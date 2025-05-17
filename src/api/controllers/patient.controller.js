const PatientService = require('../services/patient.service');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

/**
 * Patient controller with simplified approach and improved error handling
 */
class PatientController {
  /**
   * Get all patients
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getAllPatients(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
        facilityId: req.query.facilityId,
        gender: req.query.gender,
        lgaResidence: req.query.lgaResidence,
        ageFrom: parseInt(req.query.ageFrom, 10) || null,
        ageTo: parseInt(req.query.ageTo, 10) || null,
      };

      const result = await PatientService.getAllPatients(options);
      return ApiResponse.success(res, 'Patients retrieved successfully', result);
    } catch (error) {
      logger.error('Get all patients error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Get patient by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getPatientById(req, res) {
    try {
      const { id } = req.params;
      const patient = await PatientService.getPatientById(id);
      return ApiResponse.success(res, 'Patient retrieved successfully', patient);
    } catch (error) {
      logger.error('Get patient by ID error:', error);
      
      if (error.message === 'Patient not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Get patient by unique identifier
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async getPatientByUniqueIdentifier(req, res) {
    try {
      const { uniqueIdentifier } = req.params;
      const patient = await PatientService.getPatientByUniqueIdentifier(uniqueIdentifier);
      return ApiResponse.success(res, 'Patient retrieved successfully', patient);
    } catch (error) {
      logger.error('Get patient by unique identifier error:', error);
      
      if (error.message === 'Patient not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Create a new patient
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async createPatient(req, res) {
    try {
      const patient = await PatientService.createPatient(req.body, req.user.id);
      return ApiResponse.created(res, 'Patient created successfully', patient);
    } catch (error) {
      logger.error('Create patient error:', error);
      
      if (error.message === 'Facility not found') {
        return ApiResponse.error(
          res,
          error.message,
          { facilityId: 'Facility not found' },
          404
        );
      }
      
      if (error.validationErrors) {
        return ApiResponse.validationError(res, 'Validation error', error.validationErrors);
      }
      
      if (error.isColumnError) {
        return ApiResponse.error(res, error.message, {}, 400);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Update patient
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const patient = await PatientService.updatePatient(id, req.body);
      return ApiResponse.success(res, 'Patient updated successfully', patient);
    } catch (error) {
      logger.error('Update patient error:', error);
      
      if (error.message === 'Patient not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      if (error.validationErrors) {
        return ApiResponse.validationError(res, 'Validation error', error.validationErrors);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Delete patient
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async deletePatient(req, res) {
    try {
      const { id } = req.params;
      await PatientService.deletePatient(id);
      return ApiResponse.success(res, 'Patient deleted successfully');
    } catch (error) {
      logger.error('Delete patient error:', error);
      
      if (error.message === 'Patient not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      return ApiResponse.serverError(res, error.message);
    }
  }

  /**
   * Search patients
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response
   */
  static async searchPatients(req, res) {
    try {
      const searchParams = {
        term: req.query.term,
        uniqueIdentifier: req.query.uniqueIdentifier,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        phoneNumber: req.query.phoneNumber,
        dateOfBirth: req.query.dateOfBirth,
        lgaResidence: req.query.lgaResidence,
        facilityId: req.query.facilityId,
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };

      const result = await PatientService.searchPatients(searchParams);
      return ApiResponse.success(res, 'Search results retrieved successfully', result);
    } catch (error) {
      logger.error('Search patients error:', error);
      return ApiResponse.serverError(res, error.message);
    }
  }
}

module.exports = PatientController;