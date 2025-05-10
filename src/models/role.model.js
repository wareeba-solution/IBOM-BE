module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
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
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      permissions: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    }, {
      timestamps: true,
    });
  
    Role.associate = (models) => {
      Role.hasMany(models.User, {
        foreignKey: 'roleId',
        as: 'users',
      });
    };
  
    return Role;
  };