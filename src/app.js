const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./config');
const errorHandler = require('./api/middlewares/errorHandler');
const loggerMiddleware = require('./api/middlewares/logger');
const swaggerSetup = require('./utils/swagger');

// ✅ Import your Redis-based rate limiters
const {
  generalLimiter,
  healthLimiter
} = require('./middleware/rateLimiter');

// Initialize Express app
const app = express();

// Apply security headers
app.use(helmet());

// Enable CORS
app.use(cors(config.corsOptions));

// Parse JSON requests
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compress responses
app.use(compression());

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Custom logger middleware
app.use(loggerMiddleware);

// ✅ Apply general rate limiter to ALL API routes as a safety net
app.use('/api', generalLimiter);

// Health check endpoint with its own rate limiting
app.get('/health', healthLimiter, (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// ✅ Your existing route registration (now with individual rate limiters applied)
app.use('/api', require('./api/routes'));

// Setup Swagger after routes are configured
swaggerSetup(app);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;