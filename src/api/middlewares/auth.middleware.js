// auth.middleware.js - Enhanced with better token validation
const jwt = require('jsonwebtoken');
const db = require('../../models');
const config = require('../../config');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

const User = db.User;
const Role = db.Role;
const Facility = db.Facility;

/**
 * Authenticate middleware - verifies JWT token and sets req.user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.debug('No token provided or incorrect format');
      return ApiResponse.unauthorized(res, 'No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
      logger.debug('Token verified successfully');
    } catch (error) {
      logger.error('Token verification error:', error);
      
      if (error.name === 'TokenExpiredError') {
        return ApiResponse.unauthorized(res, 'Token expired', { expired: true });
      }
      return ApiResponse.unauthorized(res, 'Invalid token');
    }
    
    // Get user from database with facility information
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: 'role',
        },
        {
          model: Facility,
          as: 'facility',
        },
      ],
      attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
    });
    
    if (!user) {
      logger.error('User not found for token:', decoded);
      return ApiResponse.unauthorized(res, 'User not found');
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      logger.debug('Inactive user attempted access:', user.id);
      return ApiResponse.forbidden(res, 'Account is not active');
    }
    
    // Set user object on request
    req.user = user;
    
    // Update last activity timestamp
    await User.update(
      { lastActivity: new Date() },
      { where: { id: user.id }, silent: true }
    );
    
    next();
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

// ... Keep other middleware functions ...

/**
 * Check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.isAdmin = (req, res, next) => {
  try {
    if (!req.user || !req.user.role) {
      return ApiResponse.unauthorized(res, 'User not authenticated');
    }
    
    if (req.user.role.name === 'admin' || req.user.role.name === 'health_commissioner') {
      return next();
    }
    
    return ApiResponse.forbidden(res, 'Requires admin privileges');
  } catch (error) {
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Check if user has specific role
 * @param {Array|String} roles - Required role(s)
 * @returns {Function} Middleware function
 */
exports.hasRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }
      
      // Convert single role to array
      const requiredRoles = Array.isArray(roles) ? roles : [roles];
      
      // Admin can access all routes
      if (req.user.role.name === 'admin') {
        return next();
      }
      
      // Check if user has any of the required roles
      if (requiredRoles.includes(req.user.role.name)) {
        return next();
      }
      
      return ApiResponse.forbidden(res, `Requires ${requiredRoles.join(' or ')} role`);
    } catch (error) {
      return ApiResponse.serverError(res, error.message);
    }
  };
};

/**
 * Check if user has permission to access facility data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.hasFacilityAccess = (req, res, next) => {
  try {
    const { facilityId } = req.params;
    
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'User not authenticated');
    }
    
    // Admin and health commissioner can access all facilities
    if (req.user.role.name === 'admin' || req.user.role.name === 'health_commissioner') {
      return next();
    }
    
    // Check if user belongs to the requested facility
    if (req.user.facilityId === facilityId) {
      return next();
    }
    
    return ApiResponse.forbidden(res, 'You do not have access to this facility');
  } catch (error) {
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Check if user has permission to access patient data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.hasPatientAccess = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'User not authenticated');
    }
    
    // Admin and health commissioner can access all patients
    if (req.user.role.name === 'admin' || req.user.role.name === 'health_commissioner') {
      return next();
    }
    
    // Get patient from database
    const Patient = db.Patient;
    const patient = await Patient.findByPk(patientId);
    
    if (!patient) {
      return ApiResponse.notFound(res, 'Patient not found');
    }
    
    // Check if patient belongs to user's facility
    if (patient.facilityId === req.user.facilityId) {
      return next();
    }
    
    // Check if patient has any visits at user's facility
    const Visit = db.Visit;
    const patientVisits = await Visit.findOne({
      where: {
        patientId,
        facilityId: req.user.facilityId,
      },
    });
    
    if (patientVisits) {
      return next();
    }
    
    return ApiResponse.forbidden(res, 'You do not have access to this patient');
  } catch (error) {
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Check if user has permission based on custom function
 * @param {Function} checkFn - Function to check permission
 * @returns {Function} Middleware function
 */
exports.hasPermission = (checkFn) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }
      
      // Admin can access all routes
      if (req.user.role.name === 'admin') {
        return next();
      }
      
      // Check permission using custom function
      const hasPermission = await checkFn(req.user, req);
      
      if (hasPermission) {
        return next();
      }
      
      return ApiResponse.forbidden(res, 'You do not have permission to perform this action');
    } catch (error) {
      return ApiResponse.serverError(res, error.message);
    }
  };
};