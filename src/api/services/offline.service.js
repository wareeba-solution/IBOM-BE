// src/api/services/offline.service.js
const { sequelize } = require('../../models');
const AppError = require('../../utils/appError');

class OfflineService {
  async generateOfflinePackage(userId, facilityId) {
    // Prepare the offline data package with reference data
    const dataPackage = {
      referenceData: {},
      metadata: {
        generatedAt: new Date(),
        userId,
        facilityId
      }
    };

    try {
      // Load reference data
      dataPackage.referenceData = await this.loadReferenceData();
      
      // Get recent data for the facility
      if (facilityId) {
        dataPackage.facilityData = await this.getFacilityData(facilityId);
      }
      
      return dataPackage;
    } catch (error) {
      throw new AppError(`Failed to generate offline package: ${error.message}`, 500);
    }
  }

  async loadReferenceData() {
    // Load all reference data needed for offline operations
    const [vaccines, diseases, medications, testTypes] = await Promise.all([
      this.getVaccines(),
      this.getDiseases(),
      this.getMedications(),
      this.getTestTypes()
    ]);

    return {
      vaccines,
      diseases,
      medications,
      testTypes
    };
  }

  async getVaccines() {
    // Example: Query to get vaccines from a reference table
    const query = `
      SELECT id, name, description, scheduleInfo, targetDiseases
      FROM "ReferenceVaccines"
      WHERE active = true
      ORDER BY name
    `;
    
    const [results] = await sequelize.query(query);
    return results;
  }

  async getDiseases() {
    // Example: Query to get diseases from a reference table
    const query = `
      SELECT id, name, description, symptoms, icdCode, category, notifiable
      FROM "ReferenceDiseases"
      WHERE active = true
      ORDER BY name
    `;
    
    const [results] = await sequelize.query(query);
    return results;
  }

  async getMedications() {
    // Example: Query to get medications from a reference table
    const query = `
      SELECT id, name, description, dosageForm, strength, therapeuticClass
      FROM "ReferenceMedications"
      WHERE active = true
      ORDER BY name
    `;
    
    const [results] = await sequelize.query(query);
    return results;
  }

  async getTestTypes() {
    // Example: Query to get test types from a reference table
    const query = `
      SELECT id, name, description, category, normalRange, unit
      FROM "ReferenceTestTypes"
      WHERE active = true
      ORDER BY name
    `;
    
    const [results] = await sequelize.query(query);
    return results;
  }

  async getFacilityData(facilityId) {
    // Get recent patients and related data for the facility
    const data = {};
    
    // Get patients from this facility
    const patientsQuery = `
      SELECT id, facilityId, firstName, lastName, gender, dateOfBirth, 
             address, phoneNumber, nationalId, nextOfKin, createdAt, updatedAt
      FROM "Patients"
      WHERE facilityId = :facilityId
      AND updatedAt > NOW() - INTERVAL '3 months'
      ORDER BY updatedAt DESC
      LIMIT 1000
    `;
    
    const [patients] = await sequelize.query(patientsQuery, {
      replacements: { facilityId }
    });
    
    data.patients = patients;
    
    // Get patient IDs for related data queries
    const patientIds = patients.map(p => p.id);
    
    if (patientIds.length > 0) {
      // Query related data for these patients
      const [
        immunizations,
        antenatalCare,
        births,
        deaths,
        familyPlanning,
        communicableDiseases
      ] = await Promise.all([
        this.getImmunizationsForPatients(patientIds),
        this.getAntenatalCareForPatients(patientIds),
        this.getBirthsForPatients(patientIds),
        this.getDeathsForPatients(patientIds),
        this.getFamilyPlanningForPatients(patientIds),
        this.getCommunicableDiseasesForPatients(patientIds)
      ]);
      
      // Add related data to package
      data.immunizations = immunizations;
      data.antenatalCare = antenatalCare;
      data.births = births;
      data.deaths = deaths;
      data.familyPlanning = familyPlanning;
      data.communicableDiseases = communicableDiseases;
    }
    
    return data;
  }

  async getImmunizationsForPatients(patientIds) {
    const query = `
      SELECT *
      FROM "Immunizations"
      WHERE patientId IN (:patientIds)
      AND updatedAt > NOW() - INTERVAL '6 months'
    `;
    
    const [results] = await sequelize.query(query, {
      replacements: { patientIds }
    });
    
    return results;
  }

  async getAntenatalCareForPatients(patientIds) {
    const query = `
      SELECT *
      FROM "AntenatalCare"
      WHERE patientId IN (:patientIds)
      AND updatedAt > NOW() - INTERVAL '9 months'
    `;
    
    const [results] = await sequelize.query(query, {
      replacements: { patientIds }
    });
    
    return results;
  }

  async getBirthsForPatients(patientIds) {
    const query = `
      SELECT *
      FROM "Births"
      WHERE patientId IN (:patientIds)
      AND updatedAt > NOW() - INTERVAL '12 months'
    `;
    
    const [results] = await sequelize.query(query, {
      replacements: { patientIds }
    });
    
    return results;
  }

  async getDeathsForPatients(patientIds) {
    const query = `
      SELECT *
      FROM "Deaths"
      WHERE patientId IN (:patientIds)
      AND updatedAt > NOW() - INTERVAL '12 months'
    `;
    
    const [results] = await sequelize.query(query, {
      replacements: { patientIds }
    });
    
    return results;
  }

  async getFamilyPlanningForPatients(patientIds) {
    const query = `
      SELECT *
      FROM "FamilyPlanning"
      WHERE patientId IN (:patientIds)
      AND updatedAt > NOW() - INTERVAL '6 months'
    `;
    
    const [results] = await sequelize.query(query, {
      replacements: { patientIds }
    });
    
    return results;
  }

  async getCommunicableDiseasesForPatients(patientIds) {
    const query = `
      SELECT *
      FROM "CommunicableDiseases"
      WHERE patientId IN (:patientIds)
      AND updatedAt > NOW() - INTERVAL '6 months'
    `;
    
    const [results] = await sequelize.query(query, {
      replacements: { patientIds }
    });
    
    return results;
  }
}

module.exports = new OfflineService();