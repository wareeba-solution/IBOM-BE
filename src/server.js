// Updated server.js that fixes circular dependency and adds better logging
const express = require('express');
const config = require('./config');
const logger = require('./utils/logger');
const sequelize = require('./config/database');

// Initialize database connection first
const startServer = async () => {
  try {
    // Test database connection
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection successful');
    logger.info('Database connection has been established successfully.');
    
    // Load the app only after DB connection is confirmed
    console.log('Loading application...');
    const app = require('./app');
    
    // Start the server
    const PORT = config.port || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      logger.info(`Server is running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Unable to connect to the database:');
    console.error(error.message);
    console.error(error.stack);
    logger.error('Unable to connect to the database:', error);
    
    // Log database config for debugging (without password)
    console.error('Database config:', {
      host: config.database.host,
      port: config.database.port,
      name: config.database.name,
      username: config.database.username
    });
    
    // Wait a moment before exiting to ensure logs are written
    setTimeout(() => {
      process.exit(1);
    }, 3000);
  }
};

// Also fix error handlers to ensure logs are captured
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  
  // Delay exit to ensure logs are written
  setTimeout(() => {
    process.exit(1);
  }, 3000);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  
  // Delay exit to ensure logs are written
  setTimeout(() => {
    process.exit(1);
  }, 3000);
});

// Start the server
console.log('Starting server...');
startServer();