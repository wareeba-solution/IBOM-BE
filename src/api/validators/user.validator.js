const yup = require('yup');

// Create user validation schema
const createUserSchema = yup.object().shape({
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
  status: yup.string()
    .oneOf(['active', 'inactive', 'pending'], 'Invalid status')
    .default('pending'),
});

// Update user validation schema
const updateUserSchema = yup.object().shape({
  username: yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters'),
  email: yup.string()
    .email('Invalid email format'),
  firstName: yup.string(),
  lastName: yup.string(),
  phoneNumber: yup.string()
    .nullable(),
  roleId: yup.string()
    .uuid('Invalid role ID'),
  facilityId: yup.string()
    .uuid('Invalid facility ID'),
  status: yup.string()
    .oneOf(['active', 'inactive', 'pending'], 'Invalid status'),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};