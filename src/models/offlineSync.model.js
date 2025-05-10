// src/models/offlineSync.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OfflineSync = sequelize.define('OfflineSync', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'DeviceRegistrations',
        key: 'deviceId'
      }
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type of entity being synced (Patient, Birth, etc.)'
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'ID of the entity in the local database'
    },
    operation: {
      type: DataTypes.ENUM('create', 'update', 'delete'),
      allowNull: false
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Data to be synced'
    },
    serverEntityId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of the entity in the server database after sync'
    },
    syncStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'conflict'),
      defaultValue: 'pending',
      allowNull: false
    },
    syncDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    conflictResolution: {
      type: DataTypes.ENUM('local', 'server', 'merged', 'none'),
      allowNull: true
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
    indexes: [
      { fields: ['deviceId'] },
      { fields: ['entityType', 'entityId'] },
      { fields: ['syncStatus'] },
      { fields: ['userId'] }
    ]
  });

  OfflineSync.associate = (models) => {
    OfflineSync.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return OfflineSync;
};