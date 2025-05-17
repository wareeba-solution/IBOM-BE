const { Op } = require('sequelize');
const db = require('../../models');

const Birth = db.Birth;
const Patient = db.Patient;
const Visit = db.Visit;
const Facility = db.Facility;
const User = db.User;

/**
 * Birth service
 */
class BirthService {
  /**
   * Get all birth records
   * @param {Object} options - Query options
   * @returns {Array} List of birth records
   */
  static async getAllBirths(options = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        facilityId, 
        startDate, 
        endDate,
        gender,
        deliveryMethod,
        birthType,
        lgaResidence
      } = options;
      
      const offset = (page - 1) * limit;
  
      // Build where clause
      const where = {};
      
      if (facilityId) where.facilityId = facilityId;
      if (gender) where.gender = gender;
      if (deliveryMethod) where.deliveryMethod = deliveryMethod;
      if (birthType) where.birthType = birthType;
      
      // Date range filter
      if (startDate || endDate) {
        where.birthDate = {};
        
        if (startDate) {
          where.birthDate[Op.gte] = startDate;
        }
        
        if (endDate) {
          where.birthDate[Op.lte] = endDate;
        }
      }
      
      // LGA residence filter (for mother)
      if (lgaResidence) {
        where.motherLgaResidence = lgaResidence;
      }
  
      // Find birth records
      const { rows: births, count } = await Birth.findAndCountAll({
        where,
        include: [
          {
            model: Patient,
            as: 'mother',
          },
          {
            model: Patient,
            as: 'baby',
          },
          {
            model: Facility,
            as: 'facility',
          },
          // User associations are removed temporarily
        ],
        limit,
        offset,
        order: [['birthDate', 'DESC'], ['birthTime', 'DESC']],
      });
  
      return {
        births,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get birth record by ID
   * @param {String} id - Birth record ID
   * @returns {Object} Birth record
   */
  static async getBirthById(id) {
    try {
      // Fetch the birth record without including the User associations
      const birth = await Birth.findByPk(id, {
        include: [
          {
            model: Patient,
            as: 'mother',
          },
          {
            model: Patient,
            as: 'baby',
          },
          {
            model: Visit,
            as: 'visit',
          },
          {
            model: Facility,
            as: 'facility',
          },
          // User associations are removed temporarily
        ],
      });
  
      if (!birth) {
        throw new Error('Birth record not found');
      }
  
      return birth;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new birth record
   * @param {Object} birthData - Birth record data
   * @param {String} userId - Creating user ID
   * @returns {Object} Created birth record
   */
  static async createBirth(birthData, userId) {
    try {
      // Check if mother exists
      const mother = await Patient.findByPk(birthData.motherId);
      
      if (!mother) {
        throw new Error('Mother not found');
      }
      
      // Check if facility exists
      const facility = await Facility.findByPk(birthData.facilityId);
      
      if (!facility) {
        throw new Error('Facility not found');
      }
  
      // Start a transaction
      const transaction = await db.sequelize.transaction();
      let transactionCommitted = false;
  
      try {
        // Format dates consistently
        let formattedBirthData = { ...birthData };
        
        // Ensure we have a valid birthDate in YYYY-MM-DD format
        if (formattedBirthData.birthDate) {
          // If it's not already in YYYY-MM-DD format, attempt to convert it
          if (!/^\d{4}-\d{2}-\d{2}$/.test(formattedBirthData.birthDate)) {
            try {
              const date = new Date(formattedBirthData.birthDate);
              if (!isNaN(date.getTime())) {
                formattedBirthData.birthDate = date.toISOString().split('T')[0];
              }
            } catch (err) {
              // If conversion fails, leave as is and let database handle validation
            }
          }
        }
        
        // Create birth record
        const birth = await Birth.create({
          ...formattedBirthData,
          createdBy: userId,
        }, { transaction });
  
        // If a visit ID is not provided, create a new visit record
        let visitId = formattedBirthData.visitId;
        
        if (!visitId) {
          // FIXED: Use separate date and time instead of trying to combine them
          const visit = await Visit.create({
            patientId: formattedBirthData.motherId,
            visitDate: formattedBirthData.birthDate, // Use birthDate directly
            visitTime: formattedBirthData.birthTime, // Use birthTime directly
            visitType: 'birth',
            notes: 'Automatically created for birth record',
            facilityId: formattedBirthData.facilityId,
            attendedBy: formattedBirthData.attendedBy || userId,
            // Add default values for columns that were added later
            followUpNeeded: false,
            referral: false,
            chiefComplaint: 'Birth delivery',
            prescriptions: null,
            labResults: null,
            referralFacility: null,
            referralReason: null
          }, { transaction });
          
          visitId = visit.id;
          
          // Update birth record with visit ID
          await birth.update({ visitId }, { transaction });
        }
  
        // If a baby record is not provided, create a new patient record for the baby
        let babyId = formattedBirthData.babyId;
        
        if (!babyId) {
          // Generate baby name if not provided
          const babyName = formattedBirthData.babyName || `Baby of ${mother.firstName} ${mother.lastName}`;
          
          const baby = await Patient.create({
            uniqueIdentifier: `${mother.uniqueIdentifier}-B${new Date().getTime()}`,
            firstName: babyName,
            lastName: mother.lastName,
            dateOfBirth: formattedBirthData.birthDate,
            gender: formattedBirthData.gender,
            lgaOrigin: mother.lgaOrigin,
            lgaResidence: mother.lgaResidence,
            facilityId: formattedBirthData.facilityId,
            createdBy: userId,
            // Additional required fields for Patient
            registrationDate: new Date().toISOString().split('T')[0],
            status: 'active'
          }, { transaction });
          
          babyId = baby.id;
          
          // Update birth record with baby ID
          await birth.update({ babyId }, { transaction });
        }
  
        // Generate registration number if not provided
        if (!formattedBirthData.registrationNumber) {
          const registrationNumber = `BR${Math.floor(10000 + Math.random() * 90000)}`;
          await birth.update({ registrationNumber }, { transaction });
        }
  
        // Commit transaction
        await transaction.commit();
        transactionCommitted = true;
  
        // Get created birth record with associations
        const createdBirth = await this.getBirthById(birth.id);
  
        return createdBirth;
      } catch (error) {
        // Only rollback the transaction if it hasn't been committed yet
        if (!transactionCommitted) {
          try {
            await transaction.rollback();
          } catch (rollbackError) {
            console.error('Error rolling back transaction:', rollbackError);
          }
        }
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update birth record
   * @param {String} id - Birth record ID
   * @param {Object} birthData - Birth record data
   * @returns {Object} Updated birth record
   */
  static async updateBirth(id, birthData) {
    try {
      // Find birth record
      const birth = await Birth.findByPk(id);

      if (!birth) {
        throw new Error('Birth record not found');
      }

      // Format dates consistently
      let formattedBirthData = { ...birthData };
      
      // Ensure we have a valid birthDate in YYYY-MM-DD format
      if (formattedBirthData.birthDate) {
        // If it's not already in YYYY-MM-DD format, attempt to convert it
        if (!/^\d{4}-\d{2}-\d{2}$/.test(formattedBirthData.birthDate)) {
          try {
            const date = new Date(formattedBirthData.birthDate);
            if (!isNaN(date.getTime())) {
              formattedBirthData.birthDate = date.toISOString().split('T')[0];
            }
          } catch (err) {
            // If conversion fails, leave as is and let database handle validation
          }
        }
      }

      // Update birth record
      await birth.update(formattedBirthData);

      // Get updated birth record with associations
      const updatedBirth = await this.getBirthById(id);

      return updatedBirth;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete birth record
   * @param {String} id - Birth record ID
   * @returns {Boolean} Success status
   */
  static async deleteBirth(id) {
    try {
      // Find birth record
      const birth = await Birth.findByPk(id);

      if (!birth) {
        throw new Error('Birth record not found');
      }

      // Delete birth record
      await birth.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search birth records
   * @param {Object} searchParams - Search parameters
   * @returns {Array} Search results
   */
  static async searchBirths(searchParams) {
    try {
      const { 
        motherId, 
        motherName, 
        fatherName, 
        facilityId, 
        startDate, 
        endDate, 
        gender, 
        deliveryMethod,
        birthType,
        lgaResidence,
        page = 1,
        limit = 10
      } = searchParams;
      
      const offset = (page - 1) * limit;
      
      // Build where clause
      const where = {};
      
      if (motherId) where.motherId = motherId;
      if (facilityId) where.facilityId = facilityId;
      if (gender) where.gender = gender;
      if (deliveryMethod) where.deliveryMethod = deliveryMethod;
      if (birthType) where.birthType = birthType;
      if (lgaResidence) where.motherLgaResidence = lgaResidence;
      
      if (fatherName) where.fatherName = { [Op.iLike]: `%${fatherName}%` };
      
      // Date range filter
      if (startDate || endDate) {
        where.birthDate = {};
        
        if (startDate) {
          where.birthDate[Op.gte] = startDate;
        }
        
        if (endDate) {
          where.birthDate[Op.lte] = endDate;
        }
      }

      // Include options for search
      const include = [
        {
          model: Facility,
          as: 'facility',
        },
      ];
      
      // Add mother include with filter if motherName is provided
      if (motherName) {
        include.push({
          model: Patient,
          as: 'mother',
          where: {
            [Op.or]: [
              { firstName: { [Op.iLike]: `%${motherName}%` } },
              { lastName: { [Op.iLike]: `%${motherName}%` } },
            ],
          },
        });
      } else {
        include.push({
          model: Patient,
          as: 'mother',
        });
      }

      // Find birth records
      const { rows: births, count } = await Birth.findAndCountAll({
        where,
        include,
        limit,
        offset,
        order: [['birthDate', 'DESC'], ['birthTime', 'DESC']],
      });

      return {
        births,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get birth statistics
   * @param {Object} options - Query options
   * @returns {Object} Birth statistics
   */
  static async getBirthStatistics(options = {}) {
    try {
      const { 
        facilityId, 
        startDate = new Date(new Date().getFullYear(), 0, 1), // Default to start of current year
        endDate = new Date(), 
        lgaResidence 
      } = options;

      // Build where clause
      const where = {
        birthDate: {
          [Op.between]: [startDate, endDate],
        },
      };
      
      if (facilityId) where.facilityId = facilityId;
      if (lgaResidence) where.motherLgaResidence = lgaResidence;

      // Total births
      const totalBirths = await Birth.count({ where });

      // Births by gender
      const birthsByGender = await Birth.findAll({
        attributes: ['gender', [db.sequelize.fn('COUNT', '*'), 'count']],
        where,
        group: ['gender'],
        raw: true,
      });

      // Births by delivery method
      const birthsByDeliveryMethod = await Birth.findAll({
        attributes: ['deliveryMethod', [db.sequelize.fn('COUNT', '*'), 'count']],
        where,
        group: ['deliveryMethod'],
        raw: true,
      });

      // Births by birth type
      const birthsByBirthType = await Birth.findAll({
        attributes: ['birthType', [db.sequelize.fn('COUNT', '*'), 'count']],
        where,
        group: ['birthType'],
        raw: true,
      });

      // Births by LGA of residence
      const birthsByLgaResidence = await Birth.findAll({
        attributes: ['motherLgaResidence', [db.sequelize.fn('COUNT', '*'), 'count']],
        where,
        group: ['motherLgaResidence'],
        order: [[db.sequelize.literal('count'), 'DESC']],
        raw: true,
      });

      // Births by month
      const birthsByMonth = await Birth.findAll({
        attributes: [
          [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('birthDate')), 'month'],
          [db.sequelize.fn('COUNT', '*'), 'count'],
        ],
        where,
        group: [db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('birthDate'))],
        order: [[db.sequelize.fn('DATE_TRUNC', 'month', db.sequelize.col('birthDate')), 'ASC']],
        raw: true,
      });

      // Births by facility
      const birthsByFacility = await Birth.findAll({
        attributes: ['facilityId', [db.sequelize.fn('COUNT', '*'), 'count']],
        include: [
          {
            model: Facility,
            as: 'facility',
            attributes: ['name'],
          },
        ],
        where,
        group: ['facilityId', 'facility.id', 'facility.name'],
        order: [[db.sequelize.literal('count'), 'DESC']],
        raw: true,
      });

      // Complication rate
      const complicationsTotal = await Birth.count({
        where: {
          ...where,
          complications: {
            [Op.not]: null,
            [Op.ne]: '',
          },
        },
      });
      const complicationRate = totalBirths > 0 ? (complicationsTotal / totalBirths) * 100 : 0;

      // Resuscitation rate
      const resuscitationTotal = await Birth.count({
        where: {
          ...where,
          resuscitation: true,
        },
      });
      const resuscitationRate = totalBirths > 0 ? (resuscitationTotal / totalBirths) * 100 : 0;

      // Birth defect rate
      const birthDefectsTotal = await Birth.count({
        where: {
          ...where,
          birthDefects: {
            [Op.not]: null,
            [Op.ne]: '',
          },
        },
      });
      const birthDefectRate = totalBirths > 0 ? (birthDefectsTotal / totalBirths) * 100 : 0;

      // Average mother age
      const motherAgeData = await Birth.findOne({
        attributes: [[db.sequelize.fn('AVG', db.sequelize.col('motherAge')), 'averageAge']],
        where,
        raw: true,
      });
      const averageMotherAge = motherAgeData ? motherAgeData.averageAge : 0;

      // Average birth weight
      const birthWeightData = await Birth.findOne({
        attributes: [[db.sequelize.fn('AVG', db.sequelize.col('birthWeight')), 'averageWeight']],
        where: {
          ...where,
          birthWeight: {
            [Op.not]: null,
          },
        },
        raw: true,
      });
      const averageBirthWeight = birthWeightData ? birthWeightData.averageWeight : 0;

      return {
        totalBirths,
        birthsByGender,
        birthsByDeliveryMethod,
        birthsByBirthType,
        birthsByLgaResidence,
        birthsByMonth,
        birthsByFacility,
        complications: {
          total: complicationsTotal,
          rate: complicationRate,
        },
        resuscitation: {
          total: resuscitationTotal,
          rate: resuscitationRate,
        },
        birthDefects: {
          total: birthDefectsTotal,
          rate: birthDefectRate,
        },
        averageMotherAge,
        averageBirthWeight,
        dateRange: {
          startDate,
          endDate,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BirthService;