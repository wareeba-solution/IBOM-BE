// src/api/validators/device.validator.js
const Joi = require('joi');

const registerDeviceSchema = Joi.object({
  deviceId: Joi.string().required(),
  deviceName: Joi.string().required(),
  deviceType: Joi.string().valid('android', 'ios', 'web').required(),
  osVersion: Joi.string().allow(null, ''),
  appVersion: Joi.string().required(),
  pushToken: Joi.string().allow(null, '')
});

const updateDeviceSchema = Joi.object({
  deviceName: Joi.string(),
  osVersion: Joi.string().allow(null, ''),
  appVersion: Joi.string(),
  pushToken: Joi.string().allow(null, ''),
  status: Joi.string().valid('active', 'suspended', 'revoked')
});

const deviceIdParamSchema = Joi.object({
  deviceId: Joi.string().required()
});

module.exports = {
  registerDeviceSchema,
  updateDeviceSchema,
  deviceIdParamSchema
};