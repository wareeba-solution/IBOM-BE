/**
 * @swagger
 * components:
 *   schemas:
 *     PartnerInfo:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: "John Smith"
 *         phoneNumber:
 *           type: string
 *           example: "+234801234567"
 *         bloodGroup:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-, Unknown]
 *           default: Unknown
 *         hivStatus:
 *           type: string
 *           enum: [Positive, Negative, Unknown, Not Tested]
 *           default: Not Tested
 *         sickling:
 *           type: string
 *           enum: [Positive, Negative, Unknown, Not Tested]
 *           default: Not Tested
 *
 *     BirthOutcome:
 *       type: object
 *       properties:
 *         birthWeight:
 *           type: number
 *           description: Birth weight in grams
 *           example: 3200
 *         gender:
 *           type: string
 *           enum: [Male, Female, Unknown]
 *         apgarScore:
 *           type: string
 *           description: APGAR score at birth
 *           example: "9/10"
 *         complications:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Jaundice"]
 *         notes:
 *           type: string
 *           example: "Normal delivery, healthy baby"
 *
 *     AntenatalCare:
 *       type: object
 *       required:
 *         - patientId
 *         - facilityId
 *         - registrationDate
 *         - lmp
 *         - edd
 *         - gravida
 *         - para
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for antenatal care record
 *         registrationNumber:
 *           type: string
 *           description: Unique registration number
 *           example: "ANC-2024-001234"
 *         patientId:
 *           type: string
 *           format: uuid
 *           description: ID of the pregnant patient
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: ID of the healthcare facility
 *         registrationDate:
 *           type: string
 *           format: date
 *           description: Date of antenatal care registration
 *         lmp:
 *           type: string
 *           format: date
 *           description: Last menstrual period date
 *           example: "2024-01-15"
 *         edd:
 *           type: string
 *           format: date
 *           description: Expected delivery date
 *           example: "2024-10-22"
 *         gravida:
 *           type: integer
 *           minimum: 1
 *           description: Total number of pregnancies including current
 *           example: 2
 *         para:
 *           type: integer
 *           minimum: 0
 *           description: Number of previous births after 28 weeks
 *           example: 1
 *         bloodGroup:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-, Unknown]
 *           default: Unknown
 *         height:
 *           type: number
 *           description: Patient height in centimeters
 *           example: 165
 *         prePregnancyWeight:
 *           type: number
 *           description: Weight before pregnancy in kilograms
 *           example: 60.5
 *         hivStatus:
 *           type: string
 *           enum: [Positive, Negative, Unknown, Not Tested]
 *           default: Not Tested
 *         sickling:
 *           type: string
 *           enum: [Positive, Negative, Unknown, Not Tested]
 *           default: Not Tested
 *         hepatitisB:
 *           type: string
 *           enum: [Positive, Negative, Unknown, Not Tested]
 *           default: Not Tested
 *         hepatitisC:
 *           type: string
 *           enum: [Positive, Negative, Unknown, Not Tested]
 *           default: Not Tested
 *         vdrl:
 *           type: string
 *           enum: [Positive, Negative, Unknown, Not Tested]
 *           default: Not Tested
 *           description: Venereal Disease Research Laboratory test
 *         tetanusVaccination:
 *           type: string
 *           default: Not received
 *         malariaProphylaxis:
 *           type: string
 *           default: Not received
 *         ironFolateSupplementation:
 *           type: string
 *           default: Not received
 *         riskFactors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Previous cesarean", "Diabetes"]
 *         riskLevel:
 *           type: string
 *           enum: [low, medium, high]
 *           default: low
 *         medicalHistory:
 *           type: string
 *           description: Patient's medical history
 *         obstetricsHistory:
 *           type: string
 *           description: Patient's obstetric history
 *         partner:
 *           $ref: '#/components/schemas/PartnerInfo'
 *         emergencyContact:
 *           type: object
 *           description: Emergency contact information
 *         nearestHealthFacility:
 *           type: string
 *           description: Nearest health facility to patient
 *         outcome:
 *           type: string
 *           enum: [Ongoing, Live Birth, Stillbirth, Miscarriage, Abortion, Ectopic Pregnancy, Unknown]
 *           default: Ongoing
 *         deliveryDate:
 *           type: string
 *           format: date
 *           description: Actual delivery date
 *         modeOfDelivery:
 *           type: string
 *           enum: [Vaginal Delivery, Cesarean Section, Instrumental Delivery, Not Applicable, Unknown]
 *           default: Not Applicable
 *         birthOutcome:
 *           $ref: '#/components/schemas/BirthOutcome'
 *         status:
 *           type: string
 *           enum: [Active, Completed, Transferred, Lost to Follow-up]
 *           default: Active
 *         nextAppointment:
 *           type: string
 *           format: date
 *           description: Next scheduled appointment
 *         createdBy:
 *           type: string
 *           format: uuid
 *         updatedBy:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *
 *     AntenatalVisit:
 *       type: object
 *       required:
 *         - antenatalCareId
 *         - visitDate
 *         - gestationalAge
 *         - weight
 *         - bloodPressure
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         antenatalCareId:
 *           type: string
 *           format: uuid
 *           description: ID of the antenatal care record
 *         visitDate:
 *           type: string
 *           format: date
 *           description: Date of the visit
 *         gestationalAge:
 *           type: integer
 *           minimum: 1
 *           maximum: 45
 *           description: Gestational age in weeks
 *           example: 28
 *         weight:
 *           type: number
 *           description: Patient weight in kilograms
 *           example: 65.5
 *         bloodPressure:
 *           type: string
 *           pattern: '^\d{1,3}\/\d{1,3}$'
 *           description: Blood pressure in systolic/diastolic format
 *           example: "120/80"
 *         fetalHeartRate:
 *           type: integer
 *           minimum: 60
 *           maximum: 220
 *           description: Fetal heart rate in beats per minute
 *           example: 140
 *         fetalMovement:
 *           type: string
 *           enum: [Present, Absent, Not Checked]
 *           default: Not Checked
 *         fundusHeight:
 *           type: number
 *           description: Fundus height in centimeters
 *           example: 28
 *         presentation:
 *           type: string
 *           enum: [Cephalic, Breech, Transverse, Oblique, Not Determined]
 *           default: Not Determined
 *         urineProtein:
 *           type: string
 *           description: Urine protein test result
 *           example: "Negative"
 *         urineGlucose:
 *           type: string
 *           description: Urine glucose test result
 *           example: "Negative"
 *         hemoglobin:
 *           type: number
 *           description: Hemoglobin level in g/dL
 *           example: 11.5
 *         complaints:
 *           type: string
 *           description: Patient complaints during visit
 *         diagnosis:
 *           type: string
 *           description: Clinical diagnosis
 *         treatment:
 *           type: string
 *           description: Treatment provided
 *         notes:
 *           type: string
 *           description: Additional notes
 *         nextAppointment:
 *           type: string
 *           format: date
 *           description: Next scheduled appointment
 *         createdBy:
 *           type: string
 *           format: uuid
 *         updatedBy:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AntenatalStatistics:
 *       type: object
 *       properties:
 *         summary:
 *           type: object
 *           properties:
 *             totalRegistrations:
 *               type: integer
 *             activePregnancies:
 *               type: integer
 *             completedPregnancies:
 *               type: integer
 *             averageAge:
 *               type: number
 *             hivPositiveRate:
 *               type: number
 *             deliveryOutcomes:
 *               type: object
 *               properties:
 *                 liveBirths:
 *                   type: integer
 *                 stillbirths:
 *                   type: integer
 *                 miscarriages:
 *                   type: integer
 *         groupedData:
 *           type: array
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
 *     PaginationResponse:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         totalItems:
 *           type: integer
 *           example: 150
 *         totalPages:
 *           type: integer
 *           example: 15
 *
 *     AntenatalCareListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AntenatalCare'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationResponse'
 *
 *     AntenatalVisitListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AntenatalVisit'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationResponse'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Validation error message"
 *
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Invalid or missing groupBy parameter"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 */