// src/api/validators/export.validator.js
const Joi = require('joi');

const createExportJobSchema = Joi.object({
  format: Joi.string().valid('csv', 'json', 'excel', 'pdf').required(),
  entityType: Joi.string().required(),
  filters: Joi.object().allow(null),
  fields: Joi.array().items(Joi.string()).min(1),
  sortBy: Joi.string(),
  sortDirection: Joi.string().valid('asc', 'desc').default('asc'),
  includeDeleted: Joi.boolean().default(false),
  destination: Joi.object({
    type: Joi.string().valid('file', 'email', 'ftp', 's3').required(),
    config: Joi.object().required()
  }).required()
});

const exportJobParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});

const exportJobSearchSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'completed', 'failed'),
  entityType: Joi.string(),
  format: Joi.string().valid('csv', 'json', 'excel', 'pdf'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = {
  createExportJobSchema,
  exportJobParamsSchema,
  exportJobSearchSchema
};