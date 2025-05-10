// src/api/services/device.service.js
const { DeviceRegistration, User } = require('../../models');
const AppError = require('../../utils/appError');

class DeviceService {
  async registerDevice(deviceData, userId) {
    try {
      // Check if device already exists
      const existingDevice = await DeviceRegistration.findOne({
        where: { deviceId: deviceData.deviceId }
      });

      if (existingDevice) {
        // Update existing device registration
        await existingDevice.update({
          ...deviceData,
          userId,
          status: 'active'
        });
        return existingDevice;
      }

      // Create new device registration
      const device = await DeviceRegistration.create({
        ...deviceData,
        userId
      });

      return device;
    } catch (error) {
      throw new AppError(`Device registration failed: ${error.message}`, 500);
    }
  }

  async getDeviceById(deviceId) {
    const device = await DeviceRegistration.findOne({
      where: { deviceId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!device) {
      throw new AppError('Device not found', 404);
    }

    return device;
  }

  async updateDevice(deviceId, updateData, userId) {
    const device = await this.getDeviceById(deviceId);

    // Check if user has permission to update this device
    if (device.userId !== userId) {
      throw new AppError('You do not have permission to update this device', 403);
    }

    await device.update(updateData);
    return device;
  }

  async deactivateDevice(deviceId, userId) {
    const device = await this.getDeviceById(deviceId);

    // Check if user has permission to deactivate this device
    if (device.userId !== userId && !isAdmin(userId)) {
      throw new AppError('You do not have permission to deactivate this device', 403);
    }

    await device.update({ status: 'revoked' });
    return { success: true };
  }

  async getUserDevices(userId) {
    const devices = await DeviceRegistration.findAll({
      where: { userId },
      order: [['lastSyncDate', 'DESC']]
    });

    return devices;
  }

  async updateLastSyncDate(deviceId, syncDate = new Date()) {
    await DeviceRegistration.update(
      { lastSyncDate: syncDate },
      { where: { deviceId } }
    );
  }
}

// Helper function to check if user is admin
async function isAdmin(userId) {
  const user = await User.findByPk(userId);
  return user && user.role === 'admin';
}

module.exports = new DeviceService();