const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100],
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending'),
      defaultValue: 'pending',
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerificationTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    profileCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastLoginAttempt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    registrationSource: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'web',
    },
  }, {
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  User.associate = function(models) {
    if (models.Role) {
      User.belongsTo(models.Role, {
        foreignKey: {
          name: 'roleId',
          allowNull: true // Changed from false to true
        },
        as: 'role',
      });
    }
    
    if (models.Facility) {
      User.belongsTo(models.Facility, {
        foreignKey: {
          name: 'facilityId',
          allowNull: true // Changed from false to true
        },
        as: 'facility',
      });
    }
    
    // Add audit logs association if model exists
    if (models.Audit) {
      User.hasMany(models.Audit, {
        foreignKey: 'userId',
        as: 'audits',
      });
    }
  };

  // Instance methods
  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.incrementLoginAttempts = async function () {
    const attempts = this.loginAttempts + 1;
    await this.update({
      loginAttempts: attempts,
      lastLoginAttempt: new Date(),
      lockedUntil: attempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null, // Lock for 30 minutes after 5 attempts
    });
    return attempts;
  };

  User.prototype.resetLoginAttempts = async function () {
    await this.update({
      loginAttempts: 0,
      lockedUntil: null,
    });
  };

  User.prototype.isLocked = function () {
    if (!this.lockedUntil) return false;
    return new Date(this.lockedUntil) > new Date();
  };

  User.prototype.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
  };

  // Static methods
  User.findByEmailOrUsername = async function (identifier) {
    return await this.findOne({
      where: sequelize.or(
        { email: identifier },
        { username: identifier }
      ),
      include: [
        {
          model: sequelize.models.Role,
          as: 'role',
        },
        {
          model: sequelize.models.Facility,
          as: 'facility',
        },
      ],
    });
  };

  User.generateUsername = function (email, firstName, lastName) {
    if (email) {
      return email.split('@')[0].toLowerCase();
    } 
    
    if (firstName && lastName) {
      return `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    }
    
    return null;
  };

  return User;
};