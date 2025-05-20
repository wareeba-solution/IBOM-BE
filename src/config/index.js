const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Define allowed origins based on environment
const getAllowedOrigins = () => {
  // In production, use the specified origin
  if (process.env.NODE_ENV === 'production') {
    return process.env.CORS_ORIGIN || 'https://ibom-healthcare-test.onrender.com';
  }
  
  // In development, allow both localhost and your render frontend
  return [
    'http://localhost:3000',  // React's default port
    'http://localhost:3001',  // Alternative port if needed
    'https://ibom-healthcare-test.onrender.com' // Your production frontend
  ];
};

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000, // Changed to 5000 to avoid conflict with React
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
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow cookies if you're using them
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