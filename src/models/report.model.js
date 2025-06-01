// src/models/report.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Report = sequelize.define('Report', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('standard', 'custom'),
      allowNull: false,
      defaultValue: 'standard'
    },
    category: {
      type: DataTypes.ENUM('maternal', 'child', 'disease', 'facility', 'summary'),
      allowNull: false
    },
    parameters: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    query: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    lastRunAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true // Soft deletes
  });

  Report.associate = (models) => {
    Report.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator', onDelete: 'SET NULL',onUpdate: 'CASCADE' });
  };

  return Report;
};