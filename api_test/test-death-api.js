const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3000/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEzZjViNWQ0LTgwZjItNDdkMC1iMWU4LTJjZjAxZjg0OTdlYyIsInVzZXJuYW1lIjoibmV3YWRtaW4iLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsImlhdCI6MTc0NzUxNjQwNSwiZXhwIjoxNzQ3Njg5MjA1fQ.WmLQ_j5mPbKVVxpqncYLwIx-oxpDSVN2_X220uxT2j0';

// Patient and facility IDs for testing
const PATIENT_ID = '69b5631e-95c0-45ff-b834-e07da160b4e7';
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
  if (response.data.message) {
    console.log(`Message: ${response.data.message}`);
  }
  
  if (response.data.id) {
    // Handling direct object response
    console.log(`Death ID: ${response.data.id}`);
    console.log(`Deceased: ${response.data.deceased_name}`);
    console.log(`Gender: ${response.data.gender}`);
    console.log(`Date of Death: ${response.data.date_of_death}`);
    console.log(`Cause of Death: ${response.data.cause_of_death}`);
  } else if (response.data.data) {
    // Handling wrapped data response
    if (Array.isArray(response.data.data)) {
      console.log(`Results: ${response.data.data.length} records`);
    } else if (response.data.data.id) {
      console.log(`Death ID: ${response.data.data.id}`);
      console.log(`Deceased: ${response.data.data.deceased_name}`);
      console.log(`Gender: ${response.data.data.gender}`);
      console.log(`Date of Death: ${response.data.data.date_of_death}`);
      console.log(`Cause of Death: ${response.data.data.cause_of_death}`);
    } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
      // Handling paginated response
      console.log(`Results: ${response.data.data.data.length} records`);
      console.log(`Total: ${response.data.data.pagination.totalItems}`);
      console.log(`Pages: ${response.data.data.pagination.totalPages}`);
    } else {
      console.log('Data:', JSON.stringify(response.data.data, null, 2));
    }
  } else {
    // Direct response or other format
    console.log('Response:', JSON.stringify(response.data, null, 2));
  }
  console.log('\n---\n');
};

// Test cases
async function runTests() {
  console.log('Starting Death Statistics API Endpoint Tests...\n');
  
  try {
    // Test 1: Get all death records (paginated)
    console.log('TEST 1: Get all death records');
    const allDeaths = await client.get('/death-statistics');
    logResponse('Get All Deaths', allDeaths);
    
    // Store an ID for later tests
    let deathId = null;
    if (allDeaths.data.data && allDeaths.data.data.data && allDeaths.data.data.data.length > 0) {
      deathId = allDeaths.data.data.data[0].id;
    } else if (Array.isArray(allDeaths.data.data) && allDeaths.data.data.length > 0) {
      deathId = allDeaths.data.data[0].id;
    } else if (allDeaths.data.data && allDeaths.data.data.length > 0) {
      deathId = allDeaths.data.data[0].id;
    }
    
    // Test 2: Pagination
    console.log('TEST 2: Pagination (page 1, limit 5)');
    const paginatedDeaths = await client.get('/death-statistics?page=1&limit=5');
    logResponse('Paginated Deaths', paginatedDeaths);
    
    // Test 3: Get death record by ID
    if (deathId) {
      console.log(`TEST 3: Get death record by ID (${deathId})`);
      const singleDeath = await client.get(`/death-statistics/${deathId}`);
      logResponse('Get Death by ID', singleDeath);
    } else {
      console.log('TEST 3: Skipped - No death records found');
    }
    
    // Test 4: Search deaths by name
    console.log('TEST 4: Search deaths by name (Musa)');
    const deathsByName = await client.get('/death-statistics?deceased_name=Musa');
    logResponse('Search Deaths by Name', deathsByName);
    
    // Test 5: Search deaths by cause
    console.log('TEST 5: Search deaths by cause (Heart)');
    const deathsByCause = await client.get('/death-statistics?cause_of_death=Heart');
    logResponse('Search Deaths by Cause', deathsByCause);
    
    // Test 6: Search deaths by manner of death
    console.log('TEST 6: Search deaths by manner of death (Natural)');
    const deathsByManner = await client.get('/death-statistics?manner_of_death=Natural');
    logResponse('Search by Manner of Death', deathsByManner);
    
    // Test 7: Search deaths by date range
    console.log('TEST 7: Search deaths by date range (2025)');
    const deathsByDate = await client.get('/death-statistics?date_from=2025-01-01&date_to=2025-12-31');
    logResponse('Search by Date Range', deathsByDate);
    
    // Test 8: Create a new death record
    console.log('TEST 8: Create a new death record');
    const newDeathData = {
      deceased_name: "John Smith",
      gender: "Male",
      date_of_birth: "1942-09-15",
      date_of_death: "2025-05-16",
      age_at_death: 82,
      place_of_death: "Home",
      cause_of_death: "Myocardial Infarction",
      secondary_causes: "Hypertension, Diabetes",
      manner_of_death: "Natural",
      doctor_name: "Dr. Williams",
      doctor_id: "MD98765",
      informant_name: "Mary Smith",
      informant_relationship: "Spouse",
      informant_phone: "08034567890",
      informant_address: "789 Pine St, Uyo",
      city: "Uyo",
      state: "Akwa Ibom",
      registration_date: "2025-05-18",
      status: "registered",
      notes: "Died peacefully at home",
      facilityId: FACILITY_ID,
      patientId: PATIENT_ID
    };
    
    const newDeath = await client.post('/death-statistics', newDeathData);
    logResponse('Create Death Record', newDeath);
    
    // Store the new death ID for update and delete tests
    const newDeathId = newDeath.data.id || (newDeath.data.data && newDeath.data.data.id);
    
    // Test 9: Update a death record
    if (newDeathId) {
      console.log(`TEST 9: Update death record (${newDeathId})`);
      const updateData = {
        cause_of_death: "Acute Myocardial Infarction",
        secondary_causes: "Hypertension, Diabetes, Atherosclerosis",
        notes: "Updated with more specific diagnosis"
      };
      
      const updatedDeath = await client.put(`/death-statistics/${newDeathId}`, updateData);
      logResponse('Update Death Record', updatedDeath);
    } else {
      console.log('TEST 9: Skipped - No new death record created');
    }
    
    // Test 10: Get death statistics reports by cause
    console.log('TEST 10: Get death statistics by cause');
    const deathStatsByCause = await client.get('/death-statistics/reports/statistics?groupBy=cause');
    logResponse('Death Statistics by Cause', deathStatsByCause);
    
    // Test 11: Get death statistics reports by manner
    console.log('TEST 11: Get death statistics by manner');
    const deathStatsByManner = await client.get('/death-statistics/reports/statistics?groupBy=manner');
    logResponse('Death Statistics by Manner', deathStatsByManner);
    
    // Test 12: Get death statistics by month
    console.log('TEST 12: Get death statistics by month');
    const deathStatsByMonth = await client.get('/death-statistics/reports/statistics?groupBy=month');
    logResponse('Death Statistics by Month', deathStatsByMonth);
    
    // Test 13: Get death statistics by facility
    console.log('TEST 13: Get death statistics by facility');
    const deathStatsByFacility = await client.get('/death-statistics/reports/statistics?groupBy=facility');
    logResponse('Death Statistics by Facility', deathStatsByFacility);
    
    // Test 14: Filter death statistics by date range
    console.log('TEST 14: Filter death statistics by date range');
    const deathStatsByDateRange = await client.get('/death-statistics/reports/statistics?groupBy=cause&dateFrom=2025-01-01&dateTo=2025-12-31');
    logResponse('Death Statistics by Date Range', deathStatsByDateRange);
    
    // Test 15: Filter death statistics by facility
    console.log('TEST 15: Filter death statistics by facility');
    const deathStatsBySpecificFacility = await client.get(`/death-statistics/reports/statistics?groupBy=cause&facilityId=${FACILITY_ID}`);
    logResponse('Death Statistics by Specific Facility', deathStatsBySpecificFacility);
    
    // Test 16: Delete a death record (optional - uncomment to test)
    if (newDeathId) {
      console.log(`TEST 16: Delete death record (${newDeathId})`);
      console.log('WARNING: This test is commented out to prevent accidental deletion');
      console.log('To test deletion, uncomment the code below');
      /*
      const deletedDeath = await client.delete(`/death-statistics/${newDeathId}`);
      logResponse('Delete Death Record', deletedDeath);
      
      // Verify deletion
      try {
        await client.get(`/death-statistics/${newDeathId}`);
      } catch (error) {
        console.log('Verified: Record no longer exists');
      }
      */
    } else {
      console.log('TEST 16: Skipped - No new death record created');
    }
    
    console.log('All death statistics API endpoint tests completed successfully!');
  } catch (error) {
    console.error('Error during testing:');
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
    console.error('Error stack:', error.stack);
  }
}

runTests();