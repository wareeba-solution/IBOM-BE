const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3000/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEzZjViNWQ0LTgwZjItNDdkMC1iMWU4LTJjZjAxZjg0OTdlYyIsInVzZXJuYW1lIjoibmV3YWRtaW4iLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsImlhdCI6MTc0NzUxNjQwNSwiZXhwIjoxNzQ3Njg5MjA1fQ.WmLQ_j5mPbKVVxpqncYLwIx-oxpDSVN2_X220uxT2j0';

// Patient and facility IDs for testing
const FEMALE_PATIENT_ID = '12948934-7416-4362-967b-ff537247c972';
const FACILITY_ID = 'bfe561f4-c9d4-4179-9a37-facdf8819869';
// Known antenatal ID from our previous tests
const ANTENATAL_ID = '1185f4c1-cf8e-4cdd-b768-16d190a23618';

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
  
  // Handle different response formats
  if (response.data.id) {
    console.log(`Record ID: ${response.data.id}`);
    console.log(`Registration Number: ${response.data.registrationNumber || 'N/A'}`);
    console.log(`Patient ID: ${response.data.patientId || 'N/A'}`);
    console.log(`EDD: ${response.data.edd || 'N/A'}`);
    console.log(`Status: ${response.data.status || 'N/A'}`);
  } else if (response.data.data && Array.isArray(response.data.data)) {
    console.log(`Results: ${response.data.data.length} records`);
  } else if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
    console.log(`Results: ${response.data.data.totalItems} total items, ${response.data.data.data.length} in current page`);
  } else {
    console.log('Data:', JSON.stringify(response.data, null, 2));
  }
  console.log('\n---\n');
};

// Helper function to test an API endpoint
const testEndpoint = async (testNumber, testName, endpoint, queryParams = '') => {
  console.log(`TEST ${testNumber}: ${testName}`);
  try {
    const response = await client.get(`${endpoint}${queryParams}`);
    logResponse(testName, response);
    return response.data;
  } catch (error) {
    console.log(`${testName} failed:`, error.response?.data || error.message);
    console.log(`Status: ${error.response?.status || 'Unknown'}`);
    console.log(`Full error:`, error);
    return null;
  }
};

// Test cases
async function runTests() {
  console.log('Starting Antenatal Care API Endpoint Tests...\n');
  
  // Use the existing antenatal ID
  let antenatalId = ANTENATAL_ID;
  console.log(`Using existing antenatal record ID: ${antenatalId}`);
  
  try {
    // PART 1: CORE FUNCTIONALITY TESTS
    console.log('\n=== PART 1: CORE FUNCTIONALITY TESTS ===\n');
    
    // Test 1: Get antenatal care record by ID
    await testEndpoint(1, `Get antenatal care record by ID (${antenatalId})`, `/antenatal/${antenatalId}`);
    
    // Test 2: Search antenatal records
    await testEndpoint(2, 'Search antenatal records (Active status)', '/antenatal', '?status=Active');
    
    // Test 3: Update an antenatal care record
    console.log(`TEST 3: Update antenatal care record (${antenatalId})`);
    const updateData = {
      tetanusVaccination: "Complete",
      malariaProphylaxis: "Received",
      riskLevel: "high",
      riskFactors: ["Previous C-section", "Hypertension"]
    };
    
    try {
      const updatedAntenatal = await client.put(`/antenatal/${antenatalId}`, updateData);
      logResponse('Update Antenatal Record', updatedAntenatal);
    } catch (error) {
      console.log('Update antenatal record failed:', error.response?.data || error.message);
    }
    
    // Test 4: Create an antenatal visit
    console.log(`TEST 4: Create an antenatal visit for record (${antenatalId})`);
    const visitData = {
      antenatalCareId: antenatalId,
      visitDate: "2025-05-19",
      gestationalAge: 13,
      weight: 60.5,
      bloodPressure: "120/80",
      fetalHeartRate: 142,
      fetalMovement: "Present",
      fundusHeight: 13.5,
      presentation: "Not Determined",
      urineProtein: "Negative",
      urineGlucose: "Negative",
      hemoglobin: 12.2,
      complaints: "Mild morning sickness",
      diagnosis: "Normal pregnancy progression",
      treatment: "Continued prenatal vitamins",
      notes: "Patient is adapting well to pregnancy",
      nextAppointment: "2025-06-18"
    };
    
    let visitId = null;
    try {
      const newVisit = await client.post('/antenatal/visits', visitData);
      logResponse('Create Antenatal Visit', newVisit);
      visitId = newVisit.data.id;
    } catch (error) {
      console.log('Create visit failed:', error.response?.data || error.message);
    }
    
    // Test 5: Get visit by ID
    if (visitId) {
      await testEndpoint(5, `Get antenatal visit by ID (${visitId})`, `/antenatal/visits/${visitId}`);
      
      // Test 6: Update visit
      console.log(`TEST 6: Update antenatal visit (${visitId})`);
      const updateVisitData = {
        weight: 61.2,
        bloodPressure: "118/78",
        notes: "Updated: Patient reports improved energy levels"
      };
      
      try {
        const updatedVisit = await client.put(`/antenatal/visits/${visitId}`, updateVisitData);
        logResponse('Update Antenatal Visit', updatedVisit);
      } catch (error) {
        console.log('Update visit failed:', error.response?.data || error.message);
      }
    } else {
      console.log('TEST 5 & 6: Skipped - No visit ID available');
    }
    
    // Test 7: Search visits
    await testEndpoint(7, `Search visits for antenatal record (${antenatalId})`, '/antenatal/visits', `?antenatalCareId=${antenatalId}`);
    
    // Test 8: Get due appointments
    await testEndpoint(8, 'Get due appointments', '/antenatal/appointments/due');
    
    // PART 2: STATISTICS ENDPOINTS TESTS
    console.log('\n=== PART 2: STATISTICS ENDPOINTS TESTS ===\n');
    
    // Common query params
    const dateParams = `?facilityId=${FACILITY_ID}&dateFrom=2024-01-01&dateTo=2025-12-31`;
    
    // Test 9: Basic statistics endpoint
    await testEndpoint(9, 'Get basic antenatal statistics', '/antenatal/statistics', '?groupBy=status');
    
    // Test 10: Antenatal summary statistics
    await testEndpoint(10, 'Get antenatal summary statistics', '/antenatal/statistics/summary', dateParams);
    
    // Test 11: Antenatal by trimester statistics
    await testEndpoint(11, 'Get antenatal by trimester statistics', '/antenatal/statistics/by-trimester', dateParams);
    
    // Test 12: Antenatal by risk level statistics
    await testEndpoint(12, 'Get antenatal by risk level statistics', '/antenatal/statistics/by-risk', dateParams);
    
    // Test 13: Antenatal by age group statistics
    await testEndpoint(13, 'Get antenatal by age group statistics', '/antenatal/statistics/by-age', dateParams);
    
    // Test 14: Top risk factors statistics
    await testEndpoint(14, 'Get top risk factors statistics', '/antenatal/statistics/risk-factors', dateParams);
    
    // Test 15: Monthly registrations statistics
    await testEndpoint(15, 'Get monthly registrations statistics', '/antenatal/statistics/monthly', `?facilityId=${FACILITY_ID}&year=2025`);
    
    // Test 16: Visit compliance statistics
    await testEndpoint(16, 'Get visit compliance statistics', '/antenatal/statistics/compliance', dateParams);
    
    // Test 17: Antenatal by facility statistics
    await testEndpoint(17, 'Get antenatal by facility statistics', '/antenatal/statistics/by-facility', '?dateFrom=2024-01-01&dateTo=2025-12-31');
    
    // Test 18: Delivery outcomes statistics
    await testEndpoint(18, 'Get delivery outcomes statistics', '/antenatal/statistics/delivery-outcomes', dateParams);
    
    // Test 19: Antenatal trends statistics
    await testEndpoint(19, 'Get antenatal trends statistics', '/antenatal/statistics/trends', `?facilityId=${FACILITY_ID}&months=12`);
    
    // Test 20: All antenatal statistics (comprehensive)
    await testEndpoint(20, 'Get all antenatal statistics (comprehensive)', '/antenatal/statistics/all', dateParams);
    
    console.log('All antenatal API endpoint tests completed!');
    
  } catch (error) {
    console.error('Error during testing:', error.response?.data || error.message);
    console.error('Error details:', error.stack);
  }
}

// Add ability to test individual endpoints for debugging
async function testIndividualEndpoint(endpoint, queryParams = '') {
  try {
    console.log(`Testing individual endpoint: ${endpoint}${queryParams}`);
    const response = await client.get(`${endpoint}${queryParams}`);
    logResponse(`Individual test: ${endpoint}`, response);
  } catch (error) {
    console.log(`Test failed:`, error.response?.data || error.message);
    console.log(`Status: ${error.response?.status || 'Unknown'}`);
    console.log(`Full error:`, error);
  }
}

// Uncomment and modify this line to test individual endpoints
// testIndividualEndpoint('/antenatal/statistics/by-age', `?facilityId=${FACILITY_ID}&dateFrom=2024-01-01&dateTo=2025-12-31`);

// Run all tests
runTests();