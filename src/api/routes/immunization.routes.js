// // src/api/routes/immunization.routes.js

// const express = require('express');
// const router = express.Router();
// const immunizationController = require('../controllers/immunization.controller');
// const { authenticate } = require('../middlewares/auth.middleware');
// const { checkPermission } = require('../middlewares/permission.middleware');

// router.post(
//   '/',
//   authenticate,
//   checkPermission('immunizations:create'),
//   immunizationController.createImmunization
// );

// router.get(
//   '/:id',
//   authenticate,
//   checkPermission('immunizations:read'),
//   immunizationController.getImmunizationById
// );

// router.put(
//   '/:id',
//   authenticate,
//   checkPermission('immunizations:update'),
//   immunizationController.updateImmunization
// );

// router.delete(
//   '/:id',
//   authenticate,
//   checkPermission('immunizations:delete'),
//   immunizationController.deleteImmunization
// );

// router.get(
//   '/',
//   authenticate,
//   checkPermission('immunizations:read'),
//   immunizationController.searchImmunizations
// );

// router.get(
//   '/patient/:patientId/history',
//   authenticate,
//   checkPermission('immunizations:read'),
//   immunizationController.getPatientImmunizationHistory
// );

// router.post(
//   '/schedule',
//   authenticate,
//   checkPermission('immunizations:create'),
//   immunizationController.scheduleImmunization
// );

// router.get(
//   '/due',
//   authenticate,
//   checkPermission('immunizations:read'),
//   immunizationController.getDueImmunizations
// );

// router.get(
//   '/statistics',
//   authenticate,
//   checkPermission('immunizations:read'),
//   immunizationController.getImmunizationStatistics
// );

// module.exports = router;



// src/api/routes/immunization.routes.js

const express = require('express');
const router = express.Router();
const immunizationController = require('../controllers/immunization.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

// Special routes need to be defined BEFORE the generic ID routes
// So they don't get interpreted as IDs

// Statistics endpoint
router.get(
  '/statistics',
  authenticate,
  checkPermission('immunizations:read'),
  immunizationController.getImmunizationStatistics
);

// Due immunizations endpoint
router.get(
  '/due',
  authenticate,
  checkPermission('immunizations:read'),
  immunizationController.getDueImmunizations
);

// Schedule endpoint
router.post(
  '/schedule',
  authenticate,
  checkPermission('immunizations:create'),
  immunizationController.scheduleImmunization
);

// Patient history endpoint
router.get(
  '/patient/:patientId/history',
  authenticate,
  checkPermission('immunizations:read'),
  immunizationController.getPatientImmunizationHistory
);

// Generic CRUD endpoints
router.post(
  '/',
  authenticate,
  checkPermission('immunizations:create'),
  immunizationController.createImmunization
);

// The search endpoint needs to be before the get by ID endpoint
router.get(
  '/',
  authenticate,
  checkPermission('immunizations:read'),
  immunizationController.searchImmunizations
);

router.get(
  '/:id',
  authenticate,
  checkPermission('immunizations:read'),
  immunizationController.getImmunizationById
);

router.put(
  '/:id',
  authenticate,
  checkPermission('immunizations:update'),
  immunizationController.updateImmunization
);

router.delete(
  '/:id',
  authenticate,
  checkPermission('immunizations:delete'),
  immunizationController.deleteImmunization
);

module.exports = router;