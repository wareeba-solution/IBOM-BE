// src/api/controllers/export.controller.js
const exportService = require('../services/export.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const {
  createExportJobSchema,
  exportJobParamsSchema,
  exportJobSearchSchema
} = require('../validators/export.validator');

exports.createExportJob = [
  validateRequest(createExportJobSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const exportJob = await exportService.createExportJob(req.body, userId);
      res.status(201).json({
        status: 'success',
        data: exportJob
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getExportJob = [
  validateRequest(exportJobParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const exportJob = await exportService.getExportJob(req.params.id);
      res.status(200).json({
        status: 'success',
        data: exportJob
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getExportJobs = [
  validateRequest(exportJobSearchSchema, 'query'),
  async (req, res, next) => {
    try {
      const exportJobs = await exportService.getExportJobs(req.query);
      res.status(200).json({
        status: 'success',
        data: exportJobs.data,
        meta: exportJobs.meta
      });
    } catch (error) {
      next(error);
    }
  }
];