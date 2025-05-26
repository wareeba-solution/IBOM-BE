const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patient.controller');
const { verifyToken } = require('../middlewares/authJwt');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { createPatientSchema, updatePatientSchema } = require('../validators/patient.validator');

// Apply auth middleware to all routes
router.use(verifyToken);

// Basic patient CRUD routes
router.get('/', PatientController.getAllPatients);
router.get('/search', PatientController.searchPatients);


router.get('/:id', PatientController.getPatientById);
router.get('/identifier/:uniqueIdentifier', PatientController.getPatientByUniqueIdentifier);
router.post('/', validateRequestBody(createPatientSchema), PatientController.createPatient);
router.put('/:id', validateRequestBody(updatePatientSchema), PatientController.updatePatient);
router.delete('/:id', PatientController.deletePatient);





module.exports = router;