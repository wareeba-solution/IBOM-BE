// src/database/migrations/20250505000009-create-diseases.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create disease_registry table
    await queryInterface.createTable('disease_registry', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      icdCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      symptoms: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      transmissionRoutes: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      preventiveMeasures: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      treatmentGuidelines: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      notifiable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      incubationPeriodMin: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      incubationPeriodMax: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Create disease_cases table
    await queryInterface.createTable('disease_cases', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      diseaseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'disease_registry',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      patientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      facilityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'facilities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      reportingDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      onsetDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      diagnosisDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      diagnosisType: {
        type: Sequelize.ENUM('Clinical', 'Laboratory', 'Epidemiological', 'Presumptive'),
        allowNull: false,
      },
      symptoms: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      labTestResults: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      },
      severity: {
        type: Sequelize.ENUM('Mild', 'Moderate', 'Severe', 'Critical'),
        allowNull: false,
      },
      hospitalized: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hospitalizationDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dischargeDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      outcome: {
        type: Sequelize.ENUM('Recovered', 'Recovering', 'Deceased', 'Unknown', 'Lost to Follow-up'),
        allowNull: false,
        defaultValue: 'Unknown',
      },
      outcomeDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      transmissionRoute: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transmissionLocation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      travelHistory: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contactHistory: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      treatmentProvided: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      complications: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      reportedToAuthorities: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reportedDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Active', 'Resolved', 'Deceased', 'Lost to Follow-up'),
        allowNull: false,
        defaultValue: 'Active',
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Create contact_tracing table
    await queryInterface.createTable('contact_tracing', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      diseaseCaseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'disease_cases',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      contactType: {
        type: Sequelize.ENUM('Household', 'Workplace', 'Healthcare', 'Social', 'Travel', 'Other'),
        allowNull: false,
      },
      contactName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contactPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contactAddress: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      exposureDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      exposureDuration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      exposureLocation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      relationshipToPatient: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      riskAssessment: {
        type: Sequelize.ENUM('High', 'Medium', 'Low', 'Unknown'),
        allowNull: false,
        defaultValue: 'Unknown',
      },
      monitoringStatus: {
        type: Sequelize.ENUM('Not Started', 'Ongoing', 'Completed', 'Lost to Follow-up'),
        allowNull: false,
        defaultValue: 'Not Started',
      },
      symptomDevelopment: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      symptomOnsetDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      testedStatus: {
        type: Sequelize.ENUM('Not Tested', 'Pending', 'Positive', 'Negative'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      testDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      monitoringEndDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes for improved query performance
    await queryInterface.addIndex('disease_registry', ['name']);
    await queryInterface.addIndex('disease_registry', ['notifiable']);
    await queryInterface.addIndex('disease_registry', ['isActive']);

    await queryInterface.addIndex('disease_cases', ['diseaseId']);
    await queryInterface.addIndex('disease_cases', ['patientId']);
    await queryInterface.addIndex('disease_cases', ['facilityId']);
    await queryInterface.addIndex('disease_cases', ['reportingDate']);
    await queryInterface.addIndex('disease_cases', ['diagnosisDate']);
    await queryInterface.addIndex('disease_cases', ['severity']);
    await queryInterface.addIndex('disease_cases', ['hospitalized']);
    await queryInterface.addIndex('disease_cases', ['outcome']);
    await queryInterface.addIndex('disease_cases', ['status']);
    await queryInterface.addIndex('disease_cases', ['reportedToAuthorities']);

    await queryInterface.addIndex('contact_tracing', ['diseaseCaseId']);
    await queryInterface.addIndex('contact_tracing', ['contactType']);
    await queryInterface.addIndex('contact_tracing', ['contactName']);
    await queryInterface.addIndex('contact_tracing', ['exposureDate']);
    await queryInterface.addIndex('contact_tracing', ['riskAssessment']);
    await queryInterface.addIndex('contact_tracing', ['monitoringStatus']);
    await queryInterface.addIndex('contact_tracing', ['symptomDevelopment']);
    await queryInterface.addIndex('contact_tracing', ['testedStatus']);
    await queryInterface.addIndex('contact_tracing', ['monitoringEndDate']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('contact_tracing');
    await queryInterface.dropTable('disease_cases');
    await queryInterface.dropTable('disease_registry');
  },
};