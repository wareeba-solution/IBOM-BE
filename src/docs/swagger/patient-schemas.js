// src/docs/swagger/patient-schemas.js

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
 *     PatientSearchResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Patient'
 *           description: Array of patients matching search criteria
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
 *               description: Total number of matching patients
 *             totalPages:
 *               type: integer
 *               description: Total number of pages
 *         searchCriteria:
 *           type: object
 *           description: Applied search criteria
 *           properties:
 *             term:
 *               type: string
 *               description: General search term used
 *             filters:
 *               type: object
 *               description: Specific filters applied
 */