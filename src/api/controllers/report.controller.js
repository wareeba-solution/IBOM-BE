// src/api/controllers/report.controller.js
const reportService = require('../services/report.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const { 
  createReportSchema, 
  updateReportSchema, 
  reportParamsSchema, 
  runReportSchema,
  searchReportSchema 
} = require('../validators/report.validator');

exports.createReport = [
  validateRequest(createReportSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const report = await reportService.createReport(req.body, userId);
      res.status(201).json({
        status: 'success',
        data: report
      });
    } catch (error) {
      next(error);
    }
  }
];
// src/api/controllers/report.controller.js (continued)
exports.getReportById = [
    validateRequest(reportParamsSchema, 'params'),
    async (req, res, next) => {
      try {
        const report = await reportService.getReportById(req.params.id);
        res.status(200).json({
          status: 'success',
          data: report
        });
      } catch (error) {
        next(error);
      }
    }
  ];
  
  exports.updateReport = [
    validateRequest(reportParamsSchema, 'params'),
    validateRequest(updateReportSchema, 'body'),
    async (req, res, next) => {
      try {
        const userId = req.user.id;
        const updatedReport = await reportService.updateReport(req.params.id, req.body, userId);
        res.status(200).json({
          status: 'success',
          data: updatedReport
        });
      } catch (error) {
        next(error);
      }
    }
  ];
  
  exports.deleteReport = [
    validateRequest(reportParamsSchema, 'params'),
    async (req, res, next) => {
      try {
        const userId = req.user.id;
        const result = await reportService.deleteReport(req.params.id, userId);
        res.status(200).json({
          status: 'success',
          data: result
        });
      } catch (error) {
        next(error);
      }
    }
  ];
  
  exports.searchReports = [
    validateRequest(searchReportSchema, 'query'),
    async (req, res, next) => {
      try {
        const reports = await reportService.searchReports(req.query);
        res.status(200).json({
          status: 'success',
          data: reports.data,
          meta: reports.meta
        });
      } catch (error) {
        next(error);
      }
    }
  ];
  
  exports.runReport = [
    validateRequest(reportParamsSchema, 'params'),
    validateRequest(runReportSchema, 'body'),
    async (req, res, next) => {
      try {
        const results = await reportService.runReport(req.params.id, req.body.parameters);
        res.status(200).json({
          status: 'success',
          data: results
        });
      } catch (error) {
        next(error);
      }
    }
  ];