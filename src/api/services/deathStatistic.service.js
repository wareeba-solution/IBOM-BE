// src/api/services/deathStatistic.service.js

const { Op } = require('sequelize');
const db = require('../../models');
const { AppError } = require('../../utils/error');

class DeathStatisticService {
  async createDeathStatistic(data, userId) {
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

      // Create death statistic
      const deathStatistic = await db.DeathStatistic.create({
        ...data,
        createdBy: userId,
      });

      // Update patient record to mark as deceased
      await patient.update({
        isDeceased: true,
        dateOfDeath: data.dateOfDeath,
        updatedBy: userId,
      });

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
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['id', 'name', 'type', 'lga'],
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

      if (data.dateOfDeath) {
        // Update patient's death date if it changed
        await db.Patient.update(
          {
            dateOfDeath: data.dateOfDeath,
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

      // Reset patient's deceased status
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
        dateFrom,
        dateTo,
        mannerOfDeath,
        autopsyPerformed,
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
      
      if (dateFrom || dateTo) {
        where.dateOfDeath = {};
        if (dateFrom) {
          where.dateOfDeath[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.dateOfDeath[Op.lte] = new Date(dateTo);
        }
      }
      
      if (mannerOfDeath) {
        where.mannerOfDeath = mannerOfDeath;
      }
      
      if (autopsyPerformed !== undefined) {
        where.autopsyPerformed = autopsyPerformed;
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await db.DeathStatistic.findAndCountAll({
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
        where.dateOfDeath = {};
        if (dateFrom) {
          where.dateOfDeath[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.dateOfDeath[Op.lte] = new Date(dateTo);
        }
      }

      let attributes = [];
      let group = [];
      
      // Configure grouping based on parameter
      switch (groupBy) {
        case 'cause':
          attributes = [
            'primaryCauseOfDeath',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['primaryCauseOfDeath'];
          break;
        case 'manner':
          attributes = [
            'mannerOfDeath',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['mannerOfDeath'];
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
            [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('dateOfDeath')), 'month'],
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('dateOfDeath'))];
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