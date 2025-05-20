// seed-admin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // Add this if your User model uses UUID
const db = require('./src/models');

async function seedAdminUser() {
  try {
    console.log('Connecting to database...');
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    const { User } = db; // Get the User model from your models

    // Check if admin already exists
    console.log('Checking if admin user already exists...');
    const existingAdmin = await User.findOne({
      where: { email: 'admin1@akwaibomhealth.gov.ng' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Hash the password
    console.log('Creating new admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    
    // Create admin user
    const admin = await User.create({
      id: uuidv4(), // Include this if your model uses UUID
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin1@akwaibomhealth.gov.ng',
      password: hashedPassword,
      role: 'admin', // Adjust based on your role field
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Admin user created successfully:', admin.email);
    console.log('You can now login with:');
    console.log('Email: admin1@akwaibomhealth.gov.ng');
    console.log('Password: Admin@123');
    
    // Close the database connection
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the function
seedAdminUser();