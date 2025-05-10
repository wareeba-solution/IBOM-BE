// src/api/controllers/backup.controller.js
const backupService = require('../services/backup.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const {
  createBackupSchema,
  restoreBackupSchema,
  backupParamsSchema,
  backupSearchSchema
} = require('../validators/backup.validator');

exports.createBackup = [
  validateRequest(createBackupSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const backup = await backupService.createBackup(req.body, userId);
      res.status(201).json({
        status: 'success',
        data: backup
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.restoreBackup = [
  validateRequest(restoreBackupSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await backupService.restoreBackup(req.body.backupId, req.body.password, userId);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getBackups = [
  validateRequest(backupSearchSchema, 'query'),
  async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const backups = await backupService.getBackups(page, limit);
      res.status(200).json({
        status: 'success',
        data: backups.data,
        meta: backups.meta
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getBackupById = [
  validateRequest(backupParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const backup = await backupService.getBackupById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: backup
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.deleteBackup = [
  validateRequest(backupParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await backupService.deleteBackup(req.params.id, userId);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
];