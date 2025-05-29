/**
 * @swagger
 * /diseases/cases:
 *   post:
 *     summary: Create disease case
 *     description: Register a new disease case for surveillance tracking
 *     tags: [Disease Cases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - caseId
 *               - diseaseType
 *               - diseaseId
 *               - patientId
 *               - facilityId
 *               - reportDate
 *               - diagnosisDate
 *               - diagnosisType
 *               - severity
 *             properties:
 *               caseId:
 *                 type: string
 *                 description: Unique case identifier
 *               diseaseType:
 *                 type: string
 *                 description: Name of the disease
 *               diseaseId:
 *                 type: string
 *                 format: uuid
 *                 description: Reference to disease registry entry
 *               patientId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the affected patient
 *               facilityId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the reporting healthcare facility
 *               reportDate:
 *                 type: string
 *                 format: date
 *                 description: Date when case was reported
 *               onsetDate:
 *                 type: string
 *                 format: date
 *                 description: Date when symptoms first appeared
 *               diagnosisDate:
 *                 type: string
 *                 format: date
 *                 description: Date when diagnosis was made
 *               diagnosisType:
 *                 type: string
 *                 enum: [Clinical, Laboratory, Epidemiological, Presumptive]
 *                 description: How the diagnosis was made
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Symptoms observed in this case
 *               labTestResults:
 *                 type: object
 *                 description: Laboratory test results in structured format
 *               severity:
 *                 type: string
 *                 enum: [mild, moderate, severe]
 *                 description: Severity level of the case
 *               hospitalized:
 *                 type: boolean
 *                 description: Whether patient is/was hospitalized
 *                 default: false
 *               hospitalizationDate:
 *                 type: string
 *                 format: date
 *                 description: Hospital admission date
 *               dischargeDate:
 *                 type: string
 *                 format: date
 *                 description: Hospital discharge date
 *               outcome:
 *                 type: string
 *                 enum: [under_treatment, recovered, hospitalized, death]
 *                 description: Current outcome of the case
 *                 default: under_treatment
 *               outcomeDate:
 *                 type: string
 *                 format: date
 *                 description: Date when outcome was determined
 *               transmissionRoute:
 *                 type: string
 *                 description: How the disease was transmitted
 *               transmissionLocation:
 *                 type: string
 *                 description: Where transmission likely occurred
 *               travelHistory:
 *                 type: string
 *                 description: Recent travel history
 *               contactHistory:
 *                 type: string
 *                 description: Contact history with other cases
 *               treatmentProvided:
 *                 type: string
 *                 description: Treatment details provided
 *               complications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Medical complications
 *               notes:
 *                 type: string
 *                 description: Additional case notes
 *               reportedToAuthorities:
 *                 type: boolean
 *                 description: Whether case has been reported to health authorities
 *                 default: false
 *               reportedDate:
 *                 type: string
 *                 format: date
 *                 description: Date when reported to authorities
 *               status:
 *                 type: string
 *                 enum: [suspected, probable, confirmed, ruled_out]
 *                 description: Current case status
 *                 default: suspected
 *           example:
 *             caseId: "COVID-2024-001234"
 *             diseaseType: "COVID-19"
 *             diseaseId: "123e4567-e89b-12d3-a456-426614174000"
 *             patientId: "456e7890-e89b-12d3-a456-426614174001"
 *             facilityId: "789e0123-e89b-12d3-a456-426614174002"
 *             reportDate: "2024-05-29"
 *             onsetDate: "2024-05-25"
 *             diagnosisDate: "2024-05-27"
 *             diagnosisType: "Laboratory"
 *             symptoms: ["Fever", "Cough", "Fatigue"]
 *             labTestResults:
 *               testType: "RT-PCR"
 *               result: "Positive"
 *               ctValue: 25.5
 *               testDate: "2024-05-27"
 *             severity: "moderate"
 *             hospitalized: false
 *             outcome: "under_treatment"
 *             transmissionRoute: "Close contact with confirmed case"
 *             transmissionLocation: "Workplace"
 *             status: "confirmed"
 *     responses:
 *       201:
 *         description: Disease case created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiseaseCase'
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
 *         description: Referenced disease, patient, or facility not found
 *       409:
 *         description: Case ID already exists
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Search disease cases
 *     description: Search and filter disease cases with advanced filtering and pagination
 *     tags: [Disease Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: diseaseId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by disease ID
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
 *         name: reportDateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter cases reported from this date
 *       - in: query
 *         name: reportDateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter cases reported up to this date
 *       - in: query
 *         name: diagnosisType
 *         schema:
 *           type: string
 *           enum: [Clinical, Laboratory, Epidemiological, Presumptive]
 *         description: Filter by diagnosis type
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [mild, moderate, severe]
 *         description: Filter by severity level
 *       - in: query
 *         name: hospitalized
 *         schema:
 *           type: boolean
 *         description: Filter by hospitalization status
 *       - in: query
 *         name: outcome
 *         schema:
 *           type: string
 *           enum: [under_treatment, recovered, hospitalized, death]
 *         description: Filter by outcome
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [suspected, probable, confirmed, ruled_out]
 *         description: Filter by case status
 *       - in: query
 *         name: reportedToAuthorities
 *         schema:
 *           type: boolean
 *         description: Filter by reporting status to authorities
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
 *           enum: [reportDate, diagnosisDate, createdAt]
 *           default: reportDate
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Disease cases retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiseaseCaseListResponse'
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
 * /diseases/cases/export:
 *   get:
 *     summary: Export disease cases
 *     description: Export disease case data in specified format for reporting and analysis
 *     tags: [Disease Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, xlsx, json]
 *           default: csv
 *         description: Export format
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Export cases from this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Export cases up to this date
 *       - in: query
 *         name: diseaseId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by specific disease
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by specific facility
 *     responses:
 *       200:
 *         description: Export initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExportResponse'
 *       400:
 *         description: Invalid export parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires export permission
 *       500:
 *         description: Server error
 *
 * /diseases/cases/{id}:
 *   get:
 *     summary: Get disease case by ID
 *     description: Retrieve a specific disease case with complete details and optional contact information
 *     tags: [Disease Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Disease case ID
 *       - in: query
 *         name: includeContacts
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include associated contact tracing records
 *     responses:
 *       200:
 *         description: Disease case retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/DiseaseCase'
 *                 - type: object
 *                   properties:
 *                     disease:
 *                       $ref: '#/components/schemas/DiseaseRegistry'
 *                       description: Associated disease registry information
 *                     patient:
 *                       type: object
 *                       description: Patient information
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
 *                     facility:
 *                       type: object
 *                       description: Facility information
 *                       properties:
 *                         name:
 *                           type: string
 *                         address:
 *                           type: string
 *                         type:
 *                           type: string
 *                     contacts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ContactTracing'
 *                       description: Associated contact tracing records (only if includeContacts=true)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Disease case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update disease case
 *     description: Update an existing disease case record
 *     tags: [Disease Cases]
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
 *               reportingDate:
 *                 type: string
 *                 format: date
 *               onsetDate:
 *                 type: string
 *                 format: date
 *               diagnosisDate:
 *                 type: string
 *                 format: date
 *               diagnosisType:
 *                 type: string
 *                 enum: [Clinical, Laboratory, Epidemiological, Presumptive]
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *               labTestResults:
 *                 type: object
 *               severity:
 *                 type: string
 *                 enum: [mild, moderate, severe]
 *               hospitalized:
 *                 type: boolean
 *               hospitalizationDate:
 *                 type: string
 *                 format: date
 *               dischargeDate:
 *                 type: string
 *                 format: date
 *               outcome:
 *                 type: string
 *                 enum: [under_treatment, recovered, hospitalized, death]
 *               outcomeDate:
 *                 type: string
 *                 format: date
 *               transmissionRoute:
 *                 type: string
 *               transmissionLocation:
 *                 type: string
 *               travelHistory:
 *                 type: string
 *               contactHistory:
 *                 type: string
 *               treatmentProvided:
 *                 type: string
 *               complications:
 *                 type: array
 *                 items:
 *                   type: string
 *               notes:
 *                 type: string
 *               reportedToAuthorities:
 *                 type: boolean
 *               reportedDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [suspected, probable, confirmed, ruled_out]
 *           example:
 *             severity: "severe"
 *             hospitalized: true
 *             hospitalizationDate: "2024-05-30"
 *             outcome: "hospitalized"
 *             outcomeDate: "2024-05-30"
 *             treatmentProvided: "Oxygen therapy, antiviral medication"
 *             complications: ["Pneumonia"]
 *             notes: "Patient condition deteriorated, requiring hospitalization"
 *             status: "confirmed"
 *     responses:
 *       200:
 *         description: Disease case updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiseaseCase'
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
 *         description: Disease case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete disease case
 *     description: Soft delete a disease case record
 *     tags: [Disease Cases]
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
 *         description: Disease case deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Disease case deleted successfully"
 *                 deletedAt:
 *                   type: string
 *                   format: date-time
 *                 contactCount:
 *                   type: integer
 *                   example: 5
 *                   description: Number of associated contact tracing records
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Disease case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *
 * /diseases/cases/{id}/report:
 *   post:
 *     summary: Report disease case to authorities
 *     description: Mark a disease case as reported to health authorities and update reporting status
 *     tags: [Disease Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Disease case ID
 *     responses:
 *       200:
 *         description: Disease case reported to authorities successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/DiseaseCase'
 *                 - type: object
 *                   properties:
 *                     reportingConfirmation:
 *                       type: object
 *                       properties:
 *                         reportedAt:
 *                           type: string
 *                           format: date-time
 *                         reportedBy:
 *                           type: string
 *                           example: "Dr. Jane Smith"
 *                         notificationSent:
 *                           type: boolean
 *                           example: true
 *                         referenceNumber:
 *                           type: string
 *                           example: "REP-2024-001234"
 *       400:
 *         description: Case already reported or not eligible for reporting
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "This case has already been reported to authorities"
 *                 reportedDate:
 *                   type: string
 *                   format: date
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Disease case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */