// src/api/routes/antenatal.routes.js

const express = require('express');
const router = express.Router();
const antenatalController = require('../controllers/antenatal.controller');
const antenatalStatisticsController = require('../controllers/antenatal-statistics.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

/**
 * CORE ANTENATAL CARE ROUTES
 */

// Search route
router.get(
  '/',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.searchAntenatalCare
);

// Create antenatal care
router.post(
  '/',
  authenticate,
  checkPermission('antenatal:create'),
  antenatalController.createAntenatalCare
);

// Get antenatal care by ID
router.get(
  '/:id',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.getAntenatalCareById
);

// Update antenatal care
router.put(
  '/:id',
  authenticate,
  checkPermission('antenatal:update'),
  antenatalController.updateAntenatalCare
);

// Delete antenatal care
router.delete(
  '/:id',
  authenticate,
  checkPermission('antenatal:delete'),
  antenatalController.deleteAntenatalCare
);

// Complete antenatal care
router.post(
  '/:id/complete',
  authenticate,
  checkPermission('antenatal:update'),
  antenatalController.completeAntenatalCare
);

// Due appointments route
router.get(
  '/appointments/due',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.getDueAppointments
);

/**
 * ANTENATAL VISIT ROUTES
 */

// Search visits
router.get(
  '/visits',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.searchAntenatalVisits
);

// Create visit
router.post(
  '/visits',
  authenticate,
  checkPermission('antenatal:create'),
  antenatalController.createAntenatalVisit
);

// Get visit by ID
router.get(
  '/visits/:id',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.getAntenatalVisitById
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

/**
 * STATISTICS ROUTES
 */

// Basic statistics
router.get(
  '/statistics',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getAntenatalStatistics
);

// Summary statistics
router.get(
  '/statistics/summary',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getAntenatalSummary
);

// Trimester statistics
router.get(
  '/statistics/by-trimester',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getAntenatalByTrimester
);

// Risk level statistics
router.get(
  '/statistics/by-risk',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getAntenatalByRisk
);

// Age group statistics
router.get(
  '/statistics/by-age',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getAntenatalByAge
);

// Risk factors statistics
router.get(
  '/statistics/risk-factors',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getTopRiskFactors
);

// Monthly registrations
router.get(
  '/statistics/monthly',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getMonthlyRegistrations
);

// Visit compliance statistics
router.get(
  '/statistics/compliance',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getVisitCompliance
);

// Facility statistics
router.get(
  '/statistics/by-facility',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getAntenatalByFacility
);

// Delivery outcome statistics
router.get(
  '/statistics/delivery-outcomes',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getDeliveryOutcomes
);

// Trend statistics
router.get(
  '/statistics/trends',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getAntenatalTrends
);

// Comprehensive statistics
router.get(
  '/statistics/all',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalStatisticsController.getAllAntenatalStatistics
);

module.exports = router;