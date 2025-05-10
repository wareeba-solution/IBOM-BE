const express = require('express');
const router = express.Router();
const FacilityController = require('../controllers/facility.controller');
const { verifyToken, isAdmin, hasRole } = require('../middlewares/authJwt');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { createFacilitySchema, updateFacilitySchema } = require('../validators/facility.validator');

// Apply auth middleware to all routes
router.use(verifyToken);

// Get all facilities
router.get('/', FacilityController.getAllFacilities);

// Get facility by ID
router.get('/:id', FacilityController.getFacilityById);

// Get facilities by LGA
router.get('/lga/:lga', FacilityController.getFacilitiesByLga);

// Get facilities by type
router.get('/type/:type', FacilityController.getFacilitiesByType);

// Create a new facility (admin only)
router.post(
  '/',
  [
    isAdmin,
    validateRequestBody(createFacilitySchema),
  ],
  FacilityController.createFacility
);

// Update facility (admin only)
router.put(
  '/:id',
  [
    isAdmin,
    validateRequestBody(updateFacilitySchema),
  ],
  FacilityController.updateFacility
);

// Delete facility (admin only)
router.delete(
  '/:id',
  [isAdmin],
  FacilityController.deleteFacility
);

// Activate facility (admin only)
router.patch(
  '/:id/activate',
  [isAdmin],
  FacilityController.activateFacility
);

// Deactivate facility (admin only)
router.patch(
  '/:id/deactivate',
  [isAdmin],
  FacilityController.deactivateFacility
);

module.exports = router;