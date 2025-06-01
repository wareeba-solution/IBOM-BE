// src/docs/swagger/familyPlanning-services-endpoints.js

/**
 * @swagger
 * tags:
 *   - name: Family Planning Services
 *     description: Management of family planning services provided to clients
 */

/**
 * @swagger
 * /family-planning/services:
 *   post:
 *     summary: Create a new family planning service record
 *     description: Record a family planning service provided to a client
 *     tags: [Family Planning Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - methodId
 *               - serviceDate
 *               - serviceType
 *               - providedBy
 *             properties:
 *               clientId:
 *                 type: string
 *                 format: uuid
 *                 description: Reference to the family planning client
 *               methodId:
 *                 type: string
 *                 format: uuid
 *                 description: Reference to the family planning method used
 *               serviceDate:
 *                 type: string
 *                 format: date
 *                 description: Date when the service was provided
 *               serviceType:
 *                 type: string
 *                 enum: [Initial Adoption, Method Switch, Resupply, Follow-up, Counseling, Removal, Other]
 *                 description: Type of service provided
 *               previousMethodId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Previous method ID (for method switches)
 *               switchReason:
 *                 type: string
 *                 nullable: true
 *                 description: Reason for switching methods
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 nullable: true
 *                 description: Quantity of contraceptives provided
 *               batchNumber:
 *                 type: string
 *                 nullable: true
 *                 description: Batch number of contraceptives provided
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 description: Expiry date of contraceptives provided
 *               providedBy:
 *                 type: string
 *                 description: Name of healthcare provider who provided the service
 *               weight:
 *                 type: number
 *                 minimum: 0
 *                 nullable: true
 *                 description: Client's weight in kg at time of service
 *               bloodPressure:
 *                 type: string
 *                 pattern: "^\\d{1,3}/\\d{1,3}$"
 *                 nullable: true
 *                 description: Blood pressure reading (systolic/diastolic)
 *               sideEffectsReported:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: Side effects reported by client
 *               sideEffectsManagement:
 *                 type: string
 *                 nullable: true
 *                 description: How side effects were managed
 *               counselingNotes:
 *                 type: string
 *                 nullable: true
 *                 description: Notes from counseling session
 *               nextAppointment:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 description: Date of next scheduled appointment
 *               discontinuationReason:
 *                 type: string
 *                 nullable: true
 *                 description: Reason for discontinuing method (if applicable)
 *               procedureNotes:
 *                 type: string
 *                 nullable: true
 *                 description: Notes about procedures performed
 *               patientSatisfaction:
 *                 type: string
 *                 enum: [Very Satisfied, Satisfied, Neutral, Dissatisfied, Very Dissatisfied, Not Recorded]
 *                 description: Client satisfaction with service
 *           example:
 *             clientId: "123e4567-e89b-12d3-a456-426614174003"
 *             methodId: "123e4567-e89b-12d3-a456-426614174004"
 *             serviceDate: "2025-01-15"
 *             serviceType: "Initial Adoption"
 *             providedBy: "Dr. Jane Smith"
 *             weight: 65.5
 *             bloodPressure: "120/80"
 *             counselingNotes: "Discussed proper usage, potential side effects, and when to seek help"
 *             nextAppointment: "2025-04-15"
 *             patientSatisfaction: "Satisfied"
 *     responses:
 *       201:
 *         description: Family planning service recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyPlanningService'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Client or method not found
 *       500:
 *         description: Internal server error
 * 
 *   get:
 *     summary: Search family planning services
 *     description: Retrieve a paginated list of family planning services with optional filters
 *     tags: [Family Planning Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by client ID
 *       - in: query
 *         name: methodId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by method ID
 *       - in: query
 *         name: serviceDateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by service date from (inclusive)
 *         example: "2025-01-01"
 *       - in: query
 *         name: serviceDateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by service date to (inclusive)
 *         example: "2025-12-31"
 *       - in: query
 *         name: serviceType
 *         schema:
 *           type: string
 *           enum: [Initial Adoption, Method Switch, Resupply, Follow-up, Counseling, Removal, Other]
 *         description: Filter by service type
 *       - in: query
 *         name: patientSatisfaction
 *         schema:
 *           type: string
 *           enum: [Very Satisfied, Satisfied, Neutral, Dissatisfied, Very Dissatisfied, Not Recorded]
 *         description: Filter by patient satisfaction level
 *       - in: query
 *         name: nextAppointmentFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by next appointment date from (inclusive)
 *       - in: query
 *         name: nextAppointmentTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by next appointment date to (inclusive)
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
 *           enum: [serviceDate, nextAppointment, createdAt]
 *           default: serviceDate
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
 *         description: List of family planning services retrieved successfully
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
 *                         $ref: '#/components/schemas/FamilyPlanningService'
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
 * /family-planning/services/{id}:
 *   get:
 *     summary: Get a family planning service by ID
 *     description: Retrieve detailed information about a specific family planning service
 *     tags: [Family Planning Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the family planning service
 *     responses:
 *       200:
 *         description: Family planning service retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyPlanningService'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Family planning service not found
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update a family planning service
 *     description: Update an existing family planning service record
 *     tags: [Family Planning Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the family planning service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               methodId:
 *                 type: string
 *                 format: uuid
 *                 description: Reference to the family planning method used
 *               serviceDate:
 *                 type: string
 *                 format: date
 *                 description: Date when the service was provided
 *               serviceType:
 *                 type: string
 *                 enum: [Initial Adoption, Method Switch, Resupply, Follow-up, Counseling, Removal, Other]
 *                 description: Type of service provided
 *               previousMethodId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Previous method ID (for method switches)
 *               switchReason:
 *                 type: string
 *                 nullable: true
 *                 description: Reason for switching methods
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 nullable: true
 *                 description: Quantity of contraceptives provided
 *               batchNumber:
 *                 type: string
 *                 nullable: true
 *                 description: Batch number of contraceptives provided
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 description: Expiry date of contraceptives provided
 *               providedBy:
 *                 type: string
 *                 description: Name of healthcare provider who provided the service
 *               weight:
 *                 type: number
 *                 minimum: 0
 *                 nullable: true
 *                 description: Client's weight in kg at time of service
 *               bloodPressure:
 *                 type: string
 *                 pattern: "^\\d{1,3}/\\d{1,3}$"
 *                 nullable: true
 *                 description: Blood pressure reading (systolic/diastolic)
 *               sideEffectsReported:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: Side effects reported by client
 *               sideEffectsManagement:
 *                 type: string
 *                 nullable: true
 *                 description: How side effects were managed
 *               counselingNotes:
 *                 type: string
 *                 nullable: true
 *                 description: Notes from counseling session
 *               nextAppointment:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 description: Date of next scheduled appointment
 *               discontinuationReason:
 *                 type: string
 *                 nullable: true
 *                 description: Reason for discontinuing method (if applicable)
 *               procedureNotes:
 *                 type: string
 *                 nullable: true
 *                 description: Notes about procedures performed
 *               patientSatisfaction:
 *                 type: string
 *                 enum: [Very Satisfied, Satisfied, Neutral, Dissatisfied, Very Dissatisfied, Not Recorded]
 *                 description: Client satisfaction with service
 *           example:
 *             weight: 66.0
 *             bloodPressure: "118/75"
 *             sideEffectsReported: ["Mild headache"]
 *             sideEffectsManagement: "Advised to monitor and report if persists"
 *             nextAppointment: "2025-07-15"
 *             patientSatisfaction: "Very Satisfied"
 *     responses:
 *       200:
 *         description: Family planning service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyPlanningService'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Family planning service not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete a family planning service
 *     description: Remove a family planning service record from the system (soft delete)
 *     tags: [Family Planning Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the family planning service
 *     responses:
 *       200:
 *         description: Family planning service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Family planning service deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Family planning service not found
 *       500:
 *         description: Internal server error
 */