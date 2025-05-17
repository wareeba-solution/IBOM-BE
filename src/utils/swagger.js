const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Basic information about your API
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Akwa Ibom Health Data Collection API',
      version: '1.0.0',
      description: 'API documentation for the Akwa Ibom Health Data Collection System',
      contact: {
        name: 'API Support',
        email: 'support@akwaibomhealth.gov.ng',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Facilities',
        description: 'Facility management endpoints',
      },
      {
        name: 'Patients',
        description: 'Patient management endpoints',
      },
      {
        name: 'Births',
        description: 'Birth records endpoints',
      },
      {
        name: 'Deaths',
        description: 'Death records endpoints',
      },
      {
        name: 'Immunizations',
        description: 'Immunization records endpoints',
      },
      {
        name: 'Antenatal',
        description: 'Antenatal care endpoints',
      },
      {
        name: 'Diseases',
        description: 'Communicable diseases endpoints',
      },
      {
        name: 'Reports',
        description: 'Reporting endpoints',
      },
      {
        name: 'Admin',
        description: 'Admin endpoints',
      },
    ],
  },
  // Path to the API docs
  apis: [
    './src/docs/swagger/*.js',  // Add this line to include the new documentation files
    './src/api/routes/*.js',    // Existing paths
    './src/api/controllers/*.js',
    './src/models/*.js',
  ],
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Setup swagger middleware
const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Akwa Ibom Health API Documentation',
  }));
  
  // Add a route to serve the OpenAPI specification as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });
  
  console.log('Swagger documentation available at /api-docs');
};

module.exports = swaggerSetup;