// src/api/services/notification.service.js
const { Notification, User, sequelize } = require('../../models');
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');

class NotificationService {
  async createNotification(notificationData) {
    try {
      return await Notification.create(notificationData);
    } catch (error) {
      throw new AppError(`Failed to create notification: ${error.message}`, 500);
    }
  }

  async createMultipleNotifications(notifications) {
    try {
      return await Notification.bulkCreate(notifications);
    } catch (error) {
      throw new AppError(`Failed to create notifications: ${error.message}`, 500);
    }
  }

  async getNotificationById(notificationId, userId) {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    return notification;
  }

  async getUserNotifications(userId, filters = {}) {
    const { status, type, page = 1, limit = 10 } = filters;
    
    const whereClause = { userId };
    
    if (status) {
      whereClause.status = status;
    }
    // src/api/services/notification.service.js (continued)
    if (type) {
        whereClause.type = type;
      }
      
      // Don't show expired notifications
      whereClause.expiresAt = {
        [Op.or]: [
          { [Op.gt]: new Date() },
          { [Op.eq]: null }
        ]
      };
      
      const offset = (page - 1) * limit;
      
      const { rows, count } = await Notification.findAndCountAll({
        where: whereClause,
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
  
    async markAsRead(notificationId, userId) {
      const notification = await this.getNotificationById(notificationId, userId);
      
      await notification.update({
        status: 'read',
        readAt: new Date()
      });
      
      return notification;
    }
  
    async markAllAsRead(userId, type = null) {
      const whereClause = {
        userId,
        status: 'unread'
      };
      
      if (type) {
        whereClause.type = type;
      }
      
      await Notification.update(
        {
          status: 'read',
          readAt: new Date()
        },
        { where: whereClause }
      );
      
      return { success: true };
    }
  
    async archiveNotification(notificationId, userId) {
      const notification = await this.getNotificationById(notificationId, userId);
      
      await notification.update({
        status: 'archived'
      });
      
      return notification;
    }
  
    async deleteExpiredNotifications() {
      const result = await Notification.destroy({
        where: {
          expiresAt: {
            [Op.lt]: new Date()
          }
        }
      });
      
      return { count: result };
    }
  }
  
  module.exports = new NotificationService();