// src/api/services/antenatal.service.js

const { Op } = require('sequelize');
const db = require('../../models');
const { AppError } = require('../../utils/error');

class AntenatalService {
  async createAntenatalCare(data, userId) {
    try {
      // Check if patient exists
      const patient = await db.Patient.findByPk(data.patientId);
      if (!patient) {
        throw new AppError('Patient not found', 404);
      }

      // Check if facility exists
      const facility = await db.Facility.findByPk(data.facilityId);
      if (!facility) {
        throw new AppError('Facility not found', 404);
      }

      // Check if patient gender is female
      if (patient.gender.toLowerCase() !== 'female') {
        throw new AppError('Antenatal care can only be registered for female patients', 400);
      }

      // Check if patient already has an active antenatal care record
      const existingActiveRecord = await db.AntenatalCare.findOne({
        where: {
          patientId: data.patientId,
          status: 'Active',
        },
      });

      if (existingActiveRecord) {
        throw new AppError('Patient already has an active antenatal care record', 400);
      }

      // Generate registration number if not provided
      if (!data.registrationNumber) {
        // Get facility code (first 3 letters) for prefix
        const facilityCode = facility.name.substring(0, 3).toUpperCase();
        
        // Get current date components
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(-2); // Last 2 digits of year
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month (01-12)
        
        // Generate random part (4 digits)
        const random = Math.floor(1000 + Math.random() * 9000);
        
        // Format: [Facility Code]-ANC-[YY][MM]-[Random]
        // Example: AKW-ANC-2505-4321
        data.registrationNumber = `${facilityCode}-ANC-${year}${month}-${random}`;
      }

      // Create antenatal care record
      const antenatalCare = await db.AntenatalCare.create({
        ...data,
        createdBy: userId,
      });

      return antenatalCare;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getAntenatalCareById(id, includeVisits = false) {
    try {
      const include = [
        {
          model: db.Patient,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'phoneNumber'],
        },
        {
          model: db.Facility,
          as: 'facility',
          attributes: ['id', 'name', 'facilityType', 'lga'],
        },
      ];

      if (includeVisits) {
        include.push({
          model: db.AntenatalVisit,
          as: 'visits',
          separate: true,
          order: [['visitDate', 'DESC']],
        });
      }

      const antenatalCare = await db.AntenatalCare.findByPk(id, { include });

      if (!antenatalCare) {
        throw new AppError('Antenatal care record not found', 404);
      }

      return antenatalCare;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async updateAntenatalCare(id, data, userId) {
    try {
      const antenatalCare = await db.AntenatalCare.findByPk(id);
      if (!antenatalCare) {
        throw new AppError('Antenatal care record not found', 404);
      }

      // If updating outcome to something other than 'Ongoing', ensure delivery date is provided
      if (data.outcome && data.outcome !== 'Ongoing' && !data.deliveryDate && !antenatalCare.deliveryDate) {
        throw new AppError('Delivery date is required when changing outcome from Ongoing', 400);
      }

      await antenatalCare.update({
        ...data,
        updatedBy: userId,
      });

      return antenatalCare;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async deleteAntenatalCare(id) {
    try {
      const antenatalCare = await db.AntenatalCare.findByPk(id);
      if (!antenatalCare) {
        throw new AppError('Antenatal care record not found', 404);
      }

      // Using soft delete (paranoid)
      await antenatalCare.destroy();

      return { message: 'Antenatal care record deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async searchAntenatalCare(criteria) {
    try {
      const {
        patientId,
        facilityId,
        registrationDateFrom,
        registrationDateTo,
        eddFrom,
        eddTo,
        status,
        outcome,
        hivStatus,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = criteria;

      const where = {};

      if (patientId) {
        where.patientId = patientId;
      }

      if (facilityId) {
        where.facilityId = facilityId;
      }

      if (registrationDateFrom || registrationDateTo) {
        where.registrationDate = {};
        if (registrationDateFrom) {
          where.registrationDate[Op.gte] = new Date(registrationDateFrom);
        }
        if (registrationDateTo) {
          where.registrationDate[Op.lte] = new Date(registrationDateTo);
        }
      }

      if (eddFrom || eddTo) {
        where.edd = {};
        if (eddFrom) {
          where.edd[Op.gte] = new Date(eddFrom);
        }
        if (eddTo) {
          where.edd[Op.lte] = new Date(eddTo);
        }
      }

      if (status) {
        where.status = status;
      }

      if (outcome) {
        where.outcome = outcome;
      }

      if (hivStatus) {
        where.hivStatus = hivStatus;
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await db.AntenatalCare.findAndCountAll({
        where,
        include: [
          {
            model: db.Patient,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'phoneNumber'],
          },
          {
            model: db.Facility,
            as: 'facility',
            attributes: ['id', 'name', 'facilityType', 'lga'],
          },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);

      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  async createAntenatalVisit(data, userId) {
    try {
      // Check if antenatal care record exists
      const antenatalCare = await db.AntenatalCare.findByPk(data.antenatalCareId);
      if (!antenatalCare) {
        throw new AppError('Antenatal care record not found', 404);
      }

      // Check if antenatal care is active
      if (antenatalCare.status !== 'Active') {
        throw new AppError('Cannot add visits to a non-active antenatal care record', 400);
      }

      // Create antenatal visit
      const antenatalVisit = await db.AntenatalVisit.create({
        ...data,
        createdBy: userId,
      });

      return antenatalVisit;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getAntenatalVisitById(id) {
    try {
      const antenatalVisit = await db.AntenatalVisit.findByPk(id, {
        include: [
          {
            model: db.AntenatalCare,
            as: 'antenatalCare',
            include: [
              {
                model: db.Patient,
                as: 'patient',
                attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth'],
              },
            ],
          },
        ],
      });

      if (!antenatalVisit) {
        throw new AppError('Antenatal visit not found', 404);
      }

      return antenatalVisit;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async updateAntenatalVisit(id, data, userId) {
    try {
      const antenatalVisit = await db.AntenatalVisit.findByPk(id, {
        include: [
          {
            model: db.AntenatalCare,
            as: 'antenatalCare',
          },
        ],
      });

      if (!antenatalVisit) {
        throw new AppError('Antenatal visit not found', 404);
      }

      // Check if antenatal care is active
      if (antenatalVisit.antenatalCare.status !== 'Active') {
        throw new AppError('Cannot update visits for a non-active antenatal care record', 400);
      }

      await antenatalVisit.update({
        ...data,
        updatedBy: userId,
      });

      return antenatalVisit;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async deleteAntenatalVisit(id) {
    try {
      const antenatalVisit = await db.AntenatalVisit.findByPk(id, {
        include: [
          {
            model: db.AntenatalCare,
            as: 'antenatalCare',
          },
        ],
      });

      if (!antenatalVisit) {
        throw new AppError('Antenatal visit not found', 404);
      }

      // Check if antenatal care is active
      if (antenatalVisit.antenatalCare.status !== 'Active') {
        throw new AppError('Cannot delete visits for a non-active antenatal care record', 400);
      }

      // Using soft delete (paranoid)
      await antenatalVisit.destroy();

      return { message: 'Antenatal visit deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async searchAntenatalVisits(criteria) {
    try {
      const {
        antenatalCareId,
        patientId,
        visitDateFrom,
        visitDateTo,
        minGestationalAge,
        maxGestationalAge,
        page = 1,
        limit = 10,
        sortBy = 'visitDate',
        sortOrder = 'DESC',
      } = criteria;

      const where = {};
      const includeAntenatalCare = {
        model: db.AntenatalCare,
        as: 'antenatalCare',
      };

      if (antenatalCareId) {
        where.antenatalCareId = antenatalCareId;
      }

      if (patientId) {
        includeAntenatalCare.where = { patientId };
      }

      if (visitDateFrom || visitDateTo) {
        where.visitDate = {};
        if (visitDateFrom) {
          where.visitDate[Op.gte] = new Date(visitDateFrom);
        }
        if (visitDateTo) {
          where.visitDate[Op.lte] = new Date(visitDateTo);
        }
      }

      if (minGestationalAge || maxGestationalAge) {
        where.gestationalAge = {};
        if (minGestationalAge) {
          where.gestationalAge[Op.gte] = minGestationalAge;
        }
        if (maxGestationalAge) {
          where.gestationalAge[Op.lte] = maxGestationalAge;
        }
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await db.AntenatalVisit.findAndCountAll({
        where,
        include: [
          {
            ...includeAntenatalCare,
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
          },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);

      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  async completeAntenatalCare(id, outcomeData, userId) {
    try {
      const antenatalCare = await db.AntenatalCare.findByPk(id);
      if (!antenatalCare) {
        throw new AppError('Antenatal care record not found', 404);
      }

      if (antenatalCare.status !== 'Active') {
        throw new AppError('Can only complete active antenatal care records', 400);
      }

      if (!outcomeData.deliveryDate) {
        throw new AppError('Delivery date is required', 400);
      }

      if (!outcomeData.outcome || outcomeData.outcome === 'Ongoing') {
        throw new AppError('Valid outcome is required', 400);
      }

      if (outcomeData.outcome === 'Live Birth' && !outcomeData.birthOutcome) {
        throw new AppError('Birth outcome details are required for live births', 400);
      }

      // Update the antenatal care record with outcome information
      await antenatalCare.update({
        outcome: outcomeData.outcome,
        deliveryDate: outcomeData.deliveryDate,
        modeOfDelivery: outcomeData.modeOfDelivery || 'Unknown',
        birthOutcome: outcomeData.birthOutcome || null,
        status: 'Completed',
        updatedBy: userId,
      });

      // If it's a live birth, increment para
      if (outcomeData.outcome === 'Live Birth') {
        await antenatalCare.update({
          para: antenatalCare.para + 1,
        });
      }

      return antenatalCare;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  }

  async getDueAppointments(criteria) {
    try {
      const {
        facilityId,
        dateFrom,
        dateTo,
        page = 1,
        limit = 10
      } = criteria;

      // Get the latest visit for each antenatal care record with a next appointment
      const query = `
        WITH LatestVisits AS (
          SELECT DISTINCT ON (av."antenatalCareId") 
            av.id,
            av."antenatalCareId",
            av."nextAppointment",
            ac."patientId",
            ac."facilityId"
          FROM "AntenatalVisit" av
          JOIN "AntenatalCare" ac ON av."antenatalCareId" = ac.id
          WHERE av."nextAppointment" IS NOT NULL
            AND ac.status = 'Active'
            ${facilityId ? `AND ac."facilityId" = '${facilityId}'` : ''}
            ${dateFrom ? `AND av."nextAppointment" >= '${dateFrom}'` : ''}
            ${dateTo ? `AND av."nextAppointment" <= '${dateTo}'` : ''}
          ORDER BY av."antenatalCareId", av."visitDate" DESC
        )
        SELECT 
          lv.id AS "visitId",
          lv."antenatalCareId",
          lv."nextAppointment",
          ac.id AS "antenatalId",
          ac."registrationDate",
          ac."edd",
          p.id AS "patientId",
          p."firstName",
          p."lastName",
          p."dateOfBirth",
          p."phoneNumber",
          f.id AS "facilityId",
          f.name AS "facilityName"
        FROM LatestVisits lv
        JOIN "AntenatalCare" ac ON lv."antenatalCareId" = ac.id
        JOIN "Patients" p ON ac."patientId" = p.id
        JOIN "Facilities" f ON ac."facilityId" = f.id
        ORDER BY lv."nextAppointment" ASC
        ${limit ? `LIMIT ${limit}` : ''}
        ${page && limit ? `OFFSET ${(page - 1) * limit}` : ''}
      `;

      // Count query
      const countQuery = `
        WITH LatestVisits AS (
          SELECT DISTINCT ON (av."antenatalCareId") 
            av.id
          FROM "AntenatalVisit" av
          JOIN "AntenatalCare" ac ON av."antenatalCareId" = ac.id
          WHERE av."nextAppointment" IS NOT NULL
            AND ac.status = 'Active'
            ${facilityId ? `AND ac."facilityId" = '${facilityId}'` : ''}
            ${dateFrom ? `AND av."nextAppointment" >= '${dateFrom}'` : ''}
            ${dateTo ? `AND av."nextAppointment" <= '${dateTo}'` : ''}
          ORDER BY av."antenatalCareId", av."visitDate" DESC
        )
        SELECT COUNT(*) AS total
        FROM LatestVisits
      `;

      const [results, countResults] = await Promise.all([
        db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT }),
        db.sequelize.query(countQuery, { type: db.sequelize.QueryTypes.SELECT }),
      ]);

      const count = parseInt(countResults[0]?.total || 0);
      const totalPages = Math.ceil(count / limit);

      return {
        data: results,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
}

module.exports = new AntenatalService();