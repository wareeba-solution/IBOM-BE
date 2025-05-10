// src/api/validators/integration.validator.js
const Joi = require('joi');

const createIntegrationSchema = Joi.object({
  name: Joi.string().required().max(100),
  description: Joi.string().allow(null, ''),
  type: Joi.string().valid('import', 'export', 'api', 'webhook').required(),
  config: Joi.object().required(),
  authConfig: Joi.object().allow(null),
  status: Joi.string().valid('active', 'inactive').default('inactive'),
  scheduleConfig: Joi.object().allow(null)
});

const updateIntegrationSchema = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string().allow(null, ''),
  config: Joi.object(),
  authConfig: Joi.object().allow(null),
  status: Joi.string().valid('active', 'inactive', 'error'),
  scheduleConfig: Joi.object().allow(null)
});

const integrationParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});

const runIntegrationSchema = Joi.object({
  parameters: Joi.object().allow(null)
});

const integrationSearchSchema = Joi.object({
  type: Joi.string().valid('import', 'export', 'api', 'webhook'),
  status: Joi.string().valid('active', 'inactive', 'error'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = {
  createIntegrationSchema,
  updateIntegrationSchema,
  integrationParamsSchema,
  runIntegrationSchema,
  integrationSearchSchema
};