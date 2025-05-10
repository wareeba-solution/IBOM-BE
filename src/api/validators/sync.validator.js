// src/api/validators/sync.validator.js
const Joi = require('joi');

const syncDataSchema = Joi.object({
  deviceId: Joi.string().required(),
  entities: Joi.array().items(
    Joi.object({
      entityType: Joi.string().required(),
      entityId: Joi.string().uuid().required(),
      operation: Joi.string().valid('create', 'update', 'delete').required(),
      data: Joi.object().when('operation', {
        is: 'delete',
        then: Joi.optional(),
        otherwise: Joi.required()
      }),
      localTimestamp: Joi.date().iso().required()
    })
  ).min(1).required()
});

const syncRequestSchema = Joi.object({
  deviceId: Joi.string().required(),
  lastSyncDate: Joi.date().iso().allow(null),
  entityTypes: Joi.array().items(Joi.string()).min(1)
});

const syncStatusSchema = Joi.object({
  deviceId: Joi.string().required()
});

const resolveConflictSchema = Joi.object({
  syncId: Joi.string().uuid().required(),
  resolution: Joi.string().valid('local', 'server', 'merged').required(),
  mergedData: Joi.object().when('resolution', {
    is: 'merged',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

module.exports = {
  syncDataSchema,
  syncRequestSchema,
  syncStatusSchema,
  resolveConflictSchema
};