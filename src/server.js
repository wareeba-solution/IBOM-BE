// //server.js
// const app = require('./app');
// const config = require('./config');
// const logger = require('./utils/logger');

// // Start the server
// const PORT = config.port || 3000;
// app.listen(PORT, () => {
//   logger.info(`Server is running on port ${PORT}`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   logger.error('UNHANDLED REJECTION! Shutting down...');
//   logger.error(err.name, err.message);
//   process.exit(1);
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   logger.error('UNCAUGHT EXCEPTION! Shutting down...');
//   logger.error(err.name, err.message);
//   process.exit(1);
// });


const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const db = require('./models');

// Add more detailed error logging
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack); // Add stack trace
  setTimeout(() => process.exit(1), 1000); // Delay to allow logging
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack); // Add stack trace
  setTimeout(() => process.exit(1), 1000); // Delay to allow logging
});

// Async function to start the server
const startServer = async () => {
  try {
    // Sync database
    logger.info('Connecting to the database...');
    await db.sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    // If you want to sync models with database (be careful in production)
    // await db.sequelize.sync();
    
    // Start the server
    const PORT = config.port || 3000;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to connect to the database or start server:');
    logger.error(error.message);
    logger.error(error.stack);
    process.exit(1);
  }
};

// Start the server
startServer();