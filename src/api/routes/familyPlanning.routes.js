// src/api/routes/familyPlanning.routes.js

const express = require('express');
const router = express.Router();
const familyPlanningController = require('../controllers/familyPlanning.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

// Family Planning Method Routes
router.post(
  '/methods',
  authenticate,
  checkPermission('family_planning:create'),
  familyPlanningController.createFamilyPlanningMethod
);

router.get(
  '/methods/:id',
  authenticate,
  checkPermission('family_planning:read'),
  familyPlanningController.getFamilyPlanningMethodById
);

router.put(
  '/methods/:id',
  authenticate,
  checkPermission('family_planning:update'),
  familyPlanningController.updateFamilyPlanningMethod
);

router.delete(
  '/methods/:id',
  authenticate,
  checkPermission('family_planning:delete'),
  familyPlanningController.deleteFamilyPlanningMethod
);

router.get(
  '/methods',
  authenticate,
  checkPermission('family_planning:read'),
  familyPlanningController.searchFamilyPlanningMethods
);

// Family Planning Client Routes
router.post(
  '/clients',
  authenticate,
  checkPermission('family_planning:create'),
  familyPlanningController.createFamilyPlanningClient
);

router.get(
  '/clients/:id',
  authenticate,
  checkPermission('family_planning:read'),
  familyPlanningController.getFamilyPlanningClientById
);

router.put(
  '/clients/:id',
  authenticate,
  checkPermission('family_planning:update'),
  familyPlanningController.updateFamilyPlanningClient
);

router.delete(
  '/clients/:id',
  authenticate,
  checkPermission('family_planning:delete'),
  familyPlanningController.deleteFamilyPlanningClient
);

router.get(
  '/clients',
  authenticate,
  checkPermission('family_planning:read'),
  familyPlanningController.searchFamilyPlanningClients
);

// Family Planning Service Routes
router.post(
  '/services',
  authenticate,
  checkPermission('family_planning:create'),
  familyPlanningController.createFamilyPlanningService
);

router.get(
  '/services/:id',
  authenticate,
  checkPermission('family_planning:read'),
  familyPlanningController.getFamilyPlanningServiceById
);

router.put(
  '/services/:id',
  authenticate,
  checkPermission('family_planning:update'),
  familyPlanningController.updateFamilyPlanningService
);

router.delete(
  '/services/:id',
  authenticate,
  checkPermission('family_planning:delete'),
  familyPlanningController.deleteFamilyPlanningService
);

router.get(
  '/services',
  authenticate,
  checkPermission('family_planning:read'),
  familyPlanningController.searchFamilyPlanningServices
);

// Statistics and Reports
router.get(
  '/statistics',
  authenticate,
  checkPermission('family_planning:read'),
  familyPlanningController.getFamilyPlanningStatistics
);

router.get(
  '/appointments/due',
  authenticate,
  checkPermission('family_planning:read'),
  familyPlanningController.getDueAppointments
);

router.get(
  '/reports/method-distribution',
  authenticate,
  checkPermission('family_planning:read'),
  familyPlanningController.getMethodDistribution
);

router.get(
  '/reports/client-retention',
  authenticate,
  checkPermission('family_planning:read'),
  familyPlanningController.getClientRetentionStats
);

module.exports = router;