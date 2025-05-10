const yup = require('yup');
const config = require('../../config');

// Create patient validation schema
const createPatientSchema = yup.object().shape({
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
  address: yup.string()
    .max(200, 'Address must be at most 200 characters'),
  lgaOrigin: yup.string()
    .required('LGA of origin is required')
    .oneOf(config.constants.AKWA_IBOM_LGAS, 'Invalid LGA of origin'),
  lgaResidence: yup.string()
    .required('LGA of residence is required')
    .oneOf(config.constants.AKWA_IBOM_LGAS, 'Invalid LGA of residence'),
  occupation: yup.string()
    .max(100, 'Occupation must be at most 100 characters'),
  phoneNumber: yup.string()
    .max(20, 'Phone number must be at most 20 characters'),
  nextOfKin: yup.string()
    .max(100, 'Next of kin name must be at most 100 characters'),
  nextOfKinPhone: yup.string()
    .max(20, 'Next of kin phone number must be at most 20 characters'),
  bloodGroup: yup.string()
    .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'], 'Invalid blood group')
    .default('unknown'),
  allergies: yup.string(),
  chronicConditions: yup.string(),
  notes: yup.string(),
  facilityId: yup.string()
    .uuid('Invalid facility ID')
    .required('Facility is required'),
});

// Update patient validation schema
const updatePatientSchema = yup.object().shape({
  firstName: yup.string()
    .max(50, 'First name must be at most 50 characters'),
  lastName: yup.string()
    .max(50, 'Last name must be at most 50 characters'),
  dateOfBirth: yup.date()
    .max(new Date(), 'Date of birth cannot be in the future'),
  gender: yup.string()
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),
  address: yup.string()
    .max(200, 'Address must be at most 200 characters'),
  lgaOrigin: yup.string()
    .oneOf(config.constants.AKWA_IBOM_LGAS, 'Invalid LGA of origin'),
  lgaResidence: yup.string()
    .oneOf(config.constants.AKWA_IBOM_LGAS, 'Invalid LGA of residence'),
  occupation: yup.string()
    .max(100, 'Occupation must be at most 100 characters'),
  phoneNumber: yup.string()
    .max(20, 'Phone number must be at most 20 characters'),
  nextOfKin: yup.string()
    .max(100, 'Next of kin name must be at most 100 characters'),
  nextOfKinPhone: yup.string()
    .max(20, 'Next of kin phone number must be at most 20 characters'),
  bloodGroup: yup.string()
    .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'], 'Invalid blood group'),
  allergies: yup.string(),
  chronicConditions: yup.string(),
  notes: yup.string(),
});

// Create visit validation schema
const createVisitSchema = yup.object().shape({
  patientId: yup.string()
    .uuid('Invalid patient ID')
    .required('Patient is required'),
  visitDate: yup.date()
    .default(() => new Date()),
  visitType: yup.string()
    .required('Visit type is required')
    .oneOf([
      'general', 
      'antenatal', 
      'immunization', 
      'family_planning',
      'birth',
      'death',
      'communicable_disease',
      'follow_up'
    ], 'Invalid visit type'),
  chiefComplaint: yup.string(),
  diagnosis: yup.string(),
  treatment: yup.string(),
  notes: yup.string(),
  followUpNeeded: yup.boolean().default(false),
  followUpDate: yup.date().when('followUpNeeded', {
    is: true,
    then: yup.date()
      .min(new Date(), 'Follow-up date must be in the future')
      .required('Follow-up date is required when follow-up is needed'),
  }),
  facilityId: yup.string()
    .uuid('Invalid facility ID')
    .required('Facility is required'),
});

// Update visit validation schema
const updateVisitSchema = yup.object().shape({
  visitDate: yup.date(),
  visitType: yup.string()
    .oneOf([
      'general', 
      'antenatal', 
      'immunization', 
      'family_planning',
      'birth',
      'death',
      'communicable_disease',
      'follow_up'
    ], 'Invalid visit type'),
  chiefComplaint: yup.string(),
  diagnosis: yup.string(),
  treatment: yup.string(),
  notes: yup.string(),
  followUpNeeded: yup.boolean(),
  followUpDate: yup.date().when('followUpNeeded', {
    is: true,
    then: yup.date()
      .min(new Date(), 'Follow-up date must be in the future'),
  }),
});

// Patient search validation schema
const searchPatientSchema = yup.object().shape({
  term: yup.string()
    .min(3, 'Search term must be at least 3 characters'),
  uniqueIdentifier: yup.string(),
  firstName: yup.string(),
  lastName: yup.string(),
  phoneNumber: yup.string(),
  dateOfBirth: yup.date(),
  lgaResidence: yup.string()
    .oneOf(config.constants.AKWA_IBOM_LGAS, 'Invalid LGA of residence'),
  facilityId: yup.string()
    .uuid('Invalid facility ID'),
});

module.exports = {
  createPatientSchema,
  updatePatientSchema,
  createVisitSchema,
  updateVisitSchema,
  searchPatientSchema,
};