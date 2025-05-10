// src/api/validators/setting.validator.js
const Joi = require('joi');

const createSettingSchema = Joi.object({
  key: Joi.string().required().max(100),
  value: Joi.string().allow(null, ''),
  type: Joi.string().valid('string', 'number', 'boolean', 'json', 'date').required(),
  category: Joi.string().required().max(100),
  description: Joi.string().allow(null, ''),
  isSystemSetting: Joi.boolean().default(false)
});

const updateSettingSchema = Joi.object({
  value: Joi.string().allow(null, ''),
  description: Joi.string().allow(null, '')
});

const settingParamsSchema = Joi.object({
  id: Joi.string().uuid(),
  key: Joi.string()
});

const settingSearchSchema = Joi.object({
  category: Joi.string(),
  key: Joi.string(),
  isSystemSetting: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = {
  createSettingSchema,
  updateSettingSchema,
  settingParamsSchema,
  settingSearchSchema
};