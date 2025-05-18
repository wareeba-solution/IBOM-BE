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
    console.log(`Registration Number: ${response.data.registrationNumber}`);
    console.log(`Patient ID: ${response.data.patientId}`);
    console.log(`EDD: ${response.data.edd}`);
    console.log(`Status: ${response.data.status}`);
  } else if (response.data.data && Array.isArray(response.data.data)) {
    console.log(`Results: ${response.data.data.length} records`);
  } else if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
    console.log(`Results: ${response.data.data.totalItems} total items, ${response.data.data.data.length} in current page`);
  } else {
    console.log('Data:', JSON.stringify(response.data, null, 2));
  }
  console.log('\n---\n');
};

// Test cases
async function runTests() {
  console.log('Starting Antenatal Care API Endpoint Tests...\n');
  
  // Use the existing antenatal ID
  let antenatalId = ANTENATAL_ID;
  console.log(`Using existing antenatal record ID: ${antenatalId}`);
  
  try {
    // Test 1: Get antenatal care record by ID
    console.log(`TEST 1: Get antenatal care record by ID (${antenatalId})`);
    try {
      const singleAntenatal = await client.get(`/antenatal/${antenatalId}`);
      logResponse('Get Antenatal by ID', singleAntenatal);
    } catch (error) {
      console.log('Get antenatal record failed:', error.response?.data || error.message);
    }
    
    // Test 2: Search antenatal records
    console.log('TEST 2: Search antenatal records (Active status)');
    try {
      const activeAntenatal = await client.get('/antenatal?status=Active');
      logResponse('Search Active Antenatal Records', activeAntenatal);
    } catch (error) {
      console.log('Search failed:', error.response?.data || error.message);
    }
    
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
      console.log(`TEST 5: Get antenatal visit by ID (${visitId})`);
      try {
        const singleVisit = await client.get(`/antenatal/visits/${visitId}`);
        logResponse('Get Visit by ID', singleVisit);
      } catch (error) {
        console.log('Get visit failed:', error.response?.data || error.message);
      }
      
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
    console.log(`TEST 7: Search visits for antenatal record (${antenatalId})`);
    try {
      const visits = await client.get(`/antenatal/visits?antenatalCareId=${antenatalId}`);
      logResponse('Search Visits', visits);
    } catch (error) {
      console.log('Search visits failed:', error.response?.data || error.message);
    }
    
    // Test 8: Get antenatal statistics
    console.log('TEST 8: Get antenatal statistics');
    try {
      const stats = await client.get('/antenatal/statistics?groupBy=status');
      logResponse('Antenatal Statistics', stats);
    } catch (error) {
      console.log('Statistics failed:', error.response?.data || error.message);
    }
    
    // Test 9: Get due appointments
    console.log('TEST 9: Get due appointments');
    try {
      const appointments = await client.get('/antenatal/appointments/due');
      logResponse('Due Appointments', appointments);
    } catch (error) {
      console.log('Due appointments failed:', error.response?.data || error.message);
    }
    
    console.log('All antenatal API endpoint tests completed!');
    
  } catch (error) {
    console.error('Error during testing:', error.response?.data || error.message);
    console.error('Error details:', error.stack);
  }
}

runTests();