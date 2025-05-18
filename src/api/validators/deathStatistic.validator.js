// src/api/validators/deathStatistic.validator.js

const Joi = require('joi');

const createDeathStatisticSchema = Joi.object({
  // FRONTEND FIELDS - Use frontend field names with snake_case
  deceased_name: Joi.string().required().messages({
    'string.empty': 'Deceased name cannot be empty',
    'any.required': 'Deceased name is required',
  }),
  gender: Joi.string().valid('Male', 'Female').required().messages({
    'any.only': 'Gender must be either Male or Female',
    'any.required': 'Gender is required',
  }),
  date_of_birth: Joi.date().iso().allow(null).messages({
    'date.base': 'Date of birth must be a valid date',
  }),
  date_of_death: Joi.date().iso().required().messages({
    'date.base': 'Date of death must be a valid date',
    'any.required': 'Date of death is required',
  }),
  age_at_death: Joi.number().integer().min(0).allow(null).messages({
    'number.base': 'Age at death must be a number',
    'number.min': 'Age at death cannot be negative',
  }),
  place_of_death: Joi.string().valid('Hospital', 'Home', 'Other').required().messages({
    'any.only': 'Place of death must be one of: Hospital, Home, Other',
    'any.required': 'Place of death is required',
  }),
  hospital_name: Joi.string().when('place_of_death', {
    is: 'Hospital',
    then: Joi.string().required().messages({
      'string.empty': 'Hospital name cannot be empty',
      'any.required': 'Hospital name is required when place of death is Hospital',
    }),
    otherwise: Joi.string().allow(null, ''),
  }),
  cause_of_death: Joi.string().required().messages({
    'string.empty': 'Cause of death cannot be empty',
    'any.required': 'Cause of death is required',
  }),
  secondary_causes: Joi.string().allow(null, ''),
  manner_of_death: Joi.string().valid(
    'Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined'
  ).required().messages({
    'any.only': 'Manner of death must be one of: Natural, Accident, Suicide, Homicide, Undetermined',
    'any.required': 'Manner of death is required',
  }),
  doctor_name: Joi.string().allow(null, ''),
  doctor_id: Joi.string().allow(null, ''),
  
  // Informant Information
  informant_name: Joi.string().required().messages({
    'string.empty': 'Informant name cannot be empty',
    'any.required': 'Informant name is required',
  }),
  informant_relationship: Joi.string().required().messages({
    'string.empty': 'Informant relationship cannot be empty',
    'any.required': 'Informant relationship is required',
  }),
  informant_phone: Joi.string().allow(null, ''),
  informant_address: Joi.string().allow(null, ''),
  
  // Registration Information
  registration_number: Joi.string().allow(null, ''),
  city: Joi.string().required().messages({
    'string.empty': 'City cannot be empty',
    'any.required': 'City is required',
  }),
  state: Joi.string().required().messages({
    'string.empty': 'State cannot be empty',
    'any.required': 'State is required',
  }),
  registration_date: Joi.date().iso().required().messages({
    'date.base': 'Registration date must be a valid date',
    'any.required': 'Registration date is required',
  }),
  status: Joi.string().valid('pending', 'registered').default('registered').messages({
    'any.only': 'Status must be one of: pending, registered',
  }),
  notes: Joi.string().allow(null, ''),
  
  // BACKEND FIELDS - Support both original and new fields during transition
  // These fields are optional for frontend integration but included for backward compatibility
  patientId: Joi.string().uuid().allow(null).messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facilityId: Joi.string().uuid().allow(null).messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
  dateOfDeath: Joi.date().iso().allow(null).messages({
    'date.base': 'Date of death must be a valid date',
  }),
  timeOfDeath: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).allow(null).messages({
    'string.pattern.base': 'Time of death must be in the format HH:MM:SS',
  }),
  placeOfDeath: Joi.string().allow(null, ''),
  primaryCauseOfDeath: Joi.string().allow(null, ''),
  secondaryCauseOfDeath: Joi.string().allow(null, ''),
  certificateNumber: Joi.string().allow(null, ''),
  certifiedBy: Joi.string().allow(null, ''),
  certifierDesignation: Joi.string().allow(null, ''),
  mannerOfDeath: Joi.string().valid(
    'Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined', 'Pending Investigation'
  ).allow(null).messages({
    'any.only': 'Manner of death must be one of: Natural, Accident, Suicide, Homicide, Undetermined, Pending Investigation',
  }),
  
  // Additional backend fields
  autopsyPerformed: Joi.boolean().default(false),
  autopsyFindings: Joi.string().allow(null, ''),
}).unknown(true); // Allow unknown keys for flexibility during transition

const updateDeathStatisticSchema = Joi.object({
  // FRONTEND FIELDS - Make all fields optional for updates
  deceased_name: Joi.string().messages({
    'string.empty': 'Deceased name cannot be empty',
  }),
  gender: Joi.string().valid('Male', 'Female').messages({
    'any.only': 'Gender must be either Male or Female',
  }),
  date_of_birth: Joi.date().iso().allow(null).messages({
    'date.base': 'Date of birth must be a valid date',
  }),
  date_of_death: Joi.date().iso().messages({
    'date.base': 'Date of death must be a valid date',
  }),
  age_at_death: Joi.number().integer().min(0).allow(null).messages({
    'number.base': 'Age at death must be a number',
    'number.min': 'Age at death cannot be negative',
  }),
  place_of_death: Joi.string().valid('Hospital', 'Home', 'Other').messages({
    'any.only': 'Place of death must be one of: Hospital, Home, Other',
  }),
  hospital_name: Joi.string().allow(null, ''),
  cause_of_death: Joi.string().messages({
    'string.empty': 'Cause of death cannot be empty',
  }),
  secondary_causes: Joi.string().allow(null, ''),
  manner_of_death: Joi.string().valid(
    'Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined'
  ).messages({
    'any.only': 'Manner of death must be one of: Natural, Accident, Suicide, Homicide, Undetermined',
  }),
  doctor_name: Joi.string().allow(null, ''),
  doctor_id: Joi.string().allow(null, ''),
  
  // Informant Information
  informant_name: Joi.string().messages({
    'string.empty': 'Informant name cannot be empty',
  }),
  informant_relationship: Joi.string().messages({
    'string.empty': 'Informant relationship cannot be empty',
  }),
  informant_phone: Joi.string().allow(null, ''),
  informant_address: Joi.string().allow(null, ''),
  
  // Registration Information
  registration_number: Joi.string().allow(null, ''),
  city: Joi.string().messages({
    'string.empty': 'City cannot be empty',
  }),
  state: Joi.string().messages({
    'string.empty': 'State cannot be empty',
  }),
  registration_date: Joi.date().iso().messages({
    'date.base': 'Registration date must be a valid date',
  }),
  status: Joi.string().valid('pending', 'registered').messages({
    'any.only': 'Status must be one of: pending, registered',
  }),
  notes: Joi.string().allow(null, ''),
  
  // BACKEND FIELDS - Support both original and new fields during transition
  dateOfDeath: Joi.date().iso().messages({
    'date.base': 'Date of death must be a valid date',
  }),
  timeOfDeath: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).allow(null).messages({
    'string.pattern.base': 'Time of death must be in the format HH:MM:SS',
  }),
  placeOfDeath: Joi.string(),
  primaryCauseOfDeath: Joi.string(),
  secondaryCauseOfDeath: Joi.string().allow(null, ''),
  certificateNumber: Joi.string().allow(null, ''),
  certifiedBy: Joi.string(),
  certifierDesignation: Joi.string(),
  mannerOfDeath: Joi.string().valid(
    'Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined', 'Pending Investigation'
  ).messages({
    'any.only': 'Manner of death must be one of: Natural, Accident, Suicide, Homicide, Undetermined, Pending Investigation',
  }),
  
  // Additional backend fields
  autopsyPerformed: Joi.boolean(),
  autopsyFindings: Joi.string().allow(null, ''),
}).unknown(true).min(1); // Require at least one field to be updated

const searchDeathStatisticSchema = Joi.object({
  // Search by legacy backend fields
  patientId: Joi.string().uuid().allow(null, '').messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facilityId: Joi.string().uuid().allow(null, '').messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
  
  // Search by frontend fields
  deceased_name: Joi.string().allow(null, ''),
  date_from: Joi.date().iso().allow(null, '').messages({
    'date.base': 'From date must be a valid date',
  }),
  date_to: Joi.date().iso().min(Joi.ref('date_from')).allow(null, '').messages({
    'date.base': 'To date must be a valid date',
    'date.min': 'To date must be greater than or equal to from date',
  }),
  manner_of_death: Joi.string().valid(
    'Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined'
  ).allow(null, '').messages({
    'any.only': 'Manner of death must be one of: Natural, Accident, Suicide, Homicide, Undetermined',
  }),
  cause_of_death: Joi.string().allow(null, ''),
  city: Joi.string().allow(null, ''),
  state: Joi.string().allow(null, ''),
  status: Joi.string().valid('pending', 'registered').allow(null, ''),
  
  // For backward compatibility
  dateFrom: Joi.date().iso().allow(null, '').messages({
    'date.base': 'From date must be a valid date',
  }),
  dateTo: Joi.date().iso().min(Joi.ref('dateFrom')).allow(null, '').messages({
    'date.base': 'To date must be a valid date',
    'date.min': 'To date must be greater than or equal to from date',
  }),
  mannerOfDeath: Joi.string().valid(
    'Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined', 'Pending Investigation'
  ).allow(null, '').messages({
    'any.only': 'Manner of death must be one of: Natural, Accident, Suicide, Homicide, Undetermined, Pending Investigation',
  }),
  
  // Additional search parameters
  autopsyPerformed: Joi.boolean().allow(null),
  
  // Pagination and sorting
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  
  // Support both camelCase and snake_case for sorting fields
  sortBy: Joi.string().valid(
    'dateOfDeath', 'createdAt', 'updatedAt', 'date_of_death', 'deceased_name', 'created_at', 'updated_at'
  ).default('date_of_death'),
  sortOrder: Joi.string().valid('asc', 'desc', 'ASC', 'DESC').default('desc'),
  
  // Aliases for snake_case
  sort_by: Joi.string().valid(
    'dateOfDeath', 'createdAt', 'updatedAt', 'date_of_death', 'deceased_name', 'created_at', 'updated_at'
  ),
  sort_order: Joi.string().valid('asc', 'desc', 'ASC', 'DESC'),
}).unknown(true);

module.exports = {
  createDeathStatisticSchema,
  updateDeathStatisticSchema,
  searchDeathStatisticSchema,
};

