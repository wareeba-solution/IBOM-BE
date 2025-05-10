// src/utils/validator.js
const Joi = require('joi');

/**
 * Validates request data against a Joi schema
 * @param {Object} schema - Joi schema to validate against
 * @param {String} property - Request property to validate (body, query, params)
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (!error) {
      return next();
    }
    
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  };
};

/**
 * Common validation schemas for reuse
 */
const commonSchemas = {
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('Invalid ID format'),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),
  dateRange: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate'))
  })
};

module.exports = {
  validateRequest,
  commonSchemas
};