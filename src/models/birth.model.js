module.exports = (sequelize, DataTypes) => {
    const Birth = sequelize.define('Birth', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      // Paternal Data
      fatherName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fatherAge: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 120,
        },
      },
      fatherOccupation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fatherLgaOrigin: {
        type: DataTypes.STRING,
        allowNull: true,
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
                'Other',
              ]
            ],
            msg: 'Invalid LGA of Origin',
          },
        },
      },
      // Maternal Data
      motherName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      motherAge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 120,
        },
      },
      motherOccupation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      motherLgaOrigin: {
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
                'Other',
              ]
            ],
            msg: 'Invalid LGA of Origin',
          },
        },
      },
      motherLgaResidence: {
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
                'Other',
              ]
            ],
            msg: 'Invalid LGA of Residence',
          },
        },
      },
      motherParity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      estimatedDeliveryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      complications: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Baby Statistics
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      birthTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
      },
      placeOfBirth: {
        type: DataTypes.ENUM('HOSPITAL', 'HOME'),
        allowNull: false,
        defaultValue: 'HOSPITAL',
      },
      apgarScoreOneMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 10,
        },
      },
      apgarScoreFiveMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 10,
        },
      },
      resuscitation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      birthDefects: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      birthWeight: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          min: 0,
        },
        comment: 'Birth weight in kilograms',
      },
      birthType: {
        type: DataTypes.ENUM('singleton', 'twin', 'triplet', 'quadruplet', 'other'),
        allowNull: false,
        defaultValue: 'singleton',
      },
      deliveryMethod: {
        type: DataTypes.ENUM('vaginal', 'cesarean', 'assisted', 'other'),
        allowNull: false,
        defaultValue: 'vaginal',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isBirthCertificateIssued: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      birthCertificateNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      timestamps: true,
    });
  
    Birth.associate = (models) => {
      Birth.belongsTo(models.Patient, {
        foreignKey: 'motherId',
        as: 'mother',
      });
      Birth.belongsTo(models.Patient, {
        foreignKey: 'babyId',
        as: 'baby',
      });
      Birth.belongsTo(models.Visit, {
        foreignKey: 'visitId',
        as: 'visit',
      });
      Birth.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'facility',
      });
      Birth.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'registeredBy',
      });
      Birth.belongsTo(models.User, {
        foreignKey: 'attendedBy',
        as: 'attendingUser',
      });
    };
  
    return Birth;
  };