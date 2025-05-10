// src/models/DeathStatistic.js

module.exports = (sequelize, DataTypes) => {
    const DeathStatistic = sequelize.define('DeathStatistic', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      patientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Patients',
          key: 'id',
        },
      },
      facilityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Facilities',
          key: 'id',
        },
      },
      dateOfDeath: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      timeOfDeath: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      placeOfDeath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      primaryCauseOfDeath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      secondaryCauseOfDeath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      certificateNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      certifiedBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      certifierDesignation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mannerOfDeath: {
        type: DataTypes.ENUM('Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined', 'Pending Investigation'),
        allowNull: false,
      },
      autopsyPerformed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      autopsyFindings: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    }, {
      tableName: 'death_statistics',
      timestamps: true,
    });
  
    DeathStatistic.associate = (models) => {
      DeathStatistic.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient',
      });
      DeathStatistic.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'facility',
      });
      DeathStatistic.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });
      DeathStatistic.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });
    };
  
    return DeathStatistic;
  };