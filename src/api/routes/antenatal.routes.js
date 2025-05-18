// src/api/routes/antenatal.routes.js

const express = require('express');
const router = express.Router();
const antenatalController = require('../controllers/antenatal.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

// Order matters! Put specific routes before parameterized routes

// Search route - no parameters
router.get(
  '/',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.searchAntenatalCare
);

// Statistics route
router.get(
  '/statistics',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.getAntenatalStatistics
);

// Due appointments route
router.get(
  '/appointments/due',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.getDueAppointments
);

// Visits routes - specific
router.get(
  '/visits',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.searchAntenatalVisits
);

// Visits by ID
router.get(
  '/visits/:id',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.getAntenatalVisitById
);

// Create visit
router.post(
  '/visits',
  authenticate,
  checkPermission('antenatal:create'),
  antenatalController.createAntenatalVisit
);

// Update visit
router.put(
  '/visits/:id',
  authenticate,
  checkPermission('antenatal:update'),
  antenatalController.updateAntenatalVisit
);

// Delete visit
router.delete(
  '/visits/:id',
  authenticate,
  checkPermission('antenatal:delete'),
  antenatalController.deleteAntenatalVisit
);

// Complete antenatal route
router.post(
  '/:id/complete',
  authenticate,
  checkPermission('antenatal:update'),
  antenatalController.completeAntenatalCare
);

// Get antenatal by ID - should be after all specific routes
router.get(
  '/:id',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.getAntenatalCareById
);

// Create antenatal
router.post(
  '/',
  authenticate,
  checkPermission('antenatal:create'),
  antenatalController.createAntenatalCare
);

// Update antenatal
router.put(
  '/:id',
  authenticate,
  checkPermission('antenatal:update'),
  antenatalController.updateAntenatalCare
);

// Delete antenatal
router.delete(
  '/:id',
  authenticate,
  checkPermission('antenatal:delete'),
  antenatalController.deleteAntenatalCare
);

module.exports = router;