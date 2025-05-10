/**
 * Request validation middleware
 * Provides validation for request body, query parameters, and URL parameters
 */

/**
 * Validates request data against a schema
 * @param {Object} schema - Validation schema (Joi)
 * @param {String} type - Type of request data to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema, type = 'body') => {
    return (req, res, next) => {
      let dataToValidate;
      
      // Get the data to validate based on type
      switch (type) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        default:
          return next(new Error(`Unsupported validation type: ${type}`));
      }
      
      // Validate data using Joi
      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true
      });
      
      if (error) {
        // Format validation errors
        const errors = {};
        
        error.details.forEach(detail => {
          // Convert path to string (e.g., 'user.name')
          const path = detail.path.join('.');
          errors[path] = detail.message;
        });
        
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors
        });
      }
      
      // Update request with validated data
      switch (type) {
        case 'body':
          req.body = value;
          break;
        case 'query':
          req.query = value;
          break;
        case 'params':
          req.params = value;
          break;
      }
      
      next();
    };
  };
  
  module.exports = {
    validateRequest
  };