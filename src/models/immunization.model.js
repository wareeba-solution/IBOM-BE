// src/models/immunization.model.js

module.exports = (sequelize, DataTypes) => {
    const Immunization = sequelize.define('Immunization', {
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
      vaccineType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vaccineName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      doseNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      batchNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      administrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      administeredBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      administrationSite: {
        type: DataTypes.ENUM('Left Arm', 'Right Arm', 'Left Thigh', 'Right Thigh', 'Oral', 'Intranasal', 'Other'),
        allowNull: false,
      },
      administrationRoute: {
        type: DataTypes.ENUM('Intramuscular', 'Subcutaneous', 'Intradermal', 'Oral', 'Intranasal', 'Other'),
        allowNull: false,
      },
      dosage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sideEffects: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      nextDoseDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Scheduled', 'Administered', 'Missed', 'Cancelled'),
        defaultValue: 'Administered',
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
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
      tableName: 'immunizations',
      timestamps: true,
      paranoid: true, // This enables soft delete
    });
  
    Immunization.associate = (models) => {
      Immunization.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient',
      });
      Immunization.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'facility',
      });
      Immunization.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });
      Immunization.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });
    };
  
    return Immunization;
  };