const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../../config');
const db = require('../../models');

const User = db.User;
const Role = db.Role;
const Facility = db.Facility;
const RefreshToken = db.RefreshToken || db.sequelize.define('RefreshToken', {
  token: {
    type: db.Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  expiresAt: {
    type: db.Sequelize.DATE,
    allowNull: false
  }
}, {
  tableName: 'RefreshTokens'
});


/**
 * Authentication service
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Object} Registered user
   */
  static async register(userData) {
    try {
      // Ensure all required fields are present
      // If userData has a name field instead of firstName and lastName, parse it
      if (userData.name && (!userData.firstName || !userData.lastName)) {
        const nameParts = userData.name.split(' ');
        userData.firstName = nameParts[0];
        userData.lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        delete userData.name;
      }
      
      // Generate a username from email if not provided
      if (!userData.username && userData.email) {
        userData.username = userData.email.split('@')[0].toLowerCase();
      }
      
      // Look up roleId by name if position is provided but roleId is not
      if (userData.position && !userData.roleId) {
        const role = await Role.findOne({
          where: {
            name: {
              [db.Sequelize.Op.iLike]: `%${userData.position}%`
            }
          }
        });
        
        if (role) {
          userData.roleId = role.id;
        }
      }
      
      // Look up facilityId by name if facility_name is provided but facilityId is not
      if (userData.facility_name && !userData.facilityId) {
        const facility = await Facility.findOne({
          where: {
            name: {
              [db.Sequelize.Op.iLike]: `%${userData.facility_name}%`
            }
          }
        });
        
        if (facility) {
          userData.facilityId = facility.id;
        }
      }

      // Create user
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber || userData.phone,
        roleId: userData.roleId,
        facilityId: userData.facilityId,
        status: 'pending' // All new registrations start as pending
      });

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
        attributes: { exclude: ['password'] },
      });

      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   * @param {String} email - User email
   * @param {String} password - Password
   * @returns {Object} User and token
   */
  static async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({
        where: { email },
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
      });

      // Check if user exists
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new Error('Account is not active');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate token
      const accessToken = this.generateToken(user);
      const refreshToken = await this.generateRefreshToken(user.id);

      // Return user and token
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role ? user.role.name : null,
          facility: user.facility ? user.facility.name : null,
          facilityId: user.facilityId,
          status: user.status,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate JWT token
   * @param {Object} user - User object
   * @returns {String} JWT token
   */
  static generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role ? user.role.name : null,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: '24h',
    });
  }

  /**
   * Request password reset
   * @param {String} email - User email
   * @returns {Object} Reset token and expiry
   */
  static async requestPasswordReset(email) {
    try {
      // Find user
      const user = await User.findOne({ where: { email } });

      // Check if user exists
      if (!user) {
        throw new Error('User not found with this email');
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Update user with reset token
      await user.update({
        resetToken,
        resetTokenExpiry,
      });

      return {
        resetToken,
        resetTokenExpiry,
        email: user.email,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password
   * @param {String} token - Reset token
   * @param {String} password - New password
   * @returns {Boolean} Success status
   */
  static async resetPassword(token, password) {
    try {
      // Find user with valid reset token
      const user = await User.findOne({
        where: {
          resetToken: token,
          resetTokenExpiry: { [db.Sequelize.Op.gt]: new Date() },
        },
      });

      // Check if user exists
      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password and clear reset token
      await user.update({
        password,
        resetToken: null,
        resetTokenExpiry: null,
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update password
   * @param {String} userId - User ID
   * @param {String} currentPassword - Current password
   * @param {String} newPassword - New password
   * @returns {Boolean} Success status
   */
  static async updatePassword(userId, currentPassword, newPassword) {
    try {
      // Find user
      const user = await User.findByPk(userId);

      // Check if user exists
      if (!user) {
        throw new Error('User not found');
      }

      // Check current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      await user.update({ password: newPassword });

      return true;
    } catch (error) {
      throw error;
    }
  }



  /**
   * Generate refresh token
   * @param {Number} userId - User ID
   * @returns {String} Refresh token
   */
  static async generateRefreshToken(userId) {
    try {
      // Remove any existing refresh tokens for this user
      await RefreshToken.destroy({ where: { userId } });
      
      // Generate new refresh token
      const refreshToken = crypto.randomBytes(40).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry for refresh token
      
      // Save refresh token to database
      await RefreshToken.create({
        token: refreshToken,
        userId,
        expiresAt
      });
      
      return refreshToken;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {String} refreshToken - Refresh token
   * @returns {Object} New access token and user info
   */
  static async refreshToken(refreshToken) {
    try {
      // Find refresh token in database
      const foundToken = await RefreshToken.findOne({
        where: {
          token: refreshToken,
          expiresAt: { [db.Sequelize.Op.gt]: new Date() }
        }
      });
      
      if (!foundToken) {
        throw new Error('Invalid or expired refresh token');
      }
      
      // Get user
      const user = await User.findByPk(foundToken.userId, {
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
      });
      
      if (!user || user.status !== 'active') {
        throw new Error('User not found or inactive');
      }
      
      // Generate new access token
      const accessToken = this.generateToken(user);
      
      // Return new access token and user info
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role ? user.role.name : null,
          facility: user.facility ? user.facility.name : null,
          facilityId: user.facilityId,
          status: user.status,
        },
        accessToken
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user - invalidate refresh token
   * @param {String} refreshToken - Refresh token to invalidate
   * @returns {Boolean} Success status
   */
  static async logout(refreshToken) {
    try {
      if (!refreshToken) return true;
      
      // Delete refresh token from database
      await RefreshToken.destroy({
        where: { token: refreshToken }
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  }


}

module.exports = AuthService;