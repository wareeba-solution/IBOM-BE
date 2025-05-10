const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'akwaibom_health',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.DB_LOGGING === 'true',
    timezone: '+01:00', // Nigerian timezone
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'akwaibom-health-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  
  // CORS configuration
  corsOptions: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  
  // Logging configuration
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
  
  // File upload configuration
  fileUpload: {
    maxSize: process.env.FILE_UPLOAD_MAX_SIZE || 5 * 1024 * 1024, // 5 MB
    allowedTypes: ['csv', 'xlsx', 'xls'],
    uploadDir: process.env.FILE_UPLOAD_DIR || 'public/uploads',
  },
  
  // App constants
  constants: require('./constants'),
};