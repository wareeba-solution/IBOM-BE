const yup = require('yup');
const config = require('../../config');

// Create birth record validation schema
const createBirthSchema = yup.object().shape({
  // Paternal Data
  fatherName: yup.string()
    .max(100, 'Father name must be at most 100 characters'),
  fatherAge: yup.number()
    .min(0, 'Father age must be at least 0')
    .max(120, 'Father age must be at most 120')
    .integer('Father age must be an integer'),
  fatherOccupation: yup.string()
    .max(100, 'Father occupation must be at most 100 characters'),
  fatherLgaOrigin: yup.string()
    .oneOf([...config.constants.AKWA_IBOM_LGAS, 'Other'], 'Invalid LGA of Origin'),

  // Maternal Data
  motherId: yup.string()
    .uuid('Invalid mother ID')
    .required('Mother ID is required'),
  motherName: yup.string()
    .required('Mother name is required')
    .max(100, 'Mother name must be at most 100 characters'),
  motherAge: yup.number()
    .required('Mother age is required')
    .min(0, 'Mother age must be at least 0')
    .max(120, 'Mother age must be at most 120')
    .integer('Mother age must be an integer'),
  motherOccupation: yup.string()
    .max(100, 'Mother occupation must be at most 100 characters'),
  motherLgaOrigin: yup.string()
    .required('Mother LGA of origin is required')
    .oneOf([...config.constants.AKWA_IBOM_LGAS, 'Other'], 'Invalid LGA of Origin'),
  motherLgaResidence: yup.string()
    .required('Mother LGA of residence is required')
    .oneOf([...config.constants.AKWA_IBOM_LGAS, 'Other'], 'Invalid LGA of Residence'),
  motherParity: yup.number()
    .required('Mother parity is required')
    .min(0, 'Mother parity must be at least 0')
    .integer('Mother parity must be an integer'),
  estimatedDeliveryDate: yup.date()
    .nullable(),
  complications: yup.string()
    .nullable(),

  // Baby Statistics
  birthDate: yup.date()
    .required('Birth date is required')
    .max(new Date(), 'Birth date cannot be in the future'),
  birthTime: yup.string()
    .required('Birth time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, 'Birth time must be in HH:MM or HH:MM:SS format'),
  gender: yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),
  placeOfBirth: yup.string()
    .required('Place of birth is required')
    .oneOf(['HOSPITAL', 'HOME'], 'Place of birth must be either HOSPITAL or HOME'),
  apgarScoreOneMin: yup.number()
    .min(0, 'APGAR score at 1 minute must be at least 0')
    .max(10, 'APGAR score at 1 minute must be at most 10')
    .integer('APGAR score at 1 minute must be an integer')
    .nullable(),
  apgarScoreFiveMin: yup.number()
    .min(0, 'APGAR score at 5 minutes must be at least 0')
    .max(10, 'APGAR score at 5 minutes must be at most 10')
    .integer('APGAR score at 5 minutes must be an integer')
    .nullable(),
  resuscitation: yup.boolean()
    .default(false),
  birthDefects: yup.string()
    .nullable(),
  birthWeight: yup.number()
    .min(0, 'Birth weight must be at least 0')
    .nullable(),
  birthType: yup.string()
    .required('Birth type is required')
    .oneOf(['singleton', 'twin', 'triplet', 'quadruplet', 'other'], 'Invalid birth type'),
  deliveryMethod: yup.string()
    .required('Delivery method is required')
    .oneOf(['vaginal', 'cesarean', 'assisted', 'other'], 'Invalid delivery method'),
  notes: yup.string()
    .nullable(),
  isBirthCertificateIssued: yup.boolean()
    .default(false),
  birthCertificateNumber: yup.string()
    .nullable(),

  // Metadata
  facilityId: yup.string()
    .uuid('Invalid facility ID')
    .required('Facility ID is required'),
  visitId: yup.string()
    .uuid('Invalid visit ID')
    .nullable(),
  attendedBy: yup.string()
    .uuid('Invalid user ID')
    .nullable(),
  babyId: yup.string()
    .uuid('Invalid baby ID')
    .nullable(),
});

// Update birth record validation schema
const updateBirthSchema = yup.object().shape({
  // Paternal Data
  fatherName: yup.string()
    .max(100, 'Father name must be at most 100 characters'),
  fatherAge: yup.number()
    .min(0, 'Father age must be at least 0')
    .max(120, 'Father age must be at most 120')
    .integer('Father age must be an integer'),
  fatherOccupation: yup.string()
    .max(100, 'Father occupation must be at most 100 characters'),
  fatherLgaOrigin: yup.string()
    .oneOf([...config.constants.AKWA_IBOM_LGAS, 'Other'], 'Invalid LGA of Origin'),

  // Maternal Data
  motherName: yup.string()
    .max(100, 'Mother name must be at most 100 characters'),
  motherAge: yup.number()
    .min(0, 'Mother age must be at least 0')
    .max(120, 'Mother age must be at most 120')
    .integer('Mother age must be an integer'),
  motherOccupation: yup.string()
    .max(100, 'Mother occupation must be at most 100 characters'),
  motherLgaOrigin: yup.string()
    .oneOf([...config.constants.AKWA_IBOM_LGAS, 'Other'], 'Invalid LGA of Origin'),
  motherLgaResidence: yup.string()
    .oneOf([...config.constants.AKWA_IBOM_LGAS, 'Other'], 'Invalid LGA of Residence'),
  motherParity: yup.number()
    .min(0, 'Mother parity must be at least 0')
    .integer('Mother parity must be an integer'),
  estimatedDeliveryDate: yup.date()
    .nullable(),
  complications: yup.string()
    .nullable(),

  // Baby Statistics
  birthDate: yup.date()
    .max(new Date(), 'Birth date cannot be in the future'),
  birthTime: yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, 'Birth time must be in HH:MM or HH:MM:SS format'),
  gender: yup.string()
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),
  placeOfBirth: yup.string()
    .oneOf(['HOSPITAL', 'HOME'], 'Place of birth must be either HOSPITAL or HOME'),
  apgarScoreOneMin: yup.number()
    .min(0, 'APGAR score at 1 minute must be at least 0')
    .max(10, 'APGAR score at 1 minute must be at most 10')
    .integer('APGAR score at 1 minute must be an integer')
    .nullable(),
  apgarScoreFiveMin: yup.number()
    .min(0, 'APGAR score at 5 minutes must be at least 0')
    .max(10, 'APGAR score at 5 minutes must be at most 10')
    .integer('APGAR score at 5 minutes must be an integer')
    .nullable(),
  resuscitation: yup.boolean(),
  birthDefects: yup.string()
    .nullable(),
  birthWeight: yup.number()
    .min(0, 'Birth weight must be at least 0')
    .nullable(),
  birthType: yup.string()
    .oneOf(['singleton', 'twin', 'triplet', 'quadruplet', 'other'], 'Invalid birth type'),
  deliveryMethod: yup.string()
    .oneOf(['vaginal', 'cesarean', 'assisted', 'other'], 'Invalid delivery method'),
  notes: yup.string()
    .nullable(),
  isBirthCertificateIssued: yup.boolean(),
  birthCertificateNumber: yup.string()
    .nullable(),

  // Metadata
  attendedBy: yup.string()
    .uuid('Invalid user ID')
    .nullable(),
  babyId: yup.string()
    .uuid('Invalid baby ID')
    .nullable(),
});

// Birth search validation schema
const searchBirthSchema = yup.object().shape({
  motherId: yup.string()
    .uuid('Invalid mother ID'),
  motherName: yup.string(),
  fatherName: yup.string(),
  facilityId: yup.string()
    .uuid('Invalid facility ID'),
  startDate: yup.date(),
  endDate: yup.date(),
  gender: yup.string()
    .oneOf(['male', 'female'], 'Invalid gender'),
  placeOfBirth: yup.string()
    .oneOf(['HOSPITAL', 'HOME'], 'Place of birth must be either HOSPITAL or HOME'),
  deliveryMethod: yup.string()
    .oneOf(['vaginal', 'cesarean', 'assisted'], 'Invalid delivery method'),
  birthType: yup.string()
    .oneOf(['singleton', 'twin', 'triplet', 'quadruplet'], 'Invalid birth type'),
  lgaResidence: yup.string()
    .oneOf([...config.constants.AKWA_IBOM_LGAS, 'Other'], 'Invalid LGA of Residence'),
});

module.exports = {
  createBirthSchema,
  updateBirthSchema,
  searchBirthSchema,
};