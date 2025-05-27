'use strict';

module.exports = (sequelize, DataTypes) => {
  const ContactTracing = sequelize.define('ContactTracing', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    diseaseCaseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'DiseaseCases',
        key: 'id',
      },
    },
    contactType: {
      type: DataTypes.ENUM('Household', 'Workplace', 'Healthcare', 'Social', 'Travel', 'Other'),
      allowNull: false,
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    exposureDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    exposureDuration: { // in minutes
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    exposureLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    relationshipToPatient: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    riskAssessment: {
      type: DataTypes.ENUM('High', 'Medium', 'Low', 'Unknown'),
      allowNull: false,
      defaultValue: 'Unknown',
    },
    monitoringStatus: {
      type: DataTypes.ENUM('Not Started', 'Ongoing', 'Completed', 'Lost to Follow-up'),
      allowNull: false,
      defaultValue: 'Not Started',
    },
    symptomDevelopment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    symptomOnsetDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    testedStatus: {
      type: DataTypes.ENUM('Not Tested', 'Pending', 'Positive', 'Negative'),
      allowNull: false,
      defaultValue: 'Not Tested',
    },
    testDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    monitoringEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'ContactTracing',
    timestamps: true,
    paranoid: true, // This enables soft delete
  });

  ContactTracing.associate = (models) => {
    ContactTracing.belongsTo(models.DiseaseCase, {
      foreignKey: 'diseaseCaseId',
      as: 'diseaseCase', // Changed from 'DiseaseCases'
    });
    ContactTracing.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
    ContactTracing.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater',
    });
  };

  return ContactTracing;
};