// src/api/controllers/integration.controller.js
const integrationService = require('../services/integration.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const {
  createIntegrationSchema,
  updateIntegrationSchema,
  integrationParamsSchema,
  runIntegrationSchema,
  integrationSearchSchema
} = require('../validators/integration.validator');

exports.createIntegration = [
  validateRequest(createIntegrationSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const integration = await integrationService.createIntegration(req.body, userId);
      res.status(201).json({
        status: 'success',
        data: integration
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getIntegrationById = [
  validateRequest(integrationParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const integration = await integrationService.getIntegrationById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: integration
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.updateIntegration = [
  validateRequest(integrationParamsSchema, 'params'),
  validateRequest(updateIntegrationSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const integration = await integrationService.updateIntegration(req.params.id, req.body, userId);
      res.status(200).json({
        status: 'success',
        data: integration
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.deleteIntegration = [
  validateRequest(integrationParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await integrationService.deleteIntegration(req.params.id, userId);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.searchIntegrations = [
  validateRequest(integrationSearchSchema, 'query'),
  async (req, res, next) => {
    try {
      const integrations = await integrationService.searchIntegrations(req.query);
      res.status(200).json({
        status: 'success',
        data: integrations.data,
        meta: integrations.meta
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.runIntegration = [
  validateRequest(integrationParamsSchema, 'params'),
  validateRequest(runIntegrationSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await integrationService.runIntegration(req.params.id, req.body.parameters, userId);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
];