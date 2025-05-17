const { Op } = require('sequelize');
const db = require('../../models');
const helpers = require('../../utils/helpers');
const logger = require('../../utils/logger');

const Patient = db.Patient;
const Visit = db.Visit;
const Facility = db.Facility;
const User = db.User;

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const formatDateWithAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'Not provided';
  const age = calculateAge(dateOfBirth);
  return `${dateOfBirth} (${age}y)`;
};

/**
 * Patient service with improved error handling and database-awareness
 */
class PatientService {
  
  /**
   * Create a new patient with database-aware field filtering
   * @param {Object} patientData - Patient data
   * @param {String} userId - Creating user ID
   * @returns {Object} Created patient
   */
  static async createPatient(patientData, userId) {
    try {
      // Verify facility exists
      const facility = await Facility.findByPk(patientData.facilityId);
      if (!facility) {
        throw new Error('Facility not found');
      }
      
      // Generate unique identifier
      const facilityCode = facility.name.substring(0, 3).toUpperCase();
      const uniqueIdentifier = helpers.generatePatientId(facilityCode);
      
      // Filter the patient data to only include fields that exist in the database
      // We use the actual Sequelize model definition to get the valid fields
      const validFields = Object.keys(Patient.rawAttributes);
      
      const filteredData = {};
      for (const key in patientData) {
        if (validFields.includes(key)) {
          filteredData[key] = patientData[key];
        }
      }
      
      // Set default date if not provided
      if (!filteredData.registrationDate) {
        filteredData.registrationDate = new Date();
      }

      // Create patient
      const patient = await Patient.create({
        ...filteredData,
        uniqueIdentifier,
        createdBy: userId
      });

      // Get patient with facility and user info
      const createdPatient = await Patient.findByPk(patient.id, {
        include: [
          {
            model: Facility,
            as: 'registrationFacility',
          },
          {
            model: User,
            as: 'registeredBy',
            attributes: ['id', 'firstName', 'lastName', 'username'],
          },
        ],
      });

      return createdPatient;
    } catch (error) {
      logger.error('Error creating patient:', error);
      
      // Handle validation errors from Sequelize
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = {};
        error.errors.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        
        const customError = new Error('Validation failed');
        customError.validationErrors = validationErrors;
        throw customError;
      }
      
      // Handle database column errors
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        const columnMatch = error.message.match(/column "([^"]+)"/);
        const columnName = columnMatch ? columnMatch[1] : 'unknown';
        
        const customError = new Error(`Database error: Column "${columnName}" does not exist`);
        customError.isColumnError = true;
        throw customError;
      }
      
      throw error;
    }
  }

  /**
   * Get patient by ID
   * @param {String} id - Patient ID
   * @returns {Object} Patient
   */
  static async getPatientById(id) {
    try {
      const patient = await Patient.findByPk(id, {
        include: [
          {
            model: Facility,
            as: 'registrationFacility',
          },
          {
            model: User,
            as: 'registeredBy',
            attributes: ['id', 'firstName', 'lastName', 'username'],
          },
          {
            model: Visit,
            as: 'visits',
            limit: 1,
            order: [['visitDate', 'DESC']],
            required: false // Use left join to include patients without visits
          },
        ],
      });

      if (!patient) {
        throw new Error('Patient not found');
      }

      // Add calculated fields
      const enhancedPatient = patient.toJSON();
      enhancedPatient.age = calculateAge(patient.dateOfBirth);
      enhancedPatient.formattedDOB = formatDate(patient.dateOfBirth);
      enhancedPatient.formattedRegistrationDate = formatDate(patient.registrationDate);
      
      // Add last visit info
      if (patient.visits && patient.visits.length > 0) {
        enhancedPatient.lastVisit = formatDate(patient.visits[0].visitDate);
        enhancedPatient.lastVisitId = patient.visits[0].id;
      } else {
        enhancedPatient.lastVisit = 'Never';
        enhancedPatient.lastVisitId = null;
      }

      return enhancedPatient;
    } catch (error) {
      logger.error('Error getting patient by ID:', error);
      throw error;
    }
  }

  /**
   * Get patient by unique identifier
   * @param {String} uniqueIdentifier - Patient unique identifier
   * @returns {Object} Patient
   */
  static async getPatientByUniqueIdentifier(uniqueIdentifier) {
    try {
      const patient = await Patient.findOne({
        where: { uniqueIdentifier },
        include: [
          {
            model: Facility,
            as: 'registrationFacility',
          },
          {
            model: User,
            as: 'registeredBy',
            attributes: ['id', 'firstName', 'lastName', 'username'],
          },
        ],
      });

      if (!patient) {
        throw new Error('Patient not found');
      }

      return patient;
    } catch (error) {
      logger.error('Error getting patient by unique identifier:', error);
      throw error;
    }
  }

  /**
   * Update patient
   * @param {String} id - Patient ID
   * @param {Object} patientData - Patient data
   * @returns {Object} Updated patient
   */
  static async updatePatient(id, patientData) {
    try {
      // Find patient
      const patient = await Patient.findByPk(id);
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Filter the patient data to only include fields that exist in the database
      const validFields = Object.keys(Patient.rawAttributes);
      const filteredData = {};
      
      for (const key in patientData) {
        if (validFields.includes(key)) {
          filteredData[key] = patientData[key];
        }
      }

      // Update patient
      await patient.update(filteredData);

      // Get updated patient with associations
      const updatedPatient = await Patient.findByPk(id, {
        include: [
          {
            model: Facility,
            as: 'registrationFacility',
          },
          {
            model: User,
            as: 'registeredBy',
            attributes: ['id', 'firstName', 'lastName', 'username'],
          },
        ],
      });

      return updatedPatient;
    } catch (error) {
      logger.error('Error updating patient:', error);
      
      // Handle validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = {};
        error.errors.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        
        const customError = new Error('Validation failed');
        customError.validationErrors = validationErrors;
        throw customError;
      }
      
      throw error;
    }
  }

  /**
   * Delete patient
   * @param {String} id - Patient ID
   * @returns {Boolean} Success status
   */
  static async deletePatient(id) {
    try {
      // Find patient
      const patient = await Patient.findByPk(id);
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Delete patient (soft delete since paranoid is true)
      await patient.destroy();
      return true;
    } catch (error) {
      logger.error('Error deleting patient:', error);
      throw error;
    }
  }

  /**
   * Get all patients with pagination, filters, and enhanced data for UI display
   * @param {Object} options - Query options
   * @returns {Object} Patients with pagination info and UI-ready fields
   */
  static async getAllPatients(options = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        facilityId, 
        gender, 
        lgaResidence, 
        ageFrom, 
        ageTo,
        status
      } = options;
      
      const offset = (page - 1) * limit;
      const where = {};
      
      // Apply filters
      if (facilityId) where.facilityId = facilityId;
      if (gender) where.gender = gender;
      if (lgaResidence) where.lgaResidence = lgaResidence;
      if (status) where.status = status;
      
      // Age filter based on date of birth
      if (ageFrom || ageTo) {
        const now = new Date();
        
        if (ageFrom && ageTo) {
          // Between ageFrom and ageTo
          const fromDate = new Date(now);
          fromDate.setFullYear(fromDate.getFullYear() - ageTo);
          
          const toDate = new Date(now);
          toDate.setFullYear(toDate.getFullYear() - ageFrom);
          
          where.dateOfBirth = {
            [Op.between]: [fromDate, toDate],
          };
        } else if (ageFrom) {
          // Older than ageFrom
          const fromDate = new Date(now);
          fromDate.setFullYear(fromDate.getFullYear() - ageFrom);
          
          where.dateOfBirth = {
            [Op.lte]: fromDate,
          };
        } else if (ageTo) {
          // Younger than ageTo
          const toDate = new Date(now);
          toDate.setFullYear(toDate.getFullYear() - ageTo);
          
          where.dateOfBirth = {
            [Op.gte]: toDate,
          };
        }
      }
  
      // Find patients without Visit relationship
      const { rows: patients, count } = await Patient.findAndCountAll({
        where,
        include: [
          {
            model: Facility,
            as: 'registrationFacility',
          },
          {
            model: User,
            as: 'registeredBy',
            attributes: ['id', 'firstName', 'lastName', 'username'],
          },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });
  
      // Add calculated fields for UI display
      const enhancedPatients = patients.map(patient => {
        // Convert to plain object to avoid Sequelize instance methods/getters
        const patientData = patient.toJSON ? patient.toJSON() : { ...patient };
        
        // Calculate age from date of birth
        if (patientData.dateOfBirth) {
          patientData.age = calculateAge(patientData.dateOfBirth);
          patientData.formattedDOB = formatDateWithAge(patientData.dateOfBirth);
        }
        
        // Format display name
        patientData.displayName = `${patientData.firstName || ''} ${patientData.lastName || ''}`.trim();
        
        // Add placeholder for last visit info since we don't have the Visit model
        patientData.lastVisitDate = 'Not available';
        patientData.lastVisitId = null;
        
        // Format full address for display
        const addressParts = [];
        if (patientData.address) addressParts.push(patientData.address);
        if (patientData.city) addressParts.push(patientData.city);
        if (patientData.state) addressParts.push(patientData.state);
        patientData.fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Not provided';
        
        // Add status color for UI
        patientData.statusColor = patientData.status === 'active' ? 'green' : 
                                 (patientData.status === 'inactive' ? 'gray' : 'red');
        
        return patientData;
      });
  
      return {
        patients: enhancedPatients,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error('Error getting all patients:', error);
      throw error;
    }
  }

  /**
   * Search patients
   * @param {Object} searchParams - Search parameters
   * @returns {Object} Search results with pagination info
   */
  static async searchPatients(searchParams) {
    try {
      const { 
        term, 
        uniqueIdentifier, 
        firstName, 
        lastName, 
        phoneNumber, 
        dateOfBirth, 
        lgaResidence, 
        facilityId,
        page = 1,
        limit = 10
      } = searchParams;
      
      const offset = (page - 1) * limit;
      const where = {};
      
      // Build search conditions
      if (uniqueIdentifier) {
        where.uniqueIdentifier = uniqueIdentifier;
      } else if (term) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${term}%` } },
          { lastName: { [Op.iLike]: `%${term}%` } },
          { uniqueIdentifier: { [Op.iLike]: `%${term}%` } },
          { phoneNumber: { [Op.iLike]: `%${term}%` } },
        ];
      } else {
        // Individual search parameters
        if (firstName) where.firstName = { [Op.iLike]: `%${firstName}%` };
        if (lastName) where.lastName = { [Op.iLike]: `%${lastName}%` };
        if (phoneNumber) where.phoneNumber = { [Op.iLike]: `%${phoneNumber}%` };
        if (dateOfBirth) where.dateOfBirth = dateOfBirth;
        if (lgaResidence) where.lgaResidence = lgaResidence;
        if (facilityId) where.facilityId = facilityId;
      }

      // Find patients
      const { rows: patients, count } = await Patient.findAndCountAll({
        where,
        include: [
          {
            model: Facility,
            as: 'registrationFacility',
          },
        ],
        limit,
        offset,
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
      });

      return {
        patients,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error('Error searching patients:', error);
      throw error;
    }
  }
}

module.exports = PatientService;