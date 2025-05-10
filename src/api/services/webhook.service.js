// src/api/services/webhook.service.js
const { Integration, sequelize } = require('../../models');
const axios = require('axios');
const crypto = require('crypto');
const AppError = require('../../utils/appError');

class WebhookService {
  async registerWebhook(webhookData, userId) {
    try {
      const webhook = await sequelize.models.Webhook.create({
        url: webhookData.url,
        events: webhookData.events,
        description: webhookData.description,
        secret: webhookData.secret || this.generateWebhookSecret(),
        headers: webhookData.headers || {},
        status: 'active',
        createdBy: userId
      });
      
      return webhook;
    } catch (error) {
      throw new AppError(`Failed to register webhook: ${error.message}`, 500);
    }
  }

  generateWebhookSecret() {
    return crypto.randomBytes(32).toString('hex');
  }

  async getWebhookById(webhookId) {
    const webhook = await sequelize.models.Webhook.findByPk(webhookId, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!webhook) {
      throw new AppError('Webhook not found', 404);
    }

    return webhook;
  }

  async updateWebhook(webhookId, updateData, userId) {
    const webhook = await this.getWebhookById(webhookId);
    
    await webhook.update(updateData);
    
    return webhook;
  }

  async deleteWebhook(webhookId, userId) {
    const webhook = await this.getWebhookById(webhookId);
    
    await webhook.destroy();
    
    return { success: true };
  }

  async triggerWebhook(event, payload) {
    try {
      // Find all active webhooks subscribed to this event
      const webhooks = await sequelize.models.Webhook.findAll({
        where: {
          status: 'active',
          events: {
            [sequelize.Op.contains]: [event]
          }
        }
      });
      
      const results = [];
      
      // Trigger each webhook
      for (const webhook of webhooks) {
        try {
          const result = await this.sendWebhookRequest(webhook, event, payload);
          results.push({
            webhookId: webhook.id,
            success: true,
            status: result.status,
            statusText: result.statusText
          });
          
          // Create log entry
          await sequelize.models.WebhookLog.create({
            webhookId: webhook.id,
            event,
            payload,
            status: 'success',
            responseStatus: result.status,
            responseData: result.data
          });
        } catch (error) {
          results.push({
            webhookId: webhook.id,
            success: false,
            error: error.message
          });
          
          // Create log entry
          await sequelize.models.WebhookLog.create({
            webhookId: webhook.id,
            event,
            payload,
            status: 'failed',
            error: error.message
          });
        }
      }
      
      return results;
    } catch (error) {
      throw new AppError(`Failed to trigger webhooks: ${error.message}`, 500);
    }
  }

  async sendWebhookRequest(webhook, event, payload) {
    try {
      const timestamp = new Date().toISOString();
      const headers = { ...webhook.headers };
      
      // Add signature if secret is provided
      if (webhook.secret) {
        const signature = this.signWebhookPayload(
          JSON.stringify(payload),
          webhook.secret,
          timestamp
        );
        
        headers['X-Webhook-Signature'] = signature;
        headers['X-Webhook-Timestamp'] = timestamp;
      }
      
      // Add event information
      headers['X-Webhook-Event'] = event;
      
      // Send HTTP request
      const response = await axios.post(webhook.url, {
        event,
        timestamp,
        payload
      }, {
        headers
      });
      
      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      };
    } catch (error) {
      if (error.response) {
        throw new AppError(`Webhook request failed with status ${error.response.status}: ${error.response.statusText}`, 500);
      } else if (error.request) {
        throw new AppError('Webhook request failed: No response received', 500);
      } else {
        throw new AppError(`Webhook request setup failed: ${error.message}`, 500);
      }
    }
  }

  signWebhookPayload(payload, secret, timestamp) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${timestamp}.${payload}`);
    return hmac.digest('hex');
  }

  async getWebhooks(filters = {}) {
    const { event, status, page = 1, limit = 10 } = filters;
    
    const whereClause = {};
    
    if (event) {
      whereClause.events = {
        [sequelize.Op.contains]: [event]
      };
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    const offset = (page - 1) * limit;
    
    const { rows, count } = await sequelize.models.Webhook.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getWebhookLogs(webhookId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { rows, count } = await sequelize.models.WebhookLog.findAndCountAll({
      where: { webhookId },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }
}

module.exports = new WebhookService();