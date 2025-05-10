'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      {
        id: uuidv4(),
        name: 'admin',
        description: 'System administrator with full access',
        permissions: JSON.stringify({
          users: ['create', 'read', 'update', 'delete'],
          facilities: ['create', 'read', 'update', 'delete'],
          patients: ['create', 'read', 'update', 'delete'],
          births: ['create', 'read', 'update', 'delete'],
          deaths: ['create', 'read', 'update', 'delete'],
          immunizations: ['create', 'read', 'update', 'delete'],
          antenatal: ['create', 'read', 'update', 'delete'],
          diseases: ['create', 'read', 'update', 'delete'],
          familyPlanning: ['create', 'read', 'update', 'delete'],
          reports: ['create', 'read', 'update', 'delete'],
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'health_commissioner',
        description: 'Health Commissioner with access to reports and dashboard',
        permissions: JSON.stringify({
          users: ['read'],
          facilities: ['read'],
          patients: ['read'],
          births: ['read'],
          deaths: ['read'],
          immunizations: ['read'],
          antenatal: ['read'],
          diseases: ['read'],
          familyPlanning: ['read'],
          reports: ['create', 'read', 'update', 'delete'],
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'facility_admin',
        description: 'Facility administrator with access to their facility data',
        permissions: JSON.stringify({
          users: ['read', 'update'],
          facilities: ['read'],
          patients: ['create', 'read', 'update', 'delete'],
          births: ['create', 'read', 'update', 'delete'],
          deaths: ['create', 'read', 'update', 'delete'],
          immunizations: ['create', 'read', 'update', 'delete'],
          antenatal: ['create', 'read', 'update', 'delete'],
          diseases: ['create', 'read', 'update', 'delete'],
          familyPlanning: ['create', 'read', 'update', 'delete'],
          reports: ['create', 'read'],
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'doctor',
        description: 'Doctor with access to patient data',
        permissions: JSON.stringify({
          users: ['read'],
          facilities: ['read'],
          patients: ['create', 'read', 'update'],
          births: ['create', 'read', 'update'],
          deaths: ['create', 'read', 'update'],
          immunizations: ['create', 'read', 'update'],
          antenatal: ['create', 'read', 'update'],
          diseases: ['create', 'read', 'update'],
          familyPlanning: ['create', 'read', 'update'],
          reports: ['read'],
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'nurse',
        description: 'Nurse with access to patient data',
        permissions: JSON.stringify({
          users: ['read'],
          facilities: ['read'],
          patients: ['create', 'read', 'update'],
          births: ['create', 'read', 'update'],
          deaths: ['create', 'read', 'update'],
          immunizations: ['create', 'read', 'update'],
          antenatal: ['create', 'read', 'update'],
          diseases: ['create', 'read', 'update'],
          familyPlanning: ['create', 'read', 'update'],
          reports: ['read'],
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'data_entry',
        description: 'Data entry staff with limited access',
        permissions: JSON.stringify({
          users: ['read'],
          facilities: ['read'],
          patients: ['create', 'read', 'update'],
          births: ['create', 'read', 'update'],
          deaths: ['create', 'read', 'update'],
          immunizations: ['create', 'read', 'update'],
          antenatal: ['create', 'read', 'update'],
          diseases: ['create', 'read', 'update'],
          familyPlanning: ['create', 'read', 'update'],
          reports: ['read'],
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'researcher',
        description: 'Researcher with read-only access to anonymized data',
        permissions: JSON.stringify({
          users: [],
          facilities: ['read'],
          patients: [],
          births: ['read'],
          deaths: ['read'],
          immunizations: ['read'],
          antenatal: ['read'],
          diseases: ['read'],
          familyPlanning: ['read'],
          reports: ['create', 'read'],
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert('Roles', roles, {});

    // Log the admin roleId for reference
    console.log('Admin roleId:', roles[0].id);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};