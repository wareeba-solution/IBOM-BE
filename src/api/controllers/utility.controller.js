// api/controllers/utility.controller.js
const NigeriaLocations = require('../../utils/nigeriaLocations');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

/**
 * Controller for utility endpoints including Nigerian locations
 */
class UtilityController {
  /**
   * Get all Nigerian states
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getStates(req, res) {
    try {
      const states = NigeriaLocations.getAllStates();
      return ApiResponse.success(res, 'States retrieved successfully', states);
    } catch (error) {
      logger.error('Get states error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Get LGAs for a specific state
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getLGAsByState(req, res) {
    try {
      const { stateName } = req.params;
      
      if (!stateName) {
        return ApiResponse.error(res, 'State name is required', {}, 400);
      }

      // Validate state exists
      if (!NigeriaLocations.isValidState(stateName)) {
        return ApiResponse.notFound(res, 'State not found');
      }

      const lgas = NigeriaLocations.getLGAsByState(stateName);
      return ApiResponse.success(res, 'LGAs retrieved successfully', lgas);
    } catch (error) {
      logger.error('Get LGAs by state error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Get all LGAs
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getAllLGAs(req, res) {
    try {
      const lgas = NigeriaLocations.getAllLGAs();
      return ApiResponse.success(res, 'LGAs retrieved successfully', lgas);
    } catch (error) {
      logger.error('Get all LGAs error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Search states
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async searchStates(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return ApiResponse.error(res, 'Search query is required', {}, 400);
      }

      const states = NigeriaLocations.searchStates(q);
      return ApiResponse.success(res, 'States search completed', states);
    } catch (error) {
      logger.error('Search states error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Search LGAs
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async searchLGAs(req, res) {
    try {
      const { q, state } = req.query;
      
      if (!q) {
        return ApiResponse.error(res, 'Search query is required', {}, 400);
      }

      // If state is provided, validate it exists
      if (state && !NigeriaLocations.isValidState(state)) {
        return ApiResponse.notFound(res, 'State not found');
      }

      const lgas = NigeriaLocations.searchLGAs(q, state);
      return ApiResponse.success(res, 'LGAs search completed', lgas);
    } catch (error) {
      logger.error('Search LGAs error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Validate location data
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async validateLocation(req, res) {
    try {
      const { state, lga } = req.body;

      const validation = {
        state: {
          valid: state ? NigeriaLocations.isValidState(state) : null,
          data: state ? NigeriaLocations.getStateByName(state) : null
        },
        lga: {
          valid: lga ? NigeriaLocations.isValidLGA(lga, state) : null,
          data: lga ? NigeriaLocations.getLGAByName(lga, state) : null
        }
      };

      return ApiResponse.success(res, 'Location validation completed', validation);
    } catch (error) {
      logger.error('Validate location error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }
}

module.exports = UtilityController;