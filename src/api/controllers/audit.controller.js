// src/api/controllers/audit.controller.js
const auditService = require('../services/audit.service');
const Joi = require('joi');
const { validateRequest } = require('../middlewares/validation.middleware');

const auditFilterSchema = Joi.object({
  action: Joi.string(),
  entityType: Joi.string(),
  entityId: Joi.string(),
  userId: Joi.string().uuid(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

const auditParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});

const entityHistorySchema = Joi.object({
  entityType: Joi.string().required(),
  entityId: Joi.string().required()
});

exports.getAuditLogs = [
  validateRequest(auditFilterSchema, 'query'),
  async (req, res, next) => {
    try {
      const logs = await auditService.getAuditLogs(req.query);
      res.status(200).json({
        status: 'success',
        data: logs.data,
        meta: logs.meta
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getAuditById = [
  validateRequest(auditParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const audit = await auditService.getAuditById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: audit
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getEntityHistory = [
  validateRequest(entityHistorySchema, 'query'),
  async (req, res, next) => {
    try {
      const { entityType, entityId } = req.query;
      const history = await auditService.getEntityHistory(entityType, entityId);
      res.status(200).json({
        status: 'success',
        data: history
      });
    } catch (error) {
      next(error);
    }
  }
];