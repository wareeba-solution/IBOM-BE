// src/config/config.js
const config = require('./index');

module.exports = {
  development: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect, // This should be a string like "postgres" or "mysql"
    timezone: config.database.timezone
  },
  test: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    dialect: config.database.dialect
  },
  production: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    dialect: config.database.dialect,
    logging: false
  }
};