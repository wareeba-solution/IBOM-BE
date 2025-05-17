/**
 * @swagger
 * components:
 *   schemas:
 *     Audit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique audit log identifier
 *         action:
 *           type: string
 *           description: Action performed (e.g., CREATE, UPDATE, DELETE)
 *         entityType:
 *           type: string
 *           description: Type of entity affected (e.g., User, Patient, Birth)
 *         entityId:
 *           type: string
 *           description: ID of the entity affected
 *         oldValues:
 *           type: object
 *           description: Previous values before the change
 *         newValues:
 *           type: object
 *           description: New values after the change
 *         ipAddress:
 *           type: string
 *           description: IP address of the user performing the action
 *         userAgent:
 *           type: string
 *           description: User agent information
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user who performed the action
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the audit log was created
 *
 *     Setting:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique setting identifier
 *         key:
 *           type: string
 *           description: Unique setting key
 *         value:
 *           type: string
 *           description: Setting value
 *         type:
 *           type: string
 *           enum: [string, number, boolean, json, date]
 *           description: Setting value type
 *         category:
 *           type: string
 *           description: Setting category
 *         description:
 *           type: string
 *           description: Setting description
 *         isSystemSetting:
 *           type: boolean
 *           description: Whether this is a system setting
 *         lastModifiedBy:
 *           type: string
 *           format: uuid
 *           description: ID of the user who last modified the setting
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the setting was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the setting was last updated
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique user identifier
 *         username:
 *           type: string
 *           description: User's unique username
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         phoneNumber:
 *           type: string
 *           description: User's phone number
 *         status:
 *           type: string
 *           enum: [active, inactive, pending]
 *           description: User's account status
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: Last login timestamp
 *         emailVerified:
 *           type: boolean
 *           description: Whether the user's email is verified
 *         profileCompleted:
 *           type: boolean
 *           description: Whether the user has completed their profile
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 *
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique role identifier
 *         name:
 *           type: string
 *           description: Role name
 *         description:
 *           type: string
 *           description: Role description
 *         permissions:
 *           type: object
 *           description: Role permissions
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the role was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the role was last updated
 *
 *     Facility:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique facility identifier
 *         name:
 *           type: string
 *           description: Facility name
 *         facilityType:
 *           type: string
 *           enum: [hospital, clinic, health_center, maternity]
 *           description: Type of facility
 *         address:
 *           type: string
 *           description: Facility address
 *         lga:
 *           type: string
 *           description: Local Government Area
 *         state:
 *           type: string
 *           description: State
 *         contactPerson:
 *           type: string
 *           description: Contact person
 *         phoneNumber:
 *           type: string
 *           description: Contact phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Facility status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the facility was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the facility was last updated
 *
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique notification identifier
 *         userId:
 *           type: string
 *           format: uuid
 *           description: Target user ID
 *         title:
 *           type: string
 *           description: Notification title
 *         message:
 *           type: string
 *           description: Notification message
 *         type:
 *           type: string
 *           description: Notification type
 *         read:
 *           type: boolean
 *           description: Whether the notification has been read
 *         archived:
 *           type: boolean
 *           description: Whether the notification has been archived
 *         link:
 *           type: string
 *           description: Optional link related to the notification
 *         metadata:
 *           type: object
 *           description: Additional data related to the notification
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the notification was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the notification was last updated
 *
 *     Backup:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique backup identifier
 *         filename:
 *           type: string
 *           description: Backup filename
 *         size:
 *           type: number
 *           description: Backup size in bytes
 *         path:
 *           type: string
 *           description: Path to backup file
 *         type:
 *           type: string
 *           enum: [manual, automatic]
 *           description: Type of backup
 *         status:
 *           type: string
 *           enum: [completed, failed, in_progress]
 *           description: Backup status
 *         createdBy:
 *           type: string
 *           format: uuid
 *           description: ID of the user who created the backup (null for automatic backups)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the backup was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the backup was last updated
 *
 *     Patient:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique patient identifier
 *         patientId:
 *           type: string
 *           description: Patient ID number
 *         firstName:
 *           type: string
 *           description: Patient's first name
 *         lastName:
 *           type: string
 *           description: Patient's last name
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Patient's date of birth
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Patient's gender
 *         address:
 *           type: string
 *           description: Patient's address
 *         phoneNumber:
 *           type: string
 *           description: Patient's phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Patient's email address
 *         bloodGroup:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *           description: Patient's blood group
 *         registrationDate:
 *           type: string
 *           format: date
 *           description: Date when the patient was registered
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: ID of the facility where the patient is registered
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the patient record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the patient record was last updated
 *
 *     Birth:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique birth record identifier
 *         motherId:
 *           type: string
 *           format: uuid
 *           description: ID of the mother
 *         motherName:
 *           type: string
 *           description: Mother's full name
 *         motherAge:
 *           type: integer
 *           description: Mother's age
 *         fatherName:
 *           type: string
 *           description: Father's full name
 *         fatherAge:
 *           type: integer
 *           description: Father's age
 *         babyId:
 *           type: string
 *           format: uuid
 *           description: ID of the baby (links to patient record)
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Date of birth
 *         birthTime:
 *           type: string
 *           format: time
 *           description: Time of birth
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Baby's gender
 *         birthWeight:
 *           type: number
 *           description: Birth weight in kilograms
 *         birthType:
 *           type: string
 *           enum: [singleton, twin, triplet, quadruplet, other]
 *           description: Type of birth
 *         deliveryMethod:
 *           type: string
 *           enum: [vaginal, cesarean, assisted, other]
 *           description: Method of delivery
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: ID of the facility where birth occurred
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was last updated
 *
 *     Death:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique death record identifier
 *         patientId:
 *           type: string
 *           format: uuid
 *           description: ID of the deceased
 *         dateOfDeath:
 *           type: string
 *           format: date
 *           description: Date of death
 *         timeOfDeath:
 *           type: string
 *           format: time
 *           description: Time of death
 *         causeOfDeath:
 *           type: string
 *           description: Primary cause of death
 *         placeOfDeath:
 *           type: string
 *           description: Location where death occurred
 *         certificateNumber:
 *           type: string
 *           description: Death certificate number
 *         certifiedBy:
 *           type: string
 *           format: uuid
 *           description: ID of the healthcare provider who certified the death
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: ID of the facility where death was recorded
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was last updated
 *
 *     Immunization:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique immunization record identifier
 *         patientId:
 *           type: string
 *           format: uuid
 *           description: ID of the patient
 *         vaccineName:
 *           type: string
 *           description: Name of the vaccine
 *         vaccineType:
 *           type: string
 *           description: Type of vaccine
 *         doseNumber:
 *           type: integer
 *           description: Dose number (e.g., 1st, 2nd, booster)
 *         administrationDate:
 *           type: string
 *           format: date
 *           description: Date of administration
 *         batchNumber:
 *           type: string
 *           description: Vaccine batch number
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Vaccine expiry date
 *         administeredBy:
 *           type: string
 *           format: uuid
 *           description: ID of the healthcare provider who administered the vaccine
 *         nextDueDate:
 *           type: string
 *           format: date
 *           description: Due date for next dose
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: ID of the facility where immunization was given
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was last updated
 *
 *     AntenatalVisit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique antenatal visit identifier
 *         patientId:
 *           type: string
 *           format: uuid
 *           description: ID of the pregnant patient
 *         visitNumber:
 *           type: integer
 *           description: Visit number in the pregnancy
 *         visitDate:
 *           type: string
 *           format: date
 *           description: Date of the visit
 *         gestationalAge:
 *           type: integer
 *           description: Gestational age in weeks
 *         weight:
 *           type: number
 *           description: Weight in kilograms
 *         bloodPressure:
 *           type: string
 *           description: Blood pressure reading
 *         fetalHeartRate:
 *           type: integer
 *           description: Fetal heart rate in bpm
 *         notes:
 *           type: string
 *           description: Clinical notes
 *         riskFactors:
 *           type: array
 *           items:
 *             type: string
 *           description: Identified risk factors
 *         attendedBy:
 *           type: string
 *           format: uuid
 *           description: ID of the healthcare provider who conducted the visit
 *         nextAppointment:
 *           type: string
 *           format: date
 *           description: Date of next appointment
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: ID of the facility where the visit occurred
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was last updated
 */