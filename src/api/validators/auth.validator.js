// auth.validator.js

const yup = require('yup');

// Registration validation schema
const registerSchema = yup.object().shape({
  username: yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  firstName: yup.string()
    .required('First name is required'),
  lastName: yup.string()
    .required('Last name is required'),
  phoneNumber: yup.string()
    .nullable(),
  roleId: yup.string()
    .uuid('Invalid role ID')
    .required('Role is required'),
  facilityId: yup.string()
    .uuid('Invalid facility ID')
    .required('Facility is required'),
});

// Login validation schema - Updated to use email instead of username
const loginSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup.string()
    .required('Password is required'),
  remember_me: yup.boolean()
    .optional()
});

// Password reset request validation schema
const resetRequestSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format'),
});

// Password reset validation schema
const resetPasswordSchema = yup.object().shape({
  token: yup.string()
    .required('Token is required'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Update password validation schema
const updatePasswordSchema = yup.object().shape({
  currentPassword: yup.string()
    .required('Current password is required'),
  newPassword: yup.string()
    .required('New password is required')
    .min(6, 'New password must be at least 6 characters'),
});

// Refresh token validation schema
const refreshTokenSchema = yup.object().shape({
  refreshToken: yup.string()
    .required('Refresh token is required')
});

// Logout validation schema (optional)
const logoutSchema = yup.object().shape({
  refreshToken: yup.string()
    .required('Refresh token is required')
});

module.exports = {
  registerSchema,
  loginSchema,
  resetRequestSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  refreshTokenSchema,
  logoutSchema
};