module.exports = (sequelize, DataTypes) => {
  const Visit = sequelize.define('Visit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    visitDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    visitType: {
      type: DataTypes.STRING, // Changed from ENUM to STRING
      allowNull: false,
      validate: {
        // Still validate the values in the application layer
        isIn: {
          args: [['general', 'antenatal', 'immunization', 'family_planning',
            'birth', 'death', 'communicable_disease', 'follow_up']],
          msg: 'Invalid visit type'
        }
      }
    },
    chiefComplaint: {
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
    followUpNeeded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    followUpDate: {
      type: DataTypes.DATEONLY, // Using DATEONLY instead of DATE for follow-up
      allowNull: true,
    },
    // Added additional fields
    vitalSigns: {
      type: DataTypes.JSONB, // For storing BP, temperature, pulse, etc.
      allowNull: true,
    },
    prescriptions: {
      type: DataTypes.JSONB, // For storing medications
      allowNull: true,
    },
    labResults: {
      type: DataTypes.JSONB, // For storing lab test results
      allowNull: true,
    },
    referral: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    referralFacility: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referralReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: {
          args: [['active', 'completed', 'cancelled', 'no-show']],
          msg: 'Invalid visit status'
        }
      }
    }
  }, {
    timestamps: true,
    paranoid: true, // Added soft delete capability
  });

  Visit.associate = (models) => {
    Visit.belongsTo(models.Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });
    Visit.belongsTo(models.Facility, {
      foreignKey: 'facilityId',
      as: 'facility',
    });
    Visit.belongsTo(models.User, {
      foreignKey: 'attendedBy',
      as: 'caregiver',
    });
  };

  return Visit;
};