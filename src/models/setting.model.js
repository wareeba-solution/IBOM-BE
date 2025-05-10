// src/models/setting.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Setting = sequelize.define('Setting', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'date'),
      allowNull: false,
      defaultValue: 'string'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isSystemSetting: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastModifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    indexes: [
      { fields: ['key'], unique: true },
      { fields: ['category'] }
    ]
  });

  Setting.associate = (models) => {
    Setting.belongsTo(models.User, { foreignKey: 'lastModifiedBy', as: 'modifier' });
  };

  return Setting;
};