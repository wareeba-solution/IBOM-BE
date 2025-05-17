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
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false,
    },
    maritalStatus: {
      type: DataTypes.ENUM('single', 'married', 'divorced', 'widowed', 'separated', 'other'),
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registrationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
      defaultValue: 'Akwa Ibom',
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lgaOrigin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [
            [
              'Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim',
              'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono-Ibom',
              'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu',
              'Mbo', 'Mkpat-Enin', 'Nsit-Atai', 'Nsit-Ibom', 'Nsit-Ubium',
              'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam',
              'Udung-Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo',
            ]
          ],
          msg: 'Invalid LGA of Origin',
        },
      },
    },
    lgaResidence: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [
            [
              'Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim',
              'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono-Ibom',
              'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu',
              'Mbo', 'Mkpat-Enin', 'Nsit-Atai', 'Nsit-Ibom', 'Nsit-Ubium',
              'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam',
              'Udung-Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo',
            ]
          ],
          msg: 'Invalid LGA of Residence',
        },
      },
    },
    
    // Medical Information (Stage 3)
    bloodGroup: {
      type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'),
      allowNull: true,
      defaultValue: 'unknown',
    },
    genotype: {
      type: DataTypes.ENUM('AA', 'AS', 'SS', 'AC', 'SC', 'CC', 'unknown'),
      allowNull: true,
      defaultValue: 'unknown',
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
      type: DataTypes.ENUM('active', 'inactive', 'deceased'),
      allowNull: false,
      defaultValue: 'active',
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