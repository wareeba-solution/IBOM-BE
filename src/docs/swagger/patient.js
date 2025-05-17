/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Patient ID
 *         uniqueIdentifier:
 *           type: string
 *           description: Unique patient identifier
 *         firstName:
 *           type: string
 *           description: Patient's first name
 *         lastName:
 *           type: string
 *           description: Patient's last name
 *         otherNames:
 *           type: string
 *           description: Patient's other names
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Patient's date of birth
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Patient's gender
 *         address:
 *           type: string
 *           description: Patient's address
 *         lgaOrigin:
 *           type: string
 *           description: Patient's LGA of origin
 *         lgaResidence:
 *           type: string
 *           description: Patient's LGA of residence
 *         bloodGroup:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-, unknown]
 *           description: Patient's blood group
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: ID of the facility where patient is registered
 */

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *     responses:
 *       200:
 *         description: List of patients
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient created successfully
 * 
 * /api/patients/registration/stage/1:
 *   post:
 *     summary: Submit stage 1 (Personal Information)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - dateOfBirth
 *               - gender
 *               - facilityId
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               facilityId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Stage 1 submitted
 * 
 * /api/patients/registration/stage/2:
 *   post:
 *     summary: Submit stage 2 (Contact Details)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *             properties:
 *               patientId:
 *                 type: string
 *                 format: uuid
 *               address:
 *                 type: string
 *               lgaOrigin:
 *                 type: string
 *               lgaResidence:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stage 2 submitted
 * 
 * /api/patients/registration/stage/3:
 *   post:
 *     summary: Submit stage 3 (Medical Information)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *             properties:
 *               patientId:
 *                 type: string
 *                 format: uuid
 *               bloodGroup:
 *                 type: string
 *                 enum: [A+, A-, B+, B-, AB+, AB-, O+, O-, unknown]
 *     responses:
 *       200:
 *         description: Stage 3 submitted
 * 
 * /api/patients/registration/stage/4:
 *   post:
 *     summary: Submit stage 4 (Emergency Contact)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - emergencyContactName
 *               - emergencyContactPhone
 *             properties:
 *               patientId:
 *                 type: string
 *                 format: uuid
 *               emergencyContactName:
 *                 type: string
 *               emergencyContactPhone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration completed
 */