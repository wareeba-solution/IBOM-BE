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
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
      },
      address: {
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
      occupation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nextOfKin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nextOfKinPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bloodGroup: {
        type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'),
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
      notes: {
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
      // Relationships to other health records will be added in their respective models
    };
  
    return Patient;
  };