/**
 * Device Service
 * Handles mobile device registration, management and authentication
 */

const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../../models');
const config = require('../../config');
const helpers = require('../../utils/helpers');

const Device = db.Device;
const User = db.User;

/**
 * Device service for managing mobile devices
 */
class DeviceService {
  /**
   * Register a new device
   * @param {Object} deviceData - Device data
   * @param {String} userId - User ID
   * @returns {Object} Registered device
   */
  static async registerDevice(deviceData, userId) {
    try {
      // Check if user exists
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Generate device ID if not provided
      if (!deviceData.deviceId) {
        deviceData.deviceId = `${deviceData.deviceType}-${uuidv4()}`;
      }
      
      // Check if device is already registered
      const existingDevice = await Device.findOne({
        where: {
          deviceId: deviceData.deviceId,
          userId,
        },
      });
      
      if (existingDevice) {
        // Update existing device
        await existingDevice.update({
          ...deviceData,
          lastSync: new Date(),
        });
        
        return existingDevice;
      }
      
      // Generate device secret for API authentication
      const deviceSecret = crypto.randomBytes(32).toString('hex');
      
      // Create new device
      const device = await Device.create({
        ...deviceData,
        userId,
        deviceSecret,
        isActive: true,
        lastSync: new Date(),
      });
      
      return device;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all devices for a user
   * @param {String} userId - User ID
   * @returns {Array} List of devices
   */
  static async getUserDevices(userId) {
    try {
      const devices = await Device.findAll({
        where: { userId },
        order: [['lastSync', 'DESC']],
      });
      
      return devices;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get device by ID
   * @param {String} deviceId - Device ID
   * @returns {Object} Device
   */
  static async getDeviceById(deviceId) {
    try {
      const device = await Device.findOne({
        where: { deviceId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'firstName', 'lastName'],
          },
        ],
      });
      
      if (!device) {
        throw new Error('Device not found');
      }
      
      return device;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deactivate a device
   * @param {String} deviceId - Device ID
   * @param {String} userId - User ID
   * @returns {Boolean} Success status
   */
  static async deactivateDevice(deviceId, userId) {
    try {
      const device = await Device.findOne({
        where: {
          deviceId,
          userId,
        },
      });
      
      if (!device) {
        throw new Error('Device not found');
      }
      
      await device.update({ isActive: false });
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Activate a device
   * @param {String} deviceId - Device ID
   * @param {String} userId - User ID
   * @returns {Boolean} Success status
   */
  static async activateDevice(deviceId, userId) {
    try {
      const device = await Device.findOne({
        where: {
          deviceId,
          userId,
        },
      });
      
      if (!device) {
        throw new Error('Device not found');
      }
      
      await device.update({ isActive: true });
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a device
   * @param {String} deviceId - Device ID
   * @param {String} userId - User ID
   * @returns {Boolean} Success status
   */
  static async deleteDevice(deviceId, userId) {
    try {
      const device = await Device.findOne({
        where: {
          deviceId,
          userId,
        },
      });
      
      if (!device) {
        throw new Error('Device not found');
      }
      
      await device.destroy();
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update device sync timestamp
   * @param {String} deviceId - Device ID
   * @returns {Boolean} Success status
   */
  static async updateSyncTimestamp(deviceId) {
    try {
      const device = await Device.findOne({
        where: { deviceId },
      });
      
      if (!device) {
        throw new Error('Device not found');
      }
      
      await device.update({ lastSync: new Date() });
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate device token for API authentication
   * @param {String} deviceId - Device ID
   * @param {String} deviceSecret - Device secret
   * @returns {String} JWT token
   */
  static async generateDeviceToken(deviceId, deviceSecret) {
    try {
      // Find device by ID and secret
      const device = await Device.findOne({
        where: {
          deviceId,
          deviceSecret,
          isActive: true,
        },
      });
      
      if (!device) {
        throw new Error('Invalid device credentials');
      }
      
      // Get user associated with device
      const user = await User.findByPk(device.userId);
      
      if (!user || user.status !== 'active') {
        throw new Error('User account is not active');
      }
      
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          deviceId: device.deviceId,
          type: 'device',
        },
        config.jwt.secret,
        {
          expiresIn: config.jwt.deviceExpiresIn || '30d',
        }
      );
      
      // Update last sync timestamp
      await device.update({ lastSync: new Date() });
      
      return token;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate device token
   * @param {String} token - JWT token
   * @returns {Object} Decoded token payload
   */
  static async validateDeviceToken(token) {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Check if token is a device token
      if (decoded.type !== 'device') {
        throw new Error('Invalid token type');
      }
      
      // Check if device exists and is active
      const device = await Device.findOne({
        where: {
          deviceId: decoded.deviceId,
          isActive: true,
        },
      });
      
      if (!device) {
        throw new Error('Device not found or inactive');
      }
      
      // Check if user exists and is active
      const user = await User.findByPk(decoded.id);
      
      if (!user || user.status !== 'active') {
        throw new Error('User account is not active');
      }
      
      return {
        user,
        device,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      
      throw error;
    }
  }

  /**
   * Get device statistics
   * @returns {Object} Device statistics
   */
  static async getDeviceStatistics() {
    try {
      // Total registered devices
      const totalDevices = await Device.count();
      
      // Active devices
      const activeDevices = await Device.count({
        where: { isActive: true },
      });
      
      // Devices by type
      const devicesByType = await Device.findAll({
        attributes: [
          'deviceType',
          [db.sequelize.fn('COUNT', '*'), 'count'],
        ],
        group: ['deviceType'],
        raw: true,
      });
      
      // Recently active devices (last 7 days)
      const recentlyActiveDevices = await Device.count({
        where: {
          lastSync: {
            [db.Sequelize.Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });
      
      // Devices by OS
      const devicesByOS = await Device.findAll({
        attributes: [
          'osVersion',
          [db.sequelize.fn('COUNT', '*'), 'count'],
        ],
        group: ['osVersion'],
        raw: true,
      });
      
      return {
        totalDevices,
        activeDevices,
        devicesByType,
        recentlyActiveDevices,
        devicesByOS,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DeviceService;