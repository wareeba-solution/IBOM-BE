// src/api/controllers/notification.controller.js
const notificationService = require('../services/notification.service');
const Joi = require('joi');
const { validateRequest } = require('../middlewares/validation.middleware');

const notificationFilterSchema = Joi.object({
  status: Joi.string().valid('unread', 'read', 'archived'),
  type: Joi.string().valid('info', 'success', 'warning', 'error', 'system'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

const notificationParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});

const markAllAsReadSchema = Joi.object({
  type: Joi.string().valid('info', 'success', 'warning', 'error', 'system')
});

exports.getUserNotifications = [
  validateRequest(notificationFilterSchema, 'query'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const notifications = await notificationService.getUserNotifications(userId, req.query);
      res.status(200).json({
        status: 'success',
        data: notifications.data,
        meta: notifications.meta
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.markAsRead = [
  validateRequest(notificationParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const notification = await notificationService.markAsRead(req.params.id, userId);
      res.status(200).json({
        status: 'success',
        data: notification
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.markAllAsRead = [
  validateRequest(markAllAsReadSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await notificationService.markAllAsRead(userId, req.body.type);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.archiveNotification = [
  validateRequest(notificationParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const notification = await notificationService.archiveNotification(req.params.id, userId);
      res.status(200).json({
        status: 'success',
        data: notification
      });
    } catch (error) {
      next(error);
    }
  }
];