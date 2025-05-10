const ApiResponse = require('../../utils/apiResponse');

/**
 * Validate request body against a schema
 * @param {Object} schema - Validation schema
 * @returns {Function} Middleware function
 */
const validateRequestBody = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body against schema
      const validatedData = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      // Replace request body with validated data
      req.body = validatedData;
      next();
    } catch (error) {
      // Format validation errors
      const errors = {};
      
      if (error.inner && error.inner.length) {
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
      }

      return ApiResponse.validationError(res, 'Validation error', errors);
    }
  };
};

module.exports = validateRequestBody;