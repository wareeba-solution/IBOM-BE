/**
 * Sync Controller
 * Handles data synchronization between mobile devices and server
 */
const syncService = require('../services/sync.service');
const deviceService = require('../services/device.service');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

/**
 * Get sync status for a device
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.getSyncStatus = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;

    // Verify device belongs to user
    const device = await deviceService.getDeviceById(deviceId);
    if (device.userId !== userId) {
      return ApiResponse.forbidden(res, 'You do not have access to this device');
    }

    // Get sync status
    const syncStatus = await syncService.getSyncStatus(deviceId);
    return ApiResponse.success(res, 'Sync status retrieved successfully', syncStatus);
  } catch (error) {
    logger.error('Get sync status error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Initiate sync process
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.initiateSync = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;

    // Verify device belongs to user
    const device = await deviceService.getDeviceById(deviceId);
    if (device.userId !== userId) {
      return ApiResponse.forbidden(res, 'You do not have access to this device');
    }

    // Get sync metadata
    const syncMeta = await syncService.initiateSyncProcess(deviceId, userId);
    return ApiResponse.success(res, 'Sync process initiated', syncMeta);
  } catch (error) {
    logger.error('Initiate sync error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Upload local changes to server
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.uploadChanges = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { changes, syncToken } = req.body;
    const userId = req.user.id;

    // Verify device belongs to user
    const device = await deviceService.getDeviceById(deviceId);
    if (device.userId !== userId) {
      return ApiResponse.forbidden(res, 'You do not have access to this device');
    }

    // Process uploaded changes
    const result = await syncService.processUploadedChanges(deviceId, userId, changes, syncToken);
    
    // Update device sync timestamp
    await deviceService.updateSyncTimestamp(deviceId);
    
    return ApiResponse.success(res, 'Changes uploaded successfully', result);
  } catch (error) {
    logger.error('Upload changes error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    if (error.message === 'Invalid sync token') {
      return ApiResponse.error(res, error.message, { syncToken: 'Invalid sync token' }, 400);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Download server changes to device
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.downloadChanges = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { lastSyncTimestamp, syncToken, entityTypes } = req.body;
    const userId = req.user.id;

    // Verify device belongs to user
    const device = await deviceService.getDeviceById(deviceId);
    if (device.userId !== userId) {
      return ApiResponse.forbidden(res, 'You do not have access to this device');
    }

    // Get changes since last sync
    const changes = await syncService.getChangesForDevice(
      deviceId, 
      userId, 
      lastSyncTimestamp, 
      syncToken,
      entityTypes
    );
    
    // Update device sync timestamp
    await deviceService.updateSyncTimestamp(deviceId);
    
    return ApiResponse.success(res, 'Changes downloaded successfully', changes);
  } catch (error) {
    logger.error('Download changes error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    if (error.message === 'Invalid sync token') {
      return ApiResponse.error(res, error.message, { syncToken: 'Invalid sync token' }, 400);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Complete sync process
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.completeSync = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { syncToken, status, summary } = req.body;
    const userId = req.user.id;

    // Verify device belongs to user
    const device = await deviceService.getDeviceById(deviceId);
    if (device.userId !== userId) {
      return ApiResponse.forbidden(res, 'You do not have access to this device');
    }

    // Complete sync process
    const result = await syncService.completeSyncProcess(deviceId, userId, syncToken, status, summary);
    
    // Update device sync timestamp
    await deviceService.updateSyncTimestamp(deviceId);
    
    return ApiResponse.success(res, 'Sync process completed', result);
  } catch (error) {
    logger.error('Complete sync error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    if (error.message === 'Invalid sync token') {
      return ApiResponse.error(res, error.message, { syncToken: 'Invalid sync token' }, 400);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Get sync history for a device
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.getSyncHistory = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    // Verify device belongs to user
    const device = await deviceService.getDeviceById(deviceId);
    if (device.userId !== userId) {
      return ApiResponse.forbidden(res, 'You do not have access to this device');
    }

    // Get sync history
    const history = await syncService.getSyncHistory(deviceId, page, limit);
    return ApiResponse.success(res, 'Sync history retrieved successfully', history);
  } catch (error) {
    logger.error('Get sync history error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Resolve sync conflicts
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.resolveConflicts = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { conflicts, syncToken } = req.body;
    const userId = req.user.id;

    // Verify device belongs to user
    const device = await deviceService.getDeviceById(deviceId);
    if (device.userId !== userId) {
      return ApiResponse.forbidden(res, 'You do not have access to this device');
    }

    // Resolve conflicts
    const result = await syncService.resolveConflicts(deviceId, userId, conflicts, syncToken);
    return ApiResponse.success(res, 'Conflicts resolved successfully', result);
  } catch (error) {
    logger.error('Resolve conflicts error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    if (error.message === 'Invalid sync token') {
      return ApiResponse.error(res, error.message, { syncToken: 'Invalid sync token' }, 400);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Reset device sync state
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.resetSyncState = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;

    // Only admin or device owner can reset sync state
    if (req.user.role.name !== 'admin' && req.user.id !== userId) {
      return ApiResponse.forbidden(res, 'You do not have permission to reset this device\'s sync state');
    }

    // Reset sync state
    const result = await syncService.resetDeviceSyncState(deviceId);
    return ApiResponse.success(res, 'Device sync state reset successfully', result);
  } catch (error) {
    logger.error('Reset sync state error:', error);
    
    if (error.message === 'Device not found') {
      return ApiResponse.notFound(res, error.message);
    }
    
    return ApiResponse.serverError(res, error.message);
  }
};