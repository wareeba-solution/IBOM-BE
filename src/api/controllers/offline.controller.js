/**
 * Offline Controller
 * Handles offline data package generation and downloads
 */
const offlineService = require('../services/offline.service');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

/**
 * Get offline package metadata
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getOfflinePackage = async (req, res) => {
  try {
    const userId = req.user.id;
    const facilityId = req.user.facilityId;
    
    // Check if user has a facility assigned
    if (!facilityId) {
      return ApiResponse.error(res, 'User does not have a facility assigned', 400);
    }
    
    // Get package metadata without actual data
    const packageInfo = {
      facilityId,
      userId,
      estimatedSize: '10-50MB', // This would be dynamically calculated in a real implementation
      lastUpdated: new Date(),
      availableDataTypes: [
        'patients',
        'immunizations',
        'antenatalCare',
        'births',
        'deaths',
        'familyPlanning',
        'communicableDiseases'
      ]
    };
    
    return ApiResponse.success(res, 'Offline package info retrieved successfully', packageInfo);
  } catch (error) {
    logger.error('Get offline package error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Download offline data package
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.downloadOfflinePackage = async (req, res) => {
  try {
    const userId = req.user.id;
    const facilityId = req.body.facilityId || req.user.facilityId;
    
    // Check if user has a facility assigned or provided one
    if (!facilityId) {
      return ApiResponse.error(res, 'No facility specified for offline package', 400);
    }
    
    // Check if user has access to this facility
    if (facilityId !== req.user.facilityId && req.user.role.name !== 'admin') {
      return ApiResponse.forbidden(res, 'You do not have access to this facility');
    }
    
    // Generate the offline package
    const offlinePackage = await offlineService.generateOfflinePackage(userId, facilityId);
    
    // Log the download
    logger.info(`Offline package downloaded by user ${userId} for facility ${facilityId}`);
    
    return ApiResponse.success(res, 'Offline package generated successfully', offlinePackage);
  } catch (error) {
    logger.error('Download offline package error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};