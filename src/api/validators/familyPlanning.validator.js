// src/api/validators/familyPlanning.validator.js

const Joi = require('joi');

// Family Planning Method validation schemas
const methodCategories = [
  'Hormonal', 
  'Barrier', 
  'Long-Acting Reversible', 
  'Permanent', 
  'Fertility Awareness', 
  'Emergency', 
  'Other'
];

const createFamilyPlanningMethodSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Method name cannot be empty',
    'any.required': 'Method name is required',
  }),
  category: Joi.string().valid(...methodCategories).required().messages({
    'any.only': `Category must be one of: ${methodCategories.join(', ')}`,
    'any.required': 'Category is required',
  }),
  description: Joi.string().allow(null, ''),
  effectiveness: Joi.number().min(0).max(100).allow(null),
  duration: Joi.string().allow(null, ''),
  sideEffects: Joi.array().items(Joi.string()).allow(null),
  contraindications: Joi.array().items(Joi.string()).allow(null),
  advantages: Joi.array().items(Joi.string()).allow(null),
  disadvantages: Joi.array().items(Joi.string()).allow(null),
  isActive: Joi.boolean().default(true),
});

const updateFamilyPlanningMethodSchema = Joi.object({
  name: Joi.string().messages({
    'string.empty': 'Method name cannot be empty',
  }),
  category: Joi.string().valid(...methodCategories).messages({
    'any.only': `Category must be one of: ${methodCategories.join(', ')}`,
  }),
  description: Joi.string().allow(null, ''),
  effectiveness: Joi.number().min(0).max(100).allow(null),
  duration: Joi.string().allow(null, ''),
  sideEffects: Joi.array().items(Joi.string()).allow(null),
  contraindications: Joi.array().items(Joi.string()).allow(null),
  advantages: Joi.array().items(Joi.string()).allow(null),
  disadvantages: Joi.array().items(Joi.string()).allow(null),
  isActive: Joi.boolean(),
});

const searchFamilyPlanningMethodSchema = Joi.object({
  name: Joi.string(),
  category: Joi.string().valid(...methodCategories),
  isActive: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('name', 'category', 'createdAt').default('name'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
});

// Family Planning Client validation schemas
const clientTypes = ['New Acceptor', 'Continuing User', 'Restart'];
const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Other'];
const educationLevels = ['None', 'Primary', 'Secondary', 'Tertiary', 'Unknown'];
const clientStatuses = ['Active', 'Inactive', 'Transferred', 'Lost to Follow-up'];

// Primary contact schema for nested validation
const primaryContactSchema = Joi.object({
  name: Joi.string().allow(null, ''),
  relationship: Joi.string().allow(null, ''),
  phoneNumber: Joi.string().allow(null, ''),
  address: Joi.string().allow(null, ''),
}).allow(null);

const createFamilyPlanningClientSchema = Joi.object({
  patientId: Joi.string().uuid().required().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
    'any.required': 'Patient ID is required',
  }),
  facilityId: Joi.string().uuid().required().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
    'any.required': 'Facility ID is required',
  }),
  registrationDate: Joi.date().iso().required().messages({
    'date.base': 'Registration date must be a valid date',
    'any.required': 'Registration date is required',
  }),
  clientType: Joi.string().valid(...clientTypes).required().messages({
    'any.only': `Client type must be one of: ${clientTypes.join(', ')}`,
    'any.required': 'Client type is required',
  }),
  maritalStatus: Joi.string().valid(...maritalStatuses).required().messages({
    'any.only': `Marital status must be one of: ${maritalStatuses.join(', ')}`,
    'any.required': 'Marital status is required',
  }),
  numberOfChildren: Joi.number().integer().min(0).allow(null).default(0),
  desiredNumberOfChildren: Joi.number().integer().min(0).allow(null),
  educationLevel: Joi.string().valid(...educationLevels).default('Unknown'),
  occupation: Joi.string().allow(null, ''),
  primaryContact: primaryContactSchema,
  medicalHistory: Joi.string().allow(null, ''),
  allergyHistory: Joi.string().allow(null, ''),
  reproductiveHistory: Joi.string().allow(null, ''),
  menstrualHistory: Joi.string().allow(null, ''),
  referredBy: Joi.string().allow(null, ''),
  notes: Joi.string().allow(null, ''),
  status: Joi.string().valid(...clientStatuses).default('Active'),
});

const updateFamilyPlanningClientSchema = Joi.object({
  registrationDate: Joi.date().iso().messages({
    'date.base': 'Registration date must be a valid date',
  }),
  clientType: Joi.string().valid(...clientTypes).messages({
    'any.only': `Client type must be one of: ${clientTypes.join(', ')}`,
  }),
  maritalStatus: Joi.string().valid(...maritalStatuses).messages({
    'any.only': `Marital status must be one of: ${maritalStatuses.join(', ')}`,
  }),
  numberOfChildren: Joi.number().integer().min(0).allow(null),
  desiredNumberOfChildren: Joi.number().integer().min(0).allow(null),
  educationLevel: Joi.string().valid(...educationLevels),
  occupation: Joi.string().allow(null, ''),
  primaryContact: primaryContactSchema,
  medicalHistory: Joi.string().allow(null, ''),
  allergyHistory: Joi.string().allow(null, ''),
  reproductiveHistory: Joi.string().allow(null, ''),
  menstrualHistory: Joi.string().allow(null, ''),
  referredBy: Joi.string().allow(null, ''),
  notes: Joi.string().allow(null, ''),
  status: Joi.string().valid(...clientStatuses),
});

const searchFamilyPlanningClientSchema = Joi.object({
  patientId: Joi.string().uuid().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facilityId: Joi.string().uuid().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
  clientType: Joi.string().valid(...clientTypes),
  registrationDateFrom: Joi.date().iso().messages({
    'date.base': 'Registration from date must be a valid date',
  }),
  registrationDateTo: Joi.date().iso().min(Joi.ref('registrationDateFrom')).messages({
    'date.base': 'Registration to date must be a valid date',
    'date.min': 'Registration to date must be greater than or equal to from date',
  }),
  maritalStatus: Joi.string().valid(...maritalStatuses),
  status: Joi.string().valid(...clientStatuses),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('registrationDate', 'createdAt').default('registrationDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

// Family Planning Service validation schemas
const serviceTypes = [
  'Initial Adoption', 
  'Method Switch', 
  'Resupply', 
  'Follow-up', 
  'Counseling', 
  'Removal', 
  'Other'
];
const satisfactionLevels = ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied', 'Not Recorded'];

const createFamilyPlanningServiceSchema = Joi.object({
  clientId: Joi.string().uuid().required().messages({
    'string.uuid': 'Client ID must be a valid UUID',
    'any.required': 'Client ID is required',
  }),
  methodId: Joi.string().uuid().required().messages({
    'string.uuid': 'Method ID must be a valid UUID',
    'any.required': 'Method ID is required',
  }),
  serviceDate: Joi.date().iso().required().messages({
    'date.base': 'Service date must be a valid date',
    'any.required': 'Service date is required',
  }),
  serviceType: Joi.string().valid(...serviceTypes).required().messages({
    'any.only': `Service type must be one of: ${serviceTypes.join(', ')}`,
    'any.required': 'Service type is required',
  }),
  previousMethodId: Joi.string().uuid().allow(null).messages({
    'string.uuid': 'Previous method ID must be a valid UUID',
  }),
  switchReason: Joi.string().allow(null, ''),
  quantity: Joi.number().integer().min(0).allow(null),
  batchNumber: Joi.string().allow(null, ''),
  expiryDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Expiry date must be a valid date',
  }),
  providedBy: Joi.string().required().messages({
    'string.empty': 'Provider name cannot be empty',
    'any.required': 'Provider name is required',
  }),
  weight: Joi.number().min(0).allow(null),
  bloodPressure: Joi.string().pattern(/^\d{1,3}\/\d{1,3}$/).allow(null, '').messages({
    'string.pattern.base': 'Blood pressure must be in the format of systolic/diastolic (e.g., 120/80)',
  }),
  sideEffectsReported: Joi.array().items(Joi.string()).allow(null),
  sideEffectsManagement: Joi.string().allow(null, ''),
  counselingNotes: Joi.string().allow(null, ''),
  nextAppointment: Joi.date().iso().allow(null).messages({
    'date.base': 'Next appointment date must be a valid date',
  }),
  discontinuationReason: Joi.string().allow(null, ''),
  procedureNotes: Joi.string().allow(null, ''),
  patientSatisfaction: Joi.string().valid(...satisfactionLevels).default('Not Recorded'),
});

const updateFamilyPlanningServiceSchema = Joi.object({
  methodId: Joi.string().uuid().messages({
    'string.uuid': 'Method ID must be a valid UUID',
  }),
  serviceDate: Joi.date().iso().messages({
    'date.base': 'Service date must be a valid date',
  }),
  serviceType: Joi.string().valid(...serviceTypes).messages({
    'any.only': `Service type must be one of: ${serviceTypes.join(', ')}`,
  }),
  previousMethodId: Joi.string().uuid().allow(null).messages({
    'string.uuid': 'Previous method ID must be a valid UUID',
  }),
  switchReason: Joi.string().allow(null, ''),
  quantity: Joi.number().integer().min(0).allow(null),
  batchNumber: Joi.string().allow(null, ''),
  expiryDate: Joi.date().iso().allow(null).messages({
    'date.base': 'Expiry date must be a valid date',
  }),
  providedBy: Joi.string().messages({
    'string.empty': 'Provider name cannot be empty',
  }),
  weight: Joi.number().min(0).allow(null),
  bloodPressure: Joi.string().pattern(/^\d{1,3}\/\d{1,3}$/).allow(null, '').messages({
    'string.pattern.base': 'Blood pressure must be in the format of systolic/diastolic (e.g., 120/80)',
  }),
  sideEffectsReported: Joi.array().items(Joi.string()).allow(null),
  sideEffectsManagement: Joi.string().allow(null, ''),
  counselingNotes: Joi.string().allow(null, ''),
  nextAppointment: Joi.date().iso().allow(null).messages({
    'date.base': 'Next appointment date must be a valid date',
  }),
  discontinuationReason: Joi.string().allow(null, ''),
  procedureNotes: Joi.string().allow(null, ''),
  patientSatisfaction: Joi.string().valid(...satisfactionLevels),
});

const searchFamilyPlanningServiceSchema = Joi.object({
  clientId: Joi.string().uuid().messages({
    'string.uuid': 'Client ID must be a valid UUID',
  }),
  methodId: Joi.string().uuid().messages({
    'string.uuid': 'Method ID must be a valid UUID',
  }),
  serviceDateFrom: Joi.date().iso().messages({
    'date.base': 'Service from date must be a valid date',
  }),
  serviceDateTo: Joi.date().iso().min(Joi.ref('serviceDateFrom')).messages({
    'date.base': 'Service to date must be a valid date',
    'date.min': 'Service to date must be greater than or equal to from date',
  }),
  serviceType: Joi.string().valid(...serviceTypes),
  patientSatisfaction: Joi.string().valid(...satisfactionLevels),
  nextAppointmentFrom: Joi.date().iso().messages({
    'date.base': 'Next appointment from date must be a valid date',
  }),
  nextAppointmentTo: Joi.date().iso().min(Joi.ref('nextAppointmentFrom')).messages({
    'date.base': 'Next appointment to date must be a valid date',
    'date.min': 'Next appointment to date must be greater than or equal to from date',
  }),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('serviceDate', 'nextAppointment', 'createdAt').default('serviceDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  createFamilyPlanningMethodSchema,
  updateFamilyPlanningMethodSchema,
  searchFamilyPlanningMethodSchema,
  createFamilyPlanningClientSchema,
  updateFamilyPlanningClientSchema,
  searchFamilyPlanningClientSchema,
  createFamilyPlanningServiceSchema,
  updateFamilyPlanningServiceSchema,
  searchFamilyPlanningServiceSchema,
};