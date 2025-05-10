const logger = require('../../utils/logger');

/**
 * Request logging middleware
 */
const loggerMiddleware = (req, res, next) => {
  // Generate a unique request ID if not present
  const requestId = req.headers['x-request-id'] || 
    Math.random().toString(36).substring(2, 10);
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);
  
  // Log request details
  logger.info(`${req.method} ${req.originalUrl}`, {
    requestId,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.user ? req.user.id : 'anonymous',
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    query: Object.keys(req.query).length ? JSON.stringify(req.query) : undefined,
  });
  
  // Calculate response time
  const startTime = Date.now();
  
  // Log response details when the request is complete
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[level](`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      requestId,
      statusCode: res.statusCode,
      duration,
    });
  });
  
  next();
};

module.exports = loggerMiddleware;