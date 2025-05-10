const FacilityService = require('../services/facility.service');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

/**
 * Facility controller
 */
class FacilityController {
  /**
   * Get all facilities
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getAllFacilities(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
        status: req.query.status,
        facilityType: req.query.facilityType,
        lga: req.query.lga,
      };

      const result = await FacilityService.getAllFacilities(options);
      return ApiResponse.success(res, 'Facilities retrieved successfully', result);
    } catch (error) {
      logger.error('Get all facilities error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Get facility by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getFacilityById(req, res) {
    try {
      const { id } = req.params;
      const facility = await FacilityService.getFacilityById(id);
      return ApiResponse.success(res, 'Facility retrieved successfully', facility);
    } catch (error) {
      logger.error('Get facility by ID error:', error);
      
      if (error.message === 'Facility not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Create a new facility
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async createFacility(req, res) {
    try {
      const facility = await FacilityService.createFacility(req.body);
      return ApiResponse.created(res, 'Facility created successfully', facility);
    } catch (error) {
      logger.error('Create facility error:', error);
      
      if (error.message === 'Facility name already exists') {
        return ApiResponse.error(
          res,
          error.message,
          { name: 'Facility name already exists' },
          409
        );
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Update facility
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async updateFacility(req, res) {
    try {
      const { id } = req.params;
      const facility = await FacilityService.updateFacility(id, req.body);
      return ApiResponse.success(res, 'Facility updated successfully', facility);
    } catch (error) {
      logger.error('Update facility error:', error);
      
      if (error.message === 'Facility not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      if (error.message === 'Facility name already exists') {
        return ApiResponse.error(
          res,
          error.message,
          { name: 'Facility name already exists' },
          409
        );
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Delete facility
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async deleteFacility(req, res) {
    try {
      const { id } = req.params;
      await FacilityService.deleteFacility(id);
      return ApiResponse.success(res, 'Facility deleted successfully');
    } catch (error) {
      logger.error('Delete facility error:', error);
      
      if (error.message === 'Facility not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      if (error.message === 'Cannot delete facility with associated users') {
        return ApiResponse.error(
          res,
          error.message,
          { id: 'Cannot delete facility with associated users' },
          409
        );
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Get facilities by LGA
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getFacilitiesByLga(req, res) {
    try {
      const { lga } = req.params;
      const facilities = await FacilityService.getFacilitiesByLga(lga);
      return ApiResponse.success(res, 'Facilities retrieved successfully', facilities);
    } catch (error) {
      logger.error('Get facilities by LGA error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Get facilities by type
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getFacilitiesByType(req, res) {
    try {
      const { type } = req.params;
      const facilities = await FacilityService.getFacilitiesByType(type);
      return ApiResponse.success(res, 'Facilities retrieved successfully', facilities);
    } catch (error) {
      logger.error('Get facilities by type error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Activate facility
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async activateFacility(req, res) {
    try {
      const { id } = req.params;
      const facility = await FacilityService.activateFacility(id);
      return ApiResponse.success(res, 'Facility activated successfully', facility);
    } catch (error) {
      logger.error('Activate facility error:', error);
      
      if (error.message === 'Facility not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Deactivate facility
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async deactivateFacility(req, res) {
    try {
      const { id } = req.params;
      const facility = await FacilityService.deactivateFacility(id);
      return ApiResponse.success(res, 'Facility deactivated successfully', facility);
    } catch (error) {
      logger.error('Deactivate facility error:', error);
      
      if (error.message === 'Facility not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }
}

module.exports = FacilityController;