// src/api/services/deathStatistic.service.js

const { Op } = require('sequelize');
const db = require('../../models');
const { AppError } = require('../../utils/error');

class DeathStatisticService {
  async createDeathStatistic(data, userId) {
    try {
      let patientId = data.patientId;
      let facilityId = data.facilityId;
      
      // If patient ID is provided, check if patient exists
      if (patientId) {
        const patient = await db.Patient.findByPk(patientId);
        if (!patient) {
          throw new AppError('Patient not found', 404);
        }
      }

      // If facility ID is provided, check if facility exists
      if (facilityId) {
        const facility = await db.Facility.findByPk(facilityId);
        if (!facility) {
          throw new AppError('Facility not found', 404);
        }
      }

      // Create death statistic
      const deathStatistic = await db.DeathStatistic.create({
        ...data,
        createdBy: userId,
      });

      // Update patient record to mark as deceased if we have a patient
      if (patientId) {
        await db.Patient.update({
          isDeceased: true,
          dateOfDeath: data.date_of_death || data.dateOfDeath,
          updatedBy: userId,
        }, {
          where: { id: patientId }
        });
      }

      return deathStatistic;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getDeathStatisticById(id) {
    try {
      const deathStatistic = await db.DeathStatistic.findByPk(id, {
        include: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth'],
            required: false
          },
          {
            model: db.Facility,
            as: 'facility',
            // Use the correct column names
            attributes: ['id', 'name', 'facilityType', 'lga'],
            required: false
          },
        ],
      });
  
      if (!deathStatistic) {
        throw new AppError('Death statistic not found', 404);
      }
  
      return deathStatistic;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async updateDeathStatistic(id, data, userId) {
    try {
      const deathStatistic = await db.DeathStatistic.findByPk(id);
      if (!deathStatistic) {
        throw new AppError('Death statistic not found', 404);
      }

      await deathStatistic.update({
        ...data,
        updatedBy: userId,
      });

      // Update patient's death date if it changed
      if ((data.date_of_death || data.dateOfDeath) && deathStatistic.patientId) {
        await db.Patient.update(
          {
            dateOfDeath: data.date_of_death || data.dateOfDeath,
            updatedBy: userId,
          },
          {
            where: { id: deathStatistic.patientId },
          }
        );
      }

      return deathStatistic;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async deleteDeathStatistic(id, userId) {
    try {
      const deathStatistic = await db.DeathStatistic.findByPk(id);
      if (!deathStatistic) {
        throw new AppError('Death statistic not found', 404);
      }

      // Instead of completely deleting, we can soft delete if necessary
      await deathStatistic.destroy();

      // Reset patient's deceased status if we have a patient
      if (deathStatistic.patientId) {
        await db.Patient.update(
          {
            isDeceased: false,
            dateOfDeath: null,
            updatedBy: userId,
          },
          {
            where: { id: deathStatistic.patientId },
          }
        );
      }

      return { message: 'Death statistic deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async searchDeathStatistics(criteria) {
    try {
      const {
        patientId,
        facilityId,
        deceased_name,
        date_from,
        date_to,
        manner_of_death,
        cause_of_death,
        city,
        state,
        status,
        page = 1,
        limit = 10,
        sort_by = 'createdAt',
        sort_order = 'DESC',
      } = criteria;

      const where = {};
      
      if (patientId) {
        where.patientId = patientId;
      }
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      if (deceased_name) {
        where.deceased_name = {
          [Op.iLike]: `%${deceased_name}%` 
        };
      }
      
      if (date_from || date_to) {
        where.date_of_death = {};
        if (date_from) {
          where.date_of_death[Op.gte] = new Date(date_from);
        }
        if (date_to) {
          where.date_of_death[Op.lte] = new Date(date_to);
        }
      }
      
      if (manner_of_death) {
        where.manner_of_death = manner_of_death;
      }
      
      if (cause_of_death) {
        where.cause_of_death = {
          [Op.iLike]: `%${cause_of_death}%`
        };
      }
      
      if (city) {
        where.city = {
          [Op.iLike]: `%${city}%`
        };
      }
      
      if (state) {
        where.state = {
          [Op.iLike]: `%${state}%`
        };
      }
      
      if (status) {
        where.status = status;
      }

      const sortField = sort_by === 'created_at' ? 'createdAt' : sort_by;
      const offset = (page - 1) * limit;
      
      const { count, rows } = await db.DeathStatistic.findAndCountAll({
        where,
        include: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth'],
            required: false
          },
          {
            model: db.Facility,
            as: 'facility',
            // Changed 'type' to 'facilityType' here
            attributes: ['id', 'name', 'facilityType', 'lga'],
            required: false
          },
        ],
        order: [[sortField, sort_order]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      const totalPages = Math.ceil(count / limit);
      
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: parseInt(page),
          itemsPerPage: parseInt(limit),
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  async getDeathStatisticsReport(criteria) {
    try {
      const {
        facilityId,
        dateFrom,
        dateTo,
        groupBy,
      } = criteria;

      const where = {};
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      if (dateFrom || dateTo) {
        where.date_of_death = {};
        if (dateFrom) {
          where.date_of_death[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.date_of_death[Op.lte] = new Date(dateTo);
        }
      }

      let attributes = [];
      let group = [];
      
      // Configure grouping based on parameter
      switch (groupBy) {
        case 'cause':
          attributes = [
            'cause_of_death',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['cause_of_death'];
          break;
        case 'manner':
          attributes = [
            'manner_of_death',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['manner_of_death'];
          break;
        case 'facility':
          attributes = [
            [db.sequelize.col('facility.name'), 'facilityName'],
            [db.sequelize.fn('COUNT', db.sequelize.col('DeathStatistic.id')), 'count'],
          ];
          group = [db.sequelize.col('facility.name')];
          break;
        case 'month':
          attributes = [
            [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('date_of_death')), 'month'],
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('date_of_death'))];
          break;
        default:
          throw new AppError('Invalid groupBy parameter', 400);
      }

      const results = await db.DeathStatistic.findAll({
        attributes,
        include: groupBy === 'facility' ? [
          {
            model: db.Facility,
            as: 'facility',
            attributes: [],
            required: false
          },
        ] : [],
        where,
        group,
        raw: true,
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

module.exports = new DeathStatisticService();