/**
 * API Controller
 * Handles external API integration and third-party services
 */
const apiService = require('../services/api.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const { createError } = require('../../utils/error');
const logger = require('../../utils/logger');

/**
 * Get available API endpoints
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.getApiEndpoints = async (req, res, next) => {
  try {
    const endpoints = await apiService.getAvailableEndpoints();
    
    res.status(200).json({
      status: 'success',
      data: endpoints
    });
  } catch (error) {
    logger.error('Get API endpoints error:', error);
    next(error);
  }
};

/**
 * Get API health status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.getApiHealth = async (req, res, next) => {
  try {
    const health = await apiService.checkApiHealth();
    
    res.status(200).json({
      status: 'success',
      data: health
    });
  } catch (error) {
    logger.error('Get API health error:', error);
    next(error);
  }
};

/**
 * Sync data with external system
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.syncExternalData = async (req, res, next) => {
  try {
    const { system, dataType } = req.params;
    const options = req.body;
    
    // Validate system and data type
    if (!apiService.isSupportedSystem(system)) {
      throw createError(`Unsupported external system: ${system}`, 400);
    }
    
    if (!apiService.isSupportedDataType(dataType)) {
      throw createError(`Unsupported data type: ${dataType}`, 400);
    }
    
    // Start sync process
    const result = await apiService.syncData(system, dataType, options, req.user.id);
    
    res.status(200).json({
      status: 'success',
      message: `Sync with ${system} for ${dataType} data initiated successfully`,
      data: result
    });
  } catch (error) {
    logger.error(`Sync external data error: ${error.message}`, { system: req.params.system, dataType: req.params.dataType });
    next(error);
  }
};

/**
 * Get sync status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.getSyncStatus = async (req, res, next) => {
  try {
    const { syncId } = req.params;
    
    const status = await apiService.getSyncStatus(syncId);
    
    res.status(200).json({
      status: 'success',
      data: status
    });
  } catch (error) {
    logger.error(`Get sync status error: ${error.message}`, { syncId: req.params.syncId });
    next(error);
  }
};

/**
 * Configure API integration
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.configureApiIntegration = async (req, res, next) => {
  try {
    const { system } = req.params;
    const config = req.body;
    
    // Validate system
    if (!apiService.isSupportedSystem(system)) {
      throw createError(`Unsupported external system: ${system}`, 400);
    }
    
    // Update configuration
    const result = await apiService.updateApiConfiguration(system, config, req.user.id);
    
    res.status(200).json({
      status: 'success',
      message: `API configuration for ${system} updated successfully`,
      data: result
    });
  } catch (error) {
    logger.error(`Configure API integration error: ${error.message}`, { system: req.params.system });
    next(error);
  }
};

/**
 * Get API configuration
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.getApiConfiguration = async (req, res, next) => {
  try {
    const { system } = req.params;
    
    // Validate system
    if (!apiService.isSupportedSystem(system)) {
      throw createError(`Unsupported external system: ${system}`, 400);
    }
    
    // Get configuration
    const config = await apiService.getApiConfiguration(system);
    
    res.status(200).json({
      status: 'success',
      data: config
    });
  } catch (error) {
    logger.error(`Get API configuration error: ${error.message}`, { system: req.params.system });
    next(error);
  }
};

/**
 * Test API connection
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.testApiConnection = async (req, res, next) => {
  try {
    const { system } = req.params;
    const credentials = req.body;
    
    // Validate system
    if (!apiService.isSupportedSystem(system)) {
      throw createError(`Unsupported external system: ${system}`, 400);
    }
    
    // Test connection
    const result = await apiService.testConnection(system, credentials);
    
    res.status(200).json({
      status: 'success',
      message: `Connection to ${system} successful`,
      data: result
    });
  } catch (error) {
    logger.error(`Test API connection error: ${error.message}`, { system: req.params.system });
    next(error);
  }
};

/**
 * Fetch data from external API
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.fetchExternalData = async (req, res, next) => {
  try {
    const { system, endpoint } = req.params;
    const params = req.query;
    
    // Validate system
    if (!apiService.isSupportedSystem(system)) {
      throw createError(`Unsupported external system: ${system}`, 400);
    }
    
    // Fetch data
    const data = await apiService.fetchData(system, endpoint, params);
    
    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    logger.error(`Fetch external data error: ${error.message}`, { 
      system: req.params.system, 
      endpoint: req.params.endpoint 
    });
    next(error);
  }
};