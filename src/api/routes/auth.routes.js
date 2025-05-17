// // auth.routes.js
// const express = require('express');
// const router = express.Router();
// const AuthController = require('../controllers/auth.controller');
// const { verifyToken } = require('../middlewares/authJwt');
// const { checkDuplicateUsernameOrEmail, checkRoleExists, checkFacilityExists } = require('../middlewares/verifySignUp');
// const validateRequestBody = require('../middlewares/validateRequestBody');
// const { registerSchema, loginSchema, resetRequestSchema, resetPasswordSchema, updatePasswordSchema } = require('../validators/auth.validator');

// // Register a new user
// router.post(
//   '/register',
//   [
//     validateRequestBody(registerSchema),
//     checkDuplicateUsernameOrEmail,
//     //checkRoleExists,
//     //checkFacilityExists,
//   ],
//   AuthController.register
// );

// // Login user
// router.post(
//   '/login',
//   validateRequestBody(loginSchema),
//   AuthController.login
// );

// // Request password reset
// router.post(
//   '/forgot-password',
//   validateRequestBody(resetRequestSchema),
//   AuthController.requestPasswordReset
// );

// // Reset password
// router.post(
//   '/reset-password',
//   validateRequestBody(resetPasswordSchema),
//   AuthController.resetPassword
// );

// // Update password (protected route)
// router.post(
//   '/update-password',
//   [verifyToken, validateRequestBody(updatePasswordSchema)],
//   AuthController.updatePassword
// );

// // Get current user profile (protected route)
// router.get(
//   '/profile',
//   verifyToken,
//   AuthController.getProfile
// );

// module.exports = router;



// auth.routes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/authJwt');
const { checkDuplicateUsernameOrEmail, checkRoleExists, checkFacilityExists } = require('../middlewares/verifySignUp');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { registerSchema, loginSchema, resetRequestSchema, resetPasswordSchema, updatePasswordSchema } = require('../validators/auth.validator');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 * 
 * /auth/login:
 *   post:
 *     summary: Login to the system
 *     description: Authenticate a user and get an access token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               remember_me:
 *                 type: boolean
 *                 description: Whether to extend token expiration
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT access token
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation error
 */
// Login user
router.post(
  '/login',
  validateRequestBody(loginSchema),
  AuthController.login
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - roleId
 *               - facilityId
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               username:
 *                 type: string
 *                 description: User's desired username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               roleId:
 *                 type: string
 *                 format: uuid
 *                 description: User's role ID
 *               facilityId:
 *                 type: string
 *                 format: uuid
 *                 description: User's facility ID
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       409:
 *         description: User already exists
 *       422:
 *         description: Validation error
 */
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

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Request a password reset link
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Password reset instructions sent to your email
 *       404:
 *         description: User not found
 *       422:
 *         description: Validation error
 */
// Request password reset
router.post(
  '/forgot-password',
  validateRequestBody(resetRequestSchema),
  AuthController.requestPasswordReset
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset password using a token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token received via email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Password reset successful
 *       400:
 *         description: Invalid or expired token
 *       422:
 *         description: Validation error
 */
// Reset password
router.post(
  '/reset-password',
  validateRequestBody(resetPasswordSchema),
  AuthController.resetPassword
);

/**
 * @swagger
 * /auth/update-password:
 *   post:
 *     summary: Update password
 *     description: Update the current user's password (requires authentication)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Current password is incorrect
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
// Update password (protected route)
router.post(
  '/update-password',
  [verifyToken, validateRequestBody(updatePasswordSchema)],
  AuthController.updatePassword
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Get the current user's profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *                     facility:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                     status:
 *                       type: string
 *                     lastLogin:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 */
// Get current user profile (protected route)
router.get(
  '/profile',
  verifyToken,
  AuthController.getProfile
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get user profile (alias)
 *     description: Alias for /profile endpoint to get the current user's profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *                     facility:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                     status:
 *                       type: string
 *                     lastLogin:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 */
// Add the /me endpoint as an alias for /profile
router.get(
  '/me',
  verifyToken,
  AuthController.getProfile
);

module.exports = router;