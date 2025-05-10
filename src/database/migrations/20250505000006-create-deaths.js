// src/database/migrations/yyyyMMddHHmmss-create-death-statistics-table.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('death_statistics', {
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
      dateOfDeath: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      timeOfDeath: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      placeOfDeath: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      primaryCauseOfDeath: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      secondaryCauseOfDeath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      certificateNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      certifiedBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      certifierDesignation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mannerOfDeath: {
        type: Sequelize.ENUM('Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined', 'Pending Investigation'),
        allowNull: false,
      },
      autopsyPerformed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      autopsyFindings: {
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

    await queryInterface.addColumn('patients', 'isDeceased', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      });
  
      await queryInterface.addColumn('patients', 'dateOfDeath', {
        type: Sequelize.DATE,
        allowNull: true,
      });

    // Add indexes for improved query performance
    await queryInterface.addIndex('death_statistics', ['patientId']);
    await queryInterface.addIndex('death_statistics', ['facilityId']);
    await queryInterface.addIndex('death_statistics', ['dateOfDeath']);
    await queryInterface.addIndex('death_statistics', ['mannerOfDeath']);
    await queryInterface.addIndex('death_statistics', ['certificateNumber']);
    await queryInterface.addIndex('patients', ['isDeceased']);
    await queryInterface.addIndex('patients', ['dateOfDeath']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('death_statistics');
    await queryInterface.removeColumn('patients', 'dateOfDeath');
    await queryInterface.removeColumn('patients', 'isDeceased');
  },
};