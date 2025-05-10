const winston = require('winston');
const loggerConfig = require('../config/logger');

// Create logger instance
const logger = winston.createLogger(loggerConfig);

// Add request context middleware
logger.addRequestContext = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || Math.random().toString(36).substring(2, 10);
  const userId = req.user ? req.user.id : 'anonymous';
  
  // Add context to all log entries in this request
  logger.defaultMeta = {
    ...logger.defaultMeta,
    requestId,
    userId,
    path: req.path,
    method: req.method,
  };
  
  // Add requestId to response headers
  res.set('X-Request-ID', requestId);
  
  next();
};

module.exports = logger;