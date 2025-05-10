/**
 * Custom error handling utilities
 */

/**
 * Application Error class
 * @extends Error
 */
class AppError extends Error {
    /**
     * Create a new application error
     * @param {String} message - Error message
     * @param {Number} statusCode - HTTP status code
     * @param {Object} data - Additional error data
     */
    constructor(message, statusCode = 500, data = {}) {
      super(message);
      
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      this.data = data;
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Not Found Error 
   * @extends AppError
   */
  class NotFoundError extends AppError {
    /**
     * Create a not found error
     * @param {String} message - Error message
     * @param {Object} data - Additional error data
     */
    constructor(message = 'Resource not found', data = {}) {
      super(message, 404, data);
    }
  }
  
  /**
   * Bad Request Error
   * @extends AppError
   */
  class BadRequestError extends AppError {
    /**
     * Create a bad request error
     * @param {String} message - Error message
     * @param {Object} data - Additional error data
     */
    constructor(message = 'Bad request', data = {}) {
      super(message, 400, data);
    }
  }
  
  /**
   * Unauthorized Error
   * @extends AppError
   */
  class UnauthorizedError extends AppError {
    /**
     * Create an unauthorized error
     * @param {String} message - Error message
     * @param {Object} data - Additional error data
     */
    constructor(message = 'Unauthorized', data = {}) {
      super(message, 401, data);
    }
  }
  
  /**
   * Forbidden Error
   * @extends AppError
   */
  class ForbiddenError extends AppError {
    /**
     * Create a forbidden error
     * @param {String} message - Error message
     * @param {Object} data - Additional error data
     */
    constructor(message = 'Forbidden', data = {}) {
      super(message, 403, data);
    }
  }
  
  /**
   * Validation Error
   * @extends AppError
   */
  class ValidationError extends AppError {
    /**
     * Create a validation error
     * @param {String} message - Error message
     * @param {Object} errors - Validation errors
     */
    constructor(message = 'Validation failed', errors = {}) {
      super(message, 422, { errors });
    }
  }
  
  /**
   * Conflict Error
   * @extends AppError
   */
  class ConflictError extends AppError {
    /**
     * Create a conflict error
     * @param {String} message - Error message
     * @param {Object} data - Additional error data
     */
    constructor(message = 'Resource already exists', data = {}) {
      super(message, 409, data);
    }
  }
  
  /**
   * Database Error
   * @extends AppError
   */
  class DatabaseError extends AppError {
    /**
     * Create a database error
     * @param {String} message - Error message
     * @param {Object} data - Additional error data
     */
    constructor(message = 'Database error', data = {}) {
      super(message, 500, data);
    }
  }
  
  /**
   * Create an appropriate error based on status code
   * @param {String} message - Error message
   * @param {Number} statusCode - HTTP status code
   * @param {Object} data - Additional error data
   * @returns {AppError} Application error
   */
  const createError = (message, statusCode = 500, data = {}) => {
    switch (statusCode) {
      case 400:
        return new BadRequestError(message, data);
      case 401:
        return new UnauthorizedError(message, data);
      case 403:
        return new ForbiddenError(message, data);
      case 404:
        return new NotFoundError(message, data);
      case 409:
        return new ConflictError(message, data);
      case 422:
        return new ValidationError(message, data);
      default:
        return new AppError(message, statusCode, data);
    }
  };
  
  module.exports = {
    AppError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    ValidationError,
    ConflictError,
    DatabaseError,
    createError,
  };