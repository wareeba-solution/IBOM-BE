// src/models/deviceRegistration.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeviceRegistration = sequelize.define('DeviceRegistration', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    deviceName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deviceType: {
      type: DataTypes.ENUM('android', 'ios', 'web'),
      allowNull: false
    },
    osVersion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    appVersion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pushToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastSyncDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'revoked'),
      defaultValue: 'active',
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    paranoid: true
  });

  DeviceRegistration.associate = (models) => {
    DeviceRegistration.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return DeviceRegistration;
};