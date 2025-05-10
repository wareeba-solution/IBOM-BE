// src/api/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticate);

// Dashboard routes
router.get('/summary', dashboardController.getSummaryStats);
router.get('/trends', dashboardController.getMonthlyTrends);
router.get('/top-facilities', dashboardController.getTopFacilities);
router.get('/disease-distribution', dashboardController.getDiseaseDistribution);
router.get('/immunization-coverage', dashboardController.getImmunizationCoverage);

module.exports = router;