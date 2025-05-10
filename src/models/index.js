const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const logger = require('../utils/logger');

const basename = path.basename(__filename);
const db = {};

// Read all model files in the current directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up model associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sync database in development mode
if (process.env.NODE_ENV === 'development' && process.env.DB_SYNC === 'true') {
  sequelize.sync({ alter: true })
    .then(() => {
      logger.info('Database synchronized successfully');
    })
    .catch(err => {
      logger.error('Failed to synchronize database:', err);
    });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;