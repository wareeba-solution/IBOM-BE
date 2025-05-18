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
    
    // NEW FIELDS FROM FRONTEND
    providerId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'ID of the healthcare provider administering the vaccine'
    },
    weightKg: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Patient weight in kilograms at time of immunization'
    },
    heightCm: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Patient height in centimeters at time of immunization'
    },
    ageMonths: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Patient age in months at time of immunization'
    },
    
    // Audit fields
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
    tableName: 'Immunizations',
    timestamps: true,
    paranoid: true, // This enables soft delete
    hooks: {
      beforeValidate: async (immunization, options) => {
        // Calculate age in months if we have the patient's date of birth
        if (!immunization.ageMonths && immunization.patientId) {
          try {
            const patient = await sequelize.models.Patient.findByPk(immunization.patientId);
            if (patient && patient.dateOfBirth) {
              const birthDate = new Date(patient.dateOfBirth);
              const vaccDate = immunization.administrationDate || new Date();
              
              // Calculate months between dates
              const ageMonths = 
                (vaccDate.getFullYear() - birthDate.getFullYear()) * 12 + 
                (vaccDate.getMonth() - birthDate.getMonth());
                
              immunization.ageMonths = ageMonths;
            }
          } catch (error) {
            console.error('Error calculating age in months:', error);
          }
        }
      }
    }
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