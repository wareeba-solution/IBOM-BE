const winston = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('./index');

// Create logs directory if it doesn't exist
const logDir = path.dirname(config.logger.file);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Configure the Winston logger instance
const loggerConfig = {
  level: config.logger.level,
  format: logFormat,
  defaultMeta: { service: 'akwaibom-health-system' },
  transports: [
    // Write logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    // Write all logs to combined.log
    new winston.transports.File({
      filename: config.logger.file,
    }),
  ],
};

// Add console transport in development environment
if (process.env.NODE_ENV !== 'production') {
  loggerConfig.transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = loggerConfig;