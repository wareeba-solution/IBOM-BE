const { Op } = require('sequelize');
const db = require('../../models');
const helpers = require('../../utils/helpers');

const Patient = db.Patient;
const Visit = db.Visit;
const Facility = db.Facility;
const User = db.User;

/**
 * Patient service
 */
class PatientService {
  /**
   * Get all patients
   * @param {Object} options - Query options
   * @returns {Array} List of patients
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
        ageTo 
      } = options;
      
      const offset = (page - 1) * limit;

      // Build where clause
      const where = {};
      
      if (facilityId) where.facilityId = facilityId;
      if (gender) where.gender = gender;
      if (lgaResidence) where.lgaResidence = lgaResidence;
      
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

      // Find patients
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

      return {
        patients,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
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
        ],
      });

      if (!patient) {
        throw new Error('Patient not found');
      }

      return patient;
    } catch (error) {
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
      throw error;
    }
  }

  /**
   * Create a new patient
   * @param {Object} patientData - Patient data
   * @param {String} userId - Creating user ID
   * @returns {Object} Created patient
   */
  static async createPatient(patientData, userId) {
    try {
      // Generate unique identifier
      const facility = await Facility.findByPk(patientData.facilityId);
      
      if (!facility) {
        throw new Error('Facility not found');
      }
      
      const facilityCode = facility.name.substring(0, 3).toUpperCase();
      const uniqueIdentifier = helpers.generatePatientId(facilityCode);

      // Create patient
      const patient = await Patient.create({
        ...patientData,
        uniqueIdentifier,
        createdBy: userId,
      });

      // Get patient with facility and user
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

      // Update patient
      await patient.update(patientData);

      // Get updated patient with facility and user
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

      // Delete patient (soft delete)
      await patient.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search patients
   * @param {Object} searchParams - Search parameters
   * @returns {Array} Search results
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
      
      // Build where clause
      const where = {};
      
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
      throw error;
    }
  }

  /**
   * Create a new visit
   * @param {Object} visitData - Visit data
   * @param {String} userId - Creating user ID
   * @returns {Object} Created visit
   */
  static async createVisit(visitData, userId) {
    try {
      // Check if patient exists
      const patient = await Patient.findByPk(visitData.patientId);
      
      if (!patient) {
        throw new Error('Patient not found');
      }
      
      // Check if facility exists
      const facility = await Facility.findByPk(visitData.facilityId);
      
      if (!facility) {
        throw new Error('Facility not found');
      }
      
      // Create visit
      const visit = await Visit.create({
        ...visitData,
        attendedBy: userId,
      });

      // Get visit with patient, facility, and user
      const createdVisit = await Visit.findByPk(visit.id, {
        include: [
          {
            model: Patient,
            as: 'patient',
          },
          {
            model: Facility,
            as: 'facility',
          },
          {
            model: User,
            as: 'caregiver',
            attributes: ['id', 'firstName', 'lastName', 'username'],
          },
        ],
      });

      return createdVisit;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get patient visits
   * @param {String} patientId - Patient ID
   * @param {Object} options - Query options
   * @returns {Array} List of visits
   */
  static async getPatientVisits(patientId, options = {}) {
    try {
      const { page = 1, limit = 10, visitType } = options;
      const offset = (page - 1) * limit;

      // Build where clause
      const where = { patientId };
      if (visitType) where.visitType = visitType;

      // Find visits
      const { rows: visits, count } = await Visit.findAndCountAll({
        where,
        include: [
          {
            model: Facility,
            as: 'facility',
          },
          {
            model: User,
            as: 'caregiver',
            attributes: ['id', 'firstName', 'lastName', 'username'],
          },
        ],
        limit,
        offset,
        order: [['visitDate', 'DESC']],
      });

      return {
        visits,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get visit by ID
   * @param {String} id - Visit ID
   * @returns {Object} Visit
   */
  static async getVisitById(id) {
    try {
      const visit = await Visit.findByPk(id, {
        include: [
          {
            model: Patient,
            as: 'patient',
          },
          {
            model: Facility,
            as: 'facility',
          },
          {
            model: User,
            as: 'caregiver',
            attributes: ['id', 'firstName', 'lastName', 'username'],
          },
        ],
      });

      if (!visit) {
        throw new Error('Visit not found');
      }

      return visit;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update visit
   * @param {String} id - Visit ID
   * @param {Object} visitData - Visit data
   * @returns {Object} Updated visit
   */
  static async updateVisit(id, visitData) {
    try {
      // Find visit
      const visit = await Visit.findByPk(id);

      if (!visit) {
        throw new Error('Visit not found');
      }

      // Update visit
      await visit.update(visitData);

      // Get updated visit with patient, facility, and user
      const updatedVisit = await Visit.findByPk(id, {
        include: [
          {
            model: Patient,
            as: 'patient',
          },
          {
            model: Facility,
            as: 'facility',
          },
          {
            model: User,
            as: 'caregiver',
            attributes: ['id', 'firstName', 'lastName', 'username'],
          },
        ],
      });

      return updatedVisit;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete visit
   * @param {String} id - Visit ID
   * @returns {Boolean} Success status
   */
  static async deleteVisit(id) {
    try {
      // Find visit
      const visit = await Visit.findByPk(id);

      if (!visit) {
        throw new Error('Visit not found');
      }

      // Delete visit
      await visit.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PatientService;