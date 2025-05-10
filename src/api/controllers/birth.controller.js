const BirthService = require('../services/birth.service');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

/**
 * Birth controller
 */
class BirthController {
  /**
   * Get all birth records
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getAllBirths(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
        facilityId: req.query.facilityId,
        startDate: req.query.startDate ? new Date(req.query.startDate) : null,
        endDate: req.query.endDate ? new Date(req.query.endDate) : null,
        gender: req.query.gender,
        deliveryMethod: req.query.deliveryMethod,
        birthType: req.query.birthType,
        lgaResidence: req.query.lgaResidence,
      };

      const result = await BirthService.getAllBirths(options);
      return ApiResponse.success(res, 'Birth records retrieved successfully', result);
    } catch (error) {
      logger.error('Get all births error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Get birth record by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getBirthById(req, res) {
    try {
      const { id } = req.params;
      const birth = await BirthService.getBirthById(id);
      return ApiResponse.success(res, 'Birth record retrieved successfully', birth);
    } catch (error) {
      logger.error('Get birth by ID error:', error);
      
      if (error.message === 'Birth record not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Create a new birth record
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async createBirth(req, res) {
    try {
      const birth = await BirthService.createBirth(req.body, req.user.id);
      return ApiResponse.created(res, 'Birth record created successfully', birth);
    } catch (error) {
      logger.error('Create birth error:', error);
      
      if (error.message === 'Mother not found') {
        return ApiResponse.error(
          res,
          error.message,
          { motherId: 'Mother not found' },
          404
        );
      }
      
      if (error.message === 'Facility not found') {
        return ApiResponse.error(
          res,
          error.message,
          { facilityId: 'Facility not found' },
          404
        );
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Update birth record
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async updateBirth(req, res) {
    try {
      const { id } = req.params;
      const birth = await BirthService.updateBirth(id, req.body);
      return ApiResponse.success(res, 'Birth record updated successfully', birth);
    } catch (error) {
      logger.error('Update birth error:', error);
      
      if (error.message === 'Birth record not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Delete birth record
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async deleteBirth(req, res) {
    try {
      const { id } = req.params;
      await BirthService.deleteBirth(id);
      return ApiResponse.success(res, 'Birth record deleted successfully');
    } catch (error) {
      logger.error('Delete birth error:', error);
      
      if (error.message === 'Birth record not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Search birth records
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async searchBirths(req, res) {
    try {
      const searchParams = {
        motherId: req.query.motherId,
        motherName: req.query.motherName,
        fatherName: req.query.fatherName,
        facilityId: req.query.facilityId,
        startDate: req.query.startDate ? new Date(req.query.startDate) : null,
        endDate: req.query.endDate ? new Date(req.query.endDate) : null,
        gender: req.query.gender,
        deliveryMethod: req.query.deliveryMethod,
        birthType: req.query.birthType,
        lgaResidence: req.query.lgaResidence,
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };

      const result = await BirthService.searchBirths(searchParams);
      return ApiResponse.success(res, 'Search results retrieved successfully', result);
    } catch (error) {
      logger.error('Search births error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Get birth statistics
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getBirthStatistics(req, res) {
    try {
      const options = {
        facilityId: req.query.facilityId,
        startDate: req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().getFullYear(), 0, 1),
        endDate: req.query.endDate ? new Date(req.query.endDate) : new Date(),
        lgaResidence: req.query.lgaResidence,
      };

      const statistics = await BirthService.getBirthStatistics(options);
      return ApiResponse.success(res, 'Birth statistics retrieved successfully', statistics);
    } catch (error) {
      logger.error('Get birth statistics error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }
}

module.exports = BirthController;