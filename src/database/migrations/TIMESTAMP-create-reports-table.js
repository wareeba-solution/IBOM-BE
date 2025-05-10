// src/database/migrations/TIMESTAMP-create-reports-table.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reports', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('standard', 'custom'),
        allowNull: false,
        defaultValue: 'standard'
      },
      category: {
        type: Sequelize.ENUM('maternal', 'child', 'disease', 'facility', 'summary'),
        allowNull: false
      },
      parameters: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      query: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      lastRunAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
    
    // Create indexes for better query performance
    await queryInterface.addIndex('Reports', ['createdBy']);
    await queryInterface.addIndex('Reports', ['type']);
    await queryInterface.addIndex('Reports', ['category']);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reports');
  }
};