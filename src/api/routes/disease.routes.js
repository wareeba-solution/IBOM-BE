// src/api/routes/disease.routes.js

const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/disease.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

// Disease Registry Routes
router.post(
  '/registry',
  authenticate,
  checkPermission('diseases:create'),
  diseaseController.createDiseaseRegistry
);

router.get(
  '/registry/:id',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.getDiseaseRegistryById
);

router.put(
  '/registry/:id',
  authenticate,
  checkPermission('diseases:update'),
  diseaseController.updateDiseaseRegistry
);

router.delete(
  '/registry/:id',
  authenticate,
  checkPermission('diseases:delete'),
  diseaseController.deleteDiseaseRegistry
);

router.get(
  '/registry',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.searchDiseaseRegistry
);

// Disease Case Routes
router.post(
  '/cases',
  authenticate,
  checkPermission('diseases:create'),
  diseaseController.createDiseaseCase
);

router.get(
  '/cases/:id',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.getDiseaseCaseById
);

router.put(
  '/cases/:id',
  authenticate,
  checkPermission('diseases:update'),
  diseaseController.updateDiseaseCase
);

router.delete(
  '/cases/:id',
  authenticate,
  checkPermission('diseases:delete'),
  diseaseController.deleteDiseaseCase
);

router.get(
  '/cases',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.searchDiseaseCases
);

router.post(
  '/cases/:id/report',
  authenticate,
  checkPermission('diseases:update'),
  diseaseController.reportDiseaseToAuthorities
);

// Contact Tracing Routes
router.post(
  '/contacts',
  authenticate,
  checkPermission('diseases:create'),
  diseaseController.createContactTracing
);

router.get(
  '/contacts/:id',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.getContactTracingById
);

router.put(
  '/contacts/:id',
  authenticate,
  checkPermission('diseases:update'),
  diseaseController.updateContactTracing
);

router.delete(
  '/contacts/:id',
  authenticate,
  checkPermission('diseases:delete'),
  diseaseController.deleteContactTracing
);

router.get(
  '/contacts',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.searchContactTracing
);

router.post(
  '/contacts/batch-update',
  authenticate,
  checkPermission('diseases:update'),
  diseaseController.updateContactBatch
);

// Statistics and Reports
router.get(
  '/statistics',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.getDiseaseStatistics
);

router.get(
  '/contacts/follow-up',
  authenticate,
  checkPermission('diseases:read'),
  diseaseController.getContactsNeedingFollowUp
);

module.exports = router;