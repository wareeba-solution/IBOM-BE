/**
 * @swagger
 * /antenatal:
 *   post:
 *     summary: Create antenatal care record
 *     description: Register a new pregnancy for antenatal care
 *     tags: [Antenatal Care]
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
 *               - lmp
 *               - edd
 *               - gravida
 *               - para
 *             properties:
 *               patientId:
 *                 type: string
 *                 format: uuid
 *               facilityId:
 *                 type: string
 *                 format: uuid
 *               registrationDate:
 *                 type: string
 *                 format: date
 *               lmp:
 *                 type: string
 *                 format: date
 *               edd:
 *                 type: string
 *                 format: date
 *               gravida:
 *                 type: integer
 *                 minimum: 1
 *               para:
 *                 type: integer
 *                 minimum: 0
 *               bloodGroup:
 *                 type: string
 *                 enum: [A+, A-, B+, B-, AB+, AB-, O+, O-, Unknown]
 *               height:
 *                 type: number
 *               prePregnancyWeight:
 *                 type: number
 *               hivStatus:
 *                 type: string
 *                 enum: [Positive, Negative, Unknown, Not Tested]
 *               riskFactors:
 *                 type: array
 *                 items:
 *                   type: string
 *               partner:
 *                 $ref: '#/components/schemas/PartnerInfo'
 *           example:
 *             patientId: "123e4567-e89b-12d3-a456-426614174001"
 *             facilityId: "123e4567-e89b-12d3-a456-426614174002"
 *             registrationDate: "2024-05-29"
 *             lmp: "2024-01-15"
 *             edd: "2024-10-22"
 *             gravida: 2
 *             para: 1
 *             bloodGroup: "O+"
 *             height: 165
 *             prePregnancyWeight: 60.5
 *             hivStatus: "Negative"
 *             riskFactors: ["Previous cesarean"]
 *     responses:
 *       201:
 *         description: Antenatal care record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AntenatalCare'
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
 *   get:
 *     summary: Search antenatal care records
 *     description: Search and filter antenatal care records with pagination
 *     tags: [Antenatal Care]
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
 *         name: registrationDateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter registrations from this date
 *       - in: query
 *         name: registrationDateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter registrations up to this date
 *       - in: query
 *         name: eddFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by expected delivery date from
 *       - in: query
 *         name: eddTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by expected delivery date to
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Completed, Transferred, Lost to Follow-up]
 *         description: Filter by status
 *       - in: query
 *         name: outcome
 *         schema:
 *           type: string
 *           enum: [Ongoing, Live Birth, Stillbirth, Miscarriage, Abortion, Ectopic Pregnancy, Unknown]
 *         description: Filter by pregnancy outcome
 *       - in: query
 *         name: hivStatus
 *         schema:
 *           type: string
 *           enum: [Positive, Negative, Unknown, Not Tested]
 *         description: Filter by HIV status
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
 *           enum: [registrationDate, edd, createdAt]
 *           default: registrationDate
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Antenatal care records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AntenatalCareListResponse'
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
 * /antenatal/{id}:
 *   get:
 *     summary: Get antenatal care record by ID
 *     description: Retrieve a specific antenatal care record with optional visits
 *     tags: [Antenatal Care]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Antenatal care record ID
 *       - in: query
 *         name: includeVisits
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include associated visits in response
 *     responses:
 *       200:
 *         description: Antenatal care record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/AntenatalCare'
 *                 - type: object
 *                   properties:
 *                     visits:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AntenatalVisit'
 *                       description: Associated visits (only if includeVisits=true)
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
 *   put:
 *     summary: Update antenatal care record
 *     description: Update an existing antenatal care record
 *     tags: [Antenatal Care]
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
 *               lmp:
 *                 type: string
 *                 format: date
 *               edd:
 *                 type: string
 *                 format: date
 *               gravida:
 *                 type: integer
 *                 minimum: 1
 *               para:
 *                 type: integer
 *                 minimum: 0
 *               bloodGroup:
 *                 type: string
 *                 enum: [A+, A-, B+, B-, AB+, AB-, O+, O-, Unknown]
 *               height:
 *                 type: number
 *               prePregnancyWeight:
 *                 type: number
 *               hivStatus:
 *                 type: string
 *                 enum: [Positive, Negative, Unknown, Not Tested]
 *               sickling:
 *                 type: string
 *                 enum: [Positive, Negative, Unknown, Not Tested]
 *               hepatitisB:
 *                 type: string
 *                 enum: [Positive, Negative, Unknown, Not Tested]
 *               hepatitisC:
 *                 type: string
 *                 enum: [Positive, Negative, Unknown, Not Tested]
 *               vdrl:
 *                 type: string
 *                 enum: [Positive, Negative, Unknown, Not Tested]
 *               riskFactors:
 *                 type: array
 *                 items:
 *                   type: string
 *               riskLevel:
 *                 type: string
 *                 enum: [low, medium, high]
 *               medicalHistory:
 *                 type: string
 *               obstetricsHistory:
 *                 type: string
 *               partner:
 *                 $ref: '#/components/schemas/PartnerInfo'
 *               status:
 *                 type: string
 *                 enum: [Active, Completed, Transferred, Lost to Follow-up]
 *           example:
 *             hivStatus: "Negative"
 *             riskFactors: ["Previous cesarean", "Diabetes"]
 *             riskLevel: "medium"
 *             status: "Active"
 *             medicalHistory: "No significant medical history"
 *     responses:
 *       200:
 *         description: Antenatal care record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AntenatalCare'
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
 *   delete:
 *     summary: Delete antenatal care record
 *     description: Soft delete an antenatal care record
 *     tags: [Antenatal Care]
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
 *         description: Antenatal care record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Antenatal care record deleted successfully"
 *                 deletedAt:
 *                   type: string
 *                   format: date-time
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
 * /antenatal/{id}/complete:
 *   post:
 *     summary: Complete antenatal care
 *     description: Mark antenatal care as completed with delivery outcome
 *     tags: [Antenatal Care]
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
 *             required:
 *               - outcome
 *               - deliveryDate
 *             properties:
 *               outcome:
 *                 type: string
 *                 enum: [Live Birth, Stillbirth, Miscarriage, Abortion, Ectopic Pregnancy]
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *               modeOfDelivery:
 *                 type: string
 *                 enum: [Vaginal Delivery, Cesarean Section, Instrumental Delivery]
 *               birthOutcome:
 *                 $ref: '#/components/schemas/BirthOutcome'
 *               complications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Any delivery complications
 *               notes:
 *                 type: string
 *                 description: Additional notes about the delivery
 *           example:
 *             outcome: "Live Birth"
 *             deliveryDate: "2024-10-20"
 *             modeOfDelivery: "Vaginal Delivery"
 *             birthOutcome:
 *               birthWeight: 3200
 *               gender: "Male"
 *               apgarScore: "9/10"
 *               complications: []
 *               notes: "Normal delivery, healthy baby"
 *             notes: "Delivery proceeded without complications"
 *     responses:
 *       200:
 *         description: Antenatal care completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AntenatalCare'
 *       400:
 *         description: Validation error or pregnancy already completed
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
 * /antenatal/appointments/due:
 *   get:
 *     summary: Get due appointments
 *     description: Retrieve antenatal appointments that are due or overdue
 *     tags: [Antenatal Care]
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
 *         description: Due dates from this date (defaults to today)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Due dates up to this date
 *       - in: query
 *         name: overdue
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include only overdue appointments
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
 *         description: Due appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/AntenatalCare'
 *                       - type: object
 *                         properties:
 *                           patient:
 *                             type: object
 *                             properties:
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                               phoneNumber:
 *                                 type: string
 *                           daysOverdue:
 *                             type: integer
 *                             description: Number of days overdue (negative if not yet due)
 *                           urgency:
 *                             type: string
 *                             enum: [low, medium, high, critical]
 *                             description: Urgency level based on days overdue and risk factors
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationResponse'
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalDue:
 *                       type: integer
 *                       description: Total appointments due
 *                     totalOverdue:
 *                       type: integer
 *                       description: Total overdue appointments
 *                     urgencyBreakdown:
 *                       type: object
 *                       properties:
 *                         critical:
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
 */