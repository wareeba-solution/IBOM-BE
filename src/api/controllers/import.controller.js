// src/api/controllers/import.controller.js
const importService = require('../services/import.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const {
  createImportJobSchema,
  importJobParamsSchema,
  importJobSearchSchema
} = require('../validators/import.validator');

exports.createImportJob = [
  validateRequest(createImportJobSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const importJob = await importService.createImportJob(req.body, userId);
      res.status(201).json({
        status: 'success',
        data: importJob
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getImportJob = [
  validateRequest(importJobParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const importJob = await importService.getImportJob(req.params.id);
      res.status(200).json({
        status: 'success',
        data: importJob
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getImportJobs = [
  validateRequest(importJobSearchSchema, 'query'),
  async (req, res, next) => {
    try {
      const importJobs = await importService.getImportJobs(req.query);
      res.status(200).json({
        status: 'success',
        data: importJobs.data,
        meta: importJobs.meta
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.cancelImportJob = [
  validateRequest(importJobParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const importJob = await importService.cancelImportJob(req.params.id);
      res.status(200).json({
        status: 'success',
        data: importJob
      });
    } catch (error) {
      next(error);
    }
  }
];