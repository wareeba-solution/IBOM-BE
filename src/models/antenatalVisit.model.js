// src/models/antenatalVisit.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const AntenatalVisit = sequelize.define('AntenatalVisit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    antenatalCareId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'AntenatalCare',
        key: 'id',
      },
    },
    visitDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gestationalAge: { // in weeks
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: { // in kg
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    bloodPressure: {
      type: DataTypes.STRING, // Format: "systolic/diastolic", e.g., "120/80"
      allowNull: false,
    },
    fetalHeartRate: { // beats per minute
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fetalMovement: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Checked',
    },
    fundusHeight: { // in cm
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    presentation: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Determined',
    },
    urineProtein: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    urineGlucose: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hemoglobin: { // g/dL
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    complaints: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nextAppointment: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'AntenatalVisit',
    timestamps: true,
    paranoid: true, // This enables soft delete
  });

  AntenatalVisit.associate = (models) => {
    AntenatalVisit.belongsTo(models.AntenatalCare, {
      foreignKey: 'antenatalCareId',
      as: 'antenatalCare',
    });
    AntenatalVisit.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
    AntenatalVisit.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater',
    });
  };

  return AntenatalVisit;
};