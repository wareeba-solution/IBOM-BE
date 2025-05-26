module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    uniqueIdentifier: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Personal Information (Stage 1)
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherNames: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registrationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      
    },
    
    // Contact Details (Stage 2)
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lgaOrigin: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
    lgaResidence: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
    
    // Medical Information (Stage 3)
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
    genotype: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    chronicConditions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    medicalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
    
    // Emergency Contact (Stage 4)
    emergencyContactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContactRelationship: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContactAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true,
    paranoid: true, // Soft delete
  });

  Patient.associate = (models) => {
    Patient.belongsTo(models.Facility, {
      foreignKey: 'facilityId',
      as: 'registrationFacility',
    });
    Patient.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'registeredBy',
    });
    Patient.hasMany(models.Visit, {
      foreignKey: 'patientId',
      as: 'visits',
    });
  };

  return Patient;
};