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
        isIn: [['general', 'antenatal', 'immunization', 'family_planning',
          'birth', 'death', 'communicable_disease', 'follow_up']]
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
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  }, {
    timestamps: true,
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