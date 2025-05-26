const yup = require('yup');
const config = require('../../config');


/**
 * Minimal validation - just basic required fields and data types
 */
const createPatientSchema = yup.object().shape({
  // Only absolute essentials as required
  firstName: yup.string()
    .required('First name is required'),
  lastName: yup.string()
    .required('Last name is required'),
  dateOfBirth: yup.date()
    .required('Date of birth is required'),
    
  // Everything else is optional with basic validation
  otherNames: yup.string().nullable(),
  gender: yup.string().nullable(),
  maritalStatus: yup.string().nullable(),
  occupation: yup.string().nullable(),
  
  phoneNumber: yup.string().nullable(),
  email: yup.string().email('Invalid email format').nullable(),
  address: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  postalCode: yup.string().nullable(),
  lgaOrigin: yup.string().nullable(),
  lgaResidence: yup.string().nullable(),
  bloodGroup: yup.string().nullable(),
  genotype: yup.string().nullable(),
  allergies: yup.string().nullable(),
  chronicConditions: yup.string().nullable(),
  medicalNotes: yup.string().nullable(),
  status: yup.string().nullable(),
  emergencyContactName: yup.string().nullable(),
  emergencyContactRelationship: yup.string().nullable(),
  emergencyContactPhone: yup.string().nullable(),
  emergencyContactAddress: yup.string().nullable(),
  
});

/**
 * Update schema - everything optional
 */
const updatePatientSchema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
  otherNames: yup.string().nullable(),
  dateOfBirth: yup.date(),
  gender: yup.string().nullable(),
  maritalStatus: yup.string().nullable(),
  occupation: yup.string().nullable(),
  registrationDate: yup.date().nullable(),
  phoneNumber: yup.string().nullable(),
  email: yup.string().email('Invalid email format').nullable(),
  address: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  postalCode: yup.string().nullable(),
  lgaOrigin: yup.string().nullable(),
  lgaResidence: yup.string().nullable(),
  bloodGroup: yup.string().nullable(),
  genotype: yup.string().nullable(),
  allergies: yup.string().nullable(),
  chronicConditions: yup.string().nullable(),
  medicalNotes: yup.string().nullable(),
  status: yup.string().nullable(),
  emergencyContactName: yup.string().nullable(),
  emergencyContactRelationship: yup.string().nullable(),
  emergencyContactPhone: yup.string().nullable(),
  emergencyContactAddress: yup.string().nullable(),
});

module.exports = {
  createPatientSchema,
  updatePatientSchema
};