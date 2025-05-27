// src/models/familyPlanningClient.model.js

module.exports = (sequelize, DataTypes) => {
    const FamilyPlanningClient = sequelize.define('FamilyPlanningClient', {
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
      tableName: 'FamilyPlanningClients',
      timestamps: true,
      paranoid: true, // This enables soft delete
    });
  
    // Define model associations
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
  
    return FamilyPlanningClient;
  };