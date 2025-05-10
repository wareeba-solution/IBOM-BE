// src/api/controllers/dashboard.controller.js
const dashboardService = require('../services/dashboard.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const Joi = require('joi');

const dashboardParamsSchema = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  facilityId: Joi.string().uuid(),
  year: Joi.number().integer().min(2000).max(2100),
  metric: Joi.string().valid('patients', 'births', 'deaths', 'immunizations', 'anc', 'diseases'),
  limit: Joi.number().integer().min(1).max(50).default(5),
  vaccine: Joi.string()
});

exports.getSummaryStats = [
  validateRequest(dashboardParamsSchema, 'query'),
  async (req, res, next) => {
    try {
      const stats = await dashboardService.getSummaryStats(req.query);
      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getMonthlyTrends = [
  validateRequest(dashboardParamsSchema, 'query'),
  async (req, res, next) => {
    try {
      const trends = await dashboardService.getMonthlyTrends(req.query);
      res.status(200).json({
        status: 'success',
        data: trends
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getTopFacilities = [
  validateRequest(dashboardParamsSchema, 'query'),
  async (req, res, next) => {
    try {
      const facilities = await dashboardService.getTopFacilities(req.query);
      res.status(200).json({
        status: 'success',
        data: facilities
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getDiseaseDistribution = [
  validateRequest(dashboardParamsSchema, 'query'),
  async (req, res, next) => {
    try {
      const distribution = await dashboardService.getDiseaseDistribution(req.query);
      res.status(200).json({
        status: 'success',
        data: distribution
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getImmunizationCoverage = [
  validateRequest(dashboardParamsSchema, 'query'),
  async (req, res, next) => {
    try {
      const coverage = await dashboardService.getImmunizationCoverage(req.query);
      res.status(200).json({
        status: 'success',
        data: coverage
      });
    } catch (error) {
      next(error);
    }
  }
];