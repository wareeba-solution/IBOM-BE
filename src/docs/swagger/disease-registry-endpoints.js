/**
 * @swagger
 * /diseases/registry:
 *   post:
 *     summary: Create disease registry entry
 *     description: Create a new disease definition in the registry for surveillance tracking
 *     tags: [Disease Registry]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the disease
 *               description:
 *                 type: string
 *                 description: Detailed description of the disease
 *               icdCode:
 *                 type: string
 *                 description: International Classification of Diseases code
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Common symptoms of the disease
 *               transmissionRoutes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: How the disease spreads
 *               preventiveMeasures:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Prevention methods
 *               treatmentGuidelines:
 *                 type: string
 *                 description: Treatment guidelines and protocols
 *               notifiable:
 *                 type: boolean
 *                 description: Whether disease must be reported to health authorities
 *                 default: true
 *               incubationPeriodMin:
 *                 type: integer
 *                 description: Minimum incubation period in days
 *               incubationPeriodMax:
 *                 type: integer
 *                 description: Maximum incubation period in days
 *               isActive:
 *                 type: boolean
 *                 description: Whether this disease registry entry is active
 *                 default: true
 *           example:
 *             name: "COVID-19"
 *             description: "Coronavirus disease 2019 caused by SARS-CoV-2 virus"
 *             icdCode: "U07.1"
 *             symptoms: ["Fever", "Cough", "Shortness of breath", "Loss of taste/smell"]
 *             transmissionRoutes: ["Respiratory droplets", "Airborne", "Contact with contaminated surfaces"]
 *             preventiveMeasures: ["Vaccination", "Mask wearing", "Social distancing", "Hand hygiene"]
 *             treatmentGuidelines: "Supportive care, antiviral medications if severe, oxygen therapy if needed"
 *             notifiable: true
 *             incubationPeriodMin: 2
 *             incubationPeriodMax: 14
 *             isActive: true
 *     responses:
 *       201:
 *         description: Disease registry entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiseaseRegistry'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Disease with this name already exists
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Search disease registry
 *     description: Search and filter disease registry entries with pagination
 *     tags: [Disease Registry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by disease name (partial match)
 *         example: "COVID"
 *       - in: query
 *         name: notifiable
 *         schema:
 *           type: boolean
 *         description: Filter by notifiable status
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Filter by active status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt]
 *           default: name
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Disease registry entries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiseaseRegistryListResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /diseases/registry/{id}:
 *   get:
 *     summary: Get disease registry entry by ID
 *     description: Retrieve a specific disease registry entry with complete details
 *     tags: [Disease Registry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Disease registry entry ID
 *     responses:
 *       200:
 *         description: Disease registry entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/DiseaseRegistry'
 *                 - type: object
 *                   properties:
 *                     caseCount:
 *                       type: integer
 *                       description: Total number of cases for this disease
 *                       example: 1250
 *                     activeCaseCount:
 *                       type: integer
 *                       description: Number of active cases
 *                       example: 85
 *                     lastCaseDate:
 *                       type: string
 *                       format: date
 *                       description: Date of most recent case
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Disease registry entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update disease registry entry
 *     description: Update an existing disease registry entry
 *     tags: [Disease Registry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the disease
 *               description:
 *                 type: string
 *                 description: Detailed description of the disease
 *               icdCode:
 *                 type: string
 *                 description: International Classification of Diseases code
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Common symptoms of the disease
 *               transmissionRoutes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: How the disease spreads
 *               preventiveMeasures:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Prevention methods
 *               treatmentGuidelines:
 *                 type: string
 *                 description: Treatment guidelines and protocols
 *               notifiable:
 *                 type: boolean
 *                 description: Whether disease must be reported to health authorities
 *               incubationPeriodMin:
 *                 type: integer
 *                 description: Minimum incubation period in days
 *               incubationPeriodMax:
 *                 type: integer
 *                 description: Maximum incubation period in days
 *               isActive:
 *                 type: boolean
 *                 description: Whether this disease registry entry is active
 *           example:
 *             name: "COVID-19 (Updated)"
 *             description: "Updated coronavirus disease 2019 caused by SARS-CoV-2 virus"
 *             symptoms: ["Fever", "Cough", "Shortness of breath", "Loss of taste/smell", "Fatigue"]
 *             preventiveMeasures: ["Vaccination", "Mask wearing", "Social distancing", "Hand hygiene", "Ventilation"]
 *             treatmentGuidelines: "Updated: Supportive care, antiviral medications, monoclonal antibodies for high-risk"
 *     responses:
 *       200:
 *         description: Disease registry entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiseaseRegistry'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Disease registry entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Disease name already exists
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete disease registry entry
 *     description: Delete a disease registry entry (soft delete). Cannot delete if there are associated active cases.
 *     tags: [Disease Registry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Disease registry entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Disease registry entry deleted successfully"
 *                 deletedAt:
 *                   type: string
 *                   format: date-time
 *                 warning:
 *                   type: string
 *                   example: "This disease had 15 historical cases that are now orphaned"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Disease registry entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Cannot delete - active cases exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot delete disease registry entry with active cases"
 *                 activeCaseCount:
 *                   type: integer
 *                   example: 25
 *                 suggestion:
 *                   type: string
 *                   example: "Please resolve or transfer all active cases before deletion"
 *       500:
 *         description: Server error
 */