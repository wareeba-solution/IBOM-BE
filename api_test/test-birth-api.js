const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3000/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEzZjViNWQ0LTgwZjItNDdkMC1iMWU4LTJjZjAxZjg0OTdlYyIsInVzZXJuYW1lIjoibmV3YWRtaW4iLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsImlhdCI6MTc0NzUxNjQwNSwiZXhwIjoxNzQ3Njg5MjA1fQ.WmLQ_j5mPbKVVxpqncYLwIx-oxpDSVN2_X220uxT2j0';

// Mother and facility IDs for testing
const MOTHER_ID = 'd5ecee23-9b70-4c36-9169-0c67a2a99527';
const FACILITY_ID = 'bfe561f4-c9d4-4179-9a37-facdf8819869';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Helper function to log responses nicely
const logResponse = (testName, response) => {
  console.log(`${testName} - Status: ${response.status} ${response.statusText}`);
  console.log(`Message: ${response.data.message}`);
  if (response.data.data) {
    if (Array.isArray(response.data.data.births)) {
      console.log(`Results: ${response.data.data.births.length} records`);
    } else if (response.data.data.id) {
      console.log(`Birth ID: ${response.data.data.id}`);
      console.log(`Mother: ${response.data.data.motherName}`);
      console.log(`Baby: ${response.data.data.baby?.firstName || 'Not specified'}`);
      console.log(`Birth Date: ${response.data.data.birthDate}`);
      console.log(`Gender: ${response.data.data.gender}`);
    } else {
      console.log('Data:', JSON.stringify(response.data.data, null, 2));
    }
  }
  console.log('\n---\n');
};

// Test cases
async function runTests() {
  console.log('Starting Birth API Endpoint Tests...\n');
  
  try {
    // Test 1: Get all birth records
    console.log('TEST 1: Get all birth records');
    const allBirths = await client.get('/births');
    logResponse('Get All Births', allBirths);
    
    // Store an ID for later tests
    let birthId = null;
    if (allBirths.data.data.births && allBirths.data.data.births.length > 0) {
      birthId = allBirths.data.data.births[0].id;
    }
    
    // Test 2: Pagination
    console.log('TEST 2: Pagination (page 1, limit 3)');
    const paginatedBirths = await client.get('/births?page=1&limit=3');
    logResponse('Paginated Births', paginatedBirths);
    
    // Test 3: Get birth record by ID
    if (birthId) {
      console.log(`TEST 3: Get birth record by ID (${birthId})`);
      const singleBirth = await client.get(`/births/${birthId}`);
      logResponse('Get Birth by ID', singleBirth);
    } else {
      console.log('TEST 3: Skipped - No birth records found');
    }
    
    // Test 4: Search births by gender (male)
    console.log('TEST 4: Search births by gender (male)');
    const maleBirths = await client.get('/births/search?gender=male');
    logResponse('Search Male Births', maleBirths);
    
    // Test 5: Search births by gender (female)
    console.log('TEST 5: Search births by gender (female)');
    const femaleBirths = await client.get('/births/search?gender=female');
    logResponse('Search Female Births', femaleBirths);
    
    // Test 6: Search births by date range
    console.log('TEST 6: Search births by date range (2023)');
    const birthsByDate = await client.get('/births/search?startDate=2023-01-01&endDate=2023-12-31');
    logResponse('Search by Date Range', birthsByDate);
    
    // Test 7: Create a new birth record
    console.log('TEST 7: Create a new birth record');
    const newBirthData = {
      motherId: MOTHER_ID,
      motherName: "Jane Doe",
      motherAge: 35,
      motherOccupation: "Software Engineer",
      motherLgaOrigin: "Uyo",
      motherLgaResidence: "Uyo",
      motherParity: 1,
      fatherName: "John Doe",
      fatherAge: 37,
      fatherOccupation: "Engineer",
      fatherLgaOrigin: "Eket",
      birthDate: "2023-03-15",
      birthTime: "10:45",
      gender: "female",
      apgarScoreOneMin: 9,
      apgarScoreFiveMin: 10,
      resuscitation: false,
      birthWeight: 3.5,
      birthLength: 47.5,
      headCircumference: 34.2,
      birthType: "singleton",
      deliveryMethod: "vaginal",
      placeOfBirth: "Hospital (Hospital 1)",
      registrationNumber: `BR${Math.floor(10000 + Math.random() * 90000)}`,
      facilityId: FACILITY_ID,
      isBirthCertificateIssued: true
    };
    
    const newBirth = await client.post('/births', newBirthData);
    logResponse('Create Birth Record', newBirth);
    
    // Store the new birth ID for update and delete tests
    const newBirthId = newBirth.data.data.id;
    
    // Test 8: Update a birth record
    if (newBirthId) {
      console.log(`TEST 8: Update birth record (${newBirthId})`);
      const updateData = {
        birthWeight: 3.6,
        birthLength: 48.0,
        headCircumference: 34.5,
        isBirthCertificateIssued: true,
        notes: "Updated via API test"
      };
      
      const updatedBirth = await client.put(`/births/${newBirthId}`, updateData);
      logResponse('Update Birth Record', updatedBirth);
    } else {
      console.log('TEST 8: Skipped - No new birth record created');
    }
    
    // Test 9: Get birth statistics
    console.log('TEST 9: Get birth statistics');
    const birthStats = await client.get('/births/statistics?startDate=2023-01-01&endDate=2025-05-17');
    
    console.log('Birth Statistics:');
    console.log(`Total Births: ${birthStats.data.data.totalBirths}`);
    console.log('Births by Gender:', birthStats.data.data.birthsByGender);
    console.log('Births by Delivery Method:', birthStats.data.data.birthsByDeliveryMethod);
    console.log('Average Mother Age:', birthStats.data.data.averageMotherAge);
    console.log('Average Birth Weight:', birthStats.data.data.averageBirthWeight);
    console.log('\n---\n');
    
    // Test 10: Delete a birth record (optional - uncomment to test)
    if (newBirthId) {
      console.log(`TEST 10: Delete birth record (${newBirthId})`);
      console.log('WARNING: This test is commented out to prevent accidental deletion');
      console.log('To test deletion, uncomment the code below');
      /*
      const deletedBirth = await client.delete(`/births/${newBirthId}`);
      logResponse('Delete Birth Record', deletedBirth);
      
      // Verify deletion
      try {
        await client.get(`/births/${newBirthId}`);
      } catch (error) {
        console.log('Verified: Record no longer exists');
      }
      */
    } else {
      console.log('TEST 10: Skipped - No new birth record created');
    }
    
    console.log('All birth API endpoint tests completed successfully!');
  } catch (error) {
    console.error('Error during testing:', error.response?.data || error.message);
    console.error('Error details:', error.stack);
  }
}

runTests();