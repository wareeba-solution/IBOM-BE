const yup = require('yup');
const config = require('../../config');

/**
 * Create patient validation schema - simplified version with required database fields
 */
const createPatientSchema = yup.object().shape({
  // Required fields
  firstName: yup.string()
    .required('First name is required')
    .max(50, 'First name must be at most 50 characters'),
  lastName: yup.string()
    .required('Last name is required')
    .max(50, 'Last name must be at most 50 characters'),
  dateOfBirth: yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  gender: yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),
  lgaOrigin: yup.string()
    .required('LGA of origin is required')
    .oneOf(config.constants.AKWA_IBOM_LGAS, 'Invalid LGA of origin'),
  lgaResidence: yup.string()
    .required('LGA of residence is required')
    .oneOf(config.constants.AKWA_IBOM_LGAS, 'Invalid LGA of residence'),
  facilityId: yup.string()
    .uuid('Invalid facility ID')
    .required('Facility is required'),
    
  // Optional fields
  otherNames: yup.string()
    .max(100, 'Other names must be at most 100 characters'),
  maritalStatus: yup.string()
    .oneOf(['single', 'married', 'divorced', 'widowed', 'separated', 'other'], 'Invalid marital status'),
  occupation: yup.string()
    .max(100, 'Occupation must be at most 100 characters'),
  registrationDate: yup.date()
    .default(() => new Date()),
  phoneNumber: yup.string()
    .max(20, 'Phone number must be at most 20 characters'),
  email: yup.string()
    .email('Invalid email format')
    .max(100, 'Email must be at most 100 characters'),
  address: yup.string()
    .max(200, 'Address must be at most 200 characters'),
  bloodGroup: yup.string()
    .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'], 'Invalid blood group'),
  allergies: yup.string(),
  chronicConditions: yup.string(),
});

/**
 * Update patient validation schema - all fields optional
 */
const updatePatientSchema = yup.object().shape({
  firstName: yup.string()
    .max(50, 'First name must be at most 50 characters'),
  lastName: yup.string()
    .max(50, 'Last name must be at most 50 characters'),
  otherNames: yup.string()
    .max(100, 'Other names must be at most 100 characters'),
  dateOfBirth: yup.date()
    .max(new Date(), 'Date of birth cannot be in the future'),
  gender: yup.string()
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),
  maritalStatus: yup.string()
    .oneOf(['single', 'married', 'divorced', 'widowed', 'separated', 'other'], 'Invalid marital status'),
  occupation: yup.string()
    .max(100, 'Occupation must be at most 100 characters'),
  phoneNumber: yup.string()
    .max(20, 'Phone number must be at most 20 characters'),
  email: yup.string()
    .email('Invalid email format')
    .max(100, 'Email must be at most 100 characters'),
  address: yup.string()
    .max(200, 'Address must be at most 200 characters'),
  lgaOrigin: yup.string()
    .oneOf(config.constants.AKWA_IBOM_LGAS, 'Invalid LGA of origin'),
  lgaResidence: yup.string()
    .oneOf(config.constants.AKWA_IBOM_LGAS, 'Invalid LGA of residence'),
  bloodGroup: yup.string()
    .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'], 'Invalid blood group'),
  allergies: yup.string(),
  chronicConditions: yup.string(),
  emergencyContactName: yup.string()
    .max(100, 'Emergency contact name must be at most 100 characters'),
  emergencyContactRelationship: yup.string()
    .max(50, 'Emergency contact relationship must be at most 50 characters'),
  emergencyContactPhone: yup.string()
    .max(20, 'Emergency contact phone must be at most 20 characters'),
  emergencyContactAddress: yup.string()
    .max(200, 'Emergency contact address must be at most 200 characters'),
});

module.exports = {
  createPatientSchema,
  updatePatientSchema
};