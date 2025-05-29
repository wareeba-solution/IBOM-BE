/**
 * @swagger
 * components:
 *   schemas:
 *     Immunization:
 *       type: object
 *       required:
 *         - patientId
 *         - facilityId
 *         - vaccineType
 *         - vaccineName
 *         - doseNumber
 *         - batchNumber
 *         - administrationDate
 *         - expiryDate
 *         - administeredBy
 *         - administrationSite
 *         - administrationRoute
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the immunization record
 *         patientId:
 *           type: string
 *           format: uuid
 *           description: ID of the patient receiving the vaccine
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: ID of the facility where vaccine was administered
 *         vaccineType:
 *           type: string
 *           description: Type/category of vaccine
 *           example: "COVID-19"
 *         vaccineName:
 *           type: string
 *           description: Specific name of the vaccine
 *           example: "Pfizer-BioNTech COVID-19 Vaccine"
 *         doseNumber:
 *           type: integer
 *           minimum: 1
 *           description: Which dose in the series (1st, 2nd, etc.)
 *           example: 1
 *         batchNumber:
 *           type: string
 *           description: Vaccine batch/lot number for tracking
 *           example: "EN6201"
 *         administrationDate:
 *           type: string
 *           format: date
 *           description: Date when vaccine was administered
 *           example: "2024-05-29"
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Expiry date of the vaccine
 *           example: "2025-05-29"
 *         administeredBy:
 *           type: string
 *           description: Name of healthcare provider who administered vaccine
 *           example: "Dr. Jane Smith"
 *         administrationSite:
 *           type: string
 *           enum: [Left Arm, Right Arm, Left Thigh, Right Thigh, Oral, Intranasal, Other]
 *           description: Body site where vaccine was administered
 *         administrationRoute:
 *           type: string
 *           enum: [Intramuscular, Subcutaneous, Intradermal, Oral, Intranasal, Other]
 *           description: Route of vaccine administration
 *         dosage:
 *           type: string
 *           description: Dosage amount administered
 *           example: "0.5 mL"
 *         sideEffects:
 *           type: string
 *           description: Any side effects observed or reported
 *           example: "Mild soreness at injection site"
 *         nextDoseDate:
 *           type: string
 *           format: date
 *           description: Scheduled date for next dose (if applicable)
 *           example: "2024-06-29"
 *         status:
 *           type: string
 *           enum: [Scheduled, Administered, Missed, Cancelled]
 *           default: Administered
 *           description: Current status of the immunization
 *         notes:
 *           type: string
 *           description: Additional notes about the immunization
 *         providerId:
 *           type: string
 *           description: ID of the healthcare provider
 *         weightKg:
 *           type: number
 *           minimum: 0
 *           maximum: 500
 *           description: Patient weight in kilograms at time of immunization
 *           example: 70.5
 *         heightCm:
 *           type: number
 *           minimum: 0
 *           maximum: 300
 *           description: Patient height in centimeters at time of immunization
 *           example: 175
 *         ageMonths:
 *           type: integer
 *           minimum: 0
 *           description: Patient age in months at time of immunization
 *           example: 36
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
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           description: Soft delete timestamp (null if not deleted)
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         patientId: "123e4567-e89b-12d3-a456-426614174001"
 *         facilityId: "123e4567-e89b-12d3-a456-426614174002"
 *         vaccineType: "COVID-19"
 *         vaccineName: "Pfizer-BioNTech COVID-19 Vaccine"
 *         doseNumber: 1
 *         batchNumber: "EN6201"
 *         administrationDate: "2024-05-29"
 *         expiryDate: "2025-05-29"
 *         administeredBy: "Dr. Jane Smith"
 *         administrationSite: "Left Arm"
 *         administrationRoute: "Intramuscular"
 *         dosage: "0.5 mL"
 *         status: "Administered"
 *         weightKg: 70.5
 *         heightCm: 175
 *         ageMonths: 36
 *
 *     CreateImmunizationRequest:
 *       type: object
 *       required:
 *         - patientId
 *         - facilityId
 *         - vaccineType
 *         - vaccineName
 *         - doseNumber
 *         - batchNumber
 *         - administrationDate
 *         - expiryDate
 *         - administeredBy
 *         - administrationSite
 *         - administrationRoute
 *       properties:
 *         patientId:
 *           type: string
 *           format: uuid
 *         facilityId:
 *           type: string
 *           format: uuid
 *         vaccineType:
 *           type: string
 *         vaccineName:
 *           type: string
 *         doseNumber:
 *           type: integer
 *           minimum: 1
 *         batchNumber:
 *           type: string
 *         administrationDate:
 *           type: string
 *           format: date
 *         expiryDate:
 *           type: string
 *           format: date
 *         administeredBy:
 *           type: string
 *         administrationSite:
 *           type: string
 *           enum: [Left Arm, Right Arm, Left Thigh, Right Thigh, Oral, Intranasal, Other]
 *         administrationRoute:
 *           type: string
 *           enum: [Intramuscular, Subcutaneous, Intradermal, Oral, Intranasal, Other]
 *         dosage:
 *           type: string
 *         sideEffects:
 *           type: string
 *         nextDoseDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [Scheduled, Administered, Missed, Cancelled]
 *           default: Administered
 *         notes:
 *           type: string
 *         providerId:
 *           type: string
 *         weightKg:
 *           type: number
 *           minimum: 0
 *           maximum: 500
 *         heightCm:
 *           type: number
 *           minimum: 0
 *           maximum: 300
 *         ageMonths:
 *           type: integer
 *           minimum: 0
 *
 *     ScheduleImmunizationRequest:
 *       type: object
 *       required:
 *         - patientId
 *         - facilityId
 *         - vaccineType
 *         - vaccineName
 *         - doseNumber
 *         - scheduledDate
 *       properties:
 *         patientId:
 *           type: string
 *           format: uuid
 *         facilityId:
 *           type: string
 *           format: uuid
 *         vaccineType:
 *           type: string
 *         vaccineName:
 *           type: string
 *         doseNumber:
 *           type: integer
 *           minimum: 1
 *         scheduledDate:
 *           type: string
 *           format: date
 *         notes:
 *           type: string
 *
 *     ImmunizationStatistics:
 *       type: object
 *       properties:
 *         summary:
 *           type: object
 *           properties:
 *             totalImmunizations:
 *               type: integer
 *               description: Total number of immunizations
 *             byStatus:
 *               type: object
 *               properties:
 *                 Administered:
 *                   type: integer
 *                 Scheduled:
 *                   type: integer
 *                 Missed:
 *                   type: integer
 *                 Cancelled:
 *                   type: integer
 *             byVaccineType:
 *               type: object
 *               additionalProperties:
 *                 type: integer
 *             coverageRate:
 *               type: number
 *               description: Percentage of scheduled immunizations completed
 *         groupedData:
 *           type: array
 *           description: Data grouped by the specified groupBy parameter
 *           items:
 *             type: object
 *             properties:
 *               group:
 *                 type: string
 *               count:
 *                 type: integer
 *               percentage:
 *                 type: number
 *
 * /immunizations:
 *   post:
 *     summary: Create a new immunization record
 *     description: Record a new immunization/vaccination that has been administered
 *     tags: [Immunizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateImmunizationRequest'
 *           example:
 *             patientId: "123e4567-e89b-12d3-a456-426614174001"
 *             facilityId: "123e4567-e89b-12d3-a456-426614174002"
 *             vaccineType: "COVID-19"
 *             vaccineName: "Pfizer-BioNTech COVID-19 Vaccine"
 *             doseNumber: 1
 *             batchNumber: "EN6201"
 *             administrationDate: "2024-05-29"
 *             expiryDate: "2025-05-29"
 *             administeredBy: "Dr. Jane Smith"
 *             administrationSite: "Left Arm"
 *             administrationRoute: "Intramuscular"
 *             dosage: "0.5 mL"
 *             status: "Administered"
 *             weightKg: 70.5
 *             heightCm: 175
 *     responses:
 *       201:
 *         description: Immunization record created successfully
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
 *                   example: Immunization record created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Immunization'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Validation error message
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Search immunization records
 *     description: Search and filter immunization records with pagination
 *     tags: [Immunizations]
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
 *         name: vaccineType
 *         schema:
 *           type: string
 *         description: Filter by vaccine type
 *       - in: query
 *         name: vaccineName
 *         schema:
 *           type: string
 *         description: Filter by vaccine name
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter immunizations from this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter immunizations up to this date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Scheduled, Administered, Missed, Cancelled]
 *         description: Filter by immunization status
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
 *           enum: [administrationDate, createdAt, nextDoseDate, vaccination_date, created_at, next_due_date]
 *           default: administrationDate
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
 *         description: Immunization records retrieved successfully
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
 *                   example: Immunization records retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     immunizations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Immunization'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /immunizations/schedule:
 *   post:
 *     summary: Schedule an immunization
 *     description: Schedule a future immunization appointment for a patient
 *     tags: [Immunizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleImmunizationRequest'
 *           example:
 *             patientId: "123e4567-e89b-12d3-a456-426614174001"
 *             facilityId: "123e4567-e89b-12d3-a456-426614174002"
 *             vaccineType: "COVID-19"
 *             vaccineName: "Pfizer-BioNTech COVID-19 Vaccine"
 *             doseNumber: 2
 *             scheduledDate: "2024-06-29"
 *             notes: "Second dose appointment"
 *     responses:
 *       201:
 *         description: Immunization scheduled successfully
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
 *                   example: Immunization scheduled successfully
 *                 data:
 *                   $ref: '#/components/schemas/Immunization'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /immunizations/due:
 *   get:
 *     summary: Get due immunizations
 *     description: Retrieve list of immunizations that are due or overdue
 *     tags: [Immunizations]
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
 *         description: Due dates from this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Due dates up to this date
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
 *     responses:
 *       200:
 *         description: Due immunizations retrieved successfully
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
 *                   example: Due immunizations retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     immunizations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Immunization'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /immunizations/statistics:
 *   get:
 *     summary: Get immunization statistics
 *     description: Generate statistical reports about immunizations
 *     tags: [Immunizations]
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
 *         description: Statistics start date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Statistics end date
 *       - in: query
 *         name: groupBy
 *         required: true
 *         schema:
 *           type: string
 *           enum: [vaccine, facility, month, age]
 *         description: How to group the statistics
 *         example: vaccine
 *     responses:
 *       200:
 *         description: Immunization statistics retrieved successfully
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
 *                   example: Immunization statistics retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/ImmunizationStatistics'
 *       400:
 *         description: Invalid or missing groupBy parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid or missing groupBy parameter
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /immunizations/patient/{patientId}/history:
 *   get:
 *     summary: Get patient immunization history
 *     description: Retrieve complete immunization history for a specific patient
 *     tags: [Immunizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient immunization history retrieved successfully
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
 *                   example: Patient immunization history retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     patient:
 *                       type: object
 *                       description: Patient information
 *                     immunizations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Immunization'
 *                     upcomingDoses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Immunization'
 *                       description: Scheduled future immunizations
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalImmunizations:
 *                           type: integer
 *                         lastImmunization:
 *                           type: string
 *                           format: date
 *                         nextDue:
 *                           type: string
 *                           format: date
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 *
 * /immunizations/{id}:
 *   get:
 *     summary: Get immunization record by ID
 *     description: Retrieve a specific immunization record by its ID
 *     tags: [Immunizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Immunization record ID
 *     responses:
 *       200:
 *         description: Immunization record retrieved successfully
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
 *                   example: Immunization record retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Immunization'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Immunization record not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update immunization record
 *     description: Update an existing immunization record
 *     tags: [Immunizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Immunization record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vaccineType:
 *                 type: string
 *               vaccineName:
 *                 type: string
 *               doseNumber:
 *                 type: integer
 *                 minimum: 1
 *               batchNumber:
 *                 type: string
 *               administrationDate:
 *                 type: string
 *                 format: date
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               administeredBy:
 *                 type: string
 *               administrationSite:
 *                 type: string
 *                 enum: [Left Arm, Right Arm, Left Thigh, Right Thigh, Oral, Intranasal, Other]
 *               administrationRoute:
 *                 type: string
 *                 enum: [Intramuscular, Subcutaneous, Intradermal, Oral, Intranasal, Other]
 *               dosage:
 *                 type: string
 *               sideEffects:
 *                 type: string
 *               nextDoseDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [Scheduled, Administered, Missed, Cancelled]
 *               notes:
 *                 type: string
 *               weightKg:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 500
 *               heightCm:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 300
 *           example:
 *             status: "Administered"
 *             sideEffects: "No adverse reactions observed"
 *             notes: "Patient tolerated vaccine well"
 *     responses:
 *       200:
 *         description: Immunization record updated successfully
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
 *                   example: Immunization record updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Immunization'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Immunization record not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete immunization record
 *     description: Soft delete an immunization record from the system
 *     tags: [Immunizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Immunization record ID
 *     responses:
 *       200:
 *         description: Immunization record deleted successfully
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
 *                   example: Immunization record deleted successfully
 *                 data:
 *                   type: object
 *                   description: Deletion confirmation
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Immunization record not found
 *       500:
 *         description: Server error
 */