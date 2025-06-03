// auth.routes.js - Updated with refresh token and validation endpoints
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/authJwt');
const { checkDuplicateUsernameOrEmail, checkRoleExists, checkFacilityExists } = require('../middlewares/verifySignUp');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { 
  registerSchema, 
  loginSchema, 
  resetRequestSchema, 
  resetPasswordSchema, 
  updatePasswordSchema, 
  refreshTokenSchema // Add this new schema
} = require('../validators/auth.validator');

// Login user
router.post(
  '/login',
  validateRequestBody(loginSchema),
  AuthController.login
);

// Register user
router.post(
  '/register',
  [
    validateRequestBody(registerSchema),
    checkDuplicateUsernameOrEmail,
    //checkRoleExists,
    //checkFacilityExists,
  ],
  AuthController.register
);

// NEW: Refresh token endpoint
router.post(
  '/refresh-token',
  validateRequestBody(refreshTokenSchema),
  AuthController.refreshToken
);

// NEW: Logout endpoint
router.post(
  '/logout',
  AuthController.logout
);

// NEW: Validate token endpoint
router.get(
  '/validate',
  verifyToken,
  AuthController.validateToken
);

// Request password reset
router.post(
  '/forgot-password',
  validateRequestBody(resetRequestSchema),
  AuthController.requestPasswordReset
);

// Reset password
router.post(
  '/reset-password',
  validateRequestBody(resetPasswordSchema),
  AuthController.resetPassword
);

// Update password
router.post(
  '/update-password',
  [verifyToken, validateRequestBody(updatePasswordSchema)],
  AuthController.updatePassword
);

// Get profile
router.get(
  '/profile',
  verifyToken,
  AuthController.getProfile
);

// Alias for profile
router.get(
  '/me',
  verifyToken,
  AuthController.getProfile
);

module.exports = router;