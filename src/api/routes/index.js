const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const facilityRoutes = require('./facility.routes');
const patientRoutes = require('./patient.routes');
const birthRoutes = require('./birth.routes');
const deathStatisticRoutes = require('./death.routes'); // Add this line
const immunizationRoutes = require('./immunization.routes'); // Add this line
const diseaseRoutes = require('./disease.routes'); // Add this line
const familyPlanningRoutes = require('./familyPlanning.routes'); // Add this line
const dataImportRoutes = require('./dataImport.routes'); // Add this line
const antenatalRoutes = require('./antenatal.routes');


// Define API routes
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Akwa Ibom State Health Data Collection API',
    version: '1.0.0',
  });
});

// Use route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/facilities', facilityRoutes);
router.use('/patients', patientRoutes);
router.use('/births', birthRoutes);
router.use('/death-statistics', deathStatisticRoutes); // Add this line
router.use('/immunizations', immunizationRoutes); // Add this line
router.use('/diseases', diseaseRoutes); // Add this line
router.use('/family-planning', familyPlanningRoutes); // Add this line
router.use('/data-import', dataImportRoutes); // Add this line
router.use('/antenatal', antenatalRoutes);

// Export router for use in app.js
module.exports = router;