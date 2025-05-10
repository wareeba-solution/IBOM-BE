// src/api/routes/mobile.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const deviceController = require('../controllers/device.controller');
const syncController = require('../controllers/sync.controller');
const offlineController = require('../controllers/offline.controller');

// Apply authentication middleware to all routes
router.use(authenticate);

// Device management routes
router.post('/devices', deviceController.registerDevice);
router.get('/devices', deviceController.getUserDevices);
router.get('/devices/:deviceId', deviceController.getDeviceById);
router.patch('/devices/:deviceId/activate', deviceController.activateDevice);
router.patch('/devices/:deviceId/deactivate', deviceController.deactivateDevice);
router.delete('/devices/:deviceId', deviceController.deleteDevice);

// Offline data package routes
router.get('/offline-package', offlineController.getOfflinePackage);
router.post('/offline-package/download', offlineController.downloadOfflinePackage);

// Synchronization routes
router.get('/sync/:deviceId/status', syncController.getSyncStatus);
router.post('/sync/:deviceId/initiate', syncController.initiateSync);
router.post('/sync/:deviceId/upload', syncController.uploadChanges);
router.post('/sync/:deviceId/download', syncController.downloadChanges);
router.post('/sync/:deviceId/complete', syncController.completeSync);
router.get('/sync/:deviceId/history', syncController.getSyncHistory);
router.post('/sync/:deviceId/resolve-conflicts', syncController.resolveConflicts);
router.post('/sync/:deviceId/reset', syncController.resetSyncState);

module.exports = router;