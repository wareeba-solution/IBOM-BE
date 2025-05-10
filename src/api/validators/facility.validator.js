const yup = require('yup');
const config = require('../../config');

// Create facility validation schema
const createFacilitySchema = yup.object().shape({
  name: yup.string()
    .required('Facility name is required')
    .max(100, 'Facility name must be at most 100 characters'),
  facilityType: yup.string()
    .required('Facility type is required')
    .oneOf(['hospital', 'clinic', 'health_center', 'maternity'], 'Invalid facility type'),
  address: yup.string()
    .required('Address is required')
    .max(200, 'Address must be at most 200 characters'),
  lga: yup.string()
    .required('LGA is required')
    .oneOf(config.constants.AKWA_IBOM_LGAS, 'Invalid LGA'),
  state: yup.string()
    .default('Akwa Ibom')
    .oneOf(['Akwa Ibom'], 'State must be Akwa Ibom'),
  contactPerson: yup.string()
    .max(100, 'Contact person name must be at most 100 characters'),
  phoneNumber: yup.string()
    .max(20, 'Phone number must be at most 20 characters'),
  email: yup.string()
    .email('Invalid email format')
    .max(100, 'Email must be at most 100 characters'),
  status: yup.string()
    .default('active')
    .oneOf(['active', 'inactive'], 'Invalid status'),
});

// Update facility validation schema
const updateFacilitySchema = yup.object().shape({
  name: yup.string()
    .max(100, 'Facility name must be at most 100 characters'),
  facilityType: yup.string()
    .oneOf(['hospital', 'clinic', 'health_center', 'maternity'], 'Invalid facility type'),
  address: yup.string()
    .max(200, 'Address must be at most 200 characters'),
  lga: yup.string()
    .oneOf(config.constants.AKWA_IBOM_LGAS, 'Invalid LGA'),
  state: yup.string()
    .default('Akwa Ibom')
    .oneOf(['Akwa Ibom'], 'State must be Akwa Ibom'),
  contactPerson: yup.string()
    .max(100, 'Contact person name must be at most 100 characters'),
  phoneNumber: yup.string()
    .max(20, 'Phone number must be at most 20 characters'),
  email: yup.string()
    .email('Invalid email format')
    .max(100, 'Email must be at most 100 characters'),
  status: yup.string()
    .oneOf(['active', 'inactive'], 'Invalid status'),
});

module.exports = {
  createFacilitySchema,
  updateFacilitySchema,
};