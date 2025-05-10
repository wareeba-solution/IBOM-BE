// src/api/controllers/help.controller.js
const Joi = require('joi');
const helpService = require('../services/help.service');
const faqService = require('../services/faq.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const {
  createHelpContentSchema,
  updateHelpContentSchema,
  helpContentParamsSchema,
  helpContentSearchSchema,
  createFaqSchema,
  updateFaqSchema,
  faqParamsSchema,
  faqSearchSchema
} = require('../validators/help.validator');

// Help Content Controllers
exports.createHelpContent = [
  validateRequest(createHelpContentSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const helpContent = await helpService.createHelpContent(req.body, userId);
      res.status(201).json({
        status: 'success',
        data: helpContent
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getHelpContentById = [
  validateRequest(helpContentParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const helpContent = await helpService.getHelpContentById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: helpContent
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getHelpContentBySlug = [
  validateRequest(helpContentParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const helpContent = await helpService.getHelpContentBySlug(req.params.slug);
      res.status(200).json({
        status: 'success',
        data: helpContent
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.updateHelpContent = [
  validateRequest(helpContentParamsSchema, 'params'),
  validateRequest(updateHelpContentSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const helpContent = await helpService.updateHelpContent(req.params.id, req.body, userId);
      res.status(200).json({
        status: 'success',
        data: helpContent
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.deleteHelpContent = [
  validateRequest(helpContentParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await helpService.deleteHelpContent(req.params.id, userId);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.searchHelpContent = [
  validateRequest(helpContentSearchSchema, 'query'),
  async (req, res, next) => {
    try {
      const helpContents = await helpService.searchHelpContent(req.query);
      res.status(200).json({
        status: 'success',
        data: helpContents.data,
        meta: helpContents.meta
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getHelpCategories = async (req, res, next) => {
  try {
    const categories = await helpService.getHelpCategories();
    res.status(200).json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

exports.getHelpTags = async (req, res, next) => {
  try {
    const tags = await helpService.getHelpTags();
    res.status(200).json({
      status: 'success',
      data: tags
    });
  } catch (error) {
    next(error);
  }
};

// FAQ Controllers
exports.createFAQ = [
  validateRequest(createFaqSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const faq = await faqService.createFAQ(req.body, userId);
      res.status(201).json({
        status: 'success',
        data: faq
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getFAQById = [
  validateRequest(faqParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const faq = await faqService.getFAQById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: faq
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.updateFAQ = [
  validateRequest(faqParamsSchema, 'params'),
  validateRequest(updateFaqSchema, 'body'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const faq = await faqService.updateFAQ(req.params.id, req.body, userId);
      res.status(200).json({
        status: 'success',
        data: faq
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.deleteFAQ = [
  validateRequest(faqParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await faqService.deleteFAQ(req.params.id, userId);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.searchFAQs = [
  validateRequest(faqSearchSchema, 'query'),
  async (req, res, next) => {
    try {
      const faqs = await faqService.searchFAQs(req.query);
      res.status(200).json({
        status: 'success',
        data: faqs.data,
        meta: faqs.meta
      });
    } catch (error) {
      next(error);
    }
  }
];

exports.getFAQCategories = async (req, res, next) => {
  try {
    const categories = await faqService.getFAQCategories();
    res.status(200).json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

exports.getFAQsByCategory = [
  validateRequest(Joi.object({ category: Joi.string().required() }), 'params'),
  async (req, res, next) => {
    try {
      const faqs = await faqService.getFAQsByCategory(req.params.category);
      res.status(200).json({
        status: 'success',
        data: faqs
      });
    } catch (error) {
      next(error);
    }
  }
];