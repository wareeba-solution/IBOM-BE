const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const sequelize = require('./config/database');  // Import your database file
const db = require('./models');  // Import your models

// Start the server after testing database connection
const startServer = async () => {
  try {
    // Test database connection first
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // If we get here, database connection is successful
    const PORT = config.port || 3000;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  setTimeout(() => process.exit(1), 1000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  setTimeout(() => process.exit(1), 1000);
});