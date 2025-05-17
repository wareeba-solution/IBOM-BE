const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const errorHandler = require('./api/middlewares/errorHandler');
const loggerMiddleware = require('./api/middlewares/logger');
const swaggerSetup = require('./utils/swagger');
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

// Decide on ONE of these approaches (not both):

// OPTION 1: Use only the combined routes from index.js
app.use('/api', require('./api/routes'));

// OPTION 2: Use individual route mounts
// app.use('/api/reports', require('./api/routes/report.routes'));
// app.use('/api/dashboard', require('./api/routes/dashboard.routes'));
// app.use('/api/mobile', require('./api/routes/mobile.routes'));
// app.use('/api/admin', require('./api/routes/admin.routes'));
// app.use('/api/integration', require('./api/routes/integration.routes'));
// app.use('/api/support', require('./api/routes/support.routes'));
// app.use('/api/auth', require('./api/routes/auth.routes'));
// app.use('/api/users', require('./api/routes/user.routes'));
// app.use('/api/facilities', require('./api/routes/facility.routes'));
// app.use('/api/patients', require('./api/routes/patient.routes'));
// etc...

// Setup Swagger after routes are configured
swaggerSetup(app);

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

// Temporary test endpoint
app.get('/api/test-auth', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided',
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    
    return res.json({
      status: 'success',
      message: 'Token is valid',
      decoded,
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;