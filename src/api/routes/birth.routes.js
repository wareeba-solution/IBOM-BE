const express = require('express');
const router = express.Router();
const BirthController = require('../controllers/birth.controller');
const { verifyToken, hasFacilityAccess } = require('../middlewares/authJwt');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { createBirthSchema, updateBirthSchema, searchBirthSchema } = require('../validators/birth.validator');

// Apply auth middleware to all routes
router.use(verifyToken);

// Get all birth records
router.get('/', BirthController.getAllBirths);

// Search birth records
router.get('/search', BirthController.searchBirths);

// Get birth statistics
router.get('/statistics', BirthController.getBirthStatistics);

// Get birth record by ID
router.get('/:id', BirthController.getBirthById);

// Create a new birth record
router.post(
  '/',
  [validateRequestBody(createBirthSchema)],
  BirthController.createBirth
);

// Update birth record
router.put(
  '/:id',
  [validateRequestBody(updateBirthSchema)],
  BirthController.updateBirth
);

// Delete birth record
router.delete('/:id', BirthController.deleteBirth);

module.exports = router;