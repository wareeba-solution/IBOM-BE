// disease-case.model.js

'use strict';

module.exports = (sequelize, DataTypes) => {
  const DiseaseCase = sequelize.define('DiseaseCase', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    caseId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    diseaseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'DiseaseRegistry', // Changed from 'disease_registry'
        key: 'id',
      },
    },
    diseaseType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Direct disease type name for frontend compatibility',
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'id',
      },
    },
    patientName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Cached patient name for frontend compatibility',
    },
    facilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Facilities',
        key: 'id',
      },
    },
    reportDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    onsetDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    diagnosisDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    diagnosisType: {
      type: DataTypes.ENUM('Clinical', 'Laboratory', 'Epidemiological', 'Presumptive'),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Location of patient when diagnosed',
    },
    symptoms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('suspected', 'probable', 'confirmed', 'ruled_out'),
      allowNull: false,
      defaultValue: 'suspected',
    },
    severity: {
      type: DataTypes.ENUM('mild', 'moderate', 'severe'),
      allowNull: false,
      defaultValue: 'moderate',
    },
    outcome: {
      type: DataTypes.ENUM('under_treatment', 'recovered', 'hospitalized', 'death'),
      allowNull: false,
      defaultValue: 'under_treatment',
    },
    isOutbreak: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reportedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labTestType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labResult: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    labTestResults: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      comment: 'Detailed lab test results in JSON format',
    },
    hospitalized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hospitalName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    admissionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dischargeDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    outcomeDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    transmissionRoute: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transmissionLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    travelHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    treatmentProvided: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Treatment details',
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Treatment plan and prescriptions',
    },
    diagnosisNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    complications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reportedToAuthorities: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reportedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    caseStatus: {
      type: DataTypes.ENUM('Active', 'Resolved', 'Deceased', 'Lost to Follow-up'),
      allowNull: false,
      defaultValue: 'Active',
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
    tableName: 'DiseaseCases', // Changed from 'disease_cases'
    timestamps: true,
    paranoid: true,
  });

  DiseaseCase.associate = (models) => {
    DiseaseCase.belongsTo(models.DiseaseRegistry, {
      foreignKey: 'diseaseId',
      as: 'disease',
    });
    DiseaseCase.belongsTo(models.Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });
    DiseaseCase.belongsTo(models.Facility, {
      foreignKey: 'facilityId',
      as: 'facility',
    });
    DiseaseCase.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
    DiseaseCase.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater',
    });
    DiseaseCase.hasMany(models.ContactTracing, {
      foreignKey: 'diseaseCaseId',
      as: 'contacts',
    });
  };

  return DiseaseCase;
};