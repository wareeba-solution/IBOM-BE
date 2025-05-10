'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Births', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      // Paternal Data
      fatherName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fatherAge: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fatherOccupation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fatherLgaOrigin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // Maternal Data
      motherId: {
        type: Sequelize.UUID,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      motherName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      motherAge: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      motherOccupation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      motherLgaOrigin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      motherLgaResidence: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      motherParity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      estimatedDeliveryDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      complications: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      // Baby Statistics
      babyId: {
        type: Sequelize.UUID,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      birthTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: false,
      },
      apgarScoreOneMin: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      apgarScoreFiveMin: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      resuscitation: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      birthDefects: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      birthWeight: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Birth weight in kilograms',
      },
      birthType: {
        type: Sequelize.ENUM('singleton', 'twin', 'triplet', 'quadruplet', 'other'),
        allowNull: false,
        defaultValue: 'singleton',
      },
      deliveryMethod: {
        type: Sequelize.ENUM('vaginal', 'cesarean', 'assisted', 'other'),
        allowNull: false,
        defaultValue: 'vaginal',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isBirthCertificateIssued: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      birthCertificateNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // Metadata
      visitId: {
        type: Sequelize.UUID,
        references: {
          model: 'Visits',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      facilityId: {
        type: Sequelize.UUID,
        references: {
          model: 'Facilities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdBy: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      attendedBy: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Births');
  }
};