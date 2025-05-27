// src/utils/model-helper.js
const db = require('../models');
const logger = require('./logger');

// Utility function to safely get a model, with fallback and error handling
function getModel(modelName) {
  if (!db[modelName]) {
    logger.warn(`Model ${modelName} not found in db object. Available models: ${Object.keys(db).join(', ')}`);
    
    if (db.sequelize && db.sequelize.models && db.sequelize.models[modelName]) {
      logger.info(`Found ${modelName} in sequelize.models, using that instead`);
      return db.sequelize.models[modelName];
    } else {
      const error = new Error(`Model ${modelName} not found in db or sequelize.models`);
      logger.error(error);
      throw error;
    }
  }
  
  return db[modelName];
}

module.exports = { getModel };