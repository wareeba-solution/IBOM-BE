// src/docs/swagger/patient-endpoints.js

/**
 * Complete Swagger Documentation for Patient Management Module
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "Enter JWT token in the format: Bearer <token>"
 * 
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *         - gender
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the patient
 *           readOnly: true
 *         uniqueIdentifier:
 *           type: string
 *           description: System-generated unique identifier for the patient
 *           readOnly: true
 *           example: "PAT-2025-001234"
 *         firstName:
 *           type: string
 *           description: Patient's first name
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: Patient's last name
 *           example: "Doe"
 *         otherNames:
 *           type: string
 *           nullable: true
 *           description: Patient's other names or middle names
 *           example: "Michael"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Patient's date of birth
 *           example: "1990-05-15"
 *         gender:
 *           type: string
 *           description: Patient's gender
 *           example: "Male"
 *         maritalStatus:
 *           type: string
 *           nullable: true
 *           description: Patient's marital status
 *           example: "Married"
 *         occupation:
 *           type: string
 *           nullable: true
 *           description: Patient's occupation
 *           example: "Teacher"
 *         registrationDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Date when patient was registered
 *           example: "2025-01-15"
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *           description: Patient's phone number
 *           example: "+234-801-234-5678"
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           description: Patient's email address
 *           example: "john.doe@email.com"
 *         address:
 *           type: string
 *           nullable: true
 *           description: Patient's home address
 *           example: "123 Main Street, Garki District"
 *         city:
 *           type: string
 *           nullable: true
 *           description: Patient's city of residence
 *           example: "Abuja"
 *         state:
 *           type: string
 *           nullable: true
 *           description: Patient's state of residence
 *           example: "FCT"
 *         postalCode:
 *           type: string
 *           nullable: true
 *           description: Patient's postal code
 *           example: "900001"
 *         lgaOrigin:
 *           type: string
 *           nullable: true
 *           description: Patient's Local Government Area of origin
 *           example: "Gwagwalada"
 *         lgaResidence:
 *           type: string
 *           nullable: true
 *           description: Patient's Local Government Area of residence
 *           example: "Municipal Area Council"
 *         bloodGroup:
 *           type: string
 *           nullable: true
 *           description: Patient's blood group
 *           example: "O+"
 *         genotype:
 *           type: string
 *           nullable: true
 *           description: Patient's genotype
 *           example: "AA"
 *         allergies:
 *           type: string
 *           nullable: true
 *           description: Patient's known allergies
 *           example: "Penicillin, Peanuts"
 *         chronicConditions:
 *           type: string
 *           nullable: true
 *           description: Patient's chronic medical conditions
 *           example: "Hypertension, Diabetes Type 2"
 *         medicalNotes:
 *           type: string
 *           nullable: true
 *           description: Additional medical notes
 *           example: "Patient has history of asthma, requires inhaler"
 *         status:
 *           type: string
 *           nullable: true
 *           description: Patient's current status
 *           example: "Active"
 *         emergencyContactName:
 *           type: string
 *           nullable: true
 *           description: Name of emergency contact person
 *           example: "Jane Doe"
 *         emergencyContactRelationship:
 *           type: string
 *           nullable: true
 *           description: Relationship to emergency contact
 *           example: "Spouse"
 *         emergencyContactPhone:
 *           type: string
 *           nullable: true
 *           description: Emergency contact phone number
 *           example: "+234-801-234-5679"
 *         emergencyContactAddress:
 *           type: string
 *           nullable: true
 *           description: Emergency contact address
 *           example: "123 Main Street, Garki District, Abuja"
 *         facilityId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the facility where patient was registered
 *         createdBy:
 *           type: string
 *           format: uuid
 *           description: ID of user who created this record
 *           readOnly: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           readOnly: true
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Soft deletion timestamp
 *           readOnly: true
 * 
 *     CreatePatientRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *       properties:
 *         firstName:
 *           type: string
 *           description: Patient's first name
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: Patient's last name
 *           example: "Doe"
 *         otherNames:
 *           type: string
 *           nullable: true
 *           description: Patient's other names or middle names
 *           example: "Michael"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Patient's date of birth
 *           example: "1990-05-15"
 *         gender:
 *           type: string
 *           nullable: true
 *           description: Patient's gender
 *           example: "Male"
 *         maritalStatus:
 *           type: string
 *           nullable: true
 *           description: Patient's marital status
 *           example: "Married"
 *         occupation:
 *           type: string
 *           nullable: true
 *           description: Patient's occupation
 *           example: "Teacher"
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *           description: Patient's phone number
 *           example: "+234-801-234-5678"
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           description: Patient's email address
 *           example: "john.doe@email.com"
 *         address:
 *           type: string
 *           nullable: true
 *           description: Patient's home address
 *           example: "123 Main Street, Garki District"
 *         city:
 *           type: string
 *           nullable: true
 *           description: Patient's city of residence
 *           example: "Abuja"
 *         state:
 *           type: string
 *           nullable: true
 *           description: Patient's state of residence
 *           example: "FCT"
 *         postalCode:
 *           type: string
 *           nullable: true
 *           description: Patient's postal code
 *           example: "900001"
 *         lgaOrigin:
 *           type: string
 *           nullable: true
 *           description: Patient's Local Government Area of origin
 *           example: "Gwagwalada"
 *         lgaResidence:
 *           type: string
 *           nullable: true
 *           description: Patient's Local Government Area of residence
 *           example: "Municipal Area Council"
 *         bloodGroup:
 *           type: string
 *           nullable: true
 *           description: Patient's blood group
 *           example: "O+"
 *         genotype:
 *           type: string
 *           nullable: true
 *           description: Patient's genotype
 *           example: "AA"
 *         allergies:
 *           type: string
 *           nullable: true
 *           description: Patient's known allergies
 *           example: "Penicillin, Peanuts"
 *         chronicConditions:
 *           type: string
 *           nullable: true
 *           description: Patient's chronic medical conditions
 *           example: "Hypertension, Diabetes Type 2"
 *         medicalNotes:
 *           type: string
 *           nullable: true
 *           description: Additional medical notes
 *           example: "Patient has history of asthma, requires inhaler"
 *         status:
 *           type: string
 *           nullable: true
 *           description: Patient's current status
 *           example: "Active"
 *         emergencyContactName:
 *           type: string
 *           nullable: true
 *           description: Name of emergency contact person
 *           example: "Jane Doe"
 *         emergencyContactRelationship:
 *           type: string
 *           nullable: true
 *           description: Relationship to emergency contact
 *           example: "Spouse"
 *         emergencyContactPhone:
 *           type: string
 *           nullable: true
 *           description: Emergency contact phone number
 *           example: "+234-801-234-5679"
 *         emergencyContactAddress:
 *           type: string
 *           nullable: true
 *           description: Emergency contact address
 *           example: "123 Main Street, Garki District, Abuja"
 * 
 *     UpdatePatientRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: Patient's first name
 *         lastName:
 *           type: string
 *           description: Patient's last name
 *         otherNames:
 *           type: string
 *           nullable: true
 *           description: Patient's other names or middle names
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Patient's date of birth
 *         gender:
 *           type: string
 *           nullable: true
 *           description: Patient's gender
 *         maritalStatus:
 *           type: string
 *           nullable: true
 *           description: Patient's marital status
 *         occupation:
 *           type: string
 *           nullable: true
 *           description: Patient's occupation
 *         registrationDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Date when patient was registered
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *           description: Patient's phone number
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           description: Patient's email address
 *         address:
 *           type: string
 *           nullable: true
 *           description: Patient's home address
 *         city:
 *           type: string
 *           nullable: true
 *           description: Patient's city of residence
 *         state:
 *           type: string
 *           nullable: true
 *           description: Patient's state of residence
 *         postalCode:
 *           type: string
 *           nullable: true
 *           description: Patient's postal code
 *         lgaOrigin:
 *           type: string
 *           nullable: true
 *           description: Patient's Local Government Area of origin
 *         lgaResidence:
 *           type: string
 *           nullable: true
 *           description: Patient's Local Government Area of residence
 *         bloodGroup:
 *           type: string
 *           nullable: true
 *           description: Patient's blood group
 *         genotype:
 *           type: string
 *           nullable: true
 *           description: Patient's genotype
 *         allergies:
 *           type: string
 *           nullable: true
 *           description: Patient's known allergies
 *         chronicConditions:
 *           type: string
 *           nullable: true
 *           description: Patient's chronic medical conditions
 *         medicalNotes:
 *           type: string
 *           nullable: true
 *           description: Additional medical notes
 *         status:
 *           type: string
 *           nullable: true
 *           description: Patient's current status
 *         emergencyContactName:
 *           type: string
 *           nullable: true
 *           description: Name of emergency contact person
 *         emergencyContactRelationship:
 *           type: string
 *           nullable: true
 *           description: Relationship to emergency contact
 *         emergencyContactPhone:
 *           type: string
 *           nullable: true
 *           description: Emergency contact phone number
 *         emergencyContactAddress:
 *           type: string
 *           nullable: true
 *           description: Emergency contact address
 * 
 *     PaginatedPatientsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Patient'
 *           description: Array of patients for current page
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               description: Current page number
 *             limit:
 *               type: integer
 *               description: Items per page
 *             total:
 *               type: integer
 *               description: Total number of patients
 *             totalPages:
 *               type: integer
 *               description: Total number of pages
 * 
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the request was successful
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           description: Response data (varies by endpoint)
 *         errors:
 *           type: object
 *           description: Validation errors (if any)
 */

/**
 * @swagger
 * tags:
 *   - name: Patients
 *     description: Patient management operations
 */

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     description: Retrieve a paginated list of all patients with optional filtering
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of patients per page
 *         example: 20
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by facility ID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: Filter by gender
 *         example: "Male"
 *       - in: query
 *         name: lgaResidence
 *         schema:
 *           type: string
 *         description: Filter by Local Government Area of residence
 *         example: "Municipal Area Council"
 *       - in: query
 *         name: ageFrom
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 150
 *         description: Minimum age filter
 *         example: 18
 *       - in: query
 *         name: ageTo
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 150
 *         description: Maximum age filter
 *         example: 65
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Patients retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/PaginatedPatientsResponse'
 *             example:
 *               success: true
 *               message: "Patients retrieved successfully"
 *               data:
 *                 data:
 *                   - id: "123e4567-e89b-12d3-a456-426614174000"
 *                     uniqueIdentifier: "PAT-2025-001234"
 *                     firstName: "John"
 *                     lastName: "Doe"
 *                     dateOfBirth: "1990-05-15"
 *                     gender: "Male"
 *                     phoneNumber: "+234-801-234-5678"
 *                     email: "john.doe@email.com"
 *                     status: "Active"
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 150
 *                   totalPages: 15
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid query parameters"
 *               errors:
 *                 page: "Page must be a positive integer"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized access"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 * 
 *   post:
 *     summary: Create a new patient
 *     description: Register a new patient in the system
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePatientRequest'
 *           example:
 *             firstName: "John"
 *             lastName: "Doe"
 *             otherNames: "Michael"
 *             dateOfBirth: "1990-05-15"
 *             gender: "Male"
 *             maritalStatus: "Married"
 *             occupation: "Teacher"
 *             phoneNumber: "+234-801-234-5678"
 *             email: "john.doe@email.com"
 *             address: "123 Main Street, Garki District"
 *             city: "Abuja"
 *             state: "FCT"
 *             lgaResidence: "Municipal Area Council"
 *             bloodGroup: "O+"
 *             genotype: "AA"
 *             emergencyContactName: "Jane Doe"
 *             emergencyContactRelationship: "Spouse"
 *             emergencyContactPhone: "+234-801-234-5679"
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Patient created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *             example:
 *               success: true
 *               message: "Patient created successfully"
 *               data:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 uniqueIdentifier: "PAT-2025-001234"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 dateOfBirth: "1990-05-15"
 *                 gender: "Male"
 *                 createdAt: "2025-01-15T10:30:00Z"
 *       400:
 *         description: Validation error or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Validation error"
 *               errors:
 *                 firstName: "First name is required"
 *                 dateOfBirth: "Date of birth is required"
 *                 email: "Invalid email format"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Facility not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Facility not found"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /patients/search:
 *   get:
 *     summary: Search patients
 *     description: Search for patients using various criteria
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: term
 *         schema:
 *           type: string
 *         description: General search term (searches across multiple fields)
 *         example: "John Doe"
 *       - in: query
 *         name: uniqueIdentifier
 *         schema:
 *           type: string
 *         description: Search by unique identifier
 *         example: "PAT-2025-001234"
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Search by first name
 *         example: "John"
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Search by last name
 *         example: "Doe"
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: Search by phone number
 *         example: "+234-801-234-5678"
 *       - in: query
 *         name: dateOfBirth
 *         schema:
 *           type: string
 *           format: date
 *         description: Search by date of birth
 *         example: "1990-05-15"
 *       - in: query
 *         name: lgaResidence
 *         schema:
 *           type: string
 *         description: Filter by Local Government Area of residence
 *         example: "Municipal Area Council"
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by facility ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of patients per page
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Search results retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/PaginatedPatientsResponse'
 *             example:
 *               success: true
 *               message: "Search results retrieved successfully"
 *               data:
 *                 data:
 *                   - id: "123e4567-e89b-12d3-a456-426614174000"
 *                     uniqueIdentifier: "PAT-2025-001234"
 *                     firstName: "John"
 *                     lastName: "Doe"
 *                     phoneNumber: "+234-801-234-5678"
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 5
 *                   totalPages: 1
 *       400:
 *         description: Invalid search parameters
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     description: Retrieve a specific patient by their unique ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the patient
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Patient retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *             example:
 *               success: true
 *               message: "Patient retrieved successfully"
 *               data:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 uniqueIdentifier: "PAT-2025-001234"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 otherNames: "Michael"
 *                 dateOfBirth: "1990-05-15"
 *                 gender: "Male"
 *                 maritalStatus: "Married"
 *                 occupation: "Teacher"
 *                 phoneNumber: "+234-801-234-5678"
 *                 email: "john.doe@email.com"
 *                 address: "123 Main Street, Garki District"
 *                 city: "Abuja"
 *                 state: "FCT"
 *                 lgaResidence: "Municipal Area Council"
 *                 bloodGroup: "O+"
 *                 genotype: "AA"
 *                 emergencyContactName: "Jane Doe"
 *                 emergencyContactRelationship: "Spouse"
 *                 emergencyContactPhone: "+234-801-234-5679"
 *                 status: "Active"
 *                 createdAt: "2025-01-15T10:30:00Z"
 *                 updatedAt: "2025-01-15T10:30:00Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Patient not found"
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update patient
 *     description: Update an existing patient's information
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePatientRequest'
 *           example:
 *             phoneNumber: "+234-801-234-9999"
 *             email: "john.doe.updated@email.com"
 *             address: "456 New Street, Maitama District"
 *             occupation: "Senior Teacher"
 *             maritalStatus: "Married"
 *             emergencyContactPhone: "+234-801-234-8888"
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Patient updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *             example:
 *               success: true
 *               message: "Patient updated successfully"
 *               data:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 uniqueIdentifier: "PAT-2025-001234"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 phoneNumber: "+234-801-234-9999"
 *                 email: "john.doe.updated@email.com"
 *                 updatedAt: "2025-01-15T15:45:00Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Validation error"
 *               errors:
 *                 email: "Invalid email format"
 *                 phoneNumber: "Invalid phone number format"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete patient
 *     description: Delete a patient from the system (soft delete)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the patient
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Patient deleted successfully"
 *             example:
 *               success: true
 *               message: "Patient deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Patient not found"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /patients/identifier/{uniqueIdentifier}:
 *   get:
 *     summary: Get patient by unique identifier
 *     description: Retrieve a specific patient by their system-generated unique identifier
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uniqueIdentifier
 *         required: true
 *         schema:
 *           type: string
 *         description: System-generated unique identifier of the patient
 *         example: "PAT-2025-001234"
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Patient retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *             example:
 *               success: true
 *               message: "Patient retrieved successfully"
 *               data:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 uniqueIdentifier: "PAT-2025-001234"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 otherNames: "Michael"
 *                 dateOfBirth: "1990-05-15"
 *                 gender: "Male"
 *                 maritalStatus: "Married"
 *                 occupation: "Teacher"
 *                 phoneNumber: "+234-801-234-5678"
 *                 email: "john.doe@email.com"
 *                 address: "123 Main Street, Garki District"
 *                 city: "Abuja"
 *                 state: "FCT"
 *                 lgaResidence: "Municipal Area Council"
 *                 bloodGroup: "O+"
 *                 genotype: "AA"
 *                 emergencyContactName: "Jane Doe"
 *                 emergencyContactRelationship: "Spouse"
 *                 emergencyContactPhone: "+234-801-234-5679"
 *                 status: "Active"
 *                 createdAt: "2025-01-15T10:30:00Z"
 *                 updatedAt: "2025-01-15T10:30:00Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized access"
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Patient not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 */