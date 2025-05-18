// src/api/services/immunization.service.js

const { Op } = require('sequelize');
const db = require('../../models');
const { AppError } = require('../../utils/error');

class ImmunizationService {
  async createImmunization(data, userId) {
    try {
      // Backend data only
      const backendData = { ...data };
      
      // Handle frontend field names
      if (data.patient_id) backendData.patientId = data.patient_id;
      if (data.facility_id) backendData.facilityId = data.facility_id;
      if (data.vaccine_type) {
        backendData.vaccineType = data.vaccine_type;
        // Default vaccineName to vaccineType if not provided
        if (!backendData.vaccineName && !data.vaccine_name) {
          backendData.vaccineName = data.vaccine_type;
        }
      }
      if (data.vaccine_name) backendData.vaccineName = data.vaccine_name;
      if (data.dose_number) backendData.doseNumber = data.dose_number;
      if (data.lot_number) backendData.batchNumber = data.lot_number;
      if (data.vaccination_date) backendData.administrationDate = data.vaccination_date;
      if (data.expiry_date) backendData.expiryDate = data.expiry_date;
      if (data.healthcare_provider) backendData.administeredBy = data.healthcare_provider;
      if (data.site_of_administration) backendData.administrationSite = data.site_of_administration;
      if (data.route_of_administration) backendData.administrationRoute = data.route_of_administration;
      if (data.next_due_date) backendData.nextDoseDate = data.next_due_date;
      if (data.provider_id) backendData.providerId = data.provider_id;
      if (data.weight_kg) backendData.weightKg = data.weight_kg;
      if (data.height_cm) backendData.heightCm = data.height_cm;
      if (data.age_months) backendData.ageMonths = data.age_months;
      if (data.side_effects) backendData.sideEffects = data.side_effects;
      
      // Map status values
      if (data.status) {
        const statusMap = {
          'completed': 'Administered',
          'pending': 'Scheduled',
          'missed': 'Missed',
          'cancelled': 'Cancelled'
        };
        backendData.status = statusMap[data.status.toLowerCase()] || data.status;
      }
      
      // If vaccineName is not provided, default to vaccineType
      if (!backendData.vaccineName && backendData.vaccineType) {
        backendData.vaccineName = backendData.vaccineType;
      }
      
      // If expiryDate is not provided, default to administrationDate + 2 years
      if (!backendData.expiryDate && backendData.administrationDate) {
        const administrationDate = new Date(backendData.administrationDate);
        backendData.expiryDate = new Date(administrationDate);
        backendData.expiryDate.setFullYear(administrationDate.getFullYear() + 2);
      }
      
      // Check if patient exists
      const patientId = backendData.patientId;
      if (!patientId) {
        throw new AppError('Patient ID is required', 400);
      }
      
      const patient = await db.Patient.findByPk(patientId);
      if (!patient) {
        throw new AppError('Patient not found', 404);
      }
  
      // Check if facility exists
      const facilityId = backendData.facilityId;
      if (!facilityId) {
        throw new AppError('Facility ID is required', 400);
      }
      
      const facility = await db.Facility.findByPk(facilityId);
      if (!facility) {
        throw new AppError('Facility not found', 404);
      }
  
      // Add the user who created the record
      backendData.createdBy = userId;
  
      // Create immunization record
      const immunization = await db.Immunization.create(backendData);
  
      // Return the created record
      return immunization;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getImmunizationById(id) {
    try {
      const immunization = await db.Immunization.findByPk(id, {
        include: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth'],
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['id', 'name', 'facilityType', 'lga'],
          },
        ],
      });

      if (!immunization) {
        throw new AppError('Immunization record not found', 404);
      }

      return immunization;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async updateImmunization(id, data, userId) {
    try {
      const immunization = await db.Immunization.findByPk(id);
      if (!immunization) {
        throw new AppError('Immunization record not found', 404);
      }

      // Update with the data directly
      await immunization.update({
        ...data,
        updatedBy: userId,
      });

      return immunization;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async deleteImmunization(id) {
    try {
      const immunization = await db.Immunization.findByPk(id);
      if (!immunization) {
        throw new AppError('Immunization record not found', 404);
      }

      // Using soft delete (paranoid)
      await immunization.destroy();

      return { message: 'Immunization record deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async searchImmunizations(criteria) {
    try {
      // Extract search parameters directly
      const {
        patientId,
        patient_id,
        facilityId,
        facility_id,
        vaccineType,
        vaccine_type,
        vaccineName,
        dateFrom,
        date_from,
        dateTo,
        date_to,
        status,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        sort_by,
        sort_order,
      } = criteria;

      const where = {};
      
      // Handle both naming conventions for flexibility
      if (patientId || patient_id) {
        where.patientId = patientId || patient_id;
      }
      
      if (facilityId || facility_id) {
        where.facilityId = facilityId || facility_id;
      }
      
      if (vaccineType || vaccine_type) {
        where.vaccineType = {
          [Op.iLike]: `%${vaccineType || vaccine_type}%`
        };
      }
      
      if (vaccineName) {
        where.vaccineName = {
          [Op.iLike]: `%${vaccineName}%`
        };
      }
      
      if (dateFrom || date_from || dateTo || date_to) {
        where.administrationDate = {};
        if (dateFrom || date_from) {
          where.administrationDate[Op.gte] = new Date(dateFrom || date_from);
        }
        if (dateTo || date_to) {
          where.administrationDate[Op.lte] = new Date(dateTo || date_to);
        }
      }
      
      if (status) {
        where.status = status;
      }

      const offset = (page - 1) * limit;
      
      // Handle sort field mapping
      let effectiveSortBy = sortBy;
      if (sort_by) {
        const sortFieldMap = {
          'vaccination_date': 'administrationDate',
          'next_due_date': 'nextDoseDate',
          'created_at': 'createdAt',
          'updated_at': 'updatedAt'
        };
        effectiveSortBy = sortFieldMap[sort_by] || sort_by;
      }
      
      const effectiveSortOrder = sort_order || sortOrder;
      
      const { count, rows } = await db.Immunization.findAndCountAll({
        where,
        include: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth'],
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['id', 'name', 'facilityType', 'lga'],
          },
        ],
        order: [[effectiveSortBy, effectiveSortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      const totalPages = Math.ceil(count / limit);
      
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: parseInt(page),
          itemsPerPage: parseInt(limit),
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  async getPatientImmunizationHistory(patientId) {
    try {
      // Check if patient exists
      const patient = await db.Patient.findByPk(patientId);
      if (!patient) {
        throw new AppError('Patient not found', 404);
      }

      // Get all immunizations for the patient
      const immunizations = await db.Immunization.findAll({
        where: { patientId },
        include: [
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['id', 'name', 'facilityType', 'lga'],
          },
        ],
        order: [
          ['vaccineType', 'ASC'],
          ['doseNumber', 'ASC'],
          ['administrationDate', 'DESC'],
        ],
      });

      // Group immunizations by vaccine type
      const groupedByVaccine = {};
      
      for (const immunization of immunizations) {
        const vaccineType = immunization.vaccineType;
        
        if (!groupedByVaccine[vaccineType]) {
          groupedByVaccine[vaccineType] = [];
        }
        
        groupedByVaccine[vaccineType].push(immunization);
      }

      return {
        patient: {
          id: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          gender: patient.gender,
          dateOfBirth: patient.dateOfBirth,
        },
        immunizations: groupedByVaccine,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async scheduleImmunization(data, userId) {
    try {
      // Handle both frontend and backend field names
      const patientId = data.patientId || data.patient_id;
      const facilityId = data.facilityId || data.facility_id;
      const vaccineType = data.vaccineType || data.vaccine_type;
      const vaccineName = data.vaccineName || data.vaccine_name || vaccineType;
      const doseNumber = data.doseNumber || data.dose_number;
      const scheduledDate = data.scheduledDate || data.scheduled_date;
      const notes = data.notes;
      const providerId = data.providerId || data.provider_id;
      const weightKg = data.weightKg || data.weight_kg;
      const heightCm = data.heightCm || data.height_cm;
      const ageMonths = data.ageMonths || data.age_months;
      
      // Check if patient exists
      const patient = await db.Patient.findByPk(patientId);
      if (!patient) {
        throw new AppError('Patient not found', 404);
      }

      // Check if facility exists
      const facility = await db.Facility.findByPk(facilityId);
      if (!facility) {
        throw new AppError('Facility not found', 404);
      }

      // Create scheduled immunization
      const immunization = await db.Immunization.create({
        patientId,
        facilityId,
        vaccineType,
        vaccineName,
        doseNumber,
        administrationDate: scheduledDate,
        status: 'Scheduled',
        notes,
        createdBy: userId,
        // Default values for required fields that will be updated when administered
        batchNumber: 'TBD',
        expiryDate: new Date(scheduledDate),
        administeredBy: 'TBD',
        administrationSite: 'Other',
        administrationRoute: 'Other',
        // Add new fields
        providerId,
        weightKg,
        heightCm,
        ageMonths,
      });

      return immunization;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getDueImmunizations(criteria) {
    try {
      // Handle both naming conventions
      const facilityId = criteria.facilityId || criteria.facility_id;
      const dateFrom = criteria.dateFrom || criteria.date_from;
      const dateTo = criteria.dateTo || criteria.date_to;
      const page = parseInt(criteria.page) || 1;
      const limit = parseInt(criteria.limit) || 10;

      const where = {
        status: 'Scheduled',
      };
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      // Default to looking for immunizations due in the next 30 days if no dates provided
      const today = new Date();
      const defaultDateTo = new Date();
      defaultDateTo.setDate(today.getDate() + 30);
      
      where.administrationDate = {};
      where.administrationDate[Op.gte] = dateFrom ? new Date(dateFrom) : today;
      where.administrationDate[Op.lte] = dateTo ? new Date(dateTo) : defaultDateTo;

      const offset = (page - 1) * limit;
      
      const { count, rows } = await db.Immunization.findAndCountAll({
        where,
        include: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth'],
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['id', 'name', 'facilityType', 'lga'],
          },
        ],
        order: [['administrationDate', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      const totalPages = Math.ceil(count / limit);
      
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: parseInt(page),
          itemsPerPage: parseInt(limit),
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  async getImmunizationStatistics(criteria) {
    try {
      // Handle both naming conventions
      const facilityId = criteria.facilityId || criteria.facility_id;
      const dateFrom = criteria.dateFrom || criteria.date_from;
      const dateTo = criteria.dateTo || criteria.date_to;
      const groupBy = criteria.groupBy || criteria.group_by;
  
      // Validate required parameters
      if (!groupBy) {
        throw new AppError('groupBy parameter is required', 400);
      }
  
      const where = {};
      
      if (facilityId) {
        where.facilityId = facilityId;
      }
      
      if (dateFrom || dateTo) {
        where.administrationDate = {};
        if (dateFrom) {
          where.administrationDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          where.administrationDate[Op.lte] = new Date(dateTo);
        }
      }
  
      where.status = 'Administered';
  
      // Special case for age statistics - use raw SQL with explicit subquery
      if (groupBy === 'age') {
        // Create condition strings for the query
        const facilityCondition = facilityId ? `AND i."facilityId" = :facilityId` : '';
        const dateFromCondition = dateFrom ? `AND i."administrationDate" >= :dateFrom` : '';
        const dateToCondition = dateTo ? `AND i."administrationDate" <= :dateTo` : '';
        
        // Define the query with placeholders for parameters
        const ageQuery = `
          WITH age_groups AS (
            SELECT 
              CASE 
                WHEN EXTRACT(YEAR FROM AGE(NOW(), p."dateOfBirth")) < 1 THEN '< 1 year'
                WHEN EXTRACT(YEAR FROM AGE(NOW(), p."dateOfBirth")) < 5 THEN '1-4 years'
                WHEN EXTRACT(YEAR FROM AGE(NOW(), p."dateOfBirth")) < 12 THEN '5-11 years'
                WHEN EXTRACT(YEAR FROM AGE(NOW(), p."dateOfBirth")) < 18 THEN '12-17 years'
                ELSE '18+ years'
              END AS age_group,
              i.id
            FROM 
              "Immunizations" i
            JOIN 
              "Patients" p ON i."patientId" = p.id
            WHERE 
              i.status = 'Administered'
              ${facilityCondition}
              ${dateFromCondition}
              ${dateToCondition}
              AND i."deletedAt" IS NULL
          )
          SELECT 
            age_group,
            COUNT(*) AS count
          FROM 
            age_groups
          GROUP BY 
            age_group
          ORDER BY 
            CASE 
              WHEN age_group = '< 1 year' THEN 1
              WHEN age_group = '1-4 years' THEN 2
              WHEN age_group = '5-11 years' THEN 3
              WHEN age_group = '12-17 years' THEN 4
              ELSE 5
            END ASC
        `;
        
        // Define replacement parameters
        const replacements = {};
        if (facilityId) replacements.facilityId = facilityId;
        if (dateFrom) replacements.dateFrom = dateFrom;
        if (dateTo) replacements.dateTo = dateTo;
        
        // Execute the raw query
        const results = await db.sequelize.query(
          ageQuery, 
          { 
            replacements,
            type: db.sequelize.QueryTypes.SELECT 
          }
        );
        
        // Make sure we always return an array
        return Array.isArray(results) ? results : [];
      }
      
      // For other grouping types, use the Sequelize approach
      let attributes = [];
      let group = [];
      let orderBy = [];
      let includes = [];
      
      // Configure grouping based on parameter
      switch (groupBy) {
        case 'vaccine':
          attributes = [
            ['vaccineType', 'vaccine_type'], // Consistent field naming
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = ['vaccineType'];
          orderBy = [['vaccineType', 'ASC']];
          break;
          
        case 'facility':
          attributes = [
            [db.sequelize.col('facility.name'), 'facility_name'], // Consistent field naming
            [db.sequelize.fn('COUNT', db.sequelize.col('Immunization.id')), 'count'],
          ];
          group = [db.sequelize.col('facility.name')];
          includes = [{
            model: db.Facility,
            as: 'facility',
            attributes: [],
          }];
          break;
          
        case 'month':
          attributes = [
            [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('administrationDate')), 'month'],
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
          ];
          group = [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('administrationDate'))];
          orderBy = [[db.sequelize.literal('month'), 'ASC']];
          break;
          
        default:
          throw new AppError(`Invalid groupBy parameter: ${groupBy}`, 400);
      }
  
      const results = await db.Immunization.findAll({
        attributes,
        include: includes,
        where,
        group,
        order: orderBy,
        raw: true,
      });
  
      return results;
    } catch (error) {
      console.error('Error in getImmunizationStatistics:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }
}

module.exports = new ImmunizationService();