// src/api/validators/ticket.validator.js
const Joi = require('joi');

const createTicketSchema = Joi.object({
  subject: Joi.string().required().max(200),
  description: Joi.string().required(),
  category: Joi.string().required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  attachments: Joi.array().items(Joi.object({
    filename: Joi.string().required(),
    path: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().required()
  })).default([])
});

const updateTicketSchema = Joi.object({
  subject: Joi.string().max(200),
  description: Joi.string(),
  category: Joi.string(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  status: Joi.string().valid('open', 'in_progress', 'on_hold', 'resolved', 'closed'),
  assignedTo: Joi.string().uuid().allow(null),
  dueDate: Joi.date().iso().allow(null)
});

const ticketParamsSchema = Joi.object({
  id: Joi.string().uuid().required(),
  ticketNumber: Joi.string()
});

const ticketSearchSchema = Joi.object({
  status: Joi.string().valid('open', 'in_progress', 'on_hold', 'resolved', 'closed'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  category: Joi.string(),
  assignedTo: Joi.string().uuid(),
  createdBy: Joi.string().uuid(),
  query: Joi.string(),
  fromDate: Joi.date().iso(),
  toDate: Joi.date().iso().min(Joi.ref('fromDate')),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

const createCommentSchema = Joi.object({
  content: Joi.string().required(),
  isInternal: Joi.boolean().default(false),
  attachments: Joi.array().items(Joi.object({
    filename: Joi.string().required(),
    path: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().required()
  })).default([])
});

const commentParamsSchema = Joi.object({
  ticketId: Joi.string().uuid().required(),
  commentId: Joi.string().uuid()
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  ticketParamsSchema,
  ticketSearchSchema,
  createCommentSchema,
  commentParamsSchema
};