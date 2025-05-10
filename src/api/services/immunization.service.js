// src/api/services/immunization.service.js

const { Op } = require('sequelize');
const db = require('../../models');
const { AppError } = require('../../utils/error');

class ImmunizationService {
  async createImmunization(data, userId) {
    try {
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

      // Create immunization record
      const immunization = await db.Immunization.create({
        ...data,
        createdBy: userId,
      });

      return immunization;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getImmunizationById(id) {
    try {
      const immunization = await db.Immunization.findByPk(id, {
        include: [
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
      });

      if (!immunization) {
        throw new AppError('Immunization record not found', 404);
      }

      return immunization;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async updateImmunization(id, data, userId) {
    try {
      const immunization = await db.Immunization.findByPk(id);
      if (!immunization) {
        throw new AppError('Immunization record not found', 404);
      }

      await immunization.update({
        ...data,
        updatedBy: userId,
      });

      return immunization;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async deleteImmunization(id) {
    try {
      const immunization = await db.Immunization.findByPk(id);
      if (!immunization) {
        throw new AppError('Immunization record not found', 404);
      }

      // Using soft delete (paranoid)
      await immunization.destroy();

      return { message: 'Immunization record deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async searchImmunizations(criteria) {
    try {
      const {
        patientId,
        facilityId,
        vaccineType,
        vaccineName,
        dateFrom,
        dateTo,
        status,
        page,
        limit,
        sortBy,
        sortOrder,
      } = criteria;

      const where = {};
      
      if (patientId) {
        where.patientId = patientId;
      }
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      if (vaccineType) {
        where.vaccineType = {
          [Op.iLike]: `%${vaccineType}%`
        };
      }
      
      if (vaccineName) {
        where.vaccineName = {
          [Op.iLike]: `%${vaccineName}%`
        };
      }
      
      if (dateFrom || dateTo) {
        where.administrationDate = {};
        if (dateFrom) {
          where.administrationDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.administrationDate[Op.lte] = new Date(dateTo);
        }
      }
      
      if (status) {
        where.status = status;
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await db.Immunization.findAndCountAll({
        where,
        include: [
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

  async getPatientImmunizationHistory(patientId) {
    try {
      // Check if patient exists
      const patient = await db.Patient.findByPk(patientId);
      if (!patient) {
        throw new AppError('Patient not found', 404);
      }

      // Get all immunizations for the patient
      const immunizations = await db.Immunization.findAll({
        where: { patientId },
        include: [
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['id', 'name', 'type', 'lga'],
          },
        ],
        order: [
          ['vaccineType', 'ASC'],
          ['doseNumber', 'ASC'],
          ['administrationDate', 'DESC'],
        ],
      });

      // Group immunizations by vaccine type
      const groupedByVaccine = {};
      
      for (const immunization of immunizations) {
        const vaccineType = immunization.vaccineType;
        
        if (!groupedByVaccine[vaccineType]) {
          groupedByVaccine[vaccineType] = [];
        }
        
        groupedByVaccine[vaccineType].push(immunization);
      }

      return {
        patient: {
          id: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          gender: patient.gender,
          dateOfBirth: patient.dateOfBirth,
        },
        immunizations: groupedByVaccine,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async scheduleImmunization(data, userId) {
    try {
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

      // Create scheduled immunization
      const immunization = await db.Immunization.create({
        patientId: data.patientId,
        facilityId: data.facilityId,
        vaccineType: data.vaccineType,
        vaccineName: data.vaccineName,
        doseNumber: data.doseNumber,
        administrationDate: data.scheduledDate,
        status: 'Scheduled',
        notes: data.notes,
        createdBy: userId,
        // Default values for required fields that will be updated when administered
        batchNumber: 'TBD',
        expiryDate: new Date(data.scheduledDate),
        administeredBy: 'TBD',
        administrationSite: 'Other',
        administrationRoute: 'Other',
      });

      return immunization;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getDueImmunizations(criteria) {
    try {
      const { 
        facilityId, 
        dateFrom, 
        dateTo,
        page,
        limit 
      } = criteria;

      const where = {
        status: 'Scheduled',
      };
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      // Default to looking for immunizations due in the next 30 days if no dates provided
      const today = new Date();
      const defaultDateTo = new Date();
      defaultDateTo.setDate(today.getDate() + 30);
      
      where.administrationDate = {};
      where.administrationDate[Op.gte] = dateFrom ? new Date(dateFrom) : today;
      where.administrationDate[Op.lte] = dateTo ? new Date(dateTo) : defaultDateTo;

      const offset = (page - 1) * limit;
      
      const { count, rows } = await db.Immunization.findAndCountAll({
        where,
        include: [
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
        order: [['administrationDate', 'ASC']],
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

  async getImmunizationStatistics(criteria) {
    try {
      const { facilityId, dateFrom, dateTo, groupBy } = criteria;

      const where = {};
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      if (dateFrom || dateTo) {
        where.administrationDate = {};
        if (dateFrom) {
          where.administrationDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.administrationDate[Op.lte] = new Date(dateTo);
        }
      }

      where.status = 'Administered';

      let attributes = [];
      let group = [];
      
      // Configure grouping based on parameter
      switch (groupBy) {
        case 'vaccine':
          attributes = [
            'vaccineType',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['vaccineType'];
          break;
        case 'facility':
          attributes = [
            [db.sequelize.col('facility.name'), 'facilityName'],
            [db.sequelize.fn('COUNT', db.sequelize.col('Immunization.id')), 'count'],
          ];
          group = [db.sequelize.col('facility.name')];
          break;
        case 'month':
          attributes = [
            [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('administrationDate')), 'month'],
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('administrationDate'))];
          break;
        case 'age':
          // This would require joining with patients and calculating age group
          attributes = [
            [
              db.sequelize.literal(`
                CASE 
                  WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 1 THEN '< 1 year'
                  WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 5 THEN '1-4 years'
                  WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 12 THEN '5-11 years'
                  WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 18 THEN '12-17 years'
                  ELSE '18+ years'
                END
              `),
              'ageGroup'
            ],
            [db.sequelize.fn('COUNT', db.sequelize.col('Immunization.id')), 'count'],
          ];
          group = [
            db.sequelize.literal(`
              CASE 
                WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 1 THEN '< 1 year'
                WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 5 THEN '1-4 years'
                WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 12 THEN '5-11 years'
                WHEN EXTRACT(YEAR FROM AGE(NOW(), "patient"."dateOfBirth")) < 18 THEN '12-17 years'
                ELSE '18+ years'
              END
            `)
          ];
          break;
        default:
          throw new AppError('Invalid groupBy parameter', 400);
      }

      const results = await db.Immunization.findAll({
        attributes,
        include: [
          ...(groupBy === 'facility' ? [{
            model: db.Facility,
            as: 'facility',
            attributes: [],
          }] : []),
          ...(groupBy === 'age' ? [{
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
            [[groupBy === 'facility' ? 'facilityName' : 'vaccineType', 'ASC']],
      });

      return results;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }
}

module.exports = new ImmunizationService();