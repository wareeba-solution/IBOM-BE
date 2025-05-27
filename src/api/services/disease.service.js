// src/api/services/disease.service.js

const { Op } = require('sequelize');
const db = require('../../models');
const { AppError } = require('../../utils/error');
const logger = require('../../utils/logger');

class DiseaseService {
  constructor() {
    // Log available models for debugging
    logger.info('Available models in db:', Object.keys(db).join(', '));
    if (db.sequelize && db.sequelize.models) {
      logger.info('Available models in sequelize.models:', Object.keys(db.sequelize.models).join(', '));
    }
    
    // Store sequelize reference for database functions
    this.sequelize = db.sequelize;
    
    // Get references to models, prioritizing sequelize.models since that seems more reliable
    this.DiseaseRegistry = db.DiseaseRegistry || (db.sequelize && db.sequelize.models && db.sequelize.models.DiseaseRegistry);
    this.DiseaseCase = db.DiseaseCase || (db.sequelize && db.sequelize.models && db.sequelize.models.DiseaseCase);
    this.ContactTracing = db.ContactTracing || (db.sequelize && db.sequelize.models && db.sequelize.models.ContactTracing);
    this.Patient = db.Patient || (db.sequelize && db.sequelize.models && db.sequelize.models.Patient);
    this.Facility = db.Facility || (db.sequelize && db.sequelize.models && db.sequelize.models.Facility);
    this.User = db.User || (db.sequelize && db.sequelize.models && db.sequelize.models.User);
    
    // Check if models are available and log the status
    if (!this.DiseaseRegistry) {
      logger.error('DiseaseRegistry model not found!');
    }
    if (!this.DiseaseCase) {
      logger.error('DiseaseCase model not found!');
    }
    if (!this.ContactTracing) {
      logger.error('ContactTracing model not found!');
    }
  }

  // Disease Registry services
  async createDiseaseRegistry(data, userId) {
    try {
      // Check if the model is available
      if (!this.DiseaseRegistry) {
        throw new AppError('DiseaseRegistry model not found', 500);
      }

      // Check if disease with same name already exists
      const existingDisease = await this.DiseaseRegistry.findOne({
        where: { name: data.name }
      });

      if (existingDisease) {
        throw new AppError('Disease with this name already exists', 400);
      }

      // Create disease registry
      const diseaseRegistry = await this.DiseaseRegistry.create({
        ...data,
        createdBy: userId,
      });

      return diseaseRegistry;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getDiseaseRegistryById(id) {
    try {
      if (!this.DiseaseRegistry) {
        throw new AppError('DiseaseRegistry model not found', 500);
      }

      const diseaseRegistry = await this.DiseaseRegistry.findByPk(id);

      if (!diseaseRegistry) {
        throw new AppError('Disease registry not found', 404);
      }

      return diseaseRegistry;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async updateDiseaseRegistry(id, data, userId) {
    try {
      if (!this.DiseaseRegistry) {
        throw new AppError('DiseaseRegistry model not found', 500);
      }

      const diseaseRegistry = await this.DiseaseRegistry.findByPk(id);
      if (!diseaseRegistry) {
        throw new AppError('Disease registry not found', 404);
      }

      // If name is being changed, check for duplicates
      if (data.name && data.name !== diseaseRegistry.name) {
        const existingDisease = await this.DiseaseRegistry.findOne({
          where: { name: data.name }
        });

        if (existingDisease) {
          throw new AppError('Disease with this name already exists', 400);
        }
      }

      await diseaseRegistry.update({
        ...data,
        updatedBy: userId,
      });

      return diseaseRegistry;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async deleteDiseaseRegistry(id) {
    try {
      if (!this.DiseaseRegistry || !this.DiseaseCase) {
        throw new AppError('Required models not found', 500);
      }

      const diseaseRegistry = await this.DiseaseRegistry.findByPk(id);
      if (!diseaseRegistry) {
        throw new AppError('Disease registry not found', 404);
      }

      // Check if there are any disease cases using this registry
      const caseCount = await this.DiseaseCase.count({
        where: { diseaseId: id }
      });

      if (caseCount > 0) {
        // If cases exist, don't delete but deactivate
        await diseaseRegistry.update({ isActive: false });
        return { message: 'Disease registry deactivated successfully (has associated cases)' };
      }

      // If no cases, delete the registry
      await diseaseRegistry.destroy();
      return { message: 'Disease registry deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async searchDiseaseRegistry(criteria) {
    try {
      if (!this.DiseaseRegistry) {
        throw new AppError('DiseaseRegistry model not found', 500);
      }

      const {
        name,
        notifiable,
        isActive,
        page,
        limit,
        sortBy,
        sortOrder,
      } = criteria;

      const where = {};
      
      if (name) {
        where.name = {
          [Op.iLike]: `%${name}%`
        };
      }
      
      if (notifiable !== undefined) {
        where.notifiable = notifiable;
      }
      
      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await this.DiseaseRegistry.findAndCountAll({
        where,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);
      
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  // Disease Case services
  async createDiseaseCase(data, userId) {
    try {

      console.log('=== DEBUG: Incoming data ===');
      console.log('Raw data:', JSON.stringify(data, null, 2));
      console.log('caseId:', data.caseId);
      console.log('diseaseType:', data.diseaseType);
      console.log('==============================');
      if (!this.DiseaseRegistry || !this.DiseaseCase || !this.Patient || !this.Facility) {
        throw new AppError('Required models not found', 500);
      }

      // Check if disease exists
      const disease = await this.DiseaseRegistry.findByPk(data.diseaseId);
      if (!disease) {
        throw new AppError('Disease not found', 404);
      }

      // Check if disease is active
      if (!disease.isActive) {
        throw new AppError('Disease is inactive and cannot be reported', 400);
      }

      // Check if patient exists
      const patient = await this.Patient.findByPk(data.patientId);
      if (!patient) {
        throw new AppError('Patient not found', 404);
      }

      // Check if facility exists
      const facility = await this.Facility.findByPk(data.facilityId);
      if (!facility) {
        throw new AppError('Facility not found', 404);
      }

      // If disease is notifiable, auto-set the reported flag if not explicitly set
      if (disease.notifiable && data.reportedToAuthorities === undefined) {
        data.reportedToAuthorities = true;
        data.reportedDate = data.reportDate;
      }

      // Create disease case
      const diseaseCase = await this.DiseaseCase.create({
        ...data,
        createdBy: userId,
      });

      return diseaseCase;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getDiseaseCaseById(id, includeContacts = false) {
    try {
      if (!this.DiseaseCase || !this.DiseaseRegistry || !this.Patient || !this.Facility) {
        throw new AppError('Required models not found', 500);
      }

      const include = [
        {
          model: this.DiseaseRegistry,
          as: 'disease',
          attributes: ['id', 'name', 'icdCode', 'notifiable'],
        },
        {
          model: this.Patient,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'phoneNumber'],
        },
        {
          model: this.Facility,
          as: 'facility',
          attributes: ['id', 'name', 'facilityType', 'lga'],
        },
      ];

      if (includeContacts && this.ContactTracing) {
        include.push({
          model: this.ContactTracing,
          as: 'contacts',
        });
      }

      const diseaseCase = await this.DiseaseCase.findByPk(id, { include });

      if (!diseaseCase) {
        throw new AppError('Disease case not found', 404);
      }

      return diseaseCase;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async updateDiseaseCase(id, data, userId) {
    try {
      if (!this.DiseaseCase) {
        throw new AppError('DiseaseCase model not found', 500);
      }

      const diseaseCase = await this.DiseaseCase.findByPk(id);
      if (!diseaseCase) {
        throw new AppError('Disease case not found', 404);
      }

      // If status is being changed to 'Resolved' or 'Deceased', ensure outcome is set
      if ((data.status === 'Resolved' || data.status === 'Deceased') && 
          (!data.outcome || data.outcome === 'Unknown')) {
        throw new AppError(`Outcome must be set when status is ${data.status}`, 400);
      }

      // If outcome is being changed to 'Recovered' or 'Deceased', ensure outcome date is set
      if ((data.outcome === 'Recovered' || data.outcome === 'Deceased') && !data.outcomeDate) {
        if (!diseaseCase.outcomeDate) {
          throw new AppError(`Outcome date must be set when outcome is ${data.outcome}`, 400);
        }
      }

      await diseaseCase.update({
        ...data,
        updatedBy: userId,
      });

      return diseaseCase;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async deleteDiseaseCase(id) {
    try {
      if (!this.DiseaseCase) {
        throw new AppError('DiseaseCase model not found', 500);
      }

      const diseaseCase = await this.DiseaseCase.findByPk(id);
      if (!diseaseCase) {
        throw new AppError('Disease case not found', 404);
      }

      // Using soft delete (paranoid)
      await diseaseCase.destroy();

      return { message: 'Disease case deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async searchDiseaseCases(criteria) {
    try {
      if (!this.DiseaseCase || !this.DiseaseRegistry || !this.Patient || !this.Facility) {
        throw new AppError('Required models not found', 500);
      }

      const {
        diseaseId,
        patientId,
        facilityId,
        reportingDateFrom,
        reportingDateTo,
        diagnosisType,
        severity,
        hospitalized,
        outcome,
        status,
        reportedToAuthorities,
        page,
        limit,
        sortBy,
        sortOrder,
      } = criteria;

      const where = {};
      
      if (diseaseId) {
        where.diseaseId = diseaseId;
      }
      
      if (patientId) {
        where.patientId = patientId;
      }
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      if (reportingDateFrom || reportingDateTo) {
        where.reportDate = {}; // Changed from reportingDate
        if (reportingDateFrom) {
          where.reportDate[Op.gte] = new Date(reportingDateFrom);
        }
        if (reportingDateTo) {
          where.reportDate[Op.lte] = new Date(reportingDateTo);
        }
      }
      
      if (diagnosisType) {
        where.diagnosisType = diagnosisType;
      }
      
      if (severity) {
        where.severity = severity;
      }
      
      if (hospitalized !== undefined) {
        where.hospitalized = hospitalized;
      }
      
      if (outcome) {
        where.outcome = outcome;
      }
      
      if (status) {
        where.status = status;
      }
      
      if (reportedToAuthorities !== undefined) {
        where.reportedToAuthorities = reportedToAuthorities;
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await this.DiseaseCase.findAndCountAll({
        where,
        include: [
          {
            model: this.DiseaseRegistry,
            as: 'disease',
            attributes: ['id', 'name', 'icdCode', 'notifiable'],
          },
          {
            model: this.Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth'],
          },
          {
            model: this.Facility,
            as: 'facility',
            attributes: ['id', 'name', 'facilityType', 'lga'],
          },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);
      
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  async reportDiseaseToAuthorities(id, userId) {
    try {
      if (!this.DiseaseCase || !this.DiseaseRegistry) {
        throw new AppError('Required models not found', 500);
      }

      const diseaseCase = await this.DiseaseCase.findByPk(id, {
        include: [
          {
            model: this.DiseaseRegistry,
            as: 'disease',
          },
        ],
      });

      if (!diseaseCase) {
        throw new AppError('Disease case not found', 404);
      }

      if (diseaseCase.reportedToAuthorities) {
        throw new AppError('Disease case already reported to authorities', 400);
      }

      await diseaseCase.update({
        reportedToAuthorities: true,
        reportedDate: new Date(),
        updatedBy: userId,
      });

      return diseaseCase;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  // Contact Tracing services
  async createContactTracing(data, userId) {
    try {
      if (!this.ContactTracing || !this.DiseaseCase) {
        throw new AppError('Required models not found', 500);
      }

      // Check if disease case exists
      const diseaseCase = await this.DiseaseCase.findByPk(data.diseaseCaseId);
      if (!diseaseCase) {
        throw new AppError('Disease case not found', 404);
      }

      // Create contact tracing record
      const contactTracing = await this.ContactTracing.create({
        ...data,
        createdBy: userId,
      });

      return contactTracing;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getContactTracingById(id) {
    try {
      if (!this.ContactTracing || !this.DiseaseCase || !this.DiseaseRegistry || !this.Patient) {
        throw new AppError('Required models not found', 500);
      }

      const contactTracing = await this.ContactTracing.findByPk(id, {
        include: [
          {
            model: this.DiseaseCase,
            as: 'diseaseCase',
            include: [
              {
                model: this.DiseaseRegistry,
                as: 'disease',
                attributes: ['id', 'name'],
              },
              {
                model: this.Patient,
                as: 'patient',
                attributes: ['id', 'firstName', 'lastName'],
              },
            ],
          },
        ],
      });

      if (!contactTracing) {
        throw new AppError('Contact tracing record not found', 404);
      }

      return contactTracing;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async updateContactTracing(id, data, userId) {
    try {
      if (!this.ContactTracing) {
        throw new AppError('ContactTracing model not found', 500);
      }

      const contactTracing = await this.ContactTracing.findByPk(id);
      if (!contactTracing) {
        throw new AppError('Contact tracing record not found', 404);
      }

      await contactTracing.update({
        ...data,
        updatedBy: userId,
      });

      return contactTracing;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async deleteContactTracing(id) {
    try {
      if (!this.ContactTracing) {
        throw new AppError('ContactTracing model not found', 500);
      }

      const contactTracing = await this.ContactTracing.findByPk(id);
      if (!contactTracing) {
        throw new AppError('Contact tracing record not found', 404);
      }

      // Using soft delete (paranoid)
      await contactTracing.destroy();

      return { message: 'Contact tracing record deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async searchContactTracing(criteria) {
    try {
      if (!this.ContactTracing || !this.DiseaseCase || !this.DiseaseRegistry || !this.Patient) {
        throw new AppError('Required models not found', 500);
      }

      const {
        diseaseCaseId,
        contactType,
        riskAssessment,
        monitoringStatus,
        symptomDevelopment,
        testedStatus,
        exposureDateFrom,
        exposureDateTo,
        page,
        limit,
        sortBy,
        sortOrder,
      } = criteria;

      const where = {};
      
      if (diseaseCaseId) {
        where.diseaseCaseId = diseaseCaseId;
      }
      
      if (contactType) {
        where.contactType = contactType;
      }
      
      if (riskAssessment) {
        where.riskAssessment = riskAssessment;
      }
      
      if (monitoringStatus) {
        where.monitoringStatus = monitoringStatus;
      }
      
      if (symptomDevelopment !== undefined) {
        where.symptomDevelopment = symptomDevelopment;
      }
      
      if (testedStatus) {
        where.testedStatus = testedStatus;
      }
      
      if (exposureDateFrom || exposureDateTo) {
        where.exposureDate = {};
        if (exposureDateFrom) {
          where.exposureDate[Op.gte] = new Date(exposureDateFrom);
        }
        if (exposureDateTo) {
          where.exposureDate[Op.lte] = new Date(exposureDateTo);
        }
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await this.ContactTracing.findAndCountAll({
        where,
        include: [
          {
            model: this.DiseaseCase,
            as: 'diseaseCase',
            include: [
              {
                model: this.DiseaseRegistry,
                as: 'disease',
                attributes: ['id', 'name'],
              },
              {
                model: this.Patient,
                as: 'patient',
                attributes: ['id', 'firstName', 'lastName'],
              },
            ],
          },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);
      
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  // Disease Statistics and Reports
  async getDiseaseStatistics(criteria) {
    try {
      if (!this.DiseaseCase || !this.DiseaseRegistry || !this.Patient || !this.Facility) {
        throw new AppError('Required models not found', 500);
      }

      const { facilityId, dateFrom, dateTo, groupBy } = criteria;
      const sequelize = this.sequelize;

      const where = {};
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      if (dateFrom || dateTo) {
        where.reportDate = {}; // Changed from reportingDate
        if (dateFrom) {
          where.reportDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.reportDate[Op.lte] = new Date(dateTo);
        }
      }

      let attributes = [];
      let group = [];
      
      // Configure grouping based on parameter
      switch (groupBy) {
        case 'disease':
          attributes = [
            [sequelize.col('disease.name'), 'disease_name'],
            [sequelize.fn('COUNT', sequelize.col('DiseaseCase.id')), 'count'],
          ];
          group = [sequelize.col('disease.name')];
          break;
        case 'facility':
          attributes = [
            [sequelize.col('facility.name'), 'facilityName'],
            [sequelize.fn('COUNT', sequelize.col('DiseaseCase.id')), 'count'],
          ];
          group = [sequelize.col('facility.name')];
          break;
        case 'month':
          attributes = [
            [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('reportDate')), 'month'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          ];
          group = [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('reportDate'))];
          break;
        case 'outcome':
          attributes = [
            'outcome',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          ];
          group = ['outcome'];
          break;
        case 'severity':
          attributes = [
            'severity',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          ];
          group = ['severity'];
          break;
        case 'status':
          attributes = [
            'status',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          ];
          group = ['status'];
          break;
        case 'age':
          // Age group statistics
          attributes = [
            [
              sequelize.literal(`
                CASE 
                  WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 5 THEN 'Under 5'
                  WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 18 THEN '5-17'
                  WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 40 THEN '18-39'
                  WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 65 THEN '40-64'
                  ELSE '65 and above'
                END
              `),
              'ageGroup'
            ],
            [sequelize.fn('COUNT', sequelize.col('DiseaseCase.id')), 'count'],
          ];
          group = [
            sequelize.literal(`
              CASE 
                WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 5 THEN 'Under 5'
                WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 18 THEN '5-17'
                WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 40 THEN '18-39'
                WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 65 THEN '40-64'
                ELSE '65 and above'
              END
            `)
          ];
          break;
        case 'gender':
          attributes = [
            [sequelize.col('patient.gender'), 'gender'],
            [sequelize.fn('COUNT', sequelize.col('DiseaseCase.id')), 'count'],
          ];
          group = [sequelize.col('patient.gender')];
          break;
        default:
          throw new AppError('Invalid groupBy parameter', 400);
      }

      const results = await this.DiseaseCase.findAll({
        attributes,
        include: [
          ...(groupBy === 'disease' ? [{
            model: this.DiseaseRegistry,
            as: 'disease',
            attributes: [],
          }] : []),
          ...(groupBy === 'facility' ? [{
            model: this.Facility,
            as: 'facility',
            attributes: [],
          }] : []),
          ...(['age', 'gender'].includes(groupBy) ? [{
            model: this.Patient,
            as: 'patient',
            attributes: [],
          }] : []),
        ],
        where,
        group,
        raw: true,
        order: groupBy === 'age' ? 
          [[sequelize.literal('ageGroup'), 'ASC']] : 
          groupBy === 'month' ? 
            [[sequelize.literal('month'), 'ASC']] : 
            groupBy === 'disease' ? 
              [[sequelize.literal('disease_name'), 'ASC']] : 
              groupBy === 'facility' ? 
                [[sequelize.literal('facilityName'), 'ASC']] : 
                [[groupBy, 'ASC']],
      });

      return results;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getContactsNeedingFollowUp(criteria) {
    try {
      if (!this.ContactTracing || !this.DiseaseCase || !this.DiseaseRegistry || !this.Patient || !this.Facility) {
        throw new AppError('Required models not found', 500);
      }

      const { 
        facilityId, 
        monitoringEndDateFrom,
        monitoringEndDateTo,
        page,
        limit 
      } = criteria;

      const whereCase = {};
      if (facilityId) {
        whereCase.facilityId = facilityId;
      }

      const whereContact = {
        monitoringStatus: 'Ongoing',
      };
      
      // Filter by monitoring end date
      if (monitoringEndDateFrom || monitoringEndDateTo) {
        whereContact.monitoringEndDate = {};
        if (monitoringEndDateFrom) {
          whereContact.monitoringEndDate[Op.gte] = new Date(monitoringEndDateFrom);
        }
        if (monitoringEndDateTo) {
          whereContact.monitoringEndDate[Op.lte] = new Date(monitoringEndDateTo);
        }
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await this.ContactTracing.findAndCountAll({
        where: whereContact,
        include: [
          {
            model: this.DiseaseCase,
            as: 'diseaseCase',
            where: whereCase,
            include: [
              {
                model: this.DiseaseRegistry,
                as: 'disease',
                attributes: ['id', 'name'],
              },
              {
                model: this.Patient,
                as: 'patient',
                attributes: ['id', 'firstName', 'lastName'],
              },
              {
                model: this.Facility,
                as: 'facility',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
        order: [['monitoringEndDate', 'ASC']],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);
      
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  async updateContactBatch(contactIds, updateData, userId) {
    try {
      if (!this.ContactTracing) {
        throw new AppError('ContactTracing model not found', 500);
      }

      if (!contactIds || !contactIds.length) {
        throw new AppError('No contact IDs provided', 400);
      }

      // Update multiple contacts at once
      const result = await this.ContactTracing.update(
        {
          ...updateData,
          updatedBy: userId,
        },
        {
          where: {
            id: {
              [Op.in]: contactIds,
            },
          },
          returning: true,
        }
      );

      return { 
        message: `Updated ${result[0]} contact records successfully`,
        count: result[0],
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async exportDiseaseCases(criteria) {
    try {
      if (!this.DiseaseCase || !this.DiseaseRegistry || !this.Patient || !this.Facility) {
        throw new AppError('Required models not found', 500);
      }

      const { format, dateFrom, dateTo, diseaseId, facilityId } = criteria;
      
      // Build the query conditions
      const where = {};
      
      if (diseaseId) {
        where.diseaseId = diseaseId;
      }
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      if (dateFrom || dateTo) {
        where.reportDate = {};
        if (dateFrom) {
          where.reportDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.reportDate[Op.lte] = new Date(dateTo);
        }
      }
      
      // Find disease cases with associations
      const diseaseCases = await this.DiseaseCase.findAll({
        where,
        include: [
          {
            model: this.DiseaseRegistry,
            as: 'disease',
            attributes: ['id', 'name', 'icdCode']
          },
          {
            model: this.Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'phoneNumber']
          },
          {
            model: this.Facility,
            as: 'facility',
            attributes: ['id', 'name', 'facilityType', 'lga']
          }
        ],
        order: [['reportDate', 'DESC']]
      });
      
      // Transform data for export
      const exportData = diseaseCases.map(diseaseCase => {
        const plainCase = diseaseCase.get({ plain: true });
        
        // Format dates
        const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';
        
        return {
          case_id: plainCase.caseId,
          disease_name: plainCase.disease?.name || '',
          disease_type: plainCase.diseaseType || '',
          patient_id: plainCase.patientId,
          patient_name: plainCase.patientName || `${plainCase.patient?.firstName || ''} ${plainCase.patient?.lastName || ''}`.trim(),
          patient_gender: plainCase.patient?.gender || '',
          patient_age: plainCase.patient?.dateOfBirth ? Math.floor((new Date() - new Date(plainCase.patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : '',
          facility_name: plainCase.facility?.name || '',
          report_date: formatDate(plainCase.reportDate),
          onset_date: formatDate(plainCase.onsetDate),
          location: plainCase.location || '',
          status: plainCase.status || '',
          severity: plainCase.severity || '',
          outcome: plainCase.outcome || '',
          is_outbreak: plainCase.isOutbreak ? 'Yes' : 'No',
          reported_by: plainCase.reportedBy || '',
          lab_test_type: plainCase.labTestType || '',
          lab_result: plainCase.labResult || '',
          symptoms: Array.isArray(plainCase.symptoms) ? plainCase.symptoms.join(', ') : '',
          hospital_name: plainCase.hospitalName || '',
          admission_date: formatDate(plainCase.admissionDate),
          discharge_date: formatDate(plainCase.dischargeDate),
          reported_to_authorities: plainCase.reportedToAuthorities ? 'Yes' : 'No',
          reported_date: formatDate(plainCase.reportedDate)
        };
      });
      
      // Return data in requested format
      if (format === 'json') {
        return {
          data: exportData,
          format: 'json',
          timestamp: new Date().toISOString(),
          count: exportData.length
        };
      } else {
        // Default to CSV format
        // In a real implementation, you would convert to CSV here
        // For simplicity, we're returning the same structure
        return {
          data: exportData,
          format: 'csv',
          timestamp: new Date().toISOString(),
          count: exportData.length
        };
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }
  
  async getDiseaseTrends(criteria) {
    try {
      const { facilityId, period = 'month', diseaseId, months = 12 } = criteria;
      
      // Simple aggregation by month
      const results = await this.DiseaseCase.findAll({
        attributes: [
          [this.sequelize.fn('DATE_TRUNC', 'month', this.sequelize.col('reportDate')), 'month'],
          [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'total_cases']
        ],
        where: {
          reportDate: {
            [Op.gte]: new Date(Date.now() - (months * 30 * 24 * 60 * 60 * 1000))
          },
          ...(diseaseId && { diseaseId }),
          ...(facilityId && { facilityId })
        },
        group: [this.sequelize.fn('DATE_TRUNC', 'month', this.sequelize.col('reportDate'))],
        order: [[this.sequelize.fn('DATE_TRUNC', 'month', this.sequelize.col('reportDate')), 'ASC']],
        raw: true
      });
  
      return {
        period_type: period,
        trends: results.map(item => ({
          period: item.month,
          total_cases: parseInt(item.total_cases, 10)
        }))
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
}

module.exports = new DiseaseService();