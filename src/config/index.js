// src/config/index.js
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

/**
 * Get CORS allowed origins based on environment and configuration
 * More robust handling of multiple origins and environment-specific defaults
 */
const getAllowedOrigins = () => {
  // If CORS_ORIGIN is specified in environment variables
  if (process.env.CORS_ORIGIN) {
    // Handle comma-separated list of origins
    if (process.env.CORS_ORIGIN.includes(',')) {
      return process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
    }
    // Single origin
    return process.env.CORS_ORIGIN;
  }
  
  // Default origins based on environment
  if (process.env.NODE_ENV === 'production') {
    return [
      'https://ibom-healthcare-test.onrender.com',
      'https://ibom-healthcare-fe.onrender.com',
      'https://ibom-healthcare.onrender.com'
    ];
  }
  
  // Development defaults (include both local and remote for testing)
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173', // For Vite
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'https://ibom-healthcare-test.onrender.com',
    'https://ibom-healthcare-fe.onrender.com',
    'https://ibom-healthcare.onrender.com'
  ];
};

// CORS options handler with better error handling
const createCorsOptions = () => {
  const origins = getAllowedOrigins();
  
  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is allowed
      if (Array.isArray(origins)) {
        // If origins is an array, check if it includes the request origin
        if (origins.indexOf(origin) !== -1) {
          return callback(null, true);
        }
      } else {
        // If origins is a string, compare directly
        if (origins === origin) {
          return callback(null, true);
        }
      }
      
      // Origin not allowed
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.error(`CORS blocked: ${origin} not in allowed origins:`, origins);
      return callback(new Error(msg), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400 // 24 hours
  };
};

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  
  // Database configuration - always using environment variables
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'akwaibom_health',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.DB_LOGGING === 'true',
    timezone: '+01:00', // Nigerian timezone
    
    // SSL configuration based on environment
    dialectOptions: {
      // Only apply SSL settings if explicitly enabled or in production
      ...(process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' 
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
            }
          } 
        : {})
    },
    
    // Connection pool configuration
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '5', 10),
      min: parseInt(process.env.DB_POOL_MIN || '0', 10),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
      idle: parseInt(process.env.DB_POOL_IDLE || '10000', 10)
    }
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'akwaibom-health-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  
  // CORS configuration with improved handling
  corsOptions: createCorsOptions(),
  
  // Logging configuration
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
    // Added console option for development
    console: process.env.NODE_ENV !== 'production'
  },
  
  // File upload configuration
  fileUpload: {
    maxSize: parseInt(process.env.FILE_UPLOAD_MAX_SIZE || (5 * 1024 * 1024).toString(), 10), // 5 MB
    allowedTypes: process.env.FILE_UPLOAD_ALLOWED_TYPES 
      ? process.env.FILE_UPLOAD_ALLOWED_TYPES.split(',') 
      : ['csv', 'xlsx', 'xls'],
    uploadDir: process.env.FILE_UPLOAD_DIR || 'public/uploads',
  },
  
  // App constants
  constants: require('./constants'),
  
  // Application info (useful for health checks and logging)
  app: {
    name: 'Akwa Ibom Health System API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  }
};