const constants = require('../config/constants');

/**
 * Standard API response format
 */
class ApiResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {String} message - Success message
   * @param {Object|Array} data - Response data
   * @param {Number} statusCode - HTTP status code
   * @returns {Object} Response object
   */
  static success(res, message = 'Success', data = {}, statusCode = constants.HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {Object} errors - Error details
   * @param {Number} statusCode - HTTP status code
   * @returns {Object} Response object
   */
  static error(res, message = 'Error', errors = {}, statusCode = constants.HTTP_STATUS.BAD_REQUEST) {
    return res.status(statusCode).json({
      status: 'error',
      message,
      errors,
    });
  }

  /**
   * Created response
   * @param {Object} res - Express response object
   * @param {String} message - Success message
   * @param {Object|Array} data - Response data
   * @returns {Object} Response object
   */
  static created(res, message = 'Created successfully', data = {}) {
    return this.success(res, message, data, constants.HTTP_STATUS.CREATED);
  }

  /**
   * Not found response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @returns {Object} Response object
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, {}, constants.HTTP_STATUS.NOT_FOUND);
  }

  /**
   * Unauthorized response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @returns {Object} Response object
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, message, {}, constants.HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * Forbidden response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @returns {Object} Response object
   */
  static forbidden(res, message = 'Forbidden access') {
    return this.error(res, message, {}, constants.HTTP_STATUS.FORBIDDEN);
  }

  /**
   * Validation error response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {Object} errors - Validation errors
   * @returns {Object} Response object
   */
  static validationError(res, message = 'Validation error', errors = {}) {
    return this.error(res, message, errors, constants.HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }

  /**
   * Server error response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @returns {Object} Response object
   */
  static serverError(res, message = 'Internal server error') {
    return this.error(res, message, {}, constants.HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

module.exports = ApiResponse;