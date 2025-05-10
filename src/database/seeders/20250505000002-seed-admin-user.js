'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get admin role
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE name = 'admin'`
    );
    const adminRoleId = roles[0]?.id;

    if (!adminRoleId) {
      console.error('Admin role not found. Make sure to run the roles seeder first.');
      return;
    }

    // Get the first facility or create a dummy one if none exists
    let facilityId;
    const [facilities] = await queryInterface.sequelize.query(
      `SELECT id FROM "Facilities" LIMIT 1`
    );

    if (facilities.length === 0) {
      // Create a dummy facility if none exists
      facilityId = uuidv4();
      await queryInterface.bulkInsert('Facilities', [{
        id: facilityId,
        name: 'Akwa Ibom State Health Department',
        facilityType: 'health_center',
        address: 'State Secretariat, Uyo',
        lga: 'Uyo',
        state: 'Akwa Ibom',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
    } else {
      facilityId = facilities[0].id;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = {
      id: uuidv4(),
      username: 'admin',
      email: 'admin@akwaibomhealth.gov.ng',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      phoneNumber: '08000000000',
      status: 'active',
      roleId: adminRoleId,
      facilityId: facilityId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await queryInterface.bulkInsert('Users', [adminUser], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { username: 'admin' }, {});
  }
};