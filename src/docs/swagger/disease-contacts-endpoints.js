/**
 * @swagger
 * /diseases/contacts:
 *   post:
 *     summary: Create contact tracing record
 *     description: Create a new contact tracing record for disease surveillance
 *     tags: [Contact Tracing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - diseaseCaseId
 *               - contactType
 *               - contactName
 *             properties:
 *               diseaseCaseId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the associated disease case
 *               contactType:
 *                 type: string
 *                 enum: [Household, Workplace, Healthcare, Social, Travel, Other]
 *                 description: Type of contact relationship
 *               contactName:
 *                 type: string
 *                 description: Full name of the contact
 *               contactPhone:
 *                 type: string
 *                 description: Phone number of the contact
 *               contactAddress:
 *                 type: string
 *                 description: Address of the contact
 *               exposureDate:
 *                 type: string
 *                 format: date
 *                 description: Date of exposure to the case
 *               exposureDuration:
 *                 type: integer
 *                 description: Duration of exposure in minutes
 *               exposureLocation:
 *                 type: string
 *                 description: Location where exposure occurred
 *               relationshipToPatient:
 *                 type: string
 *                 description: Relationship to the primary case
 *               riskAssessment:
 *                 type: string
 *                 enum: [High, Medium, Low, Unknown]
 *                 description: Risk level assessment
 *                 default: Unknown
 *               monitoringStatus:
 *                 type: string
 *                 enum: [Not Started, Ongoing, Completed, Lost to Follow-up]
 *                 description: Current monitoring status
 *                 default: Not Started
 *               symptomDevelopment:
 *                 type: boolean
 *                 description: Whether contact has developed symptoms
 *                 default: false
 *               symptomOnsetDate:
 *                 type: string
 *                 format: date
 *                 description: Date when symptoms first appeared
 *               testedStatus:
 *                 type: string
 *                 enum: [Not Tested, Pending, Positive, Negative]
 *                 description: Testing status of the contact
 *                 default: Not Tested
 *               testDate:
 *                 type: string
 *                 format: date
 *                 description: Date when test was performed
 *               notes:
 *                 type: string
 *                 description: Additional notes about the contact
 *               monitoringEndDate:
 *                 type: string
 *                 format: date
 *                 description: Date when monitoring period ends
 *           example:
 *             diseaseCaseId: "123e4567-e89b-12d3-a456-426614174000"
 *             contactType: "Workplace"
 *             contactName: "Jane Doe"
 *             contactPhone: "+234801234567"
 *             contactAddress: "123 Main Street, Lagos"
 *             exposureDate: "2024-05-20"
 *             exposureDuration: 120
 *             exposureLocation: "Office meeting room"
 *             relationshipToPatient: "Colleague"
 *             riskAssessment: "Medium"
 *             monitoringStatus: "Not Started"
 *             symptomDevelopment: false
 *             testedStatus: "Not Tested"
 *             notes: "Attended same meeting for 2 hours"
 *             monitoringEndDate: "2024-06-03"
 *     responses:
 *       201:
 *         description: Contact tracing record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactTracing'
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
 *         description: Associated disease case not found
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Search contact tracing records
 *     description: Search and filter contact tracing records with pagination
 *     tags: [Contact Tracing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: diseaseCaseId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by disease case ID
 *       - in: query
 *         name: contactType
 *         schema:
 *           type: string
 *           enum: [Household, Workplace, Healthcare, Social, Travel, Other]
 *         description: Filter by contact type
 *       - in: query
 *         name: riskAssessment
 *         schema:
 *           type: string
 *           enum: [High, Medium, Low, Unknown]
 *         description: Filter by risk assessment level
 *       - in: query
 *         name: monitoringStatus
 *         schema:
 *           type: string
 *           enum: [Not Started, Ongoing, Completed, Lost to Follow-up]
 *         description: Filter by monitoring status
 *       - in: query
 *         name: symptomDevelopment
 *         schema:
 *           type: boolean
 *         description: Filter by symptom development status
 *       - in: query
 *         name: testedStatus
 *         schema:
 *           type: string
 *           enum: [Not Tested, Pending, Positive, Negative]
 *         description: Filter by testing status
 *       - in: query
 *         name: exposureDateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter contacts exposed from this date
 *       - in: query
 *         name: exposureDateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter contacts exposed up to this date
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
 *           enum: [exposureDate, contactName, riskAssessment, createdAt]
 *           default: exposureDate
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Contact tracing records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactTracingListResponse'
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
 * /diseases/contacts/follow-up:
 *   get:
 *     summary: Get contacts needing follow-up
 *     description: Retrieve contacts that need follow-up based on monitoring end dates and current status
 *     tags: [Contact Tracing]
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
 *         name: monitoringEndDateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Monitoring end dates from this date
 *       - in: query
 *         name: monitoringEndDateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Monitoring end dates up to this date
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
 *     responses:
 *       200:
 *         description: Contacts needing follow-up retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/ContactTracing'
 *                       - type: object
 *                         properties:
 *                           diseaseCase:
 *                             type: object
 *                             properties:
 *                               caseId:
 *                                 type: string
 *                               diseaseType:
 *                                 type: string
 *                               patientName:
 *                                 type: string
 *                           daysOverdue:
 *                             type: integer
 *                             description: Days since monitoring should have ended (negative if not yet due)
 *                           priority:
 *                             type: string
 *                             enum: [low, medium, high, urgent]
 *                             description: Follow-up priority based on risk and overdue status
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationResponse'
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalNeedingFollowUp:
 *                       type: integer
 *                       example: 45
 *                     overdue:
 *                       type: integer
 *                       example: 12
 *                     dueToday:
 *                       type: integer
 *                       example: 8
 *                     dueTomorrow:
 *                       type: integer
 *                       example: 15
 *                     priorityBreakdown:
 *                       type: object
 *                       properties:
 *                         urgent:
 *                           type: integer
 *                         high:
 *                           type: integer
 *                         medium:
 *                           type: integer
 *                         low:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /diseases/contacts/batch-update:
 *   post:
 *     summary: Batch update contacts
 *     description: Update multiple contact tracing records at once
 *     tags: [Contact Tracing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactIds
 *               - updateData
 *             properties:
 *               contactIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of contact tracing record IDs to update
 *               updateData:
 *                 type: object
 *                 properties:
 *                   riskAssessment:
 *                     type: string
 *                     enum: [High, Medium, Low, Unknown]
 *                   monitoringStatus:
 *                     type: string
 *                     enum: [Not Started, Ongoing, Completed, Lost to Follow-up]
 *                   symptomDevelopment:
 *                     type: boolean
 *                   symptomOnsetDate:
 *                     type: string
 *                     format: date
 *                   testedStatus:
 *                     type: string
 *                     enum: [Not Tested, Pending, Positive, Negative]
 *                   testDate:
 *                     type: string
 *                     format: date
 *                   notes:
 *                     type: string
 *                   monitoringEndDate:
 *                     type: string
 *                     format: date
 *           example:
 *             contactIds: 
 *               - "123e4567-e89b-12d3-a456-426614174000"
 *               - "456e7890-e89b-12d3-a456-426614174001"
 *               - "789e0123-e89b-12d3-a456-426614174002"
 *             updateData:
 *               monitoringStatus: "Completed"
 *               testedStatus: "Negative"
 *               testDate: "2024-05-29"
 *               notes: "Monitoring period completed successfully, test negative"
 *     responses:
 *       200:
 *         description: Batch update completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BatchUpdateResponse'
 *       400:
 *         description: Validation error or empty arrays
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Some contact IDs not found
 *       500:
 *         description: Server error
 *
 * /diseases/contacts/{id}:
 *   get:
 *     summary: Get contact tracing record by ID
 *     description: Retrieve a specific contact tracing record with complete details
 *     tags: [Contact Tracing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Contact tracing record ID
 *     responses:
 *       200:
 *         description: Contact tracing record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ContactTracing'
 *                 - type: object
 *                   properties:
 *                     diseaseCase:
 *                       type: object
 *                       description: Associated disease case information
 *                       properties:
 *                         caseId:
 *                           type: string
 *                         diseaseType:
 *                           type: string
 *                         patientName:
 *                           type: string
 *                         reportDate:
 *                           type: string
 *                           format: date
 *                         status:
 *                           type: string
 *                         severity:
 *                           type: string
 *                     monitoringHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           status:
 *                             type: string
 *                           notes:
 *                             type: string
 *                           updatedBy:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Contact tracing record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update contact tracing record
 *     description: Update an existing contact tracing record
 *     tags: [Contact Tracing]
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
 *               contactType:
 *                 type: string
 *                 enum: [Household, Workplace, Healthcare, Social, Travel, Other]
 *               contactName:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               contactAddress:
 *                 type: string
 *               exposureDate:
 *                 type: string
 *                 format: date
 *               exposureDuration:
 *                 type: integer
 *               exposureLocation:
 *                 type: string
 *               relationshipToPatient:
 *                 type: string
 *               riskAssessment:
 *                 type: string
 *                 enum: [High, Medium, Low, Unknown]
 *               monitoringStatus:
 *                 type: string
 *                 enum: [Not Started, Ongoing, Completed, Lost to Follow-up]
 *               symptomDevelopment:
 *                 type: boolean
 *               symptomOnsetDate:
 *                 type: string
 *                 format: date
 *               testedStatus:
 *                 type: string
 *                 enum: [Not Tested, Pending, Positive, Negative]
 *               testDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *               monitoringEndDate:
 *                 type: string
 *                 format: date
 *           example:
 *             riskAssessment: "High"
 *             monitoringStatus: "Ongoing"
 *             symptomDevelopment: true
 *             symptomOnsetDate: "2024-05-28"
 *             testedStatus: "Pending"
 *             testDate: "2024-05-29"
 *             notes: "Contact developed fever and cough, test scheduled"
 *     responses:
 *       200:
 *         description: Contact tracing record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactTracing'
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
 *         description: Contact tracing record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete contact tracing record
 *     description: Delete a contact tracing record
 *     tags: [Contact Tracing]
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
 *         description: Contact tracing record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contact tracing record deleted successfully"
 *                 deletedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Contact tracing record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */