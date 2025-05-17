const jwt = require('jsonwebtoken');
const config = require('../../config');
const db = require('../../models');
const ApiResponse = require('../../utils/apiResponse');

const User = db.User;
const Role = db.Role;

/**
 * Verify JWT token
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided or incorrect format:', authHeader);
    return ApiResponse.unauthorized(res, 'No token provided');
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, config.jwt.secret);
    console.log('Token decoded successfully:', decoded);
    
    // Find user with the decoded ID
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: 'role',
        },
      ],
    });
    
    if (!user) {
      console.log('User not found for decoded ID:', decoded.id);
      return ApiResponse.unauthorized(res, 'Invalid token - user not found');
    }
    
    console.log('User found:', {
      id: user.id,
      username: user.username,
      status: user.status,
      role: user.role ? user.role.name : null
    });
    
    // Check if user is active
    if (user.status !== 'active') {
      console.log('User account is not active:', user.status);
      return ApiResponse.forbidden(res, 'Account is not active');
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token expired');
    }
    
    return ApiResponse.unauthorized(res, 'Invalid token');
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
    
    if (req.user.role.name === roleName || req.user.role.name === 'admin') {
      next();
      return;
    }
    
    return ApiResponse.forbidden(res, `Requires ${roleName} role`);
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
  if (req.user.role.name === 'admin' || req.user.role.name === 'health_commissioner') {
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
  isAdmin,
  hasRole,
  hasFacilityAccess,
};