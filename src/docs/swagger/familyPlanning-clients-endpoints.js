// src/docs/swagger/familyPlanning-clients-endpoints.js

/**
 * @swagger
 * tags:
 *   - name: Family Planning Clients
 *     description: Management of family planning clients and their registration
 */

/**
 * @swagger
 * /family-planning/clients:
 *   post:
 *     summary: Register a new family planning client
 *     description: Register a patient as a family planning client
 *     tags: [Family Planning Clients]
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
 *               - facilityId
 *               - registrationDate
 *               - clientType
 *               - maritalStatus
 *             properties:
 *               patientId:
 *                 type: string
 *                 format: uuid
 *                 description: Reference to the patient record
 *               facilityId:
 *                 type: string
 *                 format: uuid
 *                 description: Reference to the facility where client is registered
 *               registrationDate:
 *                 type: string
 *                 format: date
 *                 description: Date when client was registered for family planning services
 *               clientType:
 *                 type: string
 *                 enum: [New Acceptor, Continuing User, Restart]
 *                 description: Type of family planning client
 *               maritalStatus:
 *                 type: string
 *                 enum: [Single, Married, Divorced, Widowed, Separated, Other]
 *                 description: Marital status of the client
 *               numberOfChildren:
 *                 type: integer
 *                 minimum: 0
 *                 nullable: true
 *                 description: Current number of children
 *               desiredNumberOfChildren:
 *                 type: integer
 *                 minimum: 0
 *                 nullable: true
 *                 description: Desired total number of children
 *               educationLevel:
 *                 type: string
 *                 enum: [None, Primary, Secondary, Tertiary, Unknown]
 *                 description: Highest level of education completed
 *               occupation:
 *                 type: string
 *                 nullable: true
 *                 description: Client's occupation
 *               primaryContact:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   name:
 *                     type: string
 *                     nullable: true
 *                     description: Name of primary contact person
 *                   relationship:
 *                     type: string
 *                     nullable: true
 *                     description: Relationship to client
 *                   phoneNumber:
 *                     type: string
 *                     nullable: true
 *                     description: Contact phone number
 *                   address:
 *                     type: string
 *                     nullable: true
 *                     description: Contact address
 *               medicalHistory:
 *                 type: string
 *                 nullable: true
 *                 description: Relevant medical history
 *               allergyHistory:
 *                 type: string
 *                 nullable: true
 *                 description: Known allergies
 *               reproductiveHistory:
 *                 type: string
 *                 nullable: true
 *                 description: Previous pregnancies, births, miscarriages
 *               menstrualHistory:
 *                 type: string
 *                 nullable: true
 *                 description: Menstrual cycle information
 *               referredBy:
 *                 type: string
 *                 nullable: true
 *                 description: Who referred the client
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 description: Additional notes about the client
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Transferred, Lost to Follow-up]
 *                 description: Current status of the client
 *           example:
 *             patientId: "123e4567-e89b-12d3-a456-426614174001"
 *             facilityId: "123e4567-e89b-12d3-a456-426614174002"
 *             registrationDate: "2025-01-15"
 *             clientType: "New Acceptor"
 *             maritalStatus: "Married"
 *             numberOfChildren: 2
 *             desiredNumberOfChildren: 3
 *             educationLevel: "Secondary"
 *             occupation: "Teacher"
 *             primaryContact:
 *               name: "John Doe"
 *               relationship: "Spouse"
 *               phoneNumber: "+234-801-234-5678"
 *               address: "123 Main Street, Abuja"
 *             medicalHistory: "No significant medical history"
 *             referredBy: "Dr. Smith, General Practitioner"
 *             status: "Active"
 *     responses:
 *       201:
 *         description: Family planning client registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyPlanningClient'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Patient or facility not found
 *       409:
 *         description: Conflict - Patient already registered as family planning client
 *       500:
 *         description: Internal server error
 * 
 *   get:
 *     summary: Search family planning clients
 *     description: Retrieve a paginated list of family planning clients with optional filters
 *     tags: [Family Planning Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by patient ID
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by facility ID
 *       - in: query
 *         name: clientType
 *         schema:
 *           type: string
 *           enum: [New Acceptor, Continuing User, Restart]
 *         description: Filter by client type
 *       - in: query
 *         name: registrationDateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by registration date from (inclusive)
 *         example: "2025-01-01"
 *       - in: query
 *         name: registrationDateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by registration date to (inclusive)
 *         example: "2025-12-31"
 *       - in: query
 *         name: maritalStatus
 *         schema:
 *           type: string
 *           enum: [Single, Married, Divorced, Widowed, Separated, Other]
 *         description: Filter by marital status
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive, Transferred, Lost to Follow-up]
 *         description: Filter by client status
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
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [registrationDate, createdAt]
 *           default: registrationDate
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of family planning clients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FamilyPlanningClient'
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /family-planning/clients/{id}:
 *   get:
 *     summary: Get a family planning client by ID
 *     description: Retrieve detailed information about a specific family planning client
 *     tags: [Family Planning Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the family planning client
 *       - in: query
 *         name: includeServices
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include associated services in the response
 *         example: true
 *     responses:
 *       200:
 *         description: Family planning client retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyPlanningClient'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Family planning client not found
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update a family planning client
 *     description: Update an existing family planning client's information
 *     tags: [Family Planning Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the family planning client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registrationDate:
 *                 type: string
 *                 format: date
 *                 description: Date when client was registered for family planning services
 *               clientType:
 *                 type: string
 *                 enum: [New Acceptor, Continuing User, Restart]
 *                 description: Type of family planning client
 *               maritalStatus:
 *                 type: string
 *                 enum: [Single, Married, Divorced, Widowed, Separated, Other]
 *                 description: Marital status of the client
 *               numberOfChildren:
 *                 type: integer
 *                 minimum: 0
 *                 nullable: true
 *                 description: Current number of children
 *               desiredNumberOfChildren:
 *                 type: integer
 *                 minimum: 0
 *                 nullable: true
 *                 description: Desired total number of children
 *               educationLevel:
 *                 type: string
 *                 enum: [None, Primary, Secondary, Tertiary, Unknown]
 *                 description: Highest level of education completed
 *               occupation:
 *                 type: string
 *                 nullable: true
 *                 description: Client's occupation
 *               primaryContact:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   name:
 *                     type: string
 *                     nullable: true
 *                   relationship:
 *                     type: string
 *                     nullable: true
 *                   phoneNumber:
 *                     type: string
 *                     nullable: true
 *                   address:
 *                     type: string
 *                     nullable: true
 *               medicalHistory:
 *                 type: string
 *                 nullable: true
 *                 description: Relevant medical history
 *               allergyHistory:
 *                 type: string
 *                 nullable: true
 *                 description: Known allergies
 *               reproductiveHistory:
 *                 type: string
 *                 nullable: true
 *                 description: Previous pregnancies, births, miscarriages
 *               menstrualHistory:
 *                 type: string
 *                 nullable: true
 *                 description: Menstrual cycle information
 *               referredBy:
 *                 type: string
 *                 nullable: true
 *                 description: Who referred the client
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 description: Additional notes about the client
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Transferred, Lost to Follow-up]
 *                 description: Current status of the client
 *           example:
 *             numberOfChildren: 3
 *             occupation: "Nurse"
 *             notes: "Client expressed interest in long-term contraception"
 *             status: "Active"
 *     responses:
 *       200:
 *         description: Family planning client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyPlanningClient'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Family planning client not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete a family planning client
 *     description: Remove a family planning client from the system (soft delete)
 *     tags: [Family Planning Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the family planning client
 *     responses:
 *       200:
 *         description: Family planning client deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Family planning client deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Family planning client not found
 *       500:
 *         description: Internal server error
 */