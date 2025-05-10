// src/api/controllers/deathStatistic.controller.js

const deathStatisticService = require('../services/deathStatistic.service');
const { validateInput } = require('../../utils/validator');
const {
  createDeathStatisticSchema,
  updateDeathStatisticSchema,
  searchDeathStatisticSchema,
} = require('../validators/deathStatistic.validator');

class DeathStatisticController {
  async createDeathStatistic(req, res, next) {
    try {
      const { error, value } = validateInput(createDeathStatisticSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const deathStatistic = await deathStatisticService.createDeathStatistic(
        value,
        req.user.id
      );

      return res.status(201).json(deathStatistic);
    } catch (error) {
      next(error);
    }
  }

  async getDeathStatisticById(req, res, next) {
    try {
      const { id } = req.params;
      const deathStatistic = await deathStatisticService.getDeathStatisticById(id);
      return res.status(200).json(deathStatistic);
    } catch (error) {
      next(error);
    }
  }

  async updateDeathStatistic(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = validateInput(updateDeathStatisticSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const deathStatistic = await deathStatisticService.updateDeathStatistic(
        id,
        value,
        req.user.id
      );

      return res.status(200).json(deathStatistic);
    } catch (error) {
      next(error);
    }
  }

  async deleteDeathStatistic(req, res, next) {
    try {
      const { id } = req.params;
      const result = await deathStatisticService.deleteDeathStatistic(id, req.user.id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchDeathStatistics(req, res, next) {
    try {
      const { error, value } = validateInput(searchDeathStatisticSchema, req.query);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const results = await deathStatisticService.searchDeathStatistics(value);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  async getDeathStatisticsReport(req, res, next) {
    try {
      // Simple validation for report params
      const { facilityId, dateFrom, dateTo, groupBy } = req.query;
      
      if (!groupBy || !['cause', 'manner', 'facility', 'month'].includes(groupBy)) {
        return res.status(400).json({ error: 'Invalid or missing groupBy parameter' });
      }

      const results = await deathStatisticService.getDeathStatisticsReport({
        facilityId,
        dateFrom,
        dateTo,
        groupBy,
      });

      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DeathStatisticController();