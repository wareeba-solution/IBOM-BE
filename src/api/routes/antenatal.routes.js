// src/api/routes/antenatal.routes.js

const express = require('express');
const router = express.Router();
const antenatalController = require('../controllers/antenatal.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

// Antenatal Care Routes
router.post(
  '/',
  authenticate,
  checkPermission('antenatal:create'),
  antenatalController.createAntenatalCare
);

router.get(
  '/:id',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.getAntenatalCareById
);

router.put(
  '/:id',
  authenticate,
  checkPermission('antenatal:update'),
  antenatalController.updateAntenatalCare
);

router.delete(
  '/:id',
  authenticate,
  checkPermission('antenatal:delete'),
  antenatalController.deleteAntenatalCare
);

router.get(
  '/',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.searchAntenatalCare
);

router.post(
  '/:id/complete',
  authenticate,
  checkPermission('antenatal:update'),
  antenatalController.completeAntenatalCare
);

// Antenatal Visit Routes
router.post(
  '/visits',
  authenticate,
  checkPermission('antenatal:create'),
  antenatalController.createAntenatalVisit
);

router.get(
  '/visits/:id',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.getAntenatalVisitById
);

router.put(
  '/visits/:id',
  authenticate,
  checkPermission('antenatal:update'),
  antenatalController.updateAntenatalVisit
);

router.delete(
  '/visits/:id',
  authenticate,
  checkPermission('antenatal:delete'),
  antenatalController.deleteAntenatalVisit
);

router.get(
  '/visits',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.searchAntenatalVisits
);

// Statistics and Reports
router.get(
  '/statistics',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.getAntenatalStatistics
);

router.get(
  '/appointments/due',
  authenticate,
  checkPermission('antenatal:read'),
  antenatalController.getDueAppointments
);

module.exports = router;