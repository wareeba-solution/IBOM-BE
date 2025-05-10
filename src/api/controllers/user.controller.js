const UserService = require('../services/user.service');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

/**
 * User controller
 */
class UserController {
  /**
   * Get all users
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getAllUsers(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
        status: req.query.status,
        roleId: req.query.roleId,
        facilityId: req.query.facilityId,
      };

      const result = await UserService.getAllUsers(options);
      return ApiResponse.success(res, 'Users retrieved successfully', result);
    } catch (error) {
      logger.error('Get all users error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Get user by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      return ApiResponse.success(res, 'User retrieved successfully', user);
    } catch (error) {
      logger.error('Get user by ID error:', error);
      
      if (error.message === 'User not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Create a new user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      return ApiResponse.created(res, 'User created successfully', user);
    } catch (error) {
      logger.error('Create user error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Update user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.updateUser(id, req.body);
      return ApiResponse.success(res, 'User updated successfully', user);
    } catch (error) {
      logger.error('Update user error:', error);
      
      if (error.message === 'User not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Delete user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      return ApiResponse.success(res, 'User deleted successfully');
    } catch (error) {
      logger.error('Delete user error:', error);
      
      if (error.message === 'User not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Activate user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async activateUser(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.activateUser(id);
      return ApiResponse.success(res, 'User activated successfully', user);
    } catch (error) {
      logger.error('Activate user error:', error);
      
      if (error.message === 'User not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Deactivate user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async deactivateUser(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.deactivateUser(id);
      return ApiResponse.success(res, 'User deactivated successfully', user);
    } catch (error) {
      logger.error('Deactivate user error:', error);
      
      if (error.message === 'User not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }
}

module.exports = UserController;