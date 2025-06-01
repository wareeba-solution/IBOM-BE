// disease-registry.model.js

'use strict';

module.exports = (sequelize, DataTypes) => {
  const DiseaseRegistry = sequelize.define('DiseaseRegistry', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icdCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    symptoms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    transmissionRoutes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    preventiveMeasures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    treatmentGuidelines: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notifiable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    incubationPeriodMin: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    incubationPeriodMax: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    tableName: 'DiseaseRegistry', // Changed from 'disease_registry'
    timestamps: true,
  });

  DiseaseRegistry.associate = (models) => {
    DiseaseRegistry.hasMany(models.DiseaseCase, {
      foreignKey: 'diseaseId',
      as: 'cases',
    });
    DiseaseRegistry.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
    DiseaseRegistry.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater',
    });
  };

  return DiseaseRegistry;
};