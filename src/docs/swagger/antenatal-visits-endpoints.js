/**
 * @swagger
 * /antenatal/visits:
 *   post:
 *     summary: Create antenatal visit
 *     description: Record a new antenatal visit for pregnancy monitoring
 *     tags: [Antenatal Visits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - antenatalCareId
 *               - visitDate
 *               - gestationalAge
 *               - weight
 *               - bloodPressure
 *             properties:
 *               antenatalCareId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the antenatal care record
 *               visitDate:
 *                 type: string
 *                 format: date
 *                 description: Date of the visit
 *               gestationalAge:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 45
 *                 description: Gestational age in weeks
 *               weight:
 *                 type: number
 *                 description: Patient weight in kilograms
 *               bloodPressure:
 *                 type: string
 *                 pattern: '^\d{1,3}\/\d{1,3}$'
 *                 description: Blood pressure in systolic/diastolic format
 *               fetalHeartRate:
 *                 type: integer
 *                 minimum: 60
 *                 maximum: 220
 *                 description: Fetal heart rate in beats per minute
 *               fetalMovement:
 *                 type: string
 *                 enum: [Present, Absent, Not Checked]
 *                 default: Not Checked
 *               fundusHeight:
 *                 type: number
 *                 description: Fundus height in centimeters
 *               presentation:
 *                 type: string
 *                 enum: [Cephalic, Breech, Transverse, Oblique, Not Determined]
 *                 default: Not Determined
 *               urineProtein:
 *                 type: string
 *                 description: Urine protein test result
 *               urineGlucose:
 *                 type: string
 *                 description: Urine glucose test result
 *               hemoglobin:
 *                 type: number
 *                 description: Hemoglobin level in g/dL
 *               complaints:
 *                 type: string
 *                 description: Patient complaints during visit
 *               diagnosis:
 *                 type: string
 *                 description: Clinical diagnosis
 *               treatment:
 *                 type: string
 *                 description: Treatment provided
 *               notes:
 *                 type: string
 *                 description: Additional clinical notes
 *               nextAppointment:
 *                 type: string
 *                 format: date
 *                 description: Next scheduled appointment date
 *               interventions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Medical interventions performed
 *               supplements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Supplements prescribed
 *           example:
 *             antenatalCareId: "123e4567-e89b-12d3-a456-426614174000"
 *             visitDate: "2024-05-29"
 *             gestationalAge: 28
 *             weight: 65.5
 *             bloodPressure: "120/80"
 *             fetalHeartRate: 140
 *             fetalMovement: "Present"
 *             fundusHeight: 28
 *             presentation: "Cephalic"
 *             urineProtein: "Negative"
 *             urineGlucose: "Negative"
 *             hemoglobin: 11.5
 *             complaints: "Mild back pain"
 *             diagnosis: "Normal pregnancy progression"
 *             treatment: "Continue current supplements"
 *             notes: "Patient in good health, fetus developing normally"
 *             nextAppointment: "2024-06-26"
 *             supplements: ["Iron", "Folic Acid"]
 *     responses:
 *       201:
 *         description: Antenatal visit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AntenatalVisit'
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
 *         description: Antenatal care record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Search antenatal visits
 *     description: Search and filter antenatal visits with pagination and advanced filtering
 *     tags: [Antenatal Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: antenatalCareId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by antenatal care record ID
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
 *         name: visitDateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter visits from this date
 *       - in: query
 *         name: visitDateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter visits up to this date
 *       - in: query
 *         name: minGestationalAge
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Minimum gestational age filter
 *       - in: query
 *         name: maxGestationalAge
 *         schema:
 *           type: integer
 *           maximum: 45
 *         description: Maximum gestational age filter
 *       - in: query
 *         name: presentation
 *         schema:
 *           type: string
 *           enum: [Cephalic, Breech, Transverse, Oblique, Not Determined]
 *         description: Filter by fetal presentation
 *       - in: query
 *         name: fetalMovement
 *         schema:
 *           type: string
 *           enum: [Present, Absent, Not Checked]
 *         description: Filter by fetal movement status
 *       - in: query
 *         name: highRisk
 *         schema:
 *           type: boolean
 *         description: Filter for high-risk pregnancies only
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
 *           enum: [visitDate, gestationalAge, createdAt]
 *           default: visitDate
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: includePatient
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include patient information in response
 *     responses:
 *       200:
 *         description: Antenatal visits retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AntenatalVisitListResponse'
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
 * /antenatal/visits/{id}:
 *   get:
 *     summary: Get antenatal visit by ID
 *     description: Retrieve a specific antenatal visit record with full details
 *     tags: [Antenatal Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Antenatal visit ID
 *       - in: query
 *         name: includeAntenatalCare
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include associated antenatal care record
 *       - in: query
 *         name: includePatient
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include patient information
 *     responses:
 *       200:
 *         description: Antenatal visit retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/AntenatalVisit'
 *                 - type: object
 *                   properties:
 *                     antenatalCare:
 *                       $ref: '#/components/schemas/AntenatalCare'
 *                       description: Associated antenatal care record (only if includeAntenatalCare=true)
 *                     patient:
 *                       type: object
 *                       description: Patient information (only if includePatient=true)
 *                       properties:
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         dateOfBirth:
 *                           type: string
 *                           format: date
 *                         phoneNumber:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Antenatal visit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update antenatal visit
 *     description: Update an existing antenatal visit record
 *     tags: [Antenatal Visits]
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
 *               visitDate:
 *                 type: string
 *                 format: date
 *               gestationalAge:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 45
 *               weight:
 *                 type: number
 *               bloodPressure:
 *                 type: string
 *                 pattern: '^\d{1,3}\/\d{1,3}$'
 *               fetalHeartRate:
 *                 type: integer
 *                 minimum: 60
 *                 maximum: 220
 *               fetalMovement:
 *                 type: string
 *                 enum: [Present, Absent, Not Checked]
 *               fundusHeight:
 *                 type: number
 *               presentation:
 *                 type: string
 *                 enum: [Cephalic, Breech, Transverse, Oblique, Not Determined]
 *               urineProtein:
 *                 type: string
 *               urineGlucose:
 *                 type: string
 *               hemoglobin:
 *                 type: number
 *               complaints:
 *                 type: string
 *               diagnosis:
 *                 type: string
 *               treatment:
 *                 type: string
 *               notes:
 *                 type: string
 *               nextAppointment:
 *                 type: string
 *                 format: date
 *               interventions:
 *                 type: array
 *                 items:
 *                   type: string
 *               supplements:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             weight: 66.0
 *             bloodPressure: "125/82"
 *             fetalHeartRate: 142
 *             hemoglobin: 11.8
 *             diagnosis: "Normal pregnancy progress"
 *             treatment: "Continue iron supplements, increase folic acid"
 *             notes: "Patient reports feeling well, fetal movements strong"
 *             supplements: ["Iron", "Folic Acid", "Calcium"]
 *     responses:
 *       200:
 *         description: Antenatal visit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AntenatalVisit'
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
 *         description: Antenatal visit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete antenatal visit
 *     description: Soft delete an antenatal visit record
 *     tags: [Antenatal Visits]
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
 *         description: Antenatal visit deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Antenatal visit deleted successfully"
 *                 deletedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Antenatal visit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */