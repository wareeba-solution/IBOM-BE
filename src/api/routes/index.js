// api/routes/index.js (CORRECTED)
const express = require('express');
const router = express.Router();

// ✅ Import rate limiters
const {
  authLimiter,
  enhancedPatientLimiter,
  readOnlyLimiter,
  writeLimiter,
  healthLimiter
} = require('../../middleware/rateLimiter');

// Import route modules (matching your actual files)
const adminRoutes = require('./admin.routes');
const antenatalRoutes = require('./antenatal.routes');
const authRoutes = require('./auth.routes');
const birthRoutes = require('./birth.routes');
const dashboardRoutes = require('./dashboard.routes');
const dataImportRoutes = require('./dataImport.routes');
const deathRoutes = require('./death.routes');
const diseaseRoutes = require('./disease.routes');
const facilityRoutes = require('./facility.routes');
const familyPlanningRoutes = require('./familyPlanning.routes');
const immunizationRoutes = require('./immunization.routes');
const integrationRoutes = require('./integration.routes');
const mobileRoutes = require('./mobile.routes');
const patientRoutes = require('./patient.routes');
const reportRoutes = require('./report.routes');
const supportRoutes = require('./support.routes');
const userRoutes = require('./user.routes');
const utilityRoutes = require('./utility.routes');

// API root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Akwa Ibom State Health Data Collection API',
    version: '1.0.0',
  });
});

// ✅ Apply rate limiters correctly (only ONE per route group)

// Authentication routes with strict rate limiting
router.use('/auth', authLimiter, authRoutes);

// Patient routes with enhanced monitoring
router.use('/patients', enhancedPatientLimiter, patientRoutes);

// Data import routes (write-heavy operations)
router.use('/data-import', writeLimiter, dataImportRoutes);

// Utility routes (read-only)
router.use('/utility', readOnlyLimiter, utilityRoutes);

// 🔧 FIXED: Birth routes with ONLY readOnlyLimiter
router.use('/births', readOnlyLimiter, birthRoutes);

// All other routes with appropriate limiters
router.use('/admin', readOnlyLimiter, adminRoutes);
router.use('/antenatal', readOnlyLimiter, antenatalRoutes);
router.use('/dashboard', readOnlyLimiter, dashboardRoutes);
router.use('/death-statistics', readOnlyLimiter, deathRoutes);
router.use('/diseases', readOnlyLimiter, diseaseRoutes);
router.use('/facilities', readOnlyLimiter, facilityRoutes);
router.use('/family-planning', readOnlyLimiter, familyPlanningRoutes);
router.use('/immunizations', readOnlyLimiter, immunizationRoutes);
router.use('/integration', readOnlyLimiter, integrationRoutes);
router.use('/mobile', readOnlyLimiter, mobileRoutes);
router.use('/reports', readOnlyLimiter, reportRoutes);
router.use('/support', readOnlyLimiter, supportRoutes);
router.use('/users', readOnlyLimiter, userRoutes);

module.exports = router;