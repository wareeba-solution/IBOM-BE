// src/api/controllers/support.controller.js
const supportService = require('../services/support.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const {
  createTicketSchema,
  updateTicketSchema,
  ticketParamsSchema,
  ticketSearchSchema,
  createCommentSchema,
  commentParamsSchema
} = require('../validators/ticket.validator');

exports.createTicket = [
  validateRequest(createTicketSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const ticket = await supportService.createTicket(req.body, userId);
      res.status(201).json({
        status: 'success',
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getTicketById = [
  validateRequest(ticketParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const ticket = await supportService.getTicketById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getTicketByNumber = [
  validateRequest(ticketParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const ticket = await supportService.getTicketByNumber(req.params.ticketNumber);
      res.status(200).json({
        status: 'success',
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.updateTicket = [
  validateRequest(ticketParamsSchema, 'params'),
  validateRequest(updateTicketSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const ticket = await supportService.updateTicket(req.params.id, req.body, userId);
      res.status(200).json({
        status: 'success',
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.searchTickets = [
  validateRequest(ticketSearchSchema, 'query'),
  async (req, res, next) => {
    try {
      const tickets = await supportService.searchTickets(req.query);
      res.status(200).json({
        status: 'success',
        data: tickets.data,
        meta: tickets.meta
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.addComment = [
  validateRequest(commentParamsSchema, 'params'),
  validateRequest(createCommentSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const comment = await supportService.addComment({
        ...req.body,
        ticketId: req.params.ticketId
      }, userId);
      res.status(201).json({
        status: 'success',
        data: comment
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getTicketComments = [
  validateRequest(commentParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      // Check if user is admin to include internal comments
      const includeInternal = req.user.role === 'admin';
      const comments = await supportService.getTicketComments(req.params.ticketId, includeInternal);
      res.status(200).json({
        status: 'success',
        data: comments
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getTicketStatistics = async (req, res, next) => {
  try {
    // If user is not admin, only show their own tickets' statistics
    const userId = req.user.role === 'admin' ? null : req.user.id;
    const statistics = await supportService.getTicketStatistics(userId);
    res.status(200).json({
      status: 'success',
      data: statistics
    });
  } catch (error) {
    next(error);
  }
};