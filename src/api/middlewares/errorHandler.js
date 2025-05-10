const logger = require('../../utils/logger');
const constants = require('../../config/constants');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, { 
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.headers['x-request-id'],
  });

  // Default error status and message
  let statusCode = err.statusCode || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Something went wrong';
  let errors = err.errors || {};

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = constants.HTTP_STATUS.UNPROCESSABLE_ENTITY;
    message = 'Validation error';
    errors = err.errors.reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
    }, {});
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = constants.HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = constants.HTTP_STATUS.UNAUTHORIZED;
    message = 'Token expired';
  }

  // Handle file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = constants.HTTP_STATUS.BAD_REQUEST;
    message = 'File size too large';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = constants.HTTP_STATUS.BAD_REQUEST;
    message = 'Unexpected file';
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;