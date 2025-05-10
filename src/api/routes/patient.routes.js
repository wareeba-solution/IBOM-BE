const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patient.controller');
const { verifyToken, hasFacilityAccess } = require('../middlewares/authJwt');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { 
  createPatientSchema, 
  updatePatientSchema, 
  createVisitSchema, 
  updateVisitSchema 
} = require('../validators/patient.validator');

// Apply auth middleware to all routes
router.use(verifyToken);

// Patient routes
router.get('/', PatientController.getAllPatients);
router.get('/search', PatientController.searchPatients);
router.get('/:id', PatientController.getPatientById);
router.get('/identifier/:uniqueIdentifier', PatientController.getPatientByUniqueIdentifier);
router.post(
  '/',
  [validateRequestBody(createPatientSchema)],
  PatientController.createPatient
);
router.put(
  '/:id',
  [validateRequestBody(updatePatientSchema)],
  PatientController.updatePatient
);
router.delete('/:id', PatientController.deletePatient);

// Patient visit routes
router.get('/:patientId/visits', PatientController.getPatientVisits);
router.post(
  '/visits',
  [validateRequestBody(createVisitSchema)],
  PatientController.createVisit
);
router.get('/visits/:id', PatientController.getVisitById);
router.put(
  '/visits/:id',
  [validateRequestBody(updateVisitSchema)],
  PatientController.updateVisit
);
router.delete('/visits/:id', PatientController.deleteVisit);

module.exports = router;