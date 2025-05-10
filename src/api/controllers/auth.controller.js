// auth.controller.js
const AuthService = require('../services/auth.service');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

/**
 * Authentication controller
 */
class AuthController {
  /**
   * Register a new user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async register(req, res) {
    try {
      const userData = req.body;
      
      // Process the registration data
      const processedData = {
        username: userData.username || userData.email.split('@')[0].toLowerCase(),
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || (userData.name ? userData.name.split(' ')[0] : ''),
        lastName: userData.lastName || (userData.name ? userData.name.split(' ').slice(1).join(' ') : ''),
        phoneNumber: userData.phone || userData.phoneNumber,
        roleId: userData.roleId,
        facilityId: userData.facilityId
      };
      
      const user = await AuthService.register(processedData);
      return ApiResponse.created(res, 'User registered successfully', user);
    } catch (error) {
      logger.error('Registration error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Login user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return ApiResponse.success(res, 'Login successful', result);
    } catch (error) {
      logger.error('Login error:', error);
      return ApiResponse.unauthorized(res, error.message);
    }
  }

  /**
   * Request password reset
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      const result = await AuthService.requestPasswordReset(email);
      return ApiResponse.success(res, 'Password reset instructions sent to your email', result);
    } catch (error) {
      logger.error('Password reset request error:', error);
      return ApiResponse.error(res, error.message);
    }
  }

  /**
   * Reset password
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword(token, password);
      return ApiResponse.success(res, 'Password reset successful');
    } catch (error) {
      logger.error('Password reset error:', error);
      return ApiResponse.error(res, error.message);
    }
  }

  /**
   * Update password
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      await AuthService.updatePassword(req.user.id, currentPassword, newPassword);
      return ApiResponse.success(res, 'Password updated successfully');
    } catch (error) {
      logger.error('Password update error:', error);
      return ApiResponse.error(res, error.message);
    }
  }

  /**
   * Get current user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getProfile(req, res) {
    try {
      const user = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role ? req.user.role.name : null,
        facility: req.user.facility ? {
          id: req.user.facility.id,
          name: req.user.facility.name,
        } : null,
        status: req.user.status,
        lastLogin: req.user.lastLogin,
      };

      return ApiResponse.success(res, 'User profile retrieved successfully', user);
    } catch (error) {
      logger.error('Get profile error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }
}

module.exports = AuthController;