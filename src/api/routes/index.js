// api/routes/index.js (Updated)
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

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const facilityRoutes = require('./facility.routes');
const patientRoutes = require('./patient.routes');
const birthRoutes = require('./birth.routes');
const deathStatisticRoutes = require('./death.routes');
const immunizationRoutes = require('./immunization.routes');
const diseaseRoutes = require('./disease.routes');
const familyPlanningRoutes = require('./familyPlanning.routes');
const dataImportRoutes = require('./dataImport.routes');
const antenatalRoutes = require('./antenatal.routes');
const reportRoutes = require('./report.routes');


// ✅ NEW: Import utility routes
const utilityRoutes = require('./utility.routes');

// API root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Akwa Ibom State Health Data Collection API',
    version: '1.0.0',
  });
});

// ✅ Apply specific rate limiters to individual route groups

// Authentication routes with strict rate limiting
router.use('/auth', authLimiter, authRoutes);

// Patient routes with enhanced monitoring (for infinite loop detection)
router.use('/patients', enhancedPatientLimiter, patientRoutes);

// Data import routes (write-heavy operations) - stricter limits
router.use('/data-import', writeLimiter, dataImportRoutes);

// ✅ NEW: Utility routes (Nigerian states/LGAs) - read-only, so lighter limits
router.use('/utility', readOnlyLimiter, utilityRoutes);

// All other routes with balanced read/write limits
router.use('/users', readOnlyLimiter, writeLimiter, userRoutes);
router.use('/facilities', readOnlyLimiter, writeLimiter, facilityRoutes);
router.use('/births', readOnlyLimiter, writeLimiter, birthRoutes);
router.use('/death-statistics', readOnlyLimiter, writeLimiter, deathStatisticRoutes);
router.use('/immunizations', readOnlyLimiter, writeLimiter, immunizationRoutes);
router.use('/diseases', readOnlyLimiter, writeLimiter, diseaseRoutes);
router.use('/family-planning', readOnlyLimiter, writeLimiter, familyPlanningRoutes);
router.use('/antenatal', readOnlyLimiter, writeLimiter, antenatalRoutes);
router.use('/reports', readOnlyLimiter, writeLimiter, reportRoutes);


module.exports = router;