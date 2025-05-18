// src/api/controllers/immunization.controller.js

const immunizationService = require('../services/immunization.service');
const { validateInput } = require('../../utils/validator');
const {
  createImmunizationSchema,
  updateImmunizationSchema,
  searchImmunizationSchema,
  immunizationScheduleSchema,
} = require('../validators/immunization.validator');

class ImmunizationController {
  async createImmunization(req, res, next) {
    try {
      const { error, value } = validateInput(createImmunizationSchema, req.body);
      if (error) {
        return res.status(400).json({ 
          status: 'error',
          message: error.message
        });
      }

      const immunization = await immunizationService.createImmunization(
        value,
        req.user.id
      );

      return res.status(201).json({
        status: 'success',
        message: 'Immunization record created successfully',
        data: immunization
      });
    } catch (error) {
      next(error);
    }
  }

  async getImmunizationById(req, res, next) {
    try {
      const { id } = req.params;
      const immunization = await immunizationService.getImmunizationById(id);
      
      return res.status(200).json({
        status: 'success',
        message: 'Immunization record retrieved successfully',
        data: immunization
      });
    } catch (error) {
      next(error);
    }
  }

  async updateImmunization(req, res, next) {
    try {
      const { id } = req.params;
      
      const { error, value } = validateInput(updateImmunizationSchema, req.body);
      if (error) {
        return res.status(400).json({ 
          status: 'error',
          message: error.message
        });
      }

      const immunization = await immunizationService.updateImmunization(
        id,
        value,
        req.user.id
      );

      return res.status(200).json({
        status: 'success',
        message: 'Immunization record updated successfully',
        data: immunization
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteImmunization(req, res, next) {
    try {
      const { id } = req.params;
      const result = await immunizationService.deleteImmunization(id);
      
      return res.status(200).json({
        status: 'success',
        message: 'Immunization record deleted successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async searchImmunizations(req, res, next) {
    try {
      const { error, value } = validateInput(searchImmunizationSchema, req.query);
      if (error) {
        return res.status(400).json({ 
          status: 'error',
          message: error.message
        });
      }

      const results = await immunizationService.searchImmunizations(value);
      
      return res.status(200).json({
        status: 'success',
        message: 'Immunization records retrieved successfully',
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  async getPatientImmunizationHistory(req, res, next) {
    try {
      const { patientId } = req.params;
      const history = await immunizationService.getPatientImmunizationHistory(patientId);
      
      return res.status(200).json({
        status: 'success',
        message: 'Patient immunization history retrieved successfully',
        data: history
      });
    } catch (error) {
      next(error);
    }
  }

  async scheduleImmunization(req, res, next) {
    try {
      const { error, value } = validateInput(immunizationScheduleSchema, req.body);
      if (error) {
        return res.status(400).json({ 
          status: 'error',
          message: error.message
        });
      }

      const immunization = await immunizationService.scheduleImmunization(
        value,
        req.user.id
      );

      return res.status(201).json({
        status: 'success',
        message: 'Immunization scheduled successfully',
        data: immunization
      });
    } catch (error) {
      next(error);
    }
  }

  async getDueImmunizations(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const results = await immunizationService.getDueImmunizations({
        facilityId,
        dateFrom,
        dateTo,
        page,
        limit,
      });

      return res.status(200).json({
        status: 'success',
        message: 'Due immunizations retrieved successfully',
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  async getImmunizationStatistics(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo, groupBy } = req.query;
      
      if (!groupBy || !['vaccine', 'facility', 'month', 'age'].includes(groupBy)) {
        return res.status(400).json({ 
          status: 'error',
          message: 'Invalid or missing groupBy parameter'
        });
      }

      const results = await immunizationService.getImmunizationStatistics({
        facilityId,
        dateFrom,
        dateTo,
        groupBy,
      });

      return res.status(200).json({
        status: 'success',
        message: 'Immunization statistics retrieved successfully',
        data: results
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ImmunizationController();