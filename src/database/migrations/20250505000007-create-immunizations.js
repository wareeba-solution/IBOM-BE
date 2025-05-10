// src/database/migrations/20250505000007-create-immunizations.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('immunizations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      vaccineType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vaccineName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      doseNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      batchNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      administrationDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      administeredBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      administrationSite: {
        type: Sequelize.ENUM('Left Arm', 'Right Arm', 'Left Thigh', 'Right Thigh', 'Oral', 'Intranasal', 'Other'),
        allowNull: false,
      },
      administrationRoute: {
        type: Sequelize.ENUM('Intramuscular', 'Subcutaneous', 'Intradermal', 'Oral', 'Intranasal', 'Other'),
        allowNull: false,
      },
      dosage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sideEffects: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      nextDoseDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Scheduled', 'Administered', 'Missed', 'Cancelled'),
        defaultValue: 'Administered',
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('immunizations', ['patientId']);
    await queryInterface.addIndex('immunizations', ['facilityId']);
    await queryInterface.addIndex('immunizations', ['vaccineType']);
    await queryInterface.addIndex('immunizations', ['administrationDate']);
    await queryInterface.addIndex('immunizations', ['status']);
    await queryInterface.addIndex('immunizations', ['nextDoseDate']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('immunizations');
  },
};