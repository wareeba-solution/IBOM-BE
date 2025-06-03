const jwt = require('jsonwebtoken');
const config = require('../../config');
const db = require('../../models');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

const User = db.User;
const Role = db.Role;
const Facility = db.Facility;

/**
 * Verify JWT token with enhanced error handling for token expiration
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.debug('No token provided or incorrect format:', authHeader);
    return ApiResponse.unauthorized(res, 'No token provided');
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    logger.debug('Verifying token...');
    const decoded = jwt.verify(token, config.jwt.secret);
    logger.debug('Token decoded successfully');
    
    // Find user with the decoded ID including role and facility
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: 'role',
        },
        {
          model: Facility,
          as: 'facility',
        }
      ],
    });
    
    if (!user) {
      logger.error('User not found for decoded ID:', decoded.id);
      return ApiResponse.unauthorized(res, 'Invalid token - user not found');
    }
    
    logger.debug('User authenticated:', {
      id: user.id,
      username: user.username,
      status: user.status,
      role: user.role ? user.role.name : null
    });
    
    // Check if user is active
    if (user.status !== 'active') {
      logger.debug('User account is not active:', user.status);
      return ApiResponse.forbidden(res, 'Account is not active');
    }
    
    // Add user to request
    req.user = user;
    
    // Update last activity timestamp if needed
    try {
      await User.update(
        { lastActivity: new Date() },
        { where: { id: user.id }, silent: true }
      );
    } catch (updateError) {
      // Non-critical error, just log it
      logger.warn('Failed to update user last activity:', updateError.message);
    }
    
    next();
  } catch (error) {
    logger.error('Token verification error:', error.name);
    
    if (error.name === 'TokenExpiredError') {
      // Include expired flag to help frontend identify when to refresh token
      return ApiResponse.unauthorized(res, 'Token expired', { expired: true });
    }
    
    return ApiResponse.unauthorized(res, 'Invalid token');
  }
};

/**
 * Verify token without throwing errors - useful for optional authentication
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Continue without authentication
    next();
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Find user with the decoded ID
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: 'role',
        },
        {
          model: Facility,
          as: 'facility',
        }
      ],
    });
    
    if (user && user.status === 'active') {
      // Add user to request
      req.user = user;
      
      // Update last activity timestamp
      try {
        await User.update(
          { lastActivity: new Date() },
          { where: { id: user.id }, silent: true }
        );
      } catch (updateError) {
        // Just log the error
        logger.warn('Failed to update user last activity:', updateError.message);
      }
    }
    
    next();
  } catch (error) {
    // Just continue without authentication on any error
    next();
  }
};

/**
 * Check if user has admin role
 */
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return ApiResponse.unauthorized(res, 'No user found');
  }
  
  // Convert role name to lowercase for case-insensitive comparison
  const roleName = req.user.role.name.toLowerCase();
  
  // Check against common admin role names
  if (roleName === 'admin' || 
      roleName === 'administrator' || 
      roleName === 'health_commissioner') {
    next();
    return;
  }
  
  return ApiResponse.forbidden(res, 'Requires admin role');
};

/**
 * Check if user has a specific role
 */
const hasRole = (roleName) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return ApiResponse.unauthorized(res, 'No user found');
    }
    
    // Convert to array for easier comparison if single role name provided
    const requiredRoles = Array.isArray(roleName) ? roleName : [roleName];
    
    // Admin always has access
    if (req.user.role.name.toLowerCase() === 'admin') {
      next();
      return;
    }
    
    // Check if user's role is in the required roles list
    if (requiredRoles.some(role => req.user.role.name.toLowerCase() === role.toLowerCase())) {
      next();
      return;
    }
    
    return ApiResponse.forbidden(res, `Requires ${requiredRoles.join(' or ')} role`);
  };
};

/**
 * Check if user has permission to access facility data
 */
const hasFacilityAccess = (req, res, next) => {
  const { facilityId } = req.params;
  
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'No user found');
  }
  
  // Admin and health commissioner can access all facilities
  if (req.user.role.name.toLowerCase() === 'admin' || 
      req.user.role.name.toLowerCase() === 'health_commissioner') {
    next();
    return;
  }
  
  // Check if user belongs to the requested facility
  if (req.user.facilityId === facilityId) {
    next();
    return;
  }
  
  return ApiResponse.forbidden(res, 'You do not have access to this facility');
};

module.exports = {
  verifyToken,
  optionalAuth,
  isAdmin,
  hasRole,
  hasFacilityAccess,
};