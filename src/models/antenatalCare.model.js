// src/models/antenatalCare.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const AntenatalCare = sequelize.define('AntenatalCare', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Registration Information
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'id',
      },
    },
    facilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Facilities',
        key: 'id',
      },
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    
    // Basic Pregnancy Information
    lmp: { // Last Menstrual Period
      type: DataTypes.DATE,
      allowNull: false,
    },
    edd: { // Expected Delivery Date
      type: DataTypes.DATE,
      allowNull: false,
    },
    gravida: { // Number of pregnancies
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    para: { // Number of births
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    
    // Medical Information
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unknown',
    },
    height: { // in cm
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    prePregnancyWeight: { // in kg
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    
    // Medical Testing
    hivStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Tested',
    },
    sickling: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Tested',
    },
    hepatitisB: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Tested',
    },
    hepatitisC: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Tested',
    },
    vdrl: { // Venereal Disease Research Laboratory test
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Tested',
    },
    
    // Preventive Measures
    tetanusVaccination: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not received',
    },
    malariaProphylaxis: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not received',
    },
    ironFolateSupplementation: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not received',
    },
    
    // Risk Assessment
    riskFactors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    riskLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'low',
    },
    
    // Medical History
    medicalHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    obstetricsHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
    // Partner Information
    partner: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    
    // Emergency Contact Information
    emergencyContact: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    
    // Nearest Health Facility
    nearestHealthFacility: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    // Pregnancy Outcome
    outcome: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Ongoing',
    },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    modeOfDelivery: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Applicable',
    },
    birthOutcome: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    
    // Status
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Active',
    },
    
    // Tracking
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
    tableName: 'AntenatalCare',
    timestamps: true,
    paranoid: true, // This enables soft delete
  });

  AntenatalCare.associate = (models) => {
    AntenatalCare.belongsTo(models.Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });
    AntenatalCare.belongsTo(models.Facility, {
      foreignKey: 'facilityId',
      as: 'facility',
    });
    AntenatalCare.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
    AntenatalCare.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater',
    });
    AntenatalCare.hasMany(models.AntenatalVisit, {
      foreignKey: 'antenatalCareId',
      as: 'visits',
    });
  };

  return AntenatalCare;
};