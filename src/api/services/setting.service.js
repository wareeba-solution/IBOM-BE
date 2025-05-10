// src/api/services/setting.service.js
const { Setting, User, sequelize } = require('../../models');
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');

class SettingService {
  async createSetting(settingData, userId) {
    // Check if setting with this key already exists
    const existingSetting = await Setting.findOne({
      where: { key: settingData.key }
    });

    if (existingSetting) {
      throw new AppError(`Setting with key '${settingData.key}' already exists`, 400);
    }

    // Create new setting
    const setting = await Setting.create({
      ...settingData,
      lastModifiedBy: userId
    });

    return setting;
  }

  async getSettingById(id) {
    const setting = await Setting.findByPk(id, {
      include: [
        {
          model: User,
          as: 'modifier',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!setting) {
      throw new AppError('Setting not found', 404);
    }

    return setting;
  }

  async getSettingByKey(key) {
    const setting = await Setting.findOne({
      where: { key },
      include: [
        {
          model: User,
          as: 'modifier',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!setting) {
      throw new AppError(`Setting with key '${key}' not found`, 404);
    }

    return setting;
  }

  async updateSetting(id, updateData, userId) {
    const setting = await this.getSettingById(id);
    
    // Check if this is a system setting that can't be modified
    if (setting.isSystemSetting && !isAdmin(userId)) {
      throw new AppError('You do not have permission to modify system settings', 403);
    }
    
    await setting.update({
      ...updateData,
      lastModifiedBy: userId
    });
    
    return setting;
  }

  async updateSettingByKey(key, value, userId) {
    const setting = await this.getSettingByKey(key);
    
    // Check if this is a system setting that can't be modified
    if (setting.isSystemSetting && !isAdmin(userId)) {
      throw new AppError('You do not have permission to modify system settings', 403);
    }
    
    await setting.update({
      value,
      lastModifiedBy: userId
    });
    
    return setting;
  }

  async deleteSetting(id, userId) {
    const setting = await this.getSettingById(id);
    
    // Check if this is a system setting that can't be deleted
    if (setting.isSystemSetting && !isAdmin(userId)) {
      throw new AppError('You do not have permission to delete system settings', 403);
    }
    
    await setting.destroy();
    return { success: true };
  }

  async searchSettings(searchParams) {
    const { category, key, isSystemSetting, page, limit } = searchParams;
    
    const whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (key) {
      whereClause.key = { [Op.iLike]: `%${key}%` };
    }
    
    if (isSystemSetting !== undefined) {
      whereClause.isSystemSetting = isSystemSetting;
    }
    
    const offset = (page - 1) * limit;
    
    const { rows, count } = await Setting.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'modifier',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['category', 'ASC'], ['key', 'ASC']],
      limit,
      offset
    });
    
    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getSettingsByCategory(category) {
    const settings = await Setting.findAll({
      where: { category },
      order: [['key', 'ASC']]
    });
    
    return settings;
  }

  async getMultipleSettings(keys) {
    const settings = await Setting.findAll({
      where: {
        key: {
          [Op.in]: keys
        }
      }
    });
    
    // Convert to key-value object
    return settings.reduce((acc, setting) => {
      // Parse value based on type
      let parsedValue = setting.value;
      switch (setting.type) {
        case 'number':
          parsedValue = Number(setting.value);
          break;
        case 'boolean':
          parsedValue = setting.value === 'true';
          break;
        case 'json':
          try {
            parsedValue = JSON.parse(setting.value);
          } catch (e) {
            console.error(`Error parsing JSON for setting ${setting.key}:`, e);
          }
          break;
        case 'date':
          parsedValue = new Date(setting.value);
          break;
      }
      
      acc[setting.key] = parsedValue;
      return acc;
    }, {});
  }
}

// Helper function to check if user is admin
async function isAdmin(userId) {
  const user = await User.findByPk(userId);
  return user && user.role === 'admin';
}

module.exports = new SettingService();