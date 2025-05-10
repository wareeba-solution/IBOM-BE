'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const facilities = [
      {
        id: uuidv4(),
        name: 'University of Uyo Teaching Hospital',
        facilityType: 'hospital',
        address: 'Abak Road, Uyo',
        lga: 'Uyo',
        state: 'Akwa Ibom',
        contactPerson: 'Dr. John Doe',
        phoneNumber: '08012345678',
        email: 'info@uuth.org.ng',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Ibom Specialist Hospital',
        facilityType: 'hospital',
        address: 'Itam, Uyo',
        lga: 'Uyo',
        state: 'Akwa Ibom',
        contactPerson: 'Dr. Jane Smith',
        phoneNumber: '08023456789',
        email: 'info@ibomspecialist.org.ng',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'St. Luke\'s Hospital',
        facilityType: 'hospital',
        address: 'Anua, Uyo',
        lga: 'Uyo',
        state: 'Akwa Ibom',
        contactPerson: 'Dr. Michael Johnson',
        phoneNumber: '08034567890',
        email: 'info@stlukes.org.ng',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Immanuel General Hospital',
        facilityType: 'hospital',
        address: 'Eket',
        lga: 'Eket',
        state: 'Akwa Ibom',
        contactPerson: 'Dr. Sarah Williams',
        phoneNumber: '08045678901',
        email: 'info@immanuel.org.ng',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Ikot Ekpene General Hospital',
        facilityType: 'hospital',
        address: 'Ikot Ekpene',
        lga: 'Ikot Ekpene',
        state: 'Akwa Ibom',
        contactPerson: 'Dr. David Brown',
        phoneNumber: '08056789012',
        email: 'info@ikotekpenegh.org.ng',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Etinan General Hospital',
        facilityType: 'hospital',
        address: 'Etinan',
        lga: 'Etinan',
        state: 'Akwa Ibom',
        contactPerson: 'Dr. Robert James',
        phoneNumber: '08067890123',
        email: 'info@etinangh.org.ng',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Akwa Ibom State Primary Healthcare Center, Uyo',
        facilityType: 'health_center',
        address: 'Uyo',
        lga: 'Uyo',
        state: 'Akwa Ibom',
        contactPerson: 'Dr. Mary Wilson',
        phoneNumber: '08078901234',
        email: 'info@akwaibomphc.org.ng',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mother and Child Hospital',
        facilityType: 'maternity',
        address: 'Itam, Uyo',
        lga: 'Uyo',
        state: 'Akwa Ibom',
        contactPerson: 'Dr. Elizabeth Taylor',
        phoneNumber: '08089012345',
        email: 'info@motherandchild.org.ng',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Eket Community Clinic',
        facilityType: 'clinic',
        address: 'Eket',
        lga: 'Eket',
        state: 'Akwa Ibom',
        contactPerson: 'Dr. Peter Thomas',
        phoneNumber: '08090123456',
        email: 'info@eketclinic.org.ng',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Oron General Hospital',
        facilityType: 'hospital',
        address: 'Oron',
        lga: 'Oron',
        state: 'Akwa Ibom',
        contactPerson: 'Dr. Samuel Adams',
        phoneNumber: '07012345678',
        email: 'info@orongh.org.ng',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Facilities', facilities, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Facilities', null, {});
  }
};