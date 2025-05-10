// src/api/routes/integration.routes.js
const express = require('express');
const router = express.Router();

// First, check if all these controllers exist and are properly exported
const integrationController = require('../controllers/integration.controller');
const exportController = require('../controllers/export.controller');
const importController = require('../controllers/import.controller');
const apiController = require('../controllers/api.controller');
const webhookController = require('../controllers/webhook.controller');

// Make sure the auth middleware is properly imported
const authMiddleware = require('../middlewares/auth.middleware');
const authenticate = authMiddleware.authenticate;
const hasRole = authMiddleware.hasRole;

// Apply authentication middleware to all routes
router.use(authenticate);

// Integration routes
router.post('/integrations', hasRole('admin'), integrationController.createIntegration);
router.get('/integrations/:id', integrationController.getIntegrationById);
router.put('/integrations/:id', hasRole('admin'), integrationController.updateIntegration);
router.delete('/integrations/:id', hasRole('admin'), integrationController.deleteIntegration);
router.get('/integrations', integrationController.searchIntegrations);
router.post('/integrations/:id/run', integrationController.runIntegration);

// Export routes
router.post('/exports', exportController.createExportJob);
router.get('/exports/:id', exportController.getExportJob);
router.get('/exports', exportController.getExportJobs);

// Import routes
router.post('/imports', hasRole('admin'), importController.createImportJob);
router.get('/imports/:id', importController.getImportJob);
router.get('/imports', importController.getImportJobs);

// Check if this function exists - comment it out for now if it doesn't
// router.post('/imports/:id/cancel', importController.cancelImportJob);
// Temporary fix - add a placeholder if the function doesn't exist yet
router.post('/imports/:id/cancel', (req, res) => {
  res.status(501).json({ message: "Import cancellation not implemented yet" });
});

// API routes
// Check if these functions exist
router.post('/api/request', hasRole('admin'), apiController.executeApiRequest || ((req, res) => res.status(501).json({ message: "API request execution not implemented yet" })));
router.post('/api/token', hasRole('admin'), apiController.getApiToken || ((req, res) => res.status(501).json({ message: "API token generation not implemented yet" })));

// Webhook routes
router.post('/webhooks', hasRole('admin'), webhookController.registerWebhook || ((req, res) => res.status(501).json({ message: "Webhook registration not implemented yet" })));
router.get('/webhooks/:id', webhookController.getWebhookById || ((req, res) => res.status(501).json({ message: "Webhook retrieval not implemented yet" })));
router.put('/webhooks/:id', hasRole('admin'), webhookController.updateWebhook || ((req, res) => res.status(501).json({ message: "Webhook update not implemented yet" })));
router.delete('/webhooks/:id', hasRole('admin'), webhookController.deleteWebhook || ((req, res) => res.status(501).json({ message: "Webhook deletion not implemented yet" })));
router.get('/webhooks', webhookController.getWebhooks || ((req, res) => res.status(501).json({ message: "Webhook listing not implemented yet" })));
router.post('/webhooks/trigger', hasRole('admin'), webhookController.triggerWebhook || ((req, res) => res.status(501).json({ message: "Webhook triggering not implemented yet" })));
router.get('/webhooks/:id/logs', webhookController.getWebhookLogs || ((req, res) => res.status(501).json({ message: "Webhook logs not implemented yet" })));

module.exports = router;