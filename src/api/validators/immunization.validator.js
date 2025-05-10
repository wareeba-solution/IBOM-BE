// src/api/validators/immunization.validator.js

const Joi = require('joi');

const administrationSites = ['Left Arm', 'Right Arm', 'Left Thigh', 'Right Thigh', 'Oral', 'Intranasal', 'Other'];
const administrationRoutes = ['Intramuscular', 'Subcutaneous', 'Intradermal', 'Oral', 'Intranasal', 'Other'];
const statusValues = ['Scheduled', 'Administered', 'Missed', 'Cancelled'];

const createImmunizationSchema = Joi.object({
  patientId: Joi.string().uuid().required().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
    'any.required': 'Patient ID is required',
  }),
  facilityId: Joi.string().uuid().required().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
    'any.required': 'Facility ID is required',
  }),
  vaccineType: Joi.string().required().messages({
    'string.empty': 'Vaccine type cannot be empty',
    'any.required': 'Vaccine type is required',
  }),
  vaccineName: Joi.string().required().messages({
    'string.empty': 'Vaccine name cannot be empty',
    'any.required': 'Vaccine name is required',
  }),
  doseNumber: Joi.number().integer().min(1).required().messages({
    'number.base': 'Dose number must be a number',
    'number.integer': 'Dose number must be an integer',
    'number.min': 'Dose number must be at least 1',
    'any.required': 'Dose number is required',
  }),
  batchNumber: Joi.string().required().messages({
    'string.empty': 'Batch number cannot be empty',
    'any.required': 'Batch number is required',
  }),
  administrationDate: Joi.date().iso().required().messages({
    'date.base': 'Administration date must be a valid date',
    'any.required': 'Administration date is required',
  }),
  expiryDate: Joi.date().iso().required().messages({
    'date.base': 'Expiry date must be a valid date',
    'any.required': 'Expiry date is required',
  }),
  administeredBy: Joi.string().required().messages({
    'string.empty': 'Administrator name cannot be empty',
    'any.required': 'Administrator name is required',
  }),
  administrationSite: Joi.string().valid(...administrationSites).required().messages({
    'any.only': `Administration site must be one of: ${administrationSites.join(', ')}`,
    'any.required': 'Administration site is required',
  }),
  administrationRoute: Joi.string().valid(...administrationRoutes).required().messages({
    'any.only': `Administration route must be one of: ${administrationRoutes.join(', ')}`,
    'any.required': 'Administration route is required',
  }),
  dosage: Joi.string().allow(null, ''),
  sideEffects: Joi.string().allow(null, ''),
  nextDoseDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Next dose date must be a valid date',
  }),
  status: Joi.string().valid(...statusValues).default('Administered').messages({
    'any.only': `Status must be one of: ${statusValues.join(', ')}`,
  }),
  notes: Joi.string().allow(null, ''),
});

const updateImmunizationSchema = Joi.object({
  vaccineType: Joi.string().messages({
    'string.empty': 'Vaccine type cannot be empty',
  }),
  vaccineName: Joi.string().messages({
    'string.empty': 'Vaccine name cannot be empty',
  }),
  doseNumber: Joi.number().integer().min(1).messages({
    'number.base': 'Dose number must be a number',
    'number.integer': 'Dose number must be an integer',
    'number.min': 'Dose number must be at least 1',
  }),
  batchNumber: Joi.string().messages({
    'string.empty': 'Batch number cannot be empty',
  }),
  administrationDate: Joi.date().iso().messages({
    'date.base': 'Administration date must be a valid date',
  }),
  expiryDate: Joi.date().iso().messages({
    'date.base': 'Expiry date must be a valid date',
  }),
  administeredBy: Joi.string().messages({
    'string.empty': 'Administrator name cannot be empty',
  }),
  administrationSite: Joi.string().valid(...administrationSites).messages({
    'any.only': `Administration site must be one of: ${administrationSites.join(', ')}`,
  }),
  administrationRoute: Joi.string().valid(...administrationRoutes).messages({
    'any.only': `Administration route must be one of: ${administrationRoutes.join(', ')}`,
  }),
  dosage: Joi.string().allow(null, ''),
  sideEffects: Joi.string().allow(null, ''),
  nextDoseDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Next dose date must be a valid date',
  }),
  status: Joi.string().valid(...statusValues).messages({
    'any.only': `Status must be one of: ${statusValues.join(', ')}`,
  }),
  notes: Joi.string().allow(null, ''),
});

const searchImmunizationSchema = Joi.object({
  patientId: Joi.string().uuid().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facilityId: Joi.string().uuid().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
  vaccineType: Joi.string(),
  vaccineName: Joi.string(),
  dateFrom: Joi.date().iso().messages({
    'date.base': 'From date must be a valid date',
  }),
  dateTo: Joi.date().iso().min(Joi.ref('dateFrom')).messages({
    'date.base': 'To date must be a valid date',
    'date.min': 'To date must be greater than or equal to from date',
  }),
  status: Joi.string().valid(...statusValues).messages({
    'any.only': `Status must be one of: ${statusValues.join(', ')}`,
  }),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('administrationDate', 'createdAt', 'nextDoseDate').default('administrationDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const immunizationScheduleSchema = Joi.object({
  patientId: Joi.string().uuid().required().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
    'any.required': 'Patient ID is required',
  }),
  facilityId: Joi.string().uuid().required().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
    'any.required': 'Facility ID is required',
  }),
  vaccineType: Joi.string().required().messages({
    'string.empty': 'Vaccine type cannot be empty',
    'any.required': 'Vaccine type is required',
  }),
  vaccineName: Joi.string().required().messages({
    'string.empty': 'Vaccine name cannot be empty',
    'any.required': 'Vaccine name is required',
  }),
  doseNumber: Joi.number().integer().min(1).required().messages({
    'number.base': 'Dose number must be a number',
    'number.integer': 'Dose number must be an integer',
    'number.min': 'Dose number must be at least 1',
    'any.required': 'Dose number is required',
  }),
  scheduledDate: Joi.date().iso().required().messages({
    'date.base': 'Scheduled date must be a valid date',
    'any.required': 'Scheduled date is required',
  }),
  notes: Joi.string().allow(null, ''),
});

module.exports = {
  createImmunizationSchema,
  updateImmunizationSchema,
  searchImmunizationSchema,
  immunizationScheduleSchema,
};