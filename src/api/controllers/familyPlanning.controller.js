// src/api/controllers/familyPlanning.controller.js

const familyPlanningService = require('../services/familyPlanning.service');
const { validateInput } = require('../../utils/validator');
const {
  createFamilyPlanningMethodSchema,
  updateFamilyPlanningMethodSchema,
  searchFamilyPlanningMethodSchema,
  createFamilyPlanningClientSchema,
  updateFamilyPlanningClientSchema,
  searchFamilyPlanningClientSchema,
  createFamilyPlanningServiceSchema,
  updateFamilyPlanningServiceSchema,
  searchFamilyPlanningServiceSchema,
} = require('../validators/familyPlanning.validator');

class FamilyPlanningController {
  // Family Planning Method controllers
  async createFamilyPlanningMethod(req, res, next) {
    try {
      const { error, value } = validateInput(createFamilyPlanningMethodSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const method = await familyPlanningService.createFamilyPlanningMethod(
        value,
        req.user.id
      );

      return res.status(201).json(method);
    } catch (error) {
      next(error);
    }
  }

  async getFamilyPlanningMethodById(req, res, next) {
    try {
      const { id } = req.params;
      const method = await familyPlanningService.getFamilyPlanningMethodById(id);
      return res.status(200).json(method);
    } catch (error) {
      next(error);
    }
  }

  async updateFamilyPlanningMethod(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = validateInput(updateFamilyPlanningMethodSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const method = await familyPlanningService.updateFamilyPlanningMethod(
        id,
        value,
        req.user.id
      );

      return res.status(200).json(method);
    } catch (error) {
      next(error);
    }
  }

  async deleteFamilyPlanningMethod(req, res, next) {
    try {
      const { id } = req.params;
      const result = await familyPlanningService.deleteFamilyPlanningMethod(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchFamilyPlanningMethods(req, res, next) {
    try {
      const { error, value } = validateInput(searchFamilyPlanningMethodSchema, req.query);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const results = await familyPlanningService.searchFamilyPlanningMethods(value);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  // Family Planning Client controllers
  // src/api/controllers/familyPlanning.controller.js (continued)

  // Family Planning Client controllers
  async createFamilyPlanningClient(req, res, next) {
    try {
      const { error, value } = validateInput(createFamilyPlanningClientSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const client = await familyPlanningService.createFamilyPlanningClient(
        value,
        req.user.id
      );

      return res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  }

  async getFamilyPlanningClientById(req, res, next) {
    try {
      const { id } = req.params;
      const includeServices = req.query.includeServices === 'true';
      const client = await familyPlanningService.getFamilyPlanningClientById(id, includeServices);
      return res.status(200).json(client);
    } catch (error) {
      next(error);
    }
  }

  async updateFamilyPlanningClient(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = validateInput(updateFamilyPlanningClientSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const client = await familyPlanningService.updateFamilyPlanningClient(
        id,
        value,
        req.user.id
      );

      return res.status(200).json(client);
    } catch (error) {
      next(error);
    }
  }

  async deleteFamilyPlanningClient(req, res, next) {
    try {
      const { id } = req.params;
      const result = await familyPlanningService.deleteFamilyPlanningClient(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchFamilyPlanningClients(req, res, next) {
    try {
      const { error, value } = validateInput(searchFamilyPlanningClientSchema, req.query);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const results = await familyPlanningService.searchFamilyPlanningClients(value);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  // Family Planning Service controllers
  async createFamilyPlanningService(req, res, next) {
    try {
      const { error, value } = validateInput(createFamilyPlanningServiceSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const service = await familyPlanningService.createFamilyPlanningService(
        value,
        req.user.id
      );

      return res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }

  async getFamilyPlanningServiceById(req, res, next) {
    try {
      const { id } = req.params;
      const service = await familyPlanningService.getFamilyPlanningServiceById(id);
      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }

  async updateFamilyPlanningService(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = validateInput(updateFamilyPlanningServiceSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const service = await familyPlanningService.updateFamilyPlanningService(
        id,
        value,
        req.user.id
      );

      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }

  async deleteFamilyPlanningService(req, res, next) {
    try {
      const { id } = req.params;
      const result = await familyPlanningService.deleteFamilyPlanningService(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchFamilyPlanningServices(req, res, next) {
    try {
      const { error, value } = validateInput(searchFamilyPlanningServiceSchema, req.query);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const results = await familyPlanningService.searchFamilyPlanningServices(value);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  // Statistics and Reports
  async getFamilyPlanningStatistics(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo, groupBy } = req.query;
      
      if (!groupBy || !['method', 'clientType', 'facility', 'month', 'maritalStatus', 'age', 'serviceType'].includes(groupBy)) {
        return res.status(400).json({ error: 'Invalid or missing groupBy parameter' });
      }

      const results = await familyPlanningService.getFamilyPlanningStatistics({
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

  async getDueAppointments(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const results = await familyPlanningService.getDueAppointments({
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

  async getMethodDistribution(req, res, next) {
    try {
      const results = await familyPlanningService.getMethodDistribution();
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  async getClientRetentionStats(req, res, next) {
    try {
      const { facilityId } = req.query;
      const yearFrom = req.query.yearFrom ? parseInt(req.query.yearFrom) : null;
      const yearTo = req.query.yearTo ? parseInt(req.query.yearTo) : null;

      const results = await familyPlanningService.getClientRetentionStats({
        facilityId,
        yearFrom,
        yearTo,
      });

      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FamilyPlanningController();