module.exports = (sequelize, DataTypes) => {
    const Facility = sequelize.define('Facility', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      facilityType: {
        type: DataTypes.ENUM('hospital', 'clinic', 'health_center', 'maternity'),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lga: {
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
            msg: 'Invalid LGA',
          },
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Akwa Ibom',
      },
      contactPerson: {
        type: DataTypes.STRING,
        allowNull: true,
      },
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
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
    }, {
      timestamps: true,
    });
  
    Facility.associate = (models) => {
      Facility.hasMany(models.User, {
        foreignKey: 'facilityId',
        as: 'users',
      });
    };
  
    return Facility;
  };