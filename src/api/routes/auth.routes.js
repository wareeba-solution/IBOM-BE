// auth.routes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/authJwt');
const { checkDuplicateUsernameOrEmail, checkRoleExists, checkFacilityExists } = require('../middlewares/verifySignUp');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { registerSchema, loginSchema, resetRequestSchema, resetPasswordSchema, updatePasswordSchema } = require('../validators/auth.validator');

// Register a new user
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

// Login user
router.post(
  '/login',
  validateRequestBody(loginSchema),
  AuthController.login
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

// Update password (protected route)
router.post(
  '/update-password',
  [verifyToken, validateRequestBody(updatePasswordSchema)],
  AuthController.updatePassword
);

// Get current user profile (protected route)
router.get(
  '/profile',
  verifyToken,
  AuthController.getProfile
);

module.exports = router;