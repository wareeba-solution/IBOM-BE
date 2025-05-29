/**
 * @swagger
 * components:
 *   schemas:
 *     DiseaseRegistry:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for disease registry entry
 *         name:
 *           type: string
 *           description: Name of the disease
 *           example: "COVID-19"
 *         description:
 *           type: string
 *           description: Detailed description of the disease
 *           example: "Coronavirus disease 2019 caused by SARS-CoV-2 virus"
 *         icdCode:
 *           type: string
 *           description: International Classification of Diseases code
 *           example: "U07.1"
 *         symptoms:
 *           type: array
 *           items:
 *             type: string
 *           description: Common symptoms of the disease
 *           example: ["Fever", "Cough", "Shortness of breath", "Loss of taste/smell"]
 *         transmissionRoutes:
 *           type: array
 *           items:
 *             type: string
 *           description: How the disease spreads
 *           example: ["Respiratory droplets", "Airborne", "Contact with contaminated surfaces"]
 *         preventiveMeasures:
 *           type: array
 *           items:
 *             type: string
 *           description: Prevention methods
 *           example: ["Vaccination", "Mask wearing", "Social distancing", "Hand hygiene"]
 *         treatmentGuidelines:
 *           type: string
 *           description: Treatment guidelines and protocols
 *           example: "Supportive care, antiviral medications if severe, oxygen therapy if needed"
 *         notifiable:
 *           type: boolean
 *           description: Whether disease must be reported to health authorities
 *           default: true
 *         incubationPeriodMin:
 *           type: integer
 *           description: Minimum incubation period in days
 *           example: 2
 *         incubationPeriodMax:
 *           type: integer
 *           description: Maximum incubation period in days
 *           example: 14
 *         isActive:
 *           type: boolean
 *           description: Whether this disease registry entry is active
 *           default: true
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
 *     DiseaseCase:
 *       type: object
 *       required:
 *         - caseId
 *         - diseaseType
 *         - diseaseId
 *         - patientId
 *         - facilityId
 *         - reportDate
 *         - diagnosisDate
 *         - diagnosisType
 *         - severity
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for disease case
 *         caseId:
 *           type: string
 *           description: Unique case identifier
 *           example: "COVID-2024-001234"
 *         diseaseId:
 *           type: string
 *           format: uuid
 *           description: Reference to disease registry entry
 *         diseaseType:
 *           type: string
 *           description: Name of the disease for frontend compatibility
 *           example: "COVID-19"
 *         patientId:
 *           type: string
 *           format: uuid
 *           description: ID of the affected patient
 *         patientName:
 *           type: string
 *           description: Cached patient name for frontend compatibility
 *           example: "John Doe"
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: ID of the reporting healthcare facility
 *         reportDate:
 *           type: string
 *           format: date
 *           description: Date when case was reported
 *           example: "2024-05-29"
 *         onsetDate:
 *           type: string
 *           format: date
 *           description: Date when symptoms first appeared
 *           example: "2024-05-25"
 *         diagnosisDate:
 *           type: string
 *           format: date
 *           description: Date when diagnosis was made
 *           example: "2024-05-27"
 *         diagnosisType:
 *           type: string
 *           enum: [Clinical, Laboratory, Epidemiological, Presumptive]
 *           description: How the diagnosis was made
 *         location:
 *           type: string
 *           description: Location of patient when diagnosed
 *           example: "Lagos, Nigeria"
 *         symptoms:
 *           type: array
 *           items:
 *             type: string
 *           description: Symptoms observed in this case
 *           example: ["Fever", "Cough", "Fatigue"]
 *         status:
 *           type: string
 *           enum: [suspected, probable, confirmed, ruled_out]
 *           description: Current case status
 *           default: suspected
 *         severity:
 *           type: string
 *           enum: [mild, moderate, severe]
 *           description: Severity level of the case
 *         outcome:
 *           type: string
 *           enum: [under_treatment, recovered, hospitalized, death]
 *           description: Current outcome of the case
 *           default: under_treatment
 *         isOutbreak:
 *           type: boolean
 *           description: Whether this case is part of an outbreak
 *           default: false
 *         reportedBy:
 *           type: string
 *           description: Person who reported the case
 *           example: "Dr. Jane Smith"
 *         labTestType:
 *           type: string
 *           description: Type of laboratory test performed
 *           example: "RT-PCR"
 *         labResult:
 *           type: string
 *           description: Laboratory test result
 *           example: "Positive"
 *         labNotes:
 *           type: string
 *           description: Additional laboratory notes
 *         labTestResults:
 *           type: object
 *           description: Detailed lab test results in structured format
 *           example:
 *             testType: "RT-PCR"
 *             result: "Positive"
 *             ctValue: 25.5
 *             testDate: "2024-05-27"
 *         hospitalized:
 *           type: boolean
 *           description: Whether patient is/was hospitalized
 *           default: false
 *         hospitalName:
 *           type: string
 *           description: Name of hospital if hospitalized
 *           example: "Lagos University Teaching Hospital"
 *         admissionDate:
 *           type: string
 *           format: date
 *           description: Hospital admission date
 *         dischargeDate:
 *           type: string
 *           format: date
 *           description: Hospital discharge date
 *         outcomeDate:
 *           type: string
 *           format: date
 *           description: Date when outcome was determined
 *         transmissionRoute:
 *           type: string
 *           description: How the disease was transmitted
 *           example: "Close contact with confirmed case"
 *         transmissionLocation:
 *           type: string
 *           description: Where transmission likely occurred
 *           example: "Workplace"
 *         travelHistory:
 *           type: string
 *           description: Recent travel history
 *           example: "Traveled to Abuja 2 weeks prior to onset"
 *         contactHistory:
 *           type: string
 *           description: Contact history with other cases
 *         treatmentProvided:
 *           type: string
 *           description: Treatment details provided
 *         treatment:
 *           type: string
 *           description: Treatment plan and prescriptions
 *         diagnosisNotes:
 *           type: string
 *           description: Additional diagnosis notes
 *         complications:
 *           type: array
 *           items:
 *             type: string
 *           description: Medical complications
 *           example: ["Pneumonia", "Respiratory failure"]
 *         notes:
 *           type: string
 *           description: Additional case notes
 *         reportedToAuthorities:
 *           type: boolean
 *           description: Whether case has been reported to health authorities
 *           default: false
 *         reportedDate:
 *           type: string
 *           format: date
 *           description: Date when reported to authorities
 *         caseStatus:
 *           type: string
 *           enum: [Active, Resolved, Deceased, Lost to Follow-up]
 *           description: Overall case status
 *           default: Active
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
 *     ContactTracing:
 *       type: object
 *       required:
 *         - diseaseCaseId
 *         - contactType
 *         - contactName
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for contact tracing record
 *         diseaseCaseId:
 *           type: string
 *           format: uuid
 *           description: ID of the associated disease case
 *         contactType:
 *           type: string
 *           enum: [Household, Workplace, Healthcare, Social, Travel, Other]
 *           description: Type of contact relationship
 *         contactName:
 *           type: string
 *           description: Full name of the contact
 *           example: "Jane Doe"
 *         contactPhone:
 *           type: string
 *           description: Phone number of the contact
 *           example: "+234801234567"
 *         contactAddress:
 *           type: string
 *           description: Address of the contact
 *           example: "123 Main Street, Lagos"
 *         exposureDate:
 *           type: string
 *           format: date
 *           description: Date of exposure to the case
 *           example: "2024-05-20"
 *         exposureDuration:
 *           type: integer
 *           description: Duration of exposure in minutes
 *           example: 120
 *         exposureLocation:
 *           type: string
 *           description: Location where exposure occurred
 *           example: "Office meeting room"
 *         relationshipToPatient:
 *           type: string
 *           description: Relationship to the primary case
 *           example: "Colleague"
 *         riskAssessment:
 *           type: string
 *           enum: [High, Medium, Low, Unknown]
 *           description: Risk level assessment
 *           default: Unknown
 *         monitoringStatus:
 *           type: string
 *           enum: [Not Started, Ongoing, Completed, Lost to Follow-up]
 *           description: Current monitoring status
 *           default: Not Started
 *         symptomDevelopment:
 *           type: boolean
 *           description: Whether contact has developed symptoms
 *           default: false
 *         symptomOnsetDate:
 *           type: string
 *           format: date
 *           description: Date when symptoms first appeared
 *         testedStatus:
 *           type: string
 *           enum: [Not Tested, Pending, Positive, Negative]
 *           description: Testing status of the contact
 *           default: Not Tested
 *         testDate:
 *           type: string
 *           format: date
 *           description: Date when test was performed
 *         notes:
 *           type: string
 *           description: Additional notes about the contact
 *         monitoringEndDate:
 *           type: string
 *           format: date
 *           description: Date when monitoring period ends
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
 *     DiseaseStatistics:
 *       type: object
 *       properties:
 *         summary:
 *           type: object
 *           properties:
 *             totalCases:
 *               type: integer
 *               description: Total number of disease cases
 *             activeCases:
 *               type: integer
 *               description: Currently active cases
 *             resolvedCases:
 *               type: integer
 *               description: Resolved cases
 *             deaths:
 *               type: integer
 *               description: Number of deaths
 *             casesFatality:
 *               type: number
 *               description: Case fatality rate percentage
 *         groupedData:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               group:
 *                 type: string
 *                 description: Group category
 *               count:
 *                 type: integer
 *                 description: Number of cases in this group
 *               percentage:
 *                 type: number
 *                 description: Percentage of total cases
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
 *     DiseaseRegistryListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DiseaseRegistry'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationResponse'
 *
 *     DiseaseCaseListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DiseaseCase'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationResponse'
 *
 *     ContactTracingListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ContactTracing'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationResponse'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Resource not found"
 *
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Validation failed"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *
 *     BatchUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Batch update completed successfully"
 *         updatedCount:
 *           type: integer
 *           example: 15
 *         failedCount:
 *           type: integer
 *           example: 2
 *         updatedIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         failedIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               reason:
 *                 type: string
 *
 *     ExportResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Export completed successfully"
 *         format:
 *           type: string
 *           example: "csv"
 *         recordCount:
 *           type: integer
 *           example: 1250
 *         downloadUrl:
 *           type: string
 *           example: "/api/downloads/disease-cases-export-2024-05-29.csv"
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           example: "2024-05-30T10:30:00Z"
 */