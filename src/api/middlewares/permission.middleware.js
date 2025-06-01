// src/api/middlewares/permission.middleware.js
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
 * Checks if the user has permission to access the resource
 * @param {String|Array} permissions - Required permission(s)
 * @returns {Function} Express middleware function
 */
const checkPermission = (permissions) => {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Convert to array if single permission
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    
    // Skip permission check if no specific permissions required
    if (requiredPermissions.length === 0) {
      return next();
    }

    // Admin has all permissions
    if (req.user.role && req.user.role.name === 'admin') {
      return next();
    }

    

    // Check if user has any of the required permissions
    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.some(p => userPermissions.includes(p));
    
    if (hasPermission) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'You do not have permission to perform this action'
    });
  };
};

module.exports = {
  validateRequest,
  checkPermission
};