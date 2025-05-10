// src/database/migrations/20250505000010-create-family-planning.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create family_planning_methods table
    await queryInterface.createTable('family_planning_methods', {
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
      category: {
        type: Sequelize.ENUM(
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
        type: Sequelize.TEXT,
        allowNull: true,
      },
      effectiveness: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sideEffects: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      contraindications: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      advantages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      disadvantages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
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

    // Create family_planning_clients table
    await queryInterface.createTable('family_planning_clients', {
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
      registrationDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      clientType: {
        type: Sequelize.ENUM('New Acceptor', 'Continuing User', 'Restart'),
        allowNull: false,
      },
      maritalStatus: {
        type: Sequelize.ENUM('Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Other'),
        allowNull: false,
      },
      numberOfChildren: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      desiredNumberOfChildren: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      educationLevel: {
        type: Sequelize.ENUM('None', 'Primary', 'Secondary', 'Tertiary', 'Unknown'),
        allowNull: true,
        defaultValue: 'Unknown',
      },
      occupation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      primaryContact: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      },
      medicalHistory: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      allergyHistory: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      reproductiveHistory: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      menstrualHistory: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      referredBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive', 'Transferred', 'Lost to Follow-up'),
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

    // Create family_planning_services table
    await queryInterface.createTable('family_planning_services', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      clientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'family_planning_clients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      methodId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'family_planning_methods',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      serviceDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      serviceType: {
        type: Sequelize.ENUM(
          'Initial Adoption', 
          'Method Switch', 
          'Resupply', 
          'Follow-up', 
          'Counseling', 
          'Removal', 
          'Other'
        ),
        allowNull: false,
      },
      previousMethodId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'family_planning_methods',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      switchReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      batchNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      providedBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      bloodPressure: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sideEffectsReported: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      sideEffectsManagement: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      counselingNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      nextAppointment: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      discontinuationReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      procedureNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      patientSatisfaction: {
        type: Sequelize.ENUM('Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied', 'Not Recorded'),
        allowNull: false,
        defaultValue: 'Not Recorded',
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
    await queryInterface.addIndex('family_planning_methods', ['name']);
    await queryInterface.addIndex('family_planning_methods', ['category']);
    await queryInterface.addIndex('family_planning_methods', ['isActive']);

    await queryInterface.addIndex('family_planning_clients', ['patientId']);
    await queryInterface.addIndex('family_planning_clients', ['facilityId']);
    await queryInterface.addIndex('family_planning_clients', ['registrationDate']);
    await queryInterface.addIndex('family_planning_clients', ['clientType']);
    await queryInterface.addIndex('family_planning_clients', ['maritalStatus']);
    await queryInterface.addIndex('family_planning_clients', ['status']);

    await queryInterface.addIndex('family_planning_services', ['clientId']);
    await queryInterface.addIndex('family_planning_services', ['methodId']);
    await queryInterface.addIndex('family_planning_services', ['serviceDate']);
    await queryInterface.addIndex('family_planning_services', ['serviceType']);
    await queryInterface.addIndex('family_planning_services', ['nextAppointment']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('family_planning_services');
    await queryInterface.dropTable('family_planning_clients');
    await queryInterface.dropTable('family_planning_methods');
  },
};