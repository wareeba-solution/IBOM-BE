// src/api/controllers/disease.controller.js

const diseaseService = require('../services/disease.service');
const { validateInput } = require('../../utils/validator');
const {
  createDiseaseRegistrySchema,
  updateDiseaseRegistrySchema,
  searchDiseaseRegistrySchema,
  createDiseaseCaseSchema,
  updateDiseaseCaseSchema,
  searchDiseaseCaseSchema,
  createContactTracingSchema,
  updateContactTracingSchema,
  searchContactTracingSchema,
} = require('../validators/disease.validator');

class DiseaseController {
  // Disease Registry controllers
  async createDiseaseRegistry(req, res, next) {
    try {
      const { error, value } = validateInput(createDiseaseRegistrySchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const diseaseRegistry = await diseaseService.createDiseaseRegistry(
        value,
        req.user.id
      );

      return res.status(201).json(diseaseRegistry);
    } catch (error) {
      next(error);
    }
  }

  async getDiseaseRegistryById(req, res, next) {
    try {
      const { id } = req.params;
      const diseaseRegistry = await diseaseService.getDiseaseRegistryById(id);
      return res.status(200).json(diseaseRegistry);
    } catch (error) {
      next(error);
    }
  }

  async updateDiseaseRegistry(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = validateInput(updateDiseaseRegistrySchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const diseaseRegistry = await diseaseService.updateDiseaseRegistry(
        id,
        value,
        req.user.id
      );

      return res.status(200).json(diseaseRegistry);
    } catch (error) {
      next(error);
    }
  }

  async deleteDiseaseRegistry(req, res, next) {
    try {
      const { id } = req.params;
      const result = await diseaseService.deleteDiseaseRegistry(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchDiseaseRegistry(req, res, next) {
    try {
      const { error, value } = validateInput(searchDiseaseRegistrySchema, req.query);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const results = await diseaseService.searchDiseaseRegistry(value);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  // Disease Case controllers
  async createDiseaseCase(req, res, next) {
    try {
      const { error, value } = validateInput(createDiseaseCaseSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const diseaseCase = await diseaseService.createDiseaseCase(
        value,
        req.user.id
      );

      return res.status(201).json(diseaseCase);
    } catch (error) {
      next(error);
    }
  }

  async getDiseaseCaseById(req, res, next) {
    try {
      const { id } = req.params;
      const includeContacts = req.query.includeContacts === 'true';
      const diseaseCase = await diseaseService.getDiseaseCaseById(id, includeContacts);
      return res.status(200).json(diseaseCase);
    } catch (error) {
      next(error);
    }
  }

  async updateDiseaseCase(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = validateInput(updateDiseaseCaseSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const diseaseCase = await diseaseService.updateDiseaseCase(
        id,
        value,
        req.user.id
      );

      return res.status(200).json(diseaseCase);
    } catch (error) {
      next(error);
    }
  }

  async deleteDiseaseCase(req, res, next) {
    try {
      const { id } = req.params;
      const result = await diseaseService.deleteDiseaseCase(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchDiseaseCases(req, res, next) {
    try {
      const { error, value } = validateInput(searchDiseaseCaseSchema, req.query);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const results = await diseaseService.searchDiseaseCases(value);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  async reportDiseaseToAuthorities(req, res, next) {
    try {
      const { id } = req.params;
      const diseaseCase = await diseaseService.reportDiseaseToAuthorities(id, req.user.id);
      return res.status(200).json(diseaseCase);
    } catch (error) {
      next(error);
    }
  }

  // Contact Tracing controllers
  async createContactTracing(req, res, next) {
    try {
      const { error, value } = validateInput(createContactTracingSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const contactTracing = await diseaseService.createContactTracing(
        value,
        req.user.id
      );

      return res.status(201).json(contactTracing);
    } catch (error) {
      next(error);
    }
  }

  async getContactTracingById(req, res, next) {
    try {
      const { id } = req.params;
      const contactTracing = await diseaseService.getContactTracingById(id);
      return res.status(200).json(contactTracing);
    } catch (error) {
      next(error);
    }
  }

  async updateContactTracing(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = validateInput(updateContactTracingSchema, req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const contactTracing = await diseaseService.updateContactTracing(
        id,
        value,
        req.user.id
      );

      return res.status(200).json(contactTracing);
    } catch (error) {
      next(error);
    }
  }

  // src/api/controllers/disease.controller.js (continued)

  async deleteContactTracing(req, res, next) {
    try {
      const { id } = req.params;
      const result = await diseaseService.deleteContactTracing(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchContactTracing(req, res, next) {
    try {
      const { error, value } = validateInput(searchContactTracingSchema, req.query);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const results = await diseaseService.searchContactTracing(value);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  // Statistics and Reports
  async getDiseaseStatistics(req, res, next) {
    try {
      const { facilityId, dateFrom, dateTo, groupBy } = req.query;
      
      if (!groupBy || !['disease', 'facility', 'month', 'outcome', 'severity', 'status', 'age', 'gender'].includes(groupBy)) {
        return res.status(400).json({ error: 'Invalid or missing groupBy parameter' });
      }

      const results = await diseaseService.getDiseaseStatistics({
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

  async getContactsNeedingFollowUp(req, res, next) {
    try {
      const { facilityId, monitoringEndDateFrom, monitoringEndDateTo } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const results = await diseaseService.getContactsNeedingFollowUp({
        facilityId,
        monitoringEndDateFrom,
        monitoringEndDateTo,
        page,
        limit,
      });

      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  async updateContactBatch(req, res, next) {
    try {
      const { contactIds, updateData } = req.body;
      
      if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
        return res.status(400).json({ error: 'Contact IDs array is required' });
      }
      
      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'Update data is required' });
      }

      // Validate update data
      const { error } = validateInput(updateContactTracingSchema, updateData);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const result = await diseaseService.updateContactBatch(
        contactIds,
        updateData,
        req.user.id
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DiseaseController();