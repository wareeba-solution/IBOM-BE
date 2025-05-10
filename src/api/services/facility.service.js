const db = require('../../models');

const Facility = db.Facility;
const User = db.User;

/**
 * Facility service
 */
class FacilityService {
  /**
   * Get all facilities
   * @param {Object} options - Query options
   * @returns {Array} List of facilities
   */
  static async getAllFacilities(options = {}) {
    try {
      const { page = 1, limit = 10, status, facilityType, lga } = options;
      const offset = (page - 1) * limit;

      // Build where clause
      const where = {};
      if (status) where.status = status;
      if (facilityType) where.facilityType = facilityType;
      if (lga) where.lga = lga;

      // Find facilities
      const { rows: facilities, count } = await Facility.findAndCountAll({
        where,
        limit,
        offset,
        order: [['name', 'ASC']],
      });

      return {
        facilities,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get facility by ID
   * @param {String} id - Facility ID
   * @returns {Object} Facility
   */
  static async getFacilityById(id) {
    try {
      const facility = await Facility.findByPk(id);

      if (!facility) {
        throw new Error('Facility not found');
      }

      return facility;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new facility
   * @param {Object} facilityData - Facility data
   * @returns {Object} Created facility
   */
  static async createFacility(facilityData) {
    try {
      // Check if facility name already exists
      const existingFacility = await Facility.findOne({
        where: { name: facilityData.name },
      });

      if (existingFacility) {
        throw new Error('Facility name already exists');
      }

      // Create facility
      const facility = await Facility.create(facilityData);

      return facility;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update facility
   * @param {String} id - Facility ID
   * @param {Object} facilityData - Facility data
   * @returns {Object} Updated facility
   */
  static async updateFacility(id, facilityData) {
    try {
      // Find facility
      const facility = await Facility.findByPk(id);

      if (!facility) {
        throw new Error('Facility not found');
      }

      // Check if facility name already exists (if name is being updated)
      if (facilityData.name && facilityData.name !== facility.name) {
        const existingFacility = await Facility.findOne({
          where: { name: facilityData.name },
        });

        if (existingFacility) {
          throw new Error('Facility name already exists');
        }
      }

      // Update facility
      await facility.update(facilityData);

      return facility;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete facility
   * @param {String} id - Facility ID
   * @returns {Boolean} Success status
   */
  static async deleteFacility(id) {
    try {
      // Find facility
      const facility = await Facility.findByPk(id);

      if (!facility) {
        throw new Error('Facility not found');
      }

      // Check if facility has users
      const userCount = await User.count({
        where: { facilityId: id },
      });

      if (userCount > 0) {
        throw new Error('Cannot delete facility with associated users');
      }

      // Delete facility
      await facility.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get facilities by LGA
   * @param {String} lga - LGA name
   * @returns {Array} List of facilities
   */
  static async getFacilitiesByLga(lga) {
    try {
      const facilities = await Facility.findAll({
        where: { lga, status: 'active' },
        order: [['name', 'ASC']],
      });

      return facilities;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get facilities by type
   * @param {String} facilityType - Facility type
   * @returns {Array} List of facilities
   */
  static async getFacilitiesByType(facilityType) {
    try {
      const facilities = await Facility.findAll({
        where: { facilityType, status: 'active' },
        order: [['name', 'ASC']],
      });

      return facilities;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Activate facility
   * @param {String} id - Facility ID
   * @returns {Object} Activated facility
   */
  static async activateFacility(id) {
    try {
      // Find facility
      const facility = await Facility.findByPk(id);

      if (!facility) {
        throw new Error('Facility not found');
      }

      // Activate facility
      await facility.update({ status: 'active' });

      return facility;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deactivate facility
   * @param {String} id - Facility ID
   * @returns {Object} Deactivated facility
   */
  static async deactivateFacility(id) {
    try {
      // Find facility
      const facility = await Facility.findByPk(id);

      if (!facility) {
        throw new Error('Facility not found');
      }

      // Deactivate facility
      await facility.update({ status: 'inactive' });

      return facility;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FacilityService;