/**
 * @swagger
 * tags:
 *   name: Facilities
 *   description: Facility management endpoints
 * 
 * /facilities:
 *   get:
 *     summary: Get all facilities
 *     description: Retrieve a list of healthcare facilities with filtering and pagination
 *     tags: [Facilities]
 *     security:
 *       - BearerAuth: []
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
 *         description: Number of facilities per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by facility status
 *       - in: query
 *         name: facilityType
 *         schema:
 *           type: string
 *           enum: [hospital, clinic, health_center, maternity]
 *         description: Filter by facility type
 *       - in: query
 *         name: lga
 *         schema:
 *           type: string
 *         description: Filter by Local Government Area
 *     responses:
 *       200:
 *         description: List of facilities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Facilities retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Facility'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 * 
 *   post:
 *     summary: Create a new facility
 *     description: Add a new healthcare facility
 *     tags: [Facilities]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - facilityType
 *               - address
 *               - lga
 *             properties:
 *               name:
 *                 type: string
 *                 description: Facility name
 *               facilityType:
 *                 type: string
 *                 enum: [hospital, clinic, health_center, maternity]
 *                 description: Type of facility
 *               address:
 *                 type: string
 *                 description: Facility address
 *               lga:
 *                 type: string
 *                 description: Local Government Area
 *               state:
 *                 type: string
 *                 description: State
 *                 default: Akwa Ibom
 *               contactPerson:
 *                 type: string
 *                 description: Contact person
 *               phoneNumber:
 *                 type: string
 *                 description: Contact phone number
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact email
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *                 description: Facility status
 *     responses:
 *       201:
 *         description: Facility created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Facility created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Facility'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       422:
 *         description: Validation error
 * 
 * /facilities/{id}:
 *   get:
 *     summary: Get facility by ID
 *     description: Retrieve a specific facility's details
 *     tags: [Facilities]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Facility ID
 *     responses:
 *       200:
 *         description: Facility details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Facility retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Facility'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Facility not found
 * 
 *   put:
 *     summary: Update facility
 *     description: Update a facility's information
 *     tags: [Facilities]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Facility ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Facility name
 *               facilityType:
 *                 type: string
 *                 enum: [hospital, clinic, health_center, maternity]
 *                 description: Type of facility
 *               address:
 *                 type: string
 *                 description: Facility address
 *               lga:
 *                 type: string
 *                 description: Local Government Area
 *               state:
 *                 type: string
 *                 description: State
 *               contactPerson:
 *                 type: string
 *                 description: Contact person
 *               phoneNumber:
 *                 type: string
 *                 description: Contact phone number
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact email
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: Facility status
 *     responses:
 *       200:
 *         description: Facility updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Facility updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Facility'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Facility not found
 *       422:
 *         description: Validation error
 * 
 *   delete:
 *     summary: Delete facility
 *     description: Delete a facility
 *     tags: [Facilities]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Facility ID
 *     responses:
 *       200:
 *         description: Facility deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Facility deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Facility not found
 * 
 * /facilities/{id}/staff:
 *   get:
 *     summary: Get facility staff
 *     description: Retrieve all staff members assigned to a facility
 *     tags: [Facilities]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Facility ID
 *     responses:
 *       200:
 *         description: Facility staff retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Facility staff retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Facility not found
 * 
 * /facilities/{id}/statistics:
 *   get:
 *     summary: Get facility statistics
 *     description: Retrieve statistical data for a facility
 *     tags: [Facilities]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Facility ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics (format YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Facility statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Facility statistics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     patientsCount:
 *                       type: integer
 *                     birthsCount:
 *                       type: integer
 *                     deathsCount:
 *                       type: integer
 *                     immunizationsCount:
 *                       type: integer
 *                     antenatalVisitsCount:
 *                       type: integer
 *                     staffCount:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Facility not found
 */