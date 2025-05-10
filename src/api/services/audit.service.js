// src/api/services/audit.service.js
const { Audit, User, sequelize } = require('../../models');
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');

class AuditService {
  async logAction(auditData) {
    try {
      return await Audit.create(auditData);
    } catch (error) {
      console.error('Error logging audit action:', error);
      // Don't throw error to prevent disrupting the main flow
      return null;
    }
  }

  async getAuditLogs(filters) {
    const { 
      action, 
      entityType, 
      entityId, 
      userId, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 10 
    } = filters;

    const whereClause = {};
    
    if (action) {
      whereClause.action = action;
    }
    
    if (entityType) {
      whereClause.entityType = entityType;
    }
    
    if (entityId) {
      whereClause.entityId = entityId;
    }
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      
      if (startDate) {
        whereClause.createdAt[Op.gte] = new Date(startDate);
      }
      
      if (endDate) {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      }
    }
    
    const offset = (page - 1) * limit;
    
    const { rows, count } = await Audit.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getAuditById(auditId) {
    const audit = await Audit.findByPk(auditId, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!audit) {
      throw new AppError('Audit log not found', 404);
    }

    return audit;
  }

  async getEntityHistory(entityType, entityId) {
    const audits = await Audit.findAll({
      where: {
        entityType,
        entityId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return audits;
  }
}

module.exports = new AuditService();