// src/api/validators/deathStatistic.validator.js

const Joi = require('joi');

const createDeathStatisticSchema = Joi.object({
  patientId: Joi.string().uuid().required().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
    'any.required': 'Patient ID is required',
  }),
  facilityId: Joi.string().uuid().required().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
    'any.required': 'Facility ID is required',
  }),
  dateOfDeath: Joi.date().iso().required().messages({
    'date.base': 'Date of death must be a valid date',
    'any.required': 'Date of death is required',
  }),
  timeOfDeath: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).allow(null).messages({
    'string.pattern.base': 'Time of death must be in the format HH:MM:SS',
  }),
  placeOfDeath: Joi.string().required().messages({
    'string.empty': 'Place of death cannot be empty',
    'any.required': 'Place of death is required',
  }),
  primaryCauseOfDeath: Joi.string().required().messages({
    'string.empty': 'Primary cause of death cannot be empty',
    'any.required': 'Primary cause of death is required',
  }),
  secondaryCauseOfDeath: Joi.string().allow(null, ''),
  certificateNumber: Joi.string().allow(null, ''),
  certifiedBy: Joi.string().required().messages({
    'string.empty': 'Certifier name cannot be empty',
    'any.required': 'Certifier name is required',
  }),
  certifierDesignation: Joi.string().required().messages({
    'string.empty': 'Certifier designation cannot be empty',
    'any.required': 'Certifier designation is required',
  }),
  mannerOfDeath: Joi.string().valid(
    'Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined', 'Pending Investigation'
  ).required().messages({
    'any.only': 'Manner of death must be one of: Natural, Accident, Suicide, Homicide, Undetermined, Pending Investigation',
    'any.required': 'Manner of death is required',
  }),
  autopsyPerformed: Joi.boolean().default(false),
  autopsyFindings: Joi.string().allow(null, ''),
});

const updateDeathStatisticSchema = Joi.object({
  dateOfDeath: Joi.date().iso().messages({
    'date.base': 'Date of death must be a valid date',
  }),
  timeOfDeath: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).allow(null).messages({
    'string.pattern.base': 'Time of death must be in the format HH:MM:SS',
  }),
  placeOfDeath: Joi.string().messages({
    'string.empty': 'Place of death cannot be empty',
  }),
  primaryCauseOfDeath: Joi.string().messages({
    'string.empty': 'Primary cause of death cannot be empty',
  }),
  secondaryCauseOfDeath: Joi.string().allow(null, ''),
  certificateNumber: Joi.string().allow(null, ''),
  certifiedBy: Joi.string().messages({
    'string.empty': 'Certifier name cannot be empty',
  }),
  certifierDesignation: Joi.string().messages({
    'string.empty': 'Certifier designation cannot be empty',
  }),
  mannerOfDeath: Joi.string().valid(
    'Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined', 'Pending Investigation'
  ).messages({
    'any.only': 'Manner of death must be one of: Natural, Accident, Suicide, Homicide, Undetermined, Pending Investigation',
  }),
  autopsyPerformed: Joi.boolean(),
  autopsyFindings: Joi.string().allow(null, ''),
});

const searchDeathStatisticSchema = Joi.object({
  patientId: Joi.string().uuid().messages({
    'string.uuid': 'Patient ID must be a valid UUID',
  }),
  facilityId: Joi.string().uuid().messages({
    'string.uuid': 'Facility ID must be a valid UUID',
  }),
  dateFrom: Joi.date().iso().messages({
    'date.base': 'From date must be a valid date',
  }),
  dateTo: Joi.date().iso().min(Joi.ref('dateFrom')).messages({
    'date.base': 'To date must be a valid date',
    'date.min': 'To date must be greater than or equal to from date',
  }),
  mannerOfDeath: Joi.string().valid(
    'Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined', 'Pending Investigation'
  ).messages({
    'any.only': 'Manner of death must be one of: Natural, Accident, Suicide, Homicide, Undetermined, Pending Investigation',
  }),
  autopsyPerformed: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('dateOfDeath', 'createdAt').default('dateOfDeath'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  createDeathStatisticSchema,
  updateDeathStatisticSchema,
  searchDeathStatisticSchema,
};