// src/models/familyPlanningMethod.model.js

module.exports = (sequelize, DataTypes) => {
    const FamilyPlanningMethod = sequelize.define('FamilyPlanningMethod', {
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
      category: {
        type: DataTypes.ENUM(
          'Hormonal', 
          'Barrier', 
          'Long-Acting Reversible', 
          'Permanent', 
          'Fertility Awareness', 
          'Emergency', 
          'Other'
        ),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      effectiveness: {
        type: DataTypes.FLOAT, // Percentage (0-100)
        allowNull: true,
      },
      duration: {
        type: DataTypes.STRING, // e.g., "3 months", "5 years", "Permanent"
        allowNull: true,
      },
      sideEffects: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      contraindications: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      advantages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      disadvantages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    }, {
      tableName: 'FamilyPlanningMethods',
      timestamps: true,
    });
  
    // Define model associations
    FamilyPlanningMethod.associate = (models) => {
      FamilyPlanningMethod.hasMany(models.FamilyPlanningService, {
        foreignKey: 'methodId',
        as: 'services',
      });
      FamilyPlanningMethod.hasMany(models.FamilyPlanningService, {
        foreignKey: 'previousMethodId',
        as: 'switchedFromServices',
      });
      FamilyPlanningMethod.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });
      FamilyPlanningMethod.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });
    };
  
    return FamilyPlanningMethod;
  };