const config = require('./index');

module.exports = {
  development: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres', // Make sure this is a string
    timezone: config.database.timezone,
    logging: false
  },
  test: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name + '_test',
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    timezone: config.database.timezone,
    logging: false
  },
  production: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    timezone: config.database.timezone,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};