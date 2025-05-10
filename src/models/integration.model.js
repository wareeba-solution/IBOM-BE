// src/models/integration.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Integration = sequelize.define('Integration', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('import', 'export', 'api', 'webhook'),
      allowNull: false
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    authConfig: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'error'),
      allowNull: false,
      defaultValue: 'inactive'
    },
    lastRunAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastRunStatus: {
      type: DataTypes.ENUM('success', 'partial', 'failed'),
      allowNull: true
    },
    lastErrorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    scheduleConfig: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['createdBy'] }
    ]
  });

  Integration.associate = (models) => {
    Integration.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return Integration;
};