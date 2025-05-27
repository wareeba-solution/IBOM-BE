// src/models/familyPlanningService.model.js

module.exports = (sequelize, DataTypes) => {
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
          model: 'FamilyPlanningClients',
          key: 'id',
        },
      },
      methodId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'FamilyPlanningMethods',
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
          model: 'FamilyPlanningMethods',
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
      tableName: 'FamilyPlanningServices',
      timestamps: true,
      paranoid: true, // This enables soft delete
    });
  
    // Define model associations
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
  
    return FamilyPlanningService;
  };