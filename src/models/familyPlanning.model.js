// src/models/familyPlanning.model.js

module.exports = (sequelize, DataTypes) => {
    // Family Planning Method Registry
    const FamilyPlanningMethod = sequelize.define('FamilyPlanningMethod', {
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
      category: {
        type: DataTypes.ENUM(
          'Hormonal', 
          'Barrier', 
          'Long-Acting Reversible', 
          'Permanent', 
          'Fertility Awareness', 
          'Emergency', 
          'Other'
        ),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      effectiveness: {
        type: DataTypes.FLOAT, // Percentage (0-100)
        allowNull: true,
      },
      duration: {
        type: DataTypes.STRING, // e.g., "3 months", "5 years", "Permanent"
        allowNull: true,
      },
      sideEffects: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      contraindications: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      advantages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      disadvantages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
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
      tableName: 'family_planning_methods',
      timestamps: true,
    });
  
    // Client Family Planning Record
    const FamilyPlanningClient = sequelize.define('family_planning_clients', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      clientType: {
        type: DataTypes.ENUM('New Acceptor', 'Continuing User', 'Restart'),
        allowNull: false,
      },
      maritalStatus: {
        type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Other'),
        allowNull: false,
      },
      numberOfChildren: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      desiredNumberOfChildren: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      educationLevel: {
        type: DataTypes.ENUM('None', 'Primary', 'Secondary', 'Tertiary', 'Unknown'),
        allowNull: true,
        defaultValue: 'Unknown',
      },
      occupation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      primaryContact: { // Partner or next of kin info
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      medicalHistory: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      allergyHistory: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reproductiveHistory: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      menstrualHistory: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      referredBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Transferred', 'Lost to Follow-up'),
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
      tableName: 'family_planning_clients',
      timestamps: true,
      paranoid: true, // This enables soft delete
    });
  
    // Family Planning Service Record
    const FamilyPlanningService = sequelize.define('FamilyPlanningService', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'family_planning_clients',
          key: 'id',
        },
      },
      methodId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'family_planning_methods',
          key: 'id',
        },
      },
      serviceDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      serviceType: {
        type: DataTypes.ENUM(
          'Initial Adoption', 
          'Method Switch', 
          'Resupply', 
          'Follow-up', 
          'Counseling', 
          'Removal', 
          'Other'
        ),
        allowNull: false,
      },
      previousMethodId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'family_planning_methods',
          key: 'id',
        },
      },
      switchReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      batchNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      providedBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT, // in kg
        allowNull: true,
      },
      bloodPressure: {
        type: DataTypes.STRING, // Format: systolic/diastolic, e.g., "120/80"
        allowNull: true,
      },
      sideEffectsReported: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      sideEffectsManagement: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      counselingNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      nextAppointment: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      discontinuationReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      procedureNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      patientSatisfaction: {
        type: DataTypes.ENUM('Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied', 'Not Recorded'),
        allowNull: false,
        defaultValue: 'Not Recorded',
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
      tableName: 'family_planning_services',
      timestamps: true,
      paranoid: true, // This enables soft delete
    });
  
    // Define model associations
    FamilyPlanningMethod.associate = (models) => {
      FamilyPlanningMethod.hasMany(models.FamilyPlanningService, {
        foreignKey: 'methodId',
        as: 'services',
      });
      FamilyPlanningMethod.hasMany(models.FamilyPlanningService, {
        foreignKey: 'previousMethodId',
        as: 'switchedFromServices',
      });
      FamilyPlanningMethod.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });
      FamilyPlanningMethod.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });
    };
  
    FamilyPlanningClient.associate = (models) => {
      FamilyPlanningClient.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient',
      });
      FamilyPlanningClient.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'facility',
      });
      FamilyPlanningClient.hasMany(models.FamilyPlanningService, {
        foreignKey: 'clientId',
        as: 'services',
      });
      FamilyPlanningClient.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });
      FamilyPlanningClient.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });
    };
  
    FamilyPlanningService.associate = (models) => {
      FamilyPlanningService.belongsTo(models.FamilyPlanningClient, {
        foreignKey: 'clientId',
        as: 'client',
      });
      FamilyPlanningService.belongsTo(models.FamilyPlanningMethod, {
        foreignKey: 'methodId',
        as: 'method',
      });
      FamilyPlanningService.belongsTo(models.FamilyPlanningMethod, {
        foreignKey: 'previousMethodId',
        as: 'previousMethod',
      });
      FamilyPlanningService.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });
      FamilyPlanningService.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });
    };
  
    return { FamilyPlanningMethod, FamilyPlanningClient, FamilyPlanningService };
  };