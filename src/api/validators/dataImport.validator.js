// src/api/validators/dataImport.validator.js

const Joi = require('joi');

// Import options schema
const importOptionsSchema = Joi.object({
  entity: Joi.string().required().messages({
    'string.empty': 'Entity is required',
    'any.required': 'Entity is required',
  }),
  mappings: Joi.object().required().messages({
    'object.base': 'Field mappings must be an object',
    'any.required': 'Field mappings are required',
  }),
  hasHeaderRow: Joi.boolean().default(true)
});

// Analyze options schema
const analyzeOptionsSchema = Joi.object({
  entity: Joi.string()
});

// Export options schema
const exportOptionsSchema = Joi.object({
  entity: Joi.string().required().messages({
    'string.empty': 'Entity is required',
    'any.required': 'Entity is required',
  }),
  format: Joi.string().valid('csv', 'excel', 'pdf').required().messages({
    'any.only': 'Format must be one of: csv, excel, pdf',
    'any.required': 'Format is required',
  }),
  filters: Joi.object().default({}),
  fields: Joi.array().items(Joi.string()).default([])
});

// Report options schema
const reportOptionsSchema = Joi.object({
  reportType: Joi.string().required().messages({
    'string.empty': 'Report type is required',
    'any.required': 'Report type is required',
  }),
  facilityId: Joi.string().uuid(),
  diseaseId: Joi.string().uuid(),
  dateFrom: Joi.date().iso(),
  dateTo: Joi.date().iso().min(Joi.ref('dateFrom')).messages({
    'date.min': 'To date must be greater than or equal to from date',
  })
});

module.exports = {
  importOptionsSchema,
  analyzeOptionsSchema,
  exportOptionsSchema,
  reportOptionsSchema
};