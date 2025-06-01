// src/docs/swagger/familyPlanning-schemas.js

/**
 * @swagger
 * components:
 *   schemas:
 *     FamilyPlanningMethod:
 *       type: object
 *       required:
 *         - name
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the family planning method
 *         name:
 *           type: string
 *           description: Name of the family planning method
 *           example: "Combined Oral Contraceptive Pills"
 *         category:
 *           type: string
 *           enum: [Hormonal, Barrier, Long-Acting Reversible, Permanent, Fertility Awareness, Emergency, Other]
 *           description: Category of the family planning method
 *           example: "Hormonal"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Detailed description of the method
 *           example: "Daily pills containing estrogen and progestin"
 *         effectiveness:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           nullable: true
 *           description: Effectiveness percentage (0-100)
 *           example: 91
 *         duration:
 *           type: string
 *           nullable: true
 *           description: Duration of effectiveness
 *           example: "Daily use"
 *         sideEffects:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 *           description: List of possible side effects
 *           example: ["Nausea", "Weight gain", "Mood changes"]
 *         contraindications:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 *           description: Medical conditions that make this method unsuitable
 *           example: ["Blood clotting disorders", "Breast cancer"]
 *         advantages:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 *           description: Benefits of this method
 *           example: ["Highly reversible", "May reduce menstrual cramps"]
 *         disadvantages:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 *           description: Drawbacks of this method
 *           example: ["Must remember daily", "Does not protect against STIs"]
 *         isActive:
 *           type: boolean
 *           description: Whether the method is currently available
 *           default: true
 *         createdBy:
 *           type: string
 *           format: uuid
 *           description: ID of user who created this record
 *         updatedBy:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of user who last updated this record
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 * 
 *     FamilyPlanningClient:
 *       type: object
 *       required:
 *         - patientId
 *         - facilityId
 *         - registrationDate
 *         - clientType
 *         - maritalStatus
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the family planning client
 *         patientId:
 *           type: string
 *           format: uuid
 *           description: Reference to the patient record
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: Reference to the facility where client is registered
 *         registrationDate:
 *           type: string
 *           format: date
 *           description: Date when client was registered for family planning services
 *           example: "2025-01-15"
 *         clientType:
 *           type: string
 *           enum: [New Acceptor, Continuing User, Restart]
 *           description: Type of family planning client
 *           example: "New Acceptor"
 *         maritalStatus:
 *           type: string
 *           enum: [Single, Married, Divorced, Widowed, Separated, Other]
 *           description: Marital status of the client
 *           example: "Married"
 *         numberOfChildren:
 *           type: integer
 *           minimum: 0
 *           nullable: true
 *           description: Current number of children
 *           default: 0
 *           example: 2
 *         desiredNumberOfChildren:
 *           type: integer
 *           minimum: 0
 *           nullable: true
 *           description: Desired total number of children
 *           example: 3
 *         educationLevel:
 *           type: string
 *           enum: [None, Primary, Secondary, Tertiary, Unknown]
 *           description: Highest level of education completed
 *           default: "Unknown"
 *           example: "Secondary"
 *         occupation:
 *           type: string
 *           nullable: true
 *           description: Client's occupation
 *           example: "Teacher"
 *         primaryContact:
 *           type: object
 *           nullable: true
 *           properties:
 *             name:
 *               type: string
 *               nullable: true
 *               description: Name of primary contact person
 *               example: "John Doe"
 *             relationship:
 *               type: string
 *               nullable: true
 *               description: Relationship to client
 *               example: "Spouse"
 *             phoneNumber:
 *               type: string
 *               nullable: true
 *               description: Contact phone number
 *               example: "+234-801-234-5678"
 *             address:
 *               type: string
 *               nullable: true
 *               description: Contact address
 *               example: "123 Main Street, Abuja"
 *         medicalHistory:
 *           type: string
 *           nullable: true
 *           description: Relevant medical history
 *           example: "Hypertension, managed with medication"
 *         allergyHistory:
 *           type: string
 *           nullable: true
 *           description: Known allergies
 *           example: "Penicillin allergy"
 *         reproductiveHistory:
 *           type: string
 *           nullable: true
 *           description: Previous pregnancies, births, miscarriages
 *           example: "G3P2A1 - 3 pregnancies, 2 live births, 1 miscarriage"
 *         menstrualHistory:
 *           type: string
 *           nullable: true
 *           description: Menstrual cycle information
 *           example: "Regular 28-day cycles, last menstrual period: 2025-01-01"
 *         referredBy:
 *           type: string
 *           nullable: true
 *           description: Who referred the client
 *           example: "Dr. Smith, General Practitioner"
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Additional notes about the client
 *         status:
 *           type: string
 *           enum: [Active, Inactive, Transferred, Lost to Follow-up]
 *           description: Current status of the client
 *           default: "Active"
 *         createdBy:
 *           type: string
 *           format: uuid
 *           description: ID of user who created this record
 *         updatedBy:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of user who last updated this record
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Soft deletion timestamp
 * 
 *     FamilyPlanningService:
 *       type: object
 *       required:
 *         - clientId
 *         - methodId
 *         - serviceDate
 *         - serviceType
 *         - providedBy
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the family planning service
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: Reference to the family planning client
 *         methodId:
 *           type: string
 *           format: uuid
 *           description: Reference to the family planning method used
 *         serviceDate:
 *           type: string
 *           format: date
 *           description: Date when the service was provided
 *           example: "2025-01-15"
 *         serviceType:
 *           type: string
 *           enum: [Initial Adoption, Method Switch, Resupply, Follow-up, Counseling, Removal, Other]
 *           description: Type of service provided
 *           example: "Initial Adoption"
 *         previousMethodId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Previous method ID (for method switches)
 *         switchReason:
 *           type: string
 *           nullable: true
 *           description: Reason for switching methods
 *           example: "Side effects from previous method"
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           nullable: true
 *           description: Quantity of contraceptives provided
 *           example: 3
 *         batchNumber:
 *           type: string
 *           nullable: true
 *           description: Batch number of contraceptives provided
 *           example: "BT2025001"
 *         expiryDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Expiry date of contraceptives provided
 *           example: "2027-01-15"
 *         providedBy:
 *           type: string
 *           description: Name of healthcare provider who provided the service
 *           example: "Dr. Jane Smith"
 *         weight:
 *           type: number
 *           minimum: 0
 *           nullable: true
 *           description: Client's weight in kg at time of service
 *           example: 65.5
 *         bloodPressure:
 *           type: string
 *           pattern: "^\\d{1,3}/\\d{1,3}$"
 *           nullable: true
 *           description: Blood pressure reading (systolic/diastolic)
 *           example: "120/80"
 *         sideEffectsReported:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 *           description: Side effects reported by client
 *           example: ["Mild nausea", "Spotting"]
 *         sideEffectsManagement:
 *           type: string
 *           nullable: true
 *           description: How side effects were managed
 *           example: "Advised to take with food, scheduled follow-up in 2 weeks"
 *         counselingNotes:
 *           type: string
 *           nullable: true
 *           description: Notes from counseling session
 *           example: "Discussed proper usage, potential side effects, and when to seek help"
 *         nextAppointment:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Date of next scheduled appointment
 *           example: "2025-04-15"
 *         discontinuationReason:
 *           type: string
 *           nullable: true
 *           description: Reason for discontinuing method (if applicable)
 *           example: "Planning pregnancy"
 *         procedureNotes:
 *           type: string
 *           nullable: true
 *           description: Notes about procedures performed
 *           example: "IUD insertion completed without complications"
 *         patientSatisfaction:
 *           type: string
 *           enum: [Very Satisfied, Satisfied, Neutral, Dissatisfied, Very Dissatisfied, Not Recorded]
 *           description: Client satisfaction with service
 *           default: "Not Recorded"
 *         createdBy:
 *           type: string
 *           format: uuid
 *           description: ID of user who created this record
 *         updatedBy:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of user who last updated this record
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Soft deletion timestamp
 * 
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *           description: Array of items for current page
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               description: Current page number
 *             limit:
 *               type: integer
 *               description: Items per page
 *             total:
 *               type: integer
 *               description: Total number of items
 *             totalPages:
 *               type: integer
 *               description: Total number of pages
 * 
 *     StatisticsResponse:
 *       type: object
 *       properties:
 *         groupBy:
 *           type: string
 *           description: The field used for grouping
 *         dateRange:
 *           type: object
 *           properties:
 *             from:
 *               type: string
 *               format: date
 *             to:
 *               type: string
 *               format: date
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category name
 *               count:
 *                 type: integer
 *                 description: Number of records in this category
 *               percentage:
 *                 type: number
 *                 description: Percentage of total
 */