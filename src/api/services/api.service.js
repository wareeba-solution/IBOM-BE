// src/api/services/api.service.js
const { Integration, sequelize } = require('../../models');
const axios = require('axios');
const AppError = require('../../utils/appError');

class ApiService {
  async executeApiRequest(config) {
    try {
      const { url, method, headers, data, params, timeout } = config;
      
      const response = await axios({
        url,
        method: method || 'GET',
        headers: headers || {},
        data: data || undefined,
        params: params || undefined,
        timeout: timeout || 30000
      });
      
      return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      };
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new AppError(`API request failed with status ${error.response.status}: ${error.response.statusText}`, 500, {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data
        });
      } else if (error.request) {
        // The request was made but no response was received
        throw new AppError(`API request failed: No response received`, 500);
      } else {
        // Something happened in setting up the request
        throw new AppError(`API request setup failed: ${error.message}`, 500);
      }
    }
  }

  async getApiToken(authConfig) {
    try {
      const { tokenUrl, clientId, clientSecret, grantType, scope } = authConfig;
      
      const response = await axios.post(tokenUrl, {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: grantType || 'client_credentials',
        scope: scope
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return {
        accessToken: response.data.access_token,
        tokenType: response.data.token_type,
        expiresIn: response.data.expires_in,
        refreshToken: response.data.refresh_token,
        obtainedAt: new Date()
      };
    } catch (error) {
      throw new AppError(`Failed to obtain API token: ${error.message}`, 500);
    }
  }

  async refreshApiToken(authConfig, refreshToken) {
    try {
      const { tokenUrl, clientId, clientSecret } = authConfig;
      
      const response = await axios.post(tokenUrl, {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return {
        accessToken: response.data.access_token,
        tokenType: response.data.token_type,
        expiresIn: response.data.expires_in,
        refreshToken: response.data.refresh_token || refreshToken,
        obtainedAt: new Date()
      };
    } catch (error) {
      throw new AppError(`Failed to refresh API token: ${error.message}`, 500);
    }
  }

  async executeApiIntegration(integration, parameters) {
    const { config, authConfig } = integration;
    
    // If authentication is required, get or refresh token
    let authToken = null;
    if (authConfig && authConfig.type) {
      switch (authConfig.type) {
        case 'oauth2':
          // Check if we have a stored token and if it's still valid
          if (authConfig.token && authConfig.token.obtainedAt) {
            const tokenAge = (new Date() - new Date(authConfig.token.obtainedAt)) / 1000;
            if (tokenAge >= authConfig.token.expiresIn - 300) { // Refresh if less than 5 minutes validity left
              if (authConfig.token.refreshToken) {
                authToken = await this.refreshApiToken(authConfig, authConfig.token.refreshToken);
              } else {
                authToken = await this.getApiToken(authConfig);
              }
            } else {
              authToken = authConfig.token;
            }
          } else {
            authToken = await this.getApiToken(authConfig);
          }
          break;
          
        case 'basic':
          // No token needed for basic auth, it's included in headers
          break;
          
        case 'apikey':
          // No token needed for API key auth, it's included in headers or params
          break;
          
        default:
          throw new AppError(`Unsupported authentication type: ${authConfig.type}`, 400);
      }
    }
    
    // Prepare request configuration
    const requestConfig = { ...config };
    
    // Apply parameters to request configuration
    if (parameters) {
      // Replace placeholders in URL path
      if (requestConfig.url && typeof requestConfig.url === 'string') {
        Object.entries(parameters).forEach(([key, value]) => {
          requestConfig.url = requestConfig.url.replace(`{${key}}`, encodeURIComponent(value));
        });
      }
      
      // Add parameters to query params
      if (!requestConfig.params) {
        requestConfig.params = {};
      }
      
      Object.entries(parameters).forEach(([key, value]) => {
        if (config.parameterMapping && config.parameterMapping[key]) {
          requestConfig.params[config.parameterMapping[key]] = value;
        } else {
          requestConfig.params[key] = value;
        }
      });
      
      // Add parameters to request body if it's a POST/PUT/PATCH request
      if (['POST', 'PUT', 'PATCH'].includes(requestConfig.method) && requestConfig.bodyTemplate) {
        let bodyData = JSON.stringify(requestConfig.bodyTemplate);
        Object.entries(parameters).forEach(([key, value]) => {
          bodyData = bodyData.replace(`"{${key}}"`, JSON.stringify(value));
        });
        requestConfig.data = JSON.parse(bodyData);
      }
    }
    
    // Add authentication to request
    if (authToken) {
      if (!requestConfig.headers) {
        requestConfig.headers = {};
      }
      
      requestConfig.headers['Authorization'] = `${authToken.tokenType} ${authToken.accessToken}`;
    } else if (authConfig) {
      switch (authConfig.type) {
        case 'basic':
          if (!requestConfig.headers) {
            requestConfig.headers = {};
          }
          const credentials = Buffer.from(`${authConfig.username}:${authConfig.password}`).toString('base64');
          requestConfig.headers['Authorization'] = `Basic ${credentials}`;
          break;
          
        case 'apikey':
          if (authConfig.in === 'header') {
            if (!requestConfig.headers) {
              requestConfig.headers = {};
            }
            requestConfig.headers[authConfig.name] = authConfig.value;
          } else if (authConfig.in === 'query') {
            if (!requestConfig.params) {
              requestConfig.params = {};
            }
            requestConfig.params[authConfig.name] = authConfig.value;
          }
          break;
      }
    }
    
    // Execute API request
    const response = await this.executeApiRequest(requestConfig);
    
    // Update integration with new token if applicable
    if (authToken && integration.id) {
      await Integration.update(
        { 
          authConfig: {
            ...authConfig,
            token: authToken
          }
        },
        { where: { id: integration.id } }
      );
    }
    
    return response;
  }
}

module.exports = new ApiService();