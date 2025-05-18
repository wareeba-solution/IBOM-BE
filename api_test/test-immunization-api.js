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
  
  if (response.data.data) {
    if (Array.isArray(response.data.data)) {
      console.log(`Results: ${response.data.data.length} records`);
    } else if (response.data.data.id) {
      console.log(`Immunization ID: ${response.data.data.id}`);
      console.log(`Patient ID: ${response.data.data.patientId}`);
      console.log(`Vaccine Type: ${response.data.data.vaccineType}`);
      console.log(`Administration Date: ${response.data.data.administrationDate}`);
      console.log(`Status: ${response.data.data.status}`);
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
  console.log('Starting Immunization API Endpoint Tests...\n');
  
  try {
    // Test 1: Get all immunization records (paginated)
    console.log('TEST 1: Get all immunization records');
    const allImmunizations = await client.get('/immunizations');
    logResponse('Get All Immunizations', allImmunizations);
    
    // Store an ID for later tests
    let immunizationId = null;
    if (allImmunizations.data.data && allImmunizations.data.data.data && allImmunizations.data.data.data.length > 0) {
      immunizationId = allImmunizations.data.data.data[0].id;
    } else if (Array.isArray(allImmunizations.data.data) && allImmunizations.data.data.length > 0) {
      immunizationId = allImmunizations.data.data[0].id;
    } else if (allImmunizations.data.data && allImmunizations.data.data.length > 0) {
      immunizationId = allImmunizations.data.data[0].id;
    }
    
    // Test 2: Pagination
    console.log('TEST 2: Pagination (page 1, limit 5)');
    const paginatedImmunizations = await client.get('/immunizations?page=1&limit=5');
    logResponse('Paginated Immunizations', paginatedImmunizations);
    
    // Test 3: Get immunization record by ID
    if (immunizationId) {
      console.log(`TEST 3: Get immunization record by ID (${immunizationId})`);
      const singleImmunization = await client.get(`/immunizations/${immunizationId}`);
      logResponse('Get Immunization by ID', singleImmunization);
    } else {
      console.log('TEST 3: Skipped - No immunization records found');
    }
    
    // Test 4: Search immunizations by vaccine type
    console.log('TEST 4: Search immunizations by vaccine type (Pentavalent)');
    const immunizationsByVaccine = await client.get('/immunizations?vaccineType=Pentavalent');
    logResponse('Search Immunizations by Vaccine Type', immunizationsByVaccine);
    
    // Test 5: Search immunizations by patient
    console.log(`TEST 5: Search immunizations by patient (${PATIENT_ID})`);
    const immunizationsByPatient = await client.get(`/immunizations?patientId=${PATIENT_ID}`);
    logResponse('Search Immunizations by Patient', immunizationsByPatient);
    
    // Test 6: Search immunizations by status
    console.log('TEST 6: Search immunizations by status (Administered)');
    const immunizationsByStatus = await client.get('/immunizations?status=Administered');
    logResponse('Search by Status', immunizationsByStatus);
    
    // Test 7: Search immunizations by date range
    console.log('TEST 7: Search immunizations by date range (2025)');
    const immunizationsByDate = await client.get('/immunizations?dateFrom=2025-01-01&dateTo=2025-12-31');
    logResponse('Search by Date Range', immunizationsByDate);
    
    // Test 8: Create a new immunization record
    console.log('TEST 8: Create a new immunization record');
    const newImmunizationData = {
      patientId: PATIENT_ID,
      facilityId: FACILITY_ID,
      vaccineType: "Rotavirus",
      vaccineName: "Rotavirus",
      doseNumber: 1,
      batchNumber: "ROT12345",
      administrationDate: "2025-05-17",
      expiryDate: "2027-05-17",
      administeredBy: "Dr. Johnson",
      administrationSite: "Oral",
      administrationRoute: "Oral",
      status: "Administered",
      notes: "First dose of Rotavirus vaccine",
      weightKg: 10.2,
      heightCm: 70.5,
      ageMonths: 6
    };
    
    const newImmunization = await client.post('/immunizations', newImmunizationData);
    logResponse('Create Immunization Record', newImmunization);
    
    // Store the new immunization ID for update and delete tests
    const newImmunizationId = newImmunization.data.data && newImmunization.data.data.id;
    
    // Test 9: Update an immunization record
    if (newImmunizationId) {
      console.log(`TEST 9: Update immunization record (${newImmunizationId})`);
      const updateData = {
        weightKg: 10.5,
        sideEffects: "Mild fever for 24 hours",
        notes: "First dose of Rotavirus vaccine, mild reaction noted"
      };
      
      const updatedImmunization = await client.put(`/immunizations/${newImmunizationId}`, updateData);
      logResponse('Update Immunization Record', updatedImmunization);
    } else {
      console.log('TEST 9: Skipped - No new immunization record created');
    }
    
    // Test 10: Get patient immunization history
    console.log(`TEST 10: Get patient immunization history (${PATIENT_ID})`);
    const patientHistory = await client.get(`/immunizations/patient/${PATIENT_ID}/history`);
    logResponse('Patient Immunization History', patientHistory);
    
    // Test 11: Schedule an immunization
    console.log('TEST 11: Schedule an immunization');
    const scheduleData = {
      patientId: PATIENT_ID,
      facilityId: FACILITY_ID,
      vaccineType: "Measles",
      vaccineName: "Measles",
      doseNumber: 1,
      scheduledDate: "2025-07-15",
      notes: "First dose of Measles vaccine"
    };
    
    const scheduledImmunization = await client.post('/immunizations/schedule', scheduleData);
    logResponse('Schedule Immunization', scheduledImmunization);
    
    // Store the scheduled immunization ID
    const scheduledImmunizationId = scheduledImmunization.data.data && scheduledImmunization.data.data.id;
    
    // Test 12: Get due immunizations
    console.log('TEST 12: Get due immunizations');
    const dueImmunizations = await client.get('/immunizations/due?dateFrom=2025-05-01&dateTo=2025-12-31');
    logResponse('Due Immunizations', dueImmunizations);
    
    // Test 13: Get immunization statistics by vaccine type
    console.log('TEST 13: Get immunization statistics by vaccine type');
    const immunizationStatsByVaccine = await client.get('/immunizations/statistics?groupBy=vaccine');
    logResponse('Immunization Statistics by Vaccine', immunizationStatsByVaccine);
    
    // Test 14: Get immunization statistics by month
    console.log('TEST 14: Get immunization statistics by month');
    const immunizationStatsByMonth = await client.get('/immunizations/statistics?groupBy=month');
    logResponse('Immunization Statistics by Month', immunizationStatsByMonth);
    
    // Test 15: Get immunization statistics by facility
    console.log('TEST 15: Get immunization statistics by facility');
    const immunizationStatsByFacility = await client.get('/immunizations/statistics?groupBy=facility');
    logResponse('Immunization Statistics by Facility', immunizationStatsByFacility);
    
    // Test 16: Get immunization statistics by age group
    console.log('TEST 16: Get immunization statistics by age group');
    const immunizationStatsByAge = await client.get('/immunizations/statistics?groupBy=age');
    logResponse('Immunization Statistics by Age', immunizationStatsByAge);
    
    // Test 17: Filter immunization statistics by date range
    console.log('TEST 17: Filter immunization statistics by date range');
    const immunizationStatsByDateRange = await client.get('/immunizations/statistics?groupBy=vaccine&dateFrom=2025-01-01&dateTo=2025-12-31');
    logResponse('Immunization Statistics by Date Range', immunizationStatsByDateRange);
    
    // Test 18: Filter immunization statistics by facility
    console.log('TEST 18: Filter immunization statistics by facility');
    const immunizationStatsBySpecificFacility = await client.get(`/immunizations/statistics?groupBy=vaccine&facilityId=${FACILITY_ID}`);
    logResponse('Immunization Statistics by Specific Facility', immunizationStatsBySpecificFacility);
    
    // Test 19: Delete an immunization record (optional - uncomment to test)
    if (newImmunizationId) {
      console.log(`TEST 19: Delete immunization record (${newImmunizationId})`);
      console.log('WARNING: This test is commented out to prevent accidental deletion');
      console.log('To test deletion, uncomment the code below');
      /*
      const deletedImmunization = await client.delete(`/immunizations/${newImmunizationId}`);
      logResponse('Delete Immunization Record', deletedImmunization);
      
      // Verify deletion
      try {
        await client.get(`/immunizations/${newImmunizationId}`);
      } catch (error) {
        console.log('Verified: Record no longer exists');
      }
      */
    } else {
      console.log('TEST 19: Skipped - No new immunization record created');
    }
    
    // Test 20: Create with backend naming convention
    console.log('TEST 20: Create immunization with backend naming convention');
    const backendStyleData = {
      patientId: PATIENT_ID,
      facilityId: FACILITY_ID,
      vaccineType: "Pneumococcal",
      vaccineName: "Pneumococcal",
      doseNumber: 1,
      batchNumber: "PCV12345",
      administrationDate: "2025-05-17",
      expiryDate: "2027-05-17",
      administeredBy: "Dr. Adams",
      administrationSite: "Left Arm",
      administrationRoute: "Intramuscular",
      weightKg: 11.2,
      heightCm: 72.5,
      ageMonths: 7,
      notes: "First dose of Pneumococcal vaccine",
      status: "Administered"
    };
    
    const backendStyleImmunization = await client.post('/immunizations', backendStyleData);
    logResponse('Create Immunization with Backend Naming', backendStyleImmunization);
    
    console.log('All immunization API endpoint tests completed successfully!');
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