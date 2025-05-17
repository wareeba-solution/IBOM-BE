// src/api/routes/admin.routes.js
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const auditController = require('../controllers/audit.controller');
const backupController = require('../controllers/backup.controller');
const settingController = require('../controllers/setting.controller');
const notificationController = require('../controllers/notification.controller');
const userController = require('../controllers/user.controller'); // Add this line

const { authenticate, isAdmin, hasRole } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticate);

// Admin dashboard routes
router.get('/dashboard', isAdmin, adminController.getDashboardStats);
router.get('/system-health', isAdmin, adminController.getSystemHealth);

// Audit routes
router.get('/audits', isAdmin, auditController.getAuditLogs);
router.get('/audits/:id', isAdmin, auditController.getAuditById);
router.get('/entity-history', isAdmin, auditController.getEntityHistory);

// Setting routes
router.post('/settings', isAdmin, settingController.createSetting);
router.get('/settings/:id', settingController.getSettingById);
router.get('/settings/key/:key', settingController.getSettingByKey);
router.put('/settings/:id', isAdmin, settingController.updateSetting);
router.put('/settings/key/:key', isAdmin, settingController.updateSettingByKey);
router.delete('/settings/:id', isAdmin, settingController.deleteSetting);
router.get('/settings', settingController.searchSettings);
router.get('/settings/category/:category', settingController.getSettingsByCategory);

// Backup routes
router.post('/backups', isAdmin, backupController.createBackup);
router.post('/backups/restore', isAdmin, backupController.restoreBackup);
router.get('/backups', isAdmin, backupController.getBackups);
router.get('/backups/:id', isAdmin, backupController.getBackupById);
router.delete('/backups/:id', isAdmin, backupController.deleteBackup);

// Notification routes
router.get('/notifications', notificationController.getUserNotifications);
router.put('/notifications/:id/read', notificationController.markAsRead);
router.put('/notifications/read-all', notificationController.markAllAsRead);
router.put('/notifications/:id/archive', notificationController.archiveNotification);

// User management routes for administrators
// Add these new routes
router.patch('/users/:id/activate', isAdmin, userController.activateUser);
router.patch('/users/:id/deactivate', isAdmin, userController.deactivateUser);
router.get('/users/pending', isAdmin, (req, res) => {
  req.query.status = 'pending';
  userController.getAllUsers(req, res);
});
router.get('/users/inactive', isAdmin, (req, res) => {
  req.query.status = 'inactive';
  userController.getAllUsers(req, res);
});

module.exports = router;