const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const errorHandler = require('./api/middlewares/errorHandler');
const loggerMiddleware = require('./api/middlewares/logger');
const reportRoutes = require('./api/routes/report.routes');
const dashboardRoutes = require('./api/routes/dashboard.routes');
const mobileRoutes = require('./api/routes/mobile.routes');
const adminRoutes = require('./api/routes/admin.routes');
const integrationRoutes = require('./api/routes/integration.routes');
const supportRoutes = require('./api/routes/support.routes');

// Initialize database
require('./models');

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

app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mobile', mobileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/support', supportRoutes);

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Custom logger middleware
app.use(loggerMiddleware);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});
app.use('/api', limiter);

// API routes
app.use('/api', require('./api/routes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

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