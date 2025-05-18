// src/models/DeathStatistic.js

module.exports = (sequelize, DataTypes) => {
  const DeathStatistic = sequelize.define('DeathStatistic', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Keep existing relationships
    patientId: {
      type: DataTypes.UUID,
      allowNull: true, // Made optional
      references: {
        model: 'Patients',
        key: 'id',
      },
    },
    facilityId: {
      type: DataTypes.UUID,
      allowNull: true, // Made optional
      references: {
        model: 'Facilities',
        key: 'id',
      },
    },
    
    // FRONTEND FIELDS (same names as in frontend)
    deceased_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_of_death: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    age_at_death: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    place_of_death: {
      type: DataTypes.ENUM('Hospital', 'Home', 'Other'),
      allowNull: false,
    },
    hospital_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cause_of_death: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secondary_causes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    manner_of_death: {
      type: DataTypes.ENUM('Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined'),
      allowNull: false,
    },
    doctor_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    doctor_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    informant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    informant_relationship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    informant_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    informant_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    registration_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'registered'),
      allowNull: false,
      defaultValue: 'registered',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
    // KEEP ORIGINAL FIELDS FOR COMPATIBILITY
    dateOfDeath: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    timeOfDeath: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    placeOfDeath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    primaryCauseOfDeath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondaryCauseOfDeath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certificateNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    certifiedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certifierDesignation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mannerOfDeath: {
      type: DataTypes.ENUM('Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined', 'Pending Investigation'),
      allowNull: true,
    },
    autopsyPerformed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    autopsyFindings: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
    // Audit fields
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    tableName: 'death_statistics',
    timestamps: true,
    hooks: {
      beforeSave: (instance) => {
        // Sync frontend fields to backend fields for compatibility
        if (instance.date_of_death) {
          instance.dateOfDeath = instance.date_of_death;
        }
        if (instance.place_of_death) {
          instance.placeOfDeath = instance.place_of_death;
        }
        if (instance.cause_of_death) {
          instance.primaryCauseOfDeath = instance.cause_of_death;
        }
        if (instance.secondary_causes) {
          instance.secondaryCauseOfDeath = instance.secondary_causes;
        }
        if (instance.manner_of_death) {
          instance.mannerOfDeath = instance.manner_of_death;
        }
        if (instance.doctor_name) {
          instance.certifiedBy = instance.doctor_name;
        }
        if (instance.doctor_id) {
          instance.certifierDesignation = instance.doctor_id;
        }
        if (instance.registration_number) {
          instance.certificateNumber = instance.registration_number;
        }
      }
    }
  });

  DeathStatistic.associate = (models) => {
    if (models.Patient) {
      DeathStatistic.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient',
      });
    }
    if (models.Facility) {
      DeathStatistic.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'facility',
      });
    }
    DeathStatistic.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
    DeathStatistic.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater',
    });
  };

  return DeathStatistic;
};