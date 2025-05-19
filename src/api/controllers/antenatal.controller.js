// src/api/controllers/antenatal.controller.js

const antenatalService = require('../services/antenatal.service');
const { validateInput } = require('../../utils/validator');
const {
  createAntenatalCareSchema,
  updateAntenatalCareSchema,
  searchAntenatalCareSchema,
  createAntenatalVisitSchema,
  updateAntenatalVisitSchema,
  searchAntenatalVisitSchema,
} = require('../validators/antenatal.validator');

class AntenatalController {
  async createAntenatalCare(req, res, next) {
    try {
      const { error, value } = validateInput(createAntenatalCareSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const antenatalCare = await antenatalService.createAntenatalCare(
        value,
        req.user.id
      );

      return res.status(201).json(antenatalCare);
    } catch (error) {
      next(error);
    }
  }

  async getAntenatalCareById(req, res, next) {
    try {
      const { id } = req.params;
      const includeVisits = req.query.includeVisits === 'true';
      const antenatalCare = await antenatalService.getAntenatalCareById(id, includeVisits);
      return res.status(200).json(antenatalCare);
    } catch (error) {
      next(error);
    }
  }

  async updateAntenatalCare(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = validateInput(updateAntenatalCareSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const antenatalCare = await antenatalService.updateAntenatalCare(
        id,
        value,
        req.user.id
      );

      return res.status(200).json(antenatalCare);
    } catch (error) {
      next(error);
    }
  }

  async deleteAntenatalCare(req, res, next) {
    try {
      const { id } = req.params;
      const result = await antenatalService.deleteAntenatalCare(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchAntenatalCare(req, res, next) {
    try {
      const { error, value } = validateInput(searchAntenatalCareSchema, req.query);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const results = await antenatalService.searchAntenatalCare(value);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  async createAntenatalVisit(req, res, next) {
    try {
      const { error, value } = validateInput(createAntenatalVisitSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const antenatalVisit = await antenatalService.createAntenatalVisit(
        value,
        req.user.id
      );

      return res.status(201).json(antenatalVisit);
    } catch (error) {
      next(error);
    }
  }

  async getAntenatalVisitById(req, res, next) {
    try {
      const { id } = req.params;
      const antenatalVisit = await antenatalService.getAntenatalVisitById(id);
      return res.status(200).json(antenatalVisit);
    } catch (error) {
      next(error);
    }
  }

  async updateAntenatalVisit(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = validateInput(updateAntenatalVisitSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const antenatalVisit = await antenatalService.updateAntenatalVisit(
        id,
        value,
        req.user.id
      );

      return res.status(200).json(antenatalVisit);
    } catch (error) {
      next(error);
    }
  }

  async deleteAntenatalVisit(req, res, next) {
    try {
      const { id } = req.params;
      const result = await antenatalService.deleteAntenatalVisit(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchAntenatalVisits(req, res, next) {
    try {
      const { error, value } = validateInput(searchAntenatalVisitSchema, req.query);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const results = await antenatalService.searchAntenatalVisits(value);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  

  async completeAntenatalCare(req, res, next) {
    try {
      const { id } = req.params;
      const outcomeData = req.body;
      
      if (!outcomeData.outcome || !outcomeData.deliveryDate) {
        return res.status(400).json({ error: 'Outcome and delivery date are required' });
      }

      const antenatalCare = await antenatalService.completeAntenatalCare(
        id,
        outcomeData,
        req.user.id
      );

      return res.status(200).json(antenatalCare);
    } catch (error) {
      next(error);
    }
  }

  async getDueAppointments(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const results = await antenatalService.getDueAppointments({
        facilityId,
        dateFrom,
        dateTo,
        page,
        limit,
      });

      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }



}

module.exports = new AntenatalController();