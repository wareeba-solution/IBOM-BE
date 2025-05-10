// src/api/validators/help.validator.js
const Joi = require('joi');

const createHelpContentSchema = Joi.object({
  title: Joi.string().required().max(200),
  content: Joi.string().required(),
  slug: Joi.string().required().regex(/^[a-z0-9-]+$/),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
  sortOrder: Joi.number().integer().default(0)
});

const updateHelpContentSchema = Joi.object({
  title: Joi.string().max(200),
  content: Joi.string(),
  slug: Joi.string().regex(/^[a-z0-9-]+$/),
  category: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  status: Joi.string().valid('draft', 'published', 'archived'),
  sortOrder: Joi.number().integer()
});

const helpContentParamsSchema = Joi.object({
  id: Joi.string().uuid(),
  slug: Joi.string().regex(/^[a-z0-9-]+$/)
});

const helpContentSearchSchema = Joi.object({
  category: Joi.string(),
  status: Joi.string().valid('draft', 'published', 'archived'),
  tag: Joi.string(),
  query: Joi.string(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

const createFaqSchema = Joi.object({
  question: Joi.string().required().max(500),
  answer: Joi.string().required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
  sortOrder: Joi.number().integer().default(0)
});

const updateFaqSchema = Joi.object({
  question: Joi.string().max(500),
  answer: Joi.string(),
  category: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  status: Joi.string().valid('draft', 'published', 'archived'),
  sortOrder: Joi.number().integer()
});

const faqParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});

const faqSearchSchema = Joi.object({
  category: Joi.string(),
  status: Joi.string().valid('draft', 'published', 'archived'),
  tag: Joi.string(),
  query: Joi.string(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = {
  createHelpContentSchema,
  updateHelpContentSchema,
  helpContentParamsSchema,
  helpContentSearchSchema,
  createFaqSchema,
  updateFaqSchema,
  faqParamsSchema,
  faqSearchSchema
};