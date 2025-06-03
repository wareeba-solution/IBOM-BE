// src/models/refreshToken.model.js
module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define('RefreshToken', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      timestamps: true,
      paranoid: true // Using soft deletes to match your User model
    });
  
    RefreshToken.associate = function(models) {
      RefreshToken.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    };
  
    return RefreshToken;
  };