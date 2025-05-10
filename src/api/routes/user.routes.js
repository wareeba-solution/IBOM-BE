const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');
const { checkDuplicateUsernameOrEmail, checkRoleExists, checkFacilityExists } = require('../middlewares/verifySignUp');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { createUserSchema, updateUserSchema } = require('../validators/user.validator');

// Apply auth middleware to all routes
router.use(verifyToken);

// Get all users (admin only)
router.get(
  '/',
  [isAdmin],
  UserController.getAllUsers
);

// Get user by ID
router.get(
  '/:id',
  UserController.getUserById
);

// Create a new user (admin only)
router.post(
  '/',
  [
    isAdmin,
    validateRequestBody(createUserSchema),
    checkDuplicateUsernameOrEmail,
    checkRoleExists,
    checkFacilityExists,
  ],
  UserController.createUser
);

// Update user (admin only)
router.put(
  '/:id',
  [
    isAdmin,
    validateRequestBody(updateUserSchema),
    checkRoleExists,
    checkFacilityExists,
  ],
  UserController.updateUser
);

// Delete user (admin only)
router.delete(
  '/:id',
  [isAdmin],
  UserController.deleteUser
);

// Activate user (admin only)
router.patch(
  '/:id/activate',
  [isAdmin],
  UserController.activateUser
);

// Deactivate user (admin only)
router.patch(
  '/:id/deactivate',
  [isAdmin],
  UserController.deactivateUser
);

module.exports = router;