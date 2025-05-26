// src/config/config.js
const config = require('./index');

module.exports = {
  development: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect, 
    timezone: config.database.timezone,
    // Pass pool settings from main config
    pool: config.database.pool
  },
  
  test: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    dialect: config.database.dialect,
    // Add timezone for consistency
    timezone: config.database.timezone
  },
  
  production: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    logging: false,
    timezone: config.database.timezone,
    // Critical: Pass SSL settings for production
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    // Pass pool settings from main config
    pool: config.database.pool
  }
};