// src/api/controllers/setting.controller.js
const Joi = require('joi'); // Add this import
const settingService = require('../services/setting.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const {
  createSettingSchema,
  updateSettingSchema,
  settingParamsSchema,
  settingSearchSchema
} = require('../validators/setting.validator');

exports.createSetting = [
  validateRequest(createSettingSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const setting = await settingService.createSetting(req.body, userId);
      res.status(201).json({
        status: 'success',
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getSettingById = [
  validateRequest(settingParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const setting = await settingService.getSettingById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getSettingByKey = [
  validateRequest(settingParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const setting = await settingService.getSettingByKey(req.params.key);
      res.status(200).json({
        status: 'success',
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.updateSetting = [
  validateRequest(settingParamsSchema, 'params'),
  validateRequest(updateSettingSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const setting = await settingService.updateSetting(req.params.id, req.body, userId);
      res.status(200).json({
        status: 'success',
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.updateSettingByKey = [
  validateRequest(settingParamsSchema, 'params'),
  validateRequest(Joi.object({ value: Joi.string().required() }), 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const setting = await settingService.updateSettingByKey(req.params.key, req.body.value, userId);
      res.status(200).json({
        status: 'success',
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.deleteSetting = [
  validateRequest(settingParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await settingService.deleteSetting(req.params.id, userId);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.searchSettings = [
  validateRequest(settingSearchSchema, 'query'),
  async (req, res, next) => {
    try {
      const settings = await settingService.searchSettings(req.query);
      res.status(200).json({
        status: 'success',
        data: settings.data,
        meta: settings.meta
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getSettingsByCategory = [
  validateRequest(Joi.object({ category: Joi.string().required() }), 'params'),
  async (req, res, next) => {
    try {
      const settings = await settingService.getSettingsByCategory(req.params.category);
      res.status(200).json({
        status: 'success',
        data: settings
      });
    } catch (error) {
      next(error);
    }
  }
];