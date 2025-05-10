// src/api/validators/report.validator.js
const Joi = require('joi');

const createReportSchema = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().allow('', null),
  type: Joi.string().valid('standard', 'custom').default('standard'),
  category: Joi.string().valid('maternal', 'child', 'disease', 'facility', 'summary').required(),
  parameters: Joi.object().allow(null),
  query: Joi.string().allow('', null)
});

const updateReportSchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().allow('', null),
  type: Joi.string().valid('standard', 'custom'),
  category: Joi.string().valid('maternal', 'child', 'disease', 'facility', 'summary'),
  parameters: Joi.object().allow(null),
  query: Joi.string().allow('', null)
});

const reportParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});

const runReportSchema = Joi.object({
  parameters: Joi.object().allow(null)
});

const searchReportSchema = Joi.object({
  title: Joi.string(),
  type: Joi.string().valid('standard', 'custom'),
  category: Joi.string().valid('maternal', 'child', 'disease', 'facility', 'summary'),
  createdBy: Joi.string().uuid(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = {
  createReportSchema,
  updateReportSchema,
  reportParamsSchema,
  runReportSchema,
  searchReportSchema
};