// src/api/routes/support.routes.js
const express = require('express');
const router = express.Router();

const helpController = require('../controllers/help.controller');
const supportController = require('../controllers/support.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Get the correct middleware functions
const authenticate = authMiddleware.authenticate;
const hasRole = authMiddleware.hasRole;

// Apply authentication middleware to all routes
router.use(authenticate);

// Help content routes
router.post('/help', hasRole('admin'), helpController.createHelpContent);
router.get('/help/:id', helpController.getHelpContentById);
router.get('/help/slug/:slug', helpController.getHelpContentBySlug);
router.put('/help/:id', hasRole('admin'), helpController.updateHelpContent);
router.delete('/help/:id', hasRole('admin'), helpController.deleteHelpContent);
router.get('/help', helpController.searchHelpContent);
router.get('/help-categories', helpController.getHelpCategories);
router.get('/help-tags', helpController.getHelpTags);

// FAQ routes
router.post('/faqs', hasRole('admin'), helpController.createFAQ);
router.get('/faqs/:id', helpController.getFAQById);
router.put('/faqs/:id', hasRole('admin'), helpController.updateFAQ);
router.delete('/faqs/:id', hasRole('admin'), helpController.deleteFAQ);
router.get('/faqs', helpController.searchFAQs);
router.get('/faq-categories', helpController.getFAQCategories);
router.get('/faqs/category/:category', helpController.getFAQsByCategory);

// Support ticket routes
router.post('/tickets', supportController.createTicket);
router.get('/tickets/:id', supportController.getTicketById);
router.get('/tickets/number/:ticketNumber', supportController.getTicketByNumber);
router.put('/tickets/:id', supportController.updateTicket);
router.get('/tickets', supportController.searchTickets);
router.post('/tickets/:ticketId/comments', supportController.addComment);
router.get('/tickets/:ticketId/comments', supportController.getTicketComments);
router.get('/ticket-statistics', supportController.getTicketStatistics);

module.exports = router;