// src/api/controllers/webhook.controller.js
const webhookService = require('../services/webhook.service');
const Joi = require('joi');
const { validateRequest } = require('../middlewares/validation.middleware');

const registerWebhookSchema = Joi.object({
  url: Joi.string().uri().required(),
  events: Joi.array().items(Joi.string()).min(1).required(),
  description: Joi.string().allow(null, ''),
  secret: Joi.string().allow(null, ''),
  headers: Joi.object()
});

const updateWebhookSchema = Joi.object({
  url: Joi.string().uri(),
  events: Joi.array().items(Joi.string()).min(1),
  description: Joi.string().allow(null, ''),
  secret: Joi.string().allow(null, ''),
  headers: Joi.object(),
  status: Joi.string().valid('active', 'inactive')
});

const webhookParamsSchema = Joi.object({
  id: Joi.string().required()
});

const webhookFilterSchema = Joi.object({
  event: Joi.string(),
  status: Joi.string().valid('active', 'inactive'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

const triggerWebhookSchema = Joi.object({
  event: Joi.string().required(),
  payload: Joi.object().required()
});

exports.registerWebhook = [
  validateRequest(registerWebhookSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const webhook = await webhookService.registerWebhook(req.body, userId);
      res.status(201).json({
        status: 'success',
        data: webhook
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getWebhookById = [
  validateRequest(webhookParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const webhook = await webhookService.getWebhookById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: webhook
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.updateWebhook = [
  validateRequest(webhookParamsSchema, 'params'),
  validateRequest(updateWebhookSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const webhook = await webhookService.updateWebhook(req.params.id, req.body, userId);
      res.status(200).json({
        status: 'success',
        data: webhook
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.deleteWebhook = [
  validateRequest(webhookParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await webhookService.deleteWebhook(req.params.id, userId);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getWebhooks = [
  validateRequest(webhookFilterSchema, 'query'),
  async (req, res, next) => {
    try {
      const webhooks = await webhookService.getWebhooks(req.query);
      res.status(200).json({
        status: 'success',
        data: webhooks.data,
        meta: webhooks.meta
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.triggerWebhook = [
  validateRequest(triggerWebhookSchema, 'body'),
  async (req, res, next) => {
    try {
      const results = await webhookService.triggerWebhook(req.body.event, req.body.payload);
      res.status(200).json({
        status: 'success',
        data: results
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getWebhookLogs = [
  validateRequest(webhookParamsSchema, 'params'),
  validateRequest(Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }), 'query'),
  async (req, res, next) => {
    try {
      const logs = await webhookService.getWebhookLogs(req.params.id, req.query.page, req.query.limit);
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