// src/docs/swagger/familyPlanning-methods-endpoints.js

/**
 * @swagger
 * tags:
 *   - name: Family Planning Methods
 *     description: Management of family planning methods and contraceptives
 */

/**
 * @swagger
 * /family-planning/methods:
 *   post:
 *     summary: Create a new family planning method
 *     description: Register a new contraceptive method in the system
 *     tags: [Family Planning Methods]
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
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the family planning method
 *                 example: "Combined Oral Contraceptive Pills"
 *               category:
 *                 type: string
 *                 enum: [Hormonal, Barrier, Long-Acting Reversible, Permanent, Fertility Awareness, Emergency, Other]
 *                 description: Category of the family planning method
 *                 example: "Hormonal"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 description: Detailed description of the method
 *                 example: "Daily pills containing estrogen and progestin"
 *               effectiveness:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 nullable: true
 *                 description: Effectiveness percentage (0-100)
 *                 example: 91
 *               duration:
 *                 type: string
 *                 nullable: true
 *                 description: Duration of effectiveness
 *                 example: "Daily use"
 *               sideEffects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: List of possible side effects
 *                 example: ["Nausea", "Weight gain", "Mood changes"]
 *               contraindications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: Medical conditions that make this method unsuitable
 *                 example: ["Blood clotting disorders", "Breast cancer"]
 *               advantages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: Benefits of this method
 *                 example: ["Highly reversible", "May reduce menstrual cramps"]
 *               disadvantages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: Drawbacks of this method
 *                 example: ["Must remember daily", "Does not protect against STIs"]
 *               isActive:
 *                 type: boolean
 *                 description: Whether the method is currently available
 *                 default: true
 *           example:
 *             name: "Combined Oral Contraceptive Pills"
 *             category: "Hormonal"
 *             description: "Daily pills containing estrogen and progestin"
 *             effectiveness: 91
 *             duration: "Daily use"
 *             sideEffects: ["Nausea", "Weight gain", "Mood changes"]
 *             contraindications: ["Blood clotting disorders", "Breast cancer"]
 *             advantages: ["Highly reversible", "May reduce menstrual cramps"]
 *             disadvantages: ["Must remember daily", "Does not protect against STIs"]
 *             isActive: true
 *     responses:
 *       201:
 *         description: Family planning method created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyPlanningMethod'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Method name is required"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       409:
 *         description: Conflict - Method name already exists
 *       500:
 *         description: Internal server error
 * 
 *   get:
 *     summary: Search family planning methods
 *     description: Retrieve a paginated list of family planning methods with optional filters
 *     tags: [Family Planning Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by method name (partial match)
 *         example: "pills"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Hormonal, Barrier, Long-Acting Reversible, Permanent, Fertility Awareness, Emergency, Other]
 *         description: Filter by method category
 *         example: "Hormonal"
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *         example: true
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
 *           enum: [name, category, createdAt]
 *           default: name
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of family planning methods retrieved successfully
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
 *                         $ref: '#/components/schemas/FamilyPlanningMethod'
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
 * /family-planning/methods/{id}:
 *   get:
 *     summary: Get a family planning method by ID
 *     description: Retrieve detailed information about a specific family planning method
 *     tags: [Family Planning Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the family planning method
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Family planning method retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyPlanningMethod'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Family planning method not found
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update a family planning method
 *     description: Update an existing family planning method's information
 *     tags: [Family Planning Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the family planning method
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the family planning method
 *               category:
 *                 type: string
 *                 enum: [Hormonal, Barrier, Long-Acting Reversible, Permanent, Fertility Awareness, Emergency, Other]
 *                 description: Category of the family planning method
 *               description:
 *                 type: string
 *                 nullable: true
 *                 description: Detailed description of the method
 *               effectiveness:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 nullable: true
 *                 description: Effectiveness percentage (0-100)
 *               duration:
 *                 type: string
 *                 nullable: true
 *                 description: Duration of effectiveness
 *               sideEffects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: List of possible side effects
 *               contraindications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: Medical conditions that make this method unsuitable
 *               advantages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: Benefits of this method
 *               disadvantages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: Drawbacks of this method
 *               isActive:
 *                 type: boolean
 *                 description: Whether the method is currently available
 *           example:
 *             name: "Combined Oral Contraceptive Pills (Updated)"
 *             description: "Updated description with new information"
 *             effectiveness: 92
 *             isActive: true
 *     responses:
 *       200:
 *         description: Family planning method updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FamilyPlanningMethod'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Family planning method not found
 *       409:
 *         description: Conflict - Method name already exists
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete a family planning method
 *     description: Remove a family planning method from the system
 *     tags: [Family Planning Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the family planning method
 *     responses:
 *       200:
 *         description: Family planning method deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Family planning method deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Family planning method not found
 *       409:
 *         description: Conflict - Method is in use and cannot be deleted
 *       500:
 *         description: Internal server error
 */