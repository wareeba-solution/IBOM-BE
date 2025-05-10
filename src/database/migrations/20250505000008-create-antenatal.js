// src/database/migrations/20250505000008-create-antenatal.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create antenatal_care table
    await queryInterface.createTable('antenatal_care', {
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
      lmp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      edd: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      gravida: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      para: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // src/database/migrations/20250505000008-create-antenatal.js (continued)

      bloodGroup: {
        type: Sequelize.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'),
        allowNull: false,
        defaultValue: 'Unknown',
      },
      rhesus: {
        type: Sequelize.ENUM('Positive', 'Negative', 'Unknown'),
        allowNull: false,
        defaultValue: 'Unknown',
      },
      height: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      prePregnancyWeight: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      hivStatus: {
        type: Sequelize.ENUM('Positive', 'Negative', 'Unknown', 'Not Tested'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      sickling: {
        type: Sequelize.ENUM('Positive', 'Negative', 'Unknown', 'Not Tested'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      hepatitisB: {
        type: Sequelize.ENUM('Positive', 'Negative', 'Unknown', 'Not Tested'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      hepatitisC: {
        type: Sequelize.ENUM('Positive', 'Negative', 'Unknown', 'Not Tested'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      vdrl: {
        type: Sequelize.ENUM('Positive', 'Negative', 'Unknown', 'Not Tested'),
        allowNull: false,
        defaultValue: 'Not Tested',
      },
      partner: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      },
      medicalHistory: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      obstetricsHistory: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      riskFactors: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      outcome: {
        type: Sequelize.ENUM(
          'Ongoing', 
          'Live Birth', 
          'Stillbirth', 
          'Miscarriage', 
          'Abortion',
          'Ectopic Pregnancy',
          'Unknown'
        ),
        allowNull: false,
        defaultValue: 'Ongoing',
      },
      deliveryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      modeOfDelivery: {
        type: Sequelize.ENUM(
          'Vaginal Delivery', 
          'Cesarean Section', 
          'Instrumental Delivery',
          'Not Applicable',
          'Unknown'
        ),
        allowNull: false,
        defaultValue: 'Not Applicable',
      },
      birthOutcome: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      },
      status: {
        type: Sequelize.ENUM('Active', 'Completed', 'Transferred', 'Lost to Follow-up'),
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

    // Create antenatal_visits table
    await queryInterface.createTable('antenatal_visits', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      antenatalCareId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'antenatal_care',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      visitDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      gestationalAge: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      bloodPressure: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fetalHeartRate: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fetalMovement: {
        type: Sequelize.ENUM('Present', 'Absent', 'Not Checked'),
        allowNull: false,
        defaultValue: 'Not Checked',
      },
      fundusHeight: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      presentation: {
        type: Sequelize.ENUM('Cephalic', 'Breech', 'Transverse', 'Oblique', 'Not Determined'),
        allowNull: false,
        defaultValue: 'Not Determined',
      },
      urineProtein: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      urineGlucose: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hemoglobin: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      complaints: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      treatment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      nextAppointment: {
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
    await queryInterface.addIndex('antenatal_care', ['patientId']);
    await queryInterface.addIndex('antenatal_care', ['facilityId']);
    await queryInterface.addIndex('antenatal_care', ['registrationDate']);
    await queryInterface.addIndex('antenatal_care', ['edd']);
    await queryInterface.addIndex('antenatal_care', ['status']);
    await queryInterface.addIndex('antenatal_care', ['outcome']);
    await queryInterface.addIndex('antenatal_care', ['hivStatus']);

    await queryInterface.addIndex('antenatal_visits', ['antenatalCareId']);
    await queryInterface.addIndex('antenatal_visits', ['visitDate']);
    await queryInterface.addIndex('antenatal_visits', ['gestationalAge']);
    await queryInterface.addIndex('antenatal_visits', ['nextAppointment']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('antenatal_visits');
    await queryInterface.dropTable('antenatal_care');
  },
};