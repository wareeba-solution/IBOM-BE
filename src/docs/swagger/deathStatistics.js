/**
 * @swagger
 * components:
 *   schemas:
 *     DeathStatistic:
 *       type: object
 *       required:
 *         - deceased_name
 *         - gender
 *         - date_of_death
 *         - place_of_death
 *         - cause_of_death
 *         - manner_of_death
 *         - informant_name
 *         - informant_relationship
 *         - city
 *         - state
 *         - registration_date
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the death record
 *         # Frontend Fields (Primary)
 *         deceased_name:
 *           type: string
 *           description: Full name of the deceased person
 *           example: "John Doe"
 *         gender:
 *           type: string
 *           enum: [Male, Female]
 *           description: Gender of the deceased
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: Date of birth of the deceased
 *           example: "1980-05-15"
 *         date_of_death:
 *           type: string
 *           format: date
 *           description: Date when death occurred
 *           example: "2024-05-29"
 *         age_at_death:
 *           type: integer
 *           minimum: 0
 *           description: Age of the deceased at time of death
 *           example: 44
 *         place_of_death:
 *           type: string
 *           enum: [Hospital, Home, Other]
 *           description: Location where death occurred
 *         hospital_name:
 *           type: string
 *           description: Name of hospital (required if place_of_death is Hospital)
 *           example: "University of Uyo Teaching Hospital"
 *         cause_of_death:
 *           type: string
 *           description: Primary cause of death
 *           example: "Cardiac arrest"
 *         secondary_causes:
 *           type: string
 *           description: Secondary or contributing causes of death
 *           example: "Diabetes, hypertension"
 *         manner_of_death:
 *           type: string
 *           enum: [Natural, Accident, Suicide, Homicide, Undetermined]
 *           description: Manner in which death occurred
 *         doctor_name:
 *           type: string
 *           description: Name of certifying doctor
 *           example: "Dr. Jane Smith"
 *         doctor_id:
 *           type: string
 *           description: ID or license number of certifying doctor
 *         # Informant Information
 *         informant_name:
 *           type: string
 *           description: Name of person reporting the death
 *           example: "Mary Doe"
 *         informant_relationship:
 *           type: string
 *           description: Relationship of informant to deceased
 *           example: "Spouse"
 *         informant_phone:
 *           type: string
 *           description: Phone number of informant
 *           example: "+234801234567"
 *         informant_address:
 *           type: string
 *           description: Address of informant
 *         # Registration Information
 *         registration_number:
 *           type: string
 *           description: Official death certificate registration number
 *           example: "DC-2024-001234"
 *         city:
 *           type: string
 *           description: City where death was registered
 *           example: "Uyo"
 *         state:
 *           type: string
 *           description: State where death was registered
 *           example: "Akwa Ibom"
 *         registration_date:
 *           type: string
 *           format: date
 *           description: Date when death was officially registered
 *         status:
 *           type: string
 *           enum: [pending, registered]
 *           default: registered
 *           description: Registration status of the death record
 *         notes:
 *           type: string
 *           description: Additional notes or comments
 *         # Backend Fields (For compatibility)
 *         patientId:
 *           type: string
 *           format: uuid
 *           description: ID of associated patient record
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: ID of facility where death occurred
 *         dateOfDeath:
 *           type: string
 *           format: date
 *           description: Legacy field - date of death
 *         timeOfDeath:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$'
 *           description: Time of death in HH:MM:SS format
 *           example: "14:30:00"
 *         placeOfDeath:
 *           type: string
 *           description: Legacy field - place of death
 *         primaryCauseOfDeath:
 *           type: string
 *           description: Legacy field - primary cause of death
 *         secondaryCauseOfDeath:
 *           type: string
 *           description: Legacy field - secondary cause of death
 *         certificateNumber:
 *           type: string
 *           description: Legacy field - certificate number
 *         certifiedBy:
 *           type: string
 *           description: Legacy field - certified by
 *         certifierDesignation:
 *           type: string
 *           description: Legacy field - certifier designation
 *         mannerOfDeath:
 *           type: string
 *           enum: [Natural, Accident, Suicide, Homicide, Undetermined, Pending Investigation]
 *           description: Legacy field - manner of death
 *         autopsyPerformed:
 *           type: boolean
 *           default: false
 *           description: Whether an autopsy was performed
 *         autopsyFindings:
 *           type: string
 *           description: Findings from autopsy if performed
 *         # Audit fields
 *         createdBy:
 *           type: string
 *           format: uuid
 *           description: ID of user who created the record
 *         updatedBy:
 *           type: string
 *           format: uuid
 *           description: ID of user who last updated the record
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Record creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Record last update timestamp
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         deceased_name: "John Doe"
 *         gender: "Male"
 *         date_of_birth: "1980-05-15"
 *         date_of_death: "2024-05-29"
 *         age_at_death: 44
 *         place_of_death: "Hospital"
 *         hospital_name: "University of Uyo Teaching Hospital"
 *         cause_of_death: "Cardiac arrest"
 *         manner_of_death: "Natural"
 *         informant_name: "Mary Doe"
 *         informant_relationship: "Spouse"
 *         city: "Uyo"
 *         state: "Akwa Ibom"
 *         registration_date: "2024-05-30"
 *         status: "registered"
 *
 *     CreateDeathStatisticRequest:
 *       type: object
 *       required:
 *         - deceased_name
 *         - gender
 *         - date_of_death
 *         - place_of_death
 *         - cause_of_death
 *         - manner_of_death
 *         - informant_name
 *         - informant_relationship
 *         - city
 *         - state
 *         - registration_date
 *       properties:
 *         deceased_name:
 *           type: string
 *           description: Full name of the deceased person
 *         gender:
 *           type: string
 *           enum: [Male, Female]
 *         date_of_birth:
 *           type: string
 *           format: date
 *         date_of_death:
 *           type: string
 *           format: date
 *         age_at_death:
 *           type: integer
 *           minimum: 0
 *         place_of_death:
 *           type: string
 *           enum: [Hospital, Home, Other]
 *         hospital_name:
 *           type: string
 *           description: Required if place_of_death is Hospital
 *         cause_of_death:
 *           type: string
 *         secondary_causes:
 *           type: string
 *         manner_of_death:
 *           type: string
 *           enum: [Natural, Accident, Suicide, Homicide, Undetermined]
 *         doctor_name:
 *           type: string
 *         doctor_id:
 *           type: string
 *         informant_name:
 *           type: string
 *         informant_relationship:
 *           type: string
 *         informant_phone:
 *           type: string
 *         informant_address:
 *           type: string
 *         registration_number:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         registration_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [pending, registered]
 *           default: registered
 *         notes:
 *           type: string
 *
 *     DeathStatisticsReport:
 *       type: object
 *       properties:
 *         summary:
 *           type: object
 *           properties:
 *             totalDeaths:
 *               type: integer
 *               description: Total number of deaths in the period
 *             byGender:
 *               type: object
 *               properties:
 *                 Male:
 *                   type: integer
 *                 Female:
 *                   type: integer
 *             byMannerOfDeath:
 *               type: object
 *               properties:
 *                 Natural:
 *                   type: integer
 *                 Accident:
 *                   type: integer
 *                 Suicide:
 *                   type: integer
 *                 Homicide:
 *                   type: integer
 *                 Undetermined:
 *                   type: integer
 *             byPlaceOfDeath:
 *               type: object
 *               properties:
 *                 Hospital:
 *                   type: integer
 *                 Home:
 *                   type: integer
 *                 Other:
 *                   type: integer
 *         groupedData:
 *           type: array
 *           description: Data grouped by the specified groupBy parameter
 *           items:
 *             type: object
 *             properties:
 *               group:
 *                 type: string
 *                 description: The grouping value
 *               count:
 *                 type: integer
 *                 description: Number of deaths in this group
 *               percentage:
 *                 type: number
 *                 description: Percentage of total deaths
 *
 * /death-statistics:
 *   post:
 *     summary: Create a new death record
 *     description: Register a new death in the system
 *     tags: [Death Statistics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDeathStatisticRequest'
 *           example:
 *             deceased_name: "John Doe"
 *             gender: "Male"
 *             date_of_birth: "1980-05-15"
 *             date_of_death: "2024-05-29"
 *             age_at_death: 44
 *             place_of_death: "Hospital"
 *             hospital_name: "University of Uyo Teaching Hospital"
 *             cause_of_death: "Cardiac arrest"
 *             manner_of_death: "Natural"
 *             informant_name: "Mary Doe"
 *             informant_relationship: "Spouse"
 *             informant_phone: "+234801234567"
 *             city: "Uyo"
 *             state: "Akwa Ibom"
 *             registration_date: "2024-05-30"
 *             status: "registered"
 *     responses:
 *       201:
 *         description: Death record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeathStatistic'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Deceased name is required"
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Search death records
 *     description: Search and filter death records with pagination
 *     tags: [Death Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: deceased_name
 *         schema:
 *           type: string
 *         description: Search by deceased person's name
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter deaths from this date
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter deaths up to this date
 *       - in: query
 *         name: manner_of_death
 *         schema:
 *           type: string
 *           enum: [Natural, Accident, Suicide, Homicide, Undetermined]
 *         description: Filter by manner of death
 *       - in: query
 *         name: cause_of_death
 *         schema:
 *           type: string
 *         description: Search by cause of death
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, registered]
 *         description: Filter by registration status
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by facility ID
 *       - in: query
 *         name: autopsyPerformed
 *         schema:
 *           type: boolean
 *         description: Filter by whether autopsy was performed
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [dateOfDeath, createdAt, updatedAt, date_of_death, deceased_name, created_at, updated_at]
 *           default: date_of_death
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc, ASC, DESC]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Death records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DeathStatistic'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /death-statistics/{id}:
 *   get:
 *     summary: Get death record by ID
 *     description: Retrieve a specific death record by its ID
 *     tags: [Death Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Death record ID
 *     responses:
 *       200:
 *         description: Death record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeathStatistic'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Death record not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update death record
 *     description: Update an existing death record
 *     tags: [Death Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Death record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deceased_name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Male, Female]
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               date_of_death:
 *                 type: string
 *                 format: date
 *               age_at_death:
 *                 type: integer
 *                 minimum: 0
 *               cause_of_death:
 *                 type: string
 *               secondary_causes:
 *                 type: string
 *               manner_of_death:
 *                 type: string
 *                 enum: [Natural, Accident, Suicide, Homicide, Undetermined]
 *               status:
 *                 type: string
 *                 enum: [pending, registered]
 *               notes:
 *                 type: string
 *             minProperties: 1
 *           example:
 *             cause_of_death: "Updated cause of death"
 *             status: "registered"
 *             notes: "Additional information added"
 *     responses:
 *       200:
 *         description: Death record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeathStatistic'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Death record not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete death record
 *     description: Delete a death record from the system
 *     tags: [Death Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Death record ID
 *     responses:
 *       200:
 *         description: Death record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Death record deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Death record not found
 *       500:
 *         description: Server error
 *
 * /death-statistics/reports/statistics:
 *   get:
 *     summary: Get death statistics report
 *     description: Generate statistical reports about deaths with various grouping options
 *     tags: [Death Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by facility ID
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Report start date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Report end date
 *       - in: query
 *         name: groupBy
 *         required: true
 *         schema:
 *           type: string
 *           enum: [cause, manner, facility, month]
 *         description: How to group the statistics
 *         example: cause
 *     responses:
 *       200:
 *         description: Death statistics report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeathStatisticsReport'
 *       400:
 *         description: Invalid or missing groupBy parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or missing groupBy parameter"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */