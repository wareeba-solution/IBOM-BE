const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3000/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEzZjViNWQ0LTgwZjItNDdkMC1iMWU4LTJjZjAxZjg0OTdlYyIsInVzZXJuYW1lIjoibmV3YWRtaW4iLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsImlhdCI6MTc0NzQ2NzM2MywiZXhwIjoxNzQ3NjQwMTYzfQ.KVPdQJrA_Wu1FVmnnl7g1s9aAZXuDxKjiE3uvAI7hUk';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Test cases
async function runTests() {
  console.log('Starting API tests...\n');
  
  try {
    // Test 1: Get all patients
    console.log('TEST 1: Get all patients');
    const allPatients = await client.get('/patients');
    console.log(`Success! Retrieved ${allPatients.data.data.totalItems} patients`);
    console.log('Sample patient:', allPatients.data.data.patients[0]);
    console.log('\n---\n');
    
    // Test 2: Pagination
    console.log('TEST 2: Pagination (page 1, limit 3)');
    const paginatedPatients = await client.get('/patients?page=1&limit=3');
    console.log(`Success! Retrieved ${paginatedPatients.data.data.patients.length} of ${paginatedPatients.data.data.totalItems} patients`);
    console.log(`Total pages: ${paginatedPatients.data.data.totalPages}, Current page: ${paginatedPatients.data.data.currentPage}`);
    console.log('\n---\n');
    
    // Test 3: Filtering by gender
    console.log('TEST 3: Filtering by gender (female)');
    const femalePatients = await client.get('/patients?gender=female');
    console.log(`Success! Found ${femalePatients.data.data.totalItems} female patients`);
    console.log('\n---\n');
    
    // Test 4: Verify calculated fields
    console.log('TEST 4: Verify calculated fields');
    if (allPatients.data.data.patients.length > 0) {
      const patient = allPatients.data.data.patients[0];
      console.log('Patient:', patient.displayName);
      console.log('Age:', patient.age);
      console.log('Formatted DOB:', patient.formattedDOB);
      console.log('Last Visit Date:', patient.lastVisitDate);
      console.log('Full Address:', patient.fullAddress);
    } else {
      console.log('No patients found to check calculated fields');
    }
    console.log('\n---\n');
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Error during testing:', error.response?.data || error.message);
  }
}

runTests();