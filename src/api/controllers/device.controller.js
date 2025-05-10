/**
 * Device Controller
 * Handles mobile device registration and management
 */
const deviceService = require('../services/device.service');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

/**
 * Register a new device
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.registerDevice = async (req, res) => {
  try {
    const userId = req.user.id;
    const device = await deviceService.registerDevice(req.body, userId);
    return ApiResponse.created(res, 'Device registered successfully', device);
  } catch (error) {
    logger.error('Register device error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Get all devices for a user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getUserDevices = async (req, res) => {
  try {
    const userId = req.user.id;
    const devices = await deviceService.getUserDevices(userId);
    return ApiResponse.success(res, 'User devices retrieved successfully', devices);
  } catch (error) {
    logger.error('Get user devices error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Get device by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getDeviceById = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const device = await deviceService.getDeviceById(deviceId);
    
    // Verify device belongs to user unless admin
    if (device.userId !== req.user.id && req.user.role.name !== 'admin') {
      return ApiResponse.forbidden(res, 'You do not have access to this device');
    }
    
    return ApiResponse.success(res, 'Device retrieved successfully', device);
  } catch (error) {
    logger.error('Get device by ID error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Activate a device
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.activateDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;
    
    // Get device to check ownership
    const device = await deviceService.getDeviceById(deviceId);
    
    // Verify device belongs to user unless admin
    if (device.userId !== userId && req.user.role.name !== 'admin') {
      return ApiResponse.forbidden(res, 'You do not have access to this device');
    }
    
    const success = await deviceService.activateDevice(deviceId, userId);
    return ApiResponse.success(res, 'Device activated successfully', { success });
  } catch (error) {
    logger.error('Activate device error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Deactivate a device
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.deactivateDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;
    
    // Get device to check ownership
    const device = await deviceService.getDeviceById(deviceId);
    
    // Verify device belongs to user unless admin
    if (device.userId !== userId && req.user.role.name !== 'admin') {
      return ApiResponse.forbidden(res, 'You do not have access to this device');
    }
    
    const success = await deviceService.deactivateDevice(deviceId, userId);
    return ApiResponse.success(res, 'Device deactivated successfully', { success });
  } catch (error) {
    logger.error('Deactivate device error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Delete a device
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.deleteDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;
    
    // Get device to check ownership
    const device = await deviceService.getDeviceById(deviceId);
    
    // Verify device belongs to user unless admin
    if (device.userId !== userId && req.user.role.name !== 'admin') {
      return ApiResponse.forbidden(res, 'You do not have access to this device');
    }
    
    const success = await deviceService.deleteDevice(deviceId, userId);
    return ApiResponse.success(res, 'Device deleted successfully', { success });
  } catch (error) {
    logger.error('Delete device error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};