// src/api/validators/backup.validator.js
const Joi = require('joi');

const createBackupSchema = Joi.object({
  description: Joi.string().allow(null, ''),
  includeFiles: Joi.boolean().default(false),
  modules: Joi.array().items(Joi.string()).min(1)
});

const restoreBackupSchema = Joi.object({
  backupId: Joi.string().required(),
  password: Joi.string().allow(null, '')
});

const backupParamsSchema = Joi.object({
  id: Joi.string().required()
});

const backupSearchSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = {
  createBackupSchema,
  restoreBackupSchema,
  backupParamsSchema,
  backupSearchSchema
};