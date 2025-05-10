const db = require('../../models');

const User = db.User;
const Role = db.Role;
const Facility = db.Facility;

/**
 * User service
 */
class UserService {
  /**
   * Get all users
   * @param {Object} options - Query options
   * @returns {Array} List of users
   */
  static async getAllUsers(options = {}) {
    try {
      const { page = 1, limit = 10, status, roleId, facilityId } = options;
      const offset = (page - 1) * limit;

      // Build where clause
      const where = {};
      if (status) where.status = status;
      if (roleId) where.roleId = roleId;
      if (facilityId) where.facilityId = facilityId;

      // Find users
      const { rows: users, count } = await User.findAndCountAll({
        where,
        include: [
          {
            model: Role,
            as: 'role',
          },
          {
            model: Facility,
            as: 'facility',
          },
        ],
        attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return {
        users,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {String} id - User ID
   * @returns {Object} User
   */
  static async getUserById(id) {
    try {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: 'role',
          },
          {
            model: Facility,
            as: 'facility',
          },
        ],
        attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} Created user
   */
  static async createUser(userData) {
    try {
      // Create user
      const user = await User.create(userData);

      // Get user with role and facility
      const createdUser = await User.findByPk(user.id, {
        include: [
          {
            model: Role,
            as: 'role',
          },
          {
            model: Facility,
            as: 'facility',
          },
        ],
        attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
      });

      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user
   * @param {String} id - User ID
   * @param {Object} userData - User data
   * @returns {Object} Updated user
   */
  static async updateUser(id, userData) {
    try {
      // Find user
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      // Update user
      await user.update(userData);

      // Get updated user with role and facility
      const updatedUser = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: 'role',
          },
          {
            model: Facility,
            as: 'facility',
          },
        ],
        attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user
   * @param {String} id - User ID
   * @returns {Boolean} Success status
   */
  static async deleteUser(id) {
    try {
      // Find user
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      // Delete user (soft delete)
      await user.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Activate user
   * @param {String} id - User ID
   * @returns {Object} Activated user
   */
  static async activateUser(id) {
    try {
      // Find user
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      // Activate user
      await user.update({ status: 'active' });

      // Get updated user
      const activatedUser = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: 'role',
          },
          {
            model: Facility,
            as: 'facility',
          },
        ],
        attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
      });

      return activatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deactivate user
   * @param {String} id - User ID
   * @returns {Object} Deactivated user
   */
  static async deactivateUser(id) {
    try {
      // Find user
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      // Deactivate user
      await user.update({ status: 'inactive' });

      // Get updated user
      const deactivatedUser = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: 'role',
          },
          {
            model: Facility,
            as: 'facility',
          },
        ],
        attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
      });

      return deactivatedUser;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;