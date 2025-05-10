// src/api/services/disease.service.js

const { Op } = require('sequelize');
const db = require('../../models');
const { AppError } = require('../../utils/error');

class DiseaseService {
  // Disease Registry services
  async createDiseaseRegistry(data, userId) {
    try {
      // Check if disease with same name already exists
      const existingDisease = await db.DiseaseRegistry.findOne({
        where: { name: data.name }
      });

      if (existingDisease) {
        throw new AppError('Disease with this name already exists', 400);
      }

      // Create disease registry
      const diseaseRegistry = await db.DiseaseRegistry.create({
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
      const diseaseRegistry = await db.DiseaseRegistry.findByPk(id);

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
      const diseaseRegistry = await db.DiseaseRegistry.findByPk(id);
      if (!diseaseRegistry) {
        throw new AppError('Disease registry not found', 404);
      }

      // If name is being changed, check for duplicates
      if (data.name && data.name !== diseaseRegistry.name) {
        const existingDisease = await db.DiseaseRegistry.findOne({
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
      const diseaseRegistry = await db.DiseaseRegistry.findByPk(id);
      if (!diseaseRegistry) {
        throw new AppError('Disease registry not found', 404);
      }

      // Check if there are any disease cases using this registry
      const caseCount = await db.DiseaseCase.count({
        where: { diseaseId: id }
      });

      if (caseCount > 0) {
        // If cases exist, don't delete but deactivate
        await diseaseRegistry.update({ isActive: false });
        return { message: 'Disease registry deactivated successfully (has associated cases)' };
      }

      // If no cases, delete the registry
      // src/api/services/disease.service.js (continued)

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
      
      const { count, rows } = await db.DiseaseRegistry.findAndCountAll({
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
      // Check if disease exists
      const disease = await db.DiseaseRegistry.findByPk(data.diseaseId);
      if (!disease) {
        throw new AppError('Disease not found', 404);
      }

      // Check if disease is active
      if (!disease.isActive) {
        throw new AppError('Disease is inactive and cannot be reported', 400);
      }

      // Check if patient exists
      const patient = await db.Patient.findByPk(data.patientId);
      if (!patient) {
        throw new AppError('Patient not found', 404);
      }

      // Check if facility exists
      const facility = await db.Facility.findByPk(data.facilityId);
      if (!facility) {
        throw new AppError('Facility not found', 404);
      }

      // If disease is notifiable, auto-set the reported flag if not explicitly set
      if (disease.notifiable && data.reportedToAuthorities === undefined) {
        data.reportedToAuthorities = true;
        data.reportedDate = data.reportingDate;
      }

      // Create disease case
      const diseaseCase = await db.DiseaseCase.create({
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
      const include = [
        {
          model: db.DiseaseRegistry,
          as: 'disease',
          attributes: ['id', 'name', 'icdCode', 'notifiable'],
        },
        {
          model: db.Patient,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'phoneNumber'],
        },
        {
          model: db.Facility,
          as: 'facility',
          attributes: ['id', 'name', 'type', 'lga'],
        },
      ];

      if (includeContacts) {
        include.push({
          model: db.ContactTracing,
          as: 'contacts',
        });
      }

      const diseaseCase = await db.DiseaseCase.findByPk(id, { include });

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
      const diseaseCase = await db.DiseaseCase.findByPk(id);
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
      const diseaseCase = await db.DiseaseCase.findByPk(id);
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
        where.reportingDate = {};
        if (reportingDateFrom) {
          where.reportingDate[Op.gte] = new Date(reportingDateFrom);
        }
        if (reportingDateTo) {
          where.reportingDate[Op.lte] = new Date(reportingDateTo);
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
      
      const { count, rows } = await db.DiseaseCase.findAndCountAll({
        where,
        include: [
          {
            model: db.DiseaseRegistry,
            as: 'disease',
            attributes: ['id', 'name', 'icdCode', 'notifiable'],
          },
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth'],
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['id', 'name', 'type', 'lga'],
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
      const diseaseCase = await db.DiseaseCase.findByPk(id, {
        include: [
          {
            model: db.DiseaseRegistry,
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
      // Check if disease case exists
      const diseaseCase = await db.DiseaseCase.findByPk(data.diseaseCaseId);
      if (!diseaseCase) {
        throw new AppError('Disease case not found', 404);
      }

      // Create contact tracing record
      const contactTracing = await db.ContactTracing.create({
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
      const contactTracing = await db.ContactTracing.findByPk(id, {
        include: [
          {
            model: db.DiseaseCase,
            as: 'diseaseCase',
            include: [
              {
                model: db.DiseaseRegistry,
                as: 'disease',
                attributes: ['id', 'name'],
              },
              {
                model: db.Patient,
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
      const contactTracing = await db.ContactTracing.findByPk(id);
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
      const contactTracing = await db.ContactTracing.findByPk(id);
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
      
      const { count, rows } = await db.ContactTracing.findAndCountAll({
        where,
        include: [
          {
            model: db.DiseaseCase,
            as: 'diseaseCase',
            include: [
              {
                model: db.DiseaseRegistry,
                as: 'disease',
                attributes: ['id', 'name'],
              },
              {
                model: db.Patient,
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
      const { facilityId, dateFrom, dateTo, groupBy } = criteria;

      const where = {};
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      if (dateFrom || dateTo) {
        where.reportingDate = {};
        if (dateFrom) {
          where.reportingDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.reportingDate[Op.lte] = new Date(dateTo);
        }
      }

      let attributes = [];
      let group = [];
      let joinCondition = null;
      
      // Configure grouping based on parameter
      switch (groupBy) {
        case 'disease':
          attributes = [
            [db.sequelize.col('disease.name'), 'diseaseName'],
            [db.sequelize.fn('COUNT', db.sequelize.col('DiseaseCase.id')), 'count'],
          ];
          group = [db.sequelize.col('disease.name')];
          break;
        case 'facility':
          attributes = [
            [db.sequelize.col('facility.name'), 'facilityName'],
            [db.sequelize.fn('COUNT', db.sequelize.col('DiseaseCase.id')), 'count'],
          ];
          group = [db.sequelize.col('facility.name')];
          break;
        case 'month':
          attributes = [
            [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('reportingDate')), 'month'],
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('reportingDate'))];
          break;
        case 'outcome':
          attributes = [
            'outcome',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['outcome'];
          break;
        case 'severity':
          attributes = [
            'severity',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['severity'];
          break;
        case 'status':
          attributes = [
            'status',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['status'];
          break;
        case 'age':
          // Age group statistics
          attributes = [
            [
              db.sequelize.literal(`
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
            [db.sequelize.fn('COUNT', db.sequelize.col('DiseaseCase.id')), 'count'],
          ];
          group = [
            db.sequelize.literal(`
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
            [db.sequelize.col('patient.gender'), 'gender'],
            [db.sequelize.fn('COUNT', db.sequelize.col('DiseaseCase.id')), 'count'],
          ];
          group = [db.sequelize.col('patient.gender')];
          break;
        default:
          throw new AppError('Invalid groupBy parameter', 400);
      }

      const results = await db.DiseaseCase.findAll({
        attributes,
        include: [
          ...(groupBy === 'disease' ? [{
            model: db.DiseaseRegistry,
            as: 'disease',
            attributes: [],
          }] : []),
          ...(groupBy === 'facility' ? [{
            model: db.Facility,
            as: 'facility',
            attributes: [],
          }] : []),
          ...(['age', 'gender'].includes(groupBy) ? [{
            model: db.Patient,
            as: 'patient',
            attributes: [],
          }] : []),
        ],
        where,
        group,
        raw: true,
        order: groupBy === 'age' ? 
          [[db.sequelize.literal('ageGroup'), 'ASC']] : 
          groupBy === 'month' ? 
            [[db.sequelize.literal('month'), 'ASC']] : 
            groupBy === 'disease' ? 
              [[db.sequelize.literal('diseaseName'), 'ASC']] : 
              groupBy === 'facility' ? 
                [[db.sequelize.literal('facilityName'), 'ASC']] : 
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
      
      const { count, rows } = await db.ContactTracing.findAndCountAll({
        where: whereContact,
        include: [
          {
            model: db.DiseaseCase,
            as: 'diseaseCase',
            where: whereCase,
            include: [
              {
                model: db.DiseaseRegistry,
                as: 'disease',
                attributes: ['id', 'name'],
              },
              {
                model: db.Patient,
                as: 'patient',
                attributes: ['id', 'firstName', 'lastName'],
              },
              {
                model: db.Facility,
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
      if (!contactIds || !contactIds.length) {
        throw new AppError('No contact IDs provided', 400);
      }

      // Update multiple contacts at once
      const result = await db.ContactTracing.update(
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
}

module.exports = new DiseaseService();