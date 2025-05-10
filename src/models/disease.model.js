// src/models/disease.model.js

module.exports = (sequelize, DataTypes) => {
    // Disease Registry (for list of diseases being tracked)
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
      icdCode: { // International Classification of Diseases code
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
      notifiable: { // Whether the disease must be reported to health authorities
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      incubationPeriodMin: { // Minimum incubation period (in days)
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      incubationPeriodMax: { // Maximum incubation period (in days)
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
      tableName: 'disease_registry',
      timestamps: true,
    });
  
    // Disease Cases (instances of diseases reported)
    const DiseaseCase = sequelize.define('DiseaseCase', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      diseaseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'disease_registry',
          key: 'id',
        },
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
      reportingDate: {
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
      symptoms: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      labTestResults: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      severity: {
        type: DataTypes.ENUM('Mild', 'Moderate', 'Severe', 'Critical'),
        allowNull: false,
      },
      hospitalized: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hospitalizationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dischargeDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      outcome: {
        type: DataTypes.ENUM('Recovered', 'Recovering', 'Deceased', 'Unknown', 'Lost to Follow-up'),
        allowNull: false,
        defaultValue: 'Unknown',
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
      status: {
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
      tableName: 'disease_cases',
      timestamps: true,
      paranoid: true, // This enables soft delete
    });
  
    // Contact Tracing model
    const ContactTracing = sequelize.define('ContactTracing', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      diseaseCaseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'disease_cases',
          key: 'id',
        },
      },
      contactType: {
        type: DataTypes.ENUM('Household', 'Workplace', 'Healthcare', 'Social', 'Travel', 'Other'),
        allowNull: false,
      },
      contactName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      exposureDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      exposureDuration: { // in minutes
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      exposureLocation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      relationshipToPatient: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      riskAssessment: {
        type: DataTypes.ENUM('High', 'Medium', 'Low', 'Unknown'),
        allowNull: false,
        defaultValue: 'Unknown',
      },
      monitoringStatus: {
        type: DataTypes.ENUM('Not Started', 'Ongoing', 'Completed', 'Lost to Follow-up'),
        allowNull: false,
        defaultValue: 'Not Started',
      },
      symptomDevelopment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      symptomOnsetDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      testedStatus: {
        type: DataTypes.ENUM('Not Tested', 'Pending', 'Positive', 'Negative'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      testDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      monitoringEndDate: {
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
      tableName: 'contact_tracing',
      timestamps: true,
      paranoid: true, // This enables soft delete
    });
  
    // Define model associations
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
  
    ContactTracing.associate = (models) => {
      ContactTracing.belongsTo(models.DiseaseCase, {
        foreignKey: 'diseaseCaseId',
        as: 'diseaseCase',
      });
      ContactTracing.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });
      ContactTracing.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });
    };
  
    return { DiseaseRegistry, DiseaseCase, ContactTracing };
  };