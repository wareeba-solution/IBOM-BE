const BirthService = require('../services/birth.service');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');
const { getBirthFormMetadata } = require('../../utils/formMetadata'); // Add this import

/**
 * Birth controller
 */
class BirthController {
  /**
   * Get form configuration for frontend auto-discovery
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getFormConfig(req, res) {
    try {
      const formConfig = {
        fields: getBirthFormMetadata(),
        version: '2.0',
        lastUpdated: new Date().toISOString()
      };
      
      return ApiResponse.success(res, 'Form configuration retrieved successfully', formConfig);
    } catch (error) {
      logger.error('Get form config error:', error);
      return ApiResponse.serverError(res, 'Failed to retrieve form configuration');
    }
  }

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
        placeOfBirth: req.query.placeOfBirth, // Add this line
        deliveryMethod: req.query.deliveryMethod,
        birthType: req.query.birthType,
        lgaResidence: req.query.lgaResidence,
      };

      const result = await BirthService.getAllBirths(options);
      
      // Add form metadata to response
      const response = {
        ...result,
        meta: {
          formFields: getBirthFormMetadata(),
          version: '2.0'
        }
      };
      
      return ApiResponse.success(res, 'Birth records retrieved successfully', response);
    } catch (error) {
      logger.error('Get all births error:', error);
      
      // Include form metadata in error response
      const errorResponse = {
        meta: {
          formFields: getBirthFormMetadata(),
          version: '2.0'
        }
      };
      
      return ApiResponse.serverError(res, error.message, errorResponse);
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
        // Return a friendly message but keep it as a success response
        return ApiResponse.success(res, 'The requested birth record does not exist or may have been deleted', null);
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
      
      // Add form metadata to successful response
      const response = {
        ...birth,
        meta: {
          formFields: getBirthFormMetadata(),
          version: '2.0'
        }
      };
      
      return ApiResponse.created(res, 'Birth record created successfully', response);
    } catch (error) {
      logger.error('Create birth error:', error);
      
      // Include form metadata in error responses
      const errorMeta = {
        meta: {
          formFields: getBirthFormMetadata(),
          version: '2.0'
        }
      };
      
      if (error.message === 'Mother not found') {
        return ApiResponse.error(
          res,
          error.message,
          { motherId: 'Mother not found', ...errorMeta },
          404
        );
      }
      
      if (error.message === 'Facility not found') {
        return ApiResponse.error(
          res,
          error.message,
          { facilityId: 'Facility not found', ...errorMeta },
          404
        );
      }
      
      return ApiResponse.serverError(res, error.message, errorMeta);
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
        placeOfBirth: req.query.placeOfBirth, // Add this line
        deliveryMethod: req.query.deliveryMethod,
        birthType: req.query.birthType,
        lgaResidence: req.query.lgaResidence,
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
  
      const result = await BirthService.searchBirths(searchParams);
      
      // Add form metadata to response
      const response = {
        ...result,
        meta: {
          formFields: getBirthFormMetadata(),
          version: '2.0'
        }
      };
      
      // If no results were found, provide a friendly message
      if (result.totalItems === 0) {
        return ApiResponse.success(
          res, 
          'No birth records match your search criteria. Try adjusting your filters or creating new records.',
          response
        );
      }
      
      return ApiResponse.success(res, 'Search results retrieved successfully', response);
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