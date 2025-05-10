// src/api/routes/dataImport.routes.js

const express = require('express');
const router = express.Router();
const dataImportController = require('../controllers/dataImport.controller');
const { handleFileUpload } = require('../middlewares/fileUpload');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');

// File analysis and import routes
router.post(
  '/analyze',
  authenticate,
  checkPermission('data_import:create'),
  handleFileUpload,
  dataImportController.analyzeFile
);

router.post(
  '/import',
  authenticate,
  checkPermission('data_import:create'),
  handleFileUpload,
  dataImportController.importData
);

// Schema and metadata routes
router.get(
  '/entities',
  authenticate,
  checkPermission('data_import:read'),
  dataImportController.getSupportedEntities
);

router.get(
  '/schema/:entity',
  authenticate,
  checkPermission('data_import:read'),
  dataImportController.getEntitySchema
);

// Export routes
router.post(
  '/export',
  authenticate,
  checkPermission('data_export:create'),
  dataImportController.exportData
);

router.get(
  '/export/entities',
  authenticate,
  checkPermission('data_export:read'),
  dataImportController.getSupportedExportEntities
);

// Report routes
router.post(
  '/report',
  authenticate,
  checkPermission('data_export:create'),
  dataImportController.generateReport
);

router.get(
  '/report/types',
  authenticate,
  checkPermission('data_export:read'),
  dataImportController.getSupportedReportTypes
);

// File download route
router.get(
  '/download/:filename',
  authenticate,
  dataImportController.downloadFile
);

module.exports = router;