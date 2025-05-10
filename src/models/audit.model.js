// src/models/audit.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Audit = sequelize.define('Audit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entityId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    oldValues: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    newValues: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
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
      { fields: ['action'] },
      { fields: ['entityType'] },
      { fields: ['entityId'] },
      { fields: ['userId'] },
      { fields: ['createdAt'] }
    ]
  });

  Audit.associate = (models) => {
    Audit.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Audit;
};