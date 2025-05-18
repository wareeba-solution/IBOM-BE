// src/api/validators/immunization.validator.js

const Joi = require('joi');

const administrationSites = ['Left Arm', 'Right Arm', 'Left Thigh', 'Right Thigh', 'Oral', 'Intranasal', 'Other'];
const administrationRoutes = ['Intramuscular', 'Subcutaneous', 'Intradermal', 'Oral', 'Intranasal', 'Other'];
const statusValues = ['Scheduled', 'Administered', 'Missed', 'Cancelled'];

// More flexible schema that validates both backend and frontend fields
const createImmunizationSchema = Joi.object({
  // Backend fields (camelCase)
  patientId: Joi.string().uuid().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facilityId: Joi.string().uuid().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
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
  status: Joi.string().valid(...statusValues).default('Administered').messages({
    'any.only': `Status must be one of: ${statusValues.join(', ')}`,
  }),
  notes: Joi.string().allow(null, ''),
  providerId: Joi.string().allow(null, ''),
  weightKg: Joi.number().min(0).max(500).allow(null).messages({
    'number.base': 'Weight must be a number',
    'number.min': 'Weight cannot be negative',
    'number.max': 'Weight exceeds maximum value',
  }),
  heightCm: Joi.number().min(0).max(300).allow(null).messages({
    'number.base': 'Height must be a number',
    'number.min': 'Height cannot be negative',
    'number.max': 'Height exceeds maximum value',
  }),
  ageMonths: Joi.number().integer().min(0).allow(null).messages({
    'number.base': 'Age in months must be a number',
    'number.integer': 'Age in months must be an integer',
    'number.min': 'Age in months cannot be negative',
  }),
  
  // Frontend fields (snake_case)
  patient_id: Joi.string().uuid().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facility_id: Joi.string().uuid().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
  vaccine_type: Joi.string(),
  vaccine_name: Joi.string(),
  dose_number: Joi.number().integer().min(1).messages({
    'number.base': 'Dose number must be a number',
    'number.integer': 'Dose number must be an integer',
    'number.min': 'Dose number must be at least 1',
  }),
  lot_number: Joi.string(),
  vaccination_date: Joi.date().iso().messages({
    'date.base': 'Vaccination date must be a valid date',
  }),
  expiry_date: Joi.date().iso().messages({
    'date.base': 'Expiry date must be a valid date',
  }),
  next_due_date: Joi.date().iso().allow(null).messages({
    'date.base': 'Next due date must be a valid date',
  }),
  healthcare_provider: Joi.string(),
  provider_id: Joi.string().allow(null, ''),
  site_of_administration: Joi.string(),
  route_of_administration: Joi.string(),
  side_effects: Joi.string().allow(null, ''),
  weight_kg: Joi.number().min(0).max(500).allow(null).messages({
    'number.base': 'Weight must be a number',
    'number.min': 'Weight cannot be negative',
    'number.max': 'Weight exceeds maximum value',
  }),
  height_cm: Joi.number().min(0).max(300).allow(null).messages({
    'number.base': 'Height must be a number',
    'number.min': 'Height cannot be negative',
    'number.max': 'Height exceeds maximum value',
  }),
  age_months: Joi.number().integer().min(0).allow(null).messages({
    'number.base': 'Age in months must be a number',
    'number.integer': 'Age in months must be an integer',
    'number.min': 'Age in months cannot be negative',
  }),
}).unknown(true); // Allow unknown fields for flexibility

const updateImmunizationSchema = Joi.object({
  // Backend fields
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
  providerId: Joi.string().allow(null, ''),
  weightKg: Joi.number().min(0).max(500).allow(null),
  heightCm: Joi.number().min(0).max(300).allow(null),
  ageMonths: Joi.number().integer().min(0).allow(null),
  
  // Frontend field names
  vaccine_type: Joi.string(),
  vaccine_name: Joi.string(),
  dose_number: Joi.number().integer().min(1),
  lot_number: Joi.string(),
  vaccination_date: Joi.date().iso(),
  expiry_date: Joi.date().iso(),
  next_due_date: Joi.date().iso().allow(null),
  healthcare_provider: Joi.string(),
  provider_id: Joi.string().allow(null, ''),
  site_of_administration: Joi.string(),
  route_of_administration: Joi.string(),
  side_effects: Joi.string().allow(null, ''),
  weight_kg: Joi.number().min(0).max(500).allow(null),
  height_cm: Joi.number().min(0).max(300).allow(null),
  age_months: Joi.number().integer().min(0).allow(null),
}).unknown(true);

const searchImmunizationSchema = Joi.object({
  // Backend fields
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
  dateTo: Joi.date().iso().messages({
    'date.base': 'To date must be a valid date',
  }),
  status: Joi.string().valid(...statusValues).messages({
    'any.only': `Status must be one of: ${statusValues.join(', ')}`,
  }),
  
  // Frontend fields
  patient_id: Joi.string().uuid().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facility_id: Joi.string().uuid().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
  vaccine_type: Joi.string(),
  date_from: Joi.date().iso().messages({
    'date.base': 'From date must be a valid date',
  }),
  date_to: Joi.date().iso().messages({
    'date.base': 'To date must be a valid date',
  }),
  
  // Pagination and sorting
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('administrationDate', 'createdAt', 'nextDoseDate', 'vaccination_date', 'created_at', 'next_due_date').default('administrationDate'),
  sortOrder: Joi.string().valid('asc', 'desc', 'ASC', 'DESC').default('desc'),
  sort_by: Joi.string().valid('vaccination_date', 'created_at', 'next_due_date'),
  sort_order: Joi.string().valid('asc', 'desc', 'ASC', 'DESC'),
}).unknown(true);

const immunizationScheduleSchema = Joi.object({
  // Backend fields
  patientId: Joi.string().uuid().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facilityId: Joi.string().uuid().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
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
  scheduledDate: Joi.date().iso().messages({
    'date.base': 'Scheduled date must be a valid date',
  }),
  notes: Joi.string().allow(null, ''),
  
  // Frontend fields
  patient_id: Joi.string().uuid().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facility_id: Joi.string().uuid().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
  vaccine_type: Joi.string(),
  vaccine_name: Joi.string(),
  dose_number: Joi.number().integer().min(1),
  scheduled_date: Joi.date().iso(),
}).unknown(true);

module.exports = {
  createImmunizationSchema,
  updateImmunizationSchema,
  searchImmunizationSchema,
  immunizationScheduleSchema,
};