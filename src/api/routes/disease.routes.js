// src/api/routes/disease.routes.js

const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/disease.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

// =============================================================================
// DISEASE REGISTRY ROUTES
// =============================================================================

// Search disease registry (must come before /:id)
router.get(
  '/registry',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.searchDiseaseRegistry
);

// Create disease registry
router.post(
  '/registry',
  authenticate,
  checkPermission('diseases:create'),
  diseaseController.createDiseaseRegistry
);

// Get disease registry by ID
router.get(
  '/registry/:id',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.getDiseaseRegistryById
);

// Update disease registry
router.put(
  '/registry/:id',
  authenticate,
  checkPermission('diseases:update'),
  diseaseController.updateDiseaseRegistry
);

// Delete disease registry
router.delete(
  '/registry/:id',
  authenticate,
  checkPermission('diseases:delete'),
  diseaseController.deleteDiseaseRegistry
);

// =============================================================================
// DISEASE CASE ROUTES
// =============================================================================

// Export disease case data (must come before /:id)
router.get(
  '/cases/export',
  authenticate,
  checkPermission('diseases:export'),
  diseaseController.exportDiseaseCases
);

// Search disease cases (must come before /:id)
router.get(
  '/cases',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.searchDiseaseCases
);

// Create disease case
router.post(
  '/cases',
  authenticate,
  checkPermission('diseases:create'),
  diseaseController.createDiseaseCase
);

// Get disease case by ID
router.get(
  '/cases/:id',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.getDiseaseCaseById
);

// Update disease case
router.put(
  '/cases/:id',
  authenticate,
  checkPermission('diseases:update'),
  diseaseController.updateDiseaseCase
);

// Delete disease case
router.delete(
  '/cases/:id',
  authenticate,
  checkPermission('diseases:delete'),
  diseaseController.deleteDiseaseCase
);

// Report disease to authorities
router.post(
  '/cases/:id/report',
  authenticate,
  checkPermission('diseases:update'),
  diseaseController.reportDiseaseToAuthorities
);

// =============================================================================
// CONTACT TRACING ROUTES
// =============================================================================

// Batch update contacts (must come before /:id)
router.post(
  '/contacts/batch-update',
  authenticate,
  checkPermission('diseases:update'),
  diseaseController.updateContactBatch
);

// Get contacts needing follow-up (must come before /:id)
router.get(
  '/contacts/follow-up',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.getContactsNeedingFollowUp
);

// Search contact tracing (must come before /:id)
router.get(
  '/contacts',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.searchContactTracing
);

// Create contact tracing
router.post(
  '/contacts',
  authenticate,
  checkPermission('diseases:create'),
  diseaseController.createContactTracing
);

// Get contact tracing by ID
router.get(
  '/contacts/:id',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.getContactTracingById
);

// Update contact tracing
router.put(
  '/contacts/:id',
  authenticate,
  checkPermission('diseases:update'),
  diseaseController.updateContactTracing
);

// Delete contact tracing
router.delete(
  '/contacts/:id',
  authenticate,
  checkPermission('diseases:delete'),
  diseaseController.deleteContactTracing
);

// =============================================================================
// STATISTICS AND REPORTING ROUTES
// =============================================================================

// Get disease trends over time (must come before /statistics with params)
router.get(
  '/statistics/trends',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.getDiseaseTrends
);

// Get disease statistics
router.get(
  '/statistics',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.getDiseaseStatistics
);

module.exports = router;