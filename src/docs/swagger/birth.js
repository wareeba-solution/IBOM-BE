/**
 * @swagger
 * components:
 *   schemas:
 *     Birth:
 *       type: object
 *       required:
 *         - motherId
 *         - motherName
 *         - motherAge
 *         - motherLgaOrigin
 *         - motherLgaResidence
 *         - motherParity
 *         - birthDate
 *         - birthTime
 *         - gender
 *         - placeOfBirth
 *         - birthType
 *         - deliveryMethod
 *         - facilityId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the birth record
 *         # Paternal Data
 *         fatherName:
 *           type: string
 *           maxLength: 100
 *           description: Father's full name
 *         fatherAge:
 *           type: integer
 *           minimum: 0
 *           maximum: 120
 *           description: Father's age in years
 *         fatherOccupation:
 *           type: string
 *           maxLength: 100
 *           description: Father's occupation
 *         fatherLgaOrigin:
 *           type: string
 *           enum: [Abak, Eastern Obolo, Eket, Esit Eket, Essien Udim, Etim Ekpo, Etinan, Ibeno, Ibesikpo Asutan, Ibiono-Ibom, Ika, Ikono, Ikot Abasi, Ikot Ekpene, Ini, Itu, Mbo, Mkpat-Enin, Nsit-Atai, Nsit-Ibom, Nsit-Ubium, Obot Akara, Okobo, Onna, Oron, Oruk Anam, Udung-Uko, Ukanafun, Uruan, Urue-Offong/Oruko, Uyo, Other]
 *           description: Father's LGA of origin
 *         # Maternal Data
 *         motherId:
 *           type: string
 *           format: uuid
 *           description: ID of the mother (patient record)
 *         motherName:
 *           type: string
 *           maxLength: 100
 *           description: Mother's full name
 *         motherAge:
 *           type: integer
 *           minimum: 0
 *           maximum: 120
 *           description: Mother's age in years
 *         motherOccupation:
 *           type: string
 *           maxLength: 100
 *           description: Mother's occupation
 *         motherLgaOrigin:
 *           type: string
 *           enum: [Abak, Eastern Obolo, Eket, Esit Eket, Essien Udim, Etim Ekpo, Etinan, Ibeno, Ibesikpo Asutan, Ibiono-Ibom, Ika, Ikono, Ikot Abasi, Ikot Ekpene, Ini, Itu, Mbo, Mkpat-Enin, Nsit-Atai, Nsit-Ibom, Nsit-Ubium, Obot Akara, Okobo, Onna, Oron, Oruk Anam, Udung-Uko, Ukanafun, Uruan, Urue-Offong/Oruko, Uyo, Other]
 *           description: Mother's LGA of origin
 *         motherLgaResidence:
 *           type: string
 *           enum: [Abak, Eastern Obolo, Eket, Esit Eket, Essien Udim, Etim Ekpo, Etinan, Ibeno, Ibesikpo Asutan, Ibiono-Ibom, Ika, Ikono, Ikot Abasi, Ikot Ekpene, Ini, Itu, Mbo, Mkpat-Enin, Nsit-Atai, Nsit-Ibom, Nsit-Ubium, Obot Akara, Okobo, Onna, Oron, Oruk Anam, Udung-Uko, Ukanafun, Uruan, Urue-Offong/Oruko, Uyo, Other]
 *           description: Mother's LGA of residence
 *         motherParity:
 *           type: integer
 *           minimum: 0
 *           description: Number of previous pregnancies
 *         estimatedDeliveryDate:
 *           type: string
 *           format: date
 *           description: Estimated delivery date
 *         complications:
 *           type: string
 *           description: Birth complications or notes
 *         # Baby Statistics
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Date of birth
 *         birthTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$'
 *           description: Time of birth (HH:MM or HH:MM:SS format)
 *           example: "14:30:00"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Baby's gender
 *         placeOfBirth:
 *           type: string
 *           enum: [HOSPITAL, HOME]
 *           default: HOSPITAL
 *           description: Location where the birth occurred
 *         apgarScoreOneMin:
 *           type: integer
 *           minimum: 0
 *           maximum: 10
 *           description: APGAR score at 1 minute
 *         apgarScoreFiveMin:
 *           type: integer
 *           minimum: 0
 *           maximum: 10
 *           description: APGAR score at 5 minutes
 *         resuscitation:
 *           type: boolean
 *           default: false
 *           description: Whether resuscitation was required
 *         birthDefects:
 *           type: string
 *           description: Any birth defects noted
 *         birthWeight:
 *           type: number
 *           minimum: 0
 *           description: Birth weight in kilograms
 *         birthType:
 *           type: string
 *           enum: [singleton, twin, triplet, quadruplet, other]
 *           description: Type of birth (single or multiple)
 *         deliveryMethod:
 *           type: string
 *           enum: [vaginal, cesarean, assisted, other]
 *           description: Method of delivery
 *         notes:
 *           type: string
 *           description: Additional notes about the birth
 *         isBirthCertificateIssued:
 *           type: boolean
 *           default: false
 *           description: Whether birth certificate has been issued
 *         birthCertificateNumber:
 *           type: string
 *           description: Birth certificate number if issued
 *         # Metadata
 *         facilityId:
 *           type: string
 *           format: uuid
 *           description: ID of the facility where birth occurred
 *         visitId:
 *           type: string
 *           format: uuid
 *           description: Associated visit ID
 *         attendedBy:
 *           type: string
 *           format: uuid
 *           description: ID of the attending healthcare provider
 *         babyId:
 *           type: string
 *           format: uuid
 *           description: Patient ID for the baby
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
 *         motherId: "123e4567-e89b-12d3-a456-426614174001"
 *         motherName: "Jane Doe"
 *         motherAge: 28
 *         motherLgaOrigin: "Uyo"
 *         motherLgaResidence: "Uyo"
 *         motherParity: 1
 *         birthDate: "2024-05-29"
 *         birthTime: "14:30:00"
 *         gender: "female"
 *         placeOfBirth: "HOSPITAL"
 *         birthWeight: 3.2
 *         birthType: "singleton"
 *         deliveryMethod: "vaginal"
 *         facilityId: "123e4567-e89b-12d3-a456-426614174002"
 *         apgarScoreOneMin: 8
 *         apgarScoreFiveMin: 9
 *         resuscitation: false
 *         isBirthCertificateIssued: false
 *
 *     CreateBirthRequest:
 *       type: object
 *       required:
 *         - motherId
 *         - motherName
 *         - motherAge
 *         - motherLgaOrigin
 *         - motherLgaResidence
 *         - motherParity
 *         - birthDate
 *         - birthTime
 *         - gender
 *         - placeOfBirth
 *         - birthType
 *         - deliveryMethod
 *         - facilityId
 *       properties:
 *         motherId:
 *           type: string
 *           format: uuid
 *         motherName:
 *           type: string
 *           maxLength: 100
 *         motherAge:
 *           type: integer
 *           minimum: 0
 *           maximum: 120
 *         motherLgaOrigin:
 *           type: string
 *           enum: [Abak, Eastern Obolo, Eket, Esit Eket, Essien Udim, Etim Ekpo, Etinan, Ibeno, Ibesikpo Asutan, Ibiono-Ibom, Ika, Ikono, Ikot Abasi, Ikot Ekpene, Ini, Itu, Mbo, Mkpat-Enin, Nsit-Atai, Nsit-Ibom, Nsit-Ubium, Obot Akara, Okobo, Onna, Oron, Oruk Anam, Udung-Uko, Ukanafun, Uruan, Urue-Offong/Oruko, Uyo, Other]
 *         motherLgaResidence:
 *           type: string
 *           enum: [Abak, Eastern Obolo, Eket, Esit Eket, Essien Udim, Etim Ekpo, Etinan, Ibeno, Ibesikpo Asutan, Ibiono-Ibom, Ika, Ikono, Ikot Abasi, Ikot Ekpene, Ini, Itu, Mbo, Mkpat-Enin, Nsit-Atai, Nsit-Ibom, Nsit-Ubium, Obot Akara, Okobo, Onna, Oron, Oruk Anam, Udung-Uko, Ukanafun, Uruan, Urue-Offong/Oruko, Uyo, Other]
 *         motherParity:
 *           type: integer
 *           minimum: 0
 *         birthDate:
 *           type: string
 *           format: date
 *         birthTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$'
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         placeOfBirth:
 *           type: string
 *           enum: [HOSPITAL, HOME]
 *           description: Location where the birth occurred
 *         birthType:
 *           type: string
 *           enum: [singleton, twin, triplet, quadruplet, other]
 *         deliveryMethod:
 *           type: string
 *           enum: [vaginal, cesarean, assisted, other]
 *         facilityId:
 *           type: string
 *           format: uuid
 *         fatherName:
 *           type: string
 *           maxLength: 100
 *         fatherAge:
 *           type: integer
 *           minimum: 0
 *           maximum: 120
 *         birthWeight:
 *           type: number
 *           minimum: 0
 *         apgarScoreOneMin:
 *           type: integer
 *           minimum: 0
 *           maximum: 10
 *         apgarScoreFiveMin:
 *           type: integer
 *           minimum: 0
 *           maximum: 10
 *
 *     BirthStatistics:
 *       type: object
 *       properties:
 *         totalBirths:
 *           type: integer
 *           description: Total number of births
 *         byGender:
 *           type: object
 *           properties:
 *             male:
 *               type: integer
 *             female:
 *               type: integer
 *             other:
 *               type: integer
 *         byDeliveryMethod:
 *           type: object
 *           properties:
 *             vaginal:
 *               type: integer
 *             cesarean:
 *               type: integer
 *             assisted:
 *               type: integer
 *             other:
 *               type: integer
 *         byBirthType:
 *           type: object
 *           properties:
 *             singleton:
 *               type: integer
 *             twin:
 *               type: integer
 *             triplet:
 *               type: integer
 *         byPlaceOfBirth:
 *           type: object
 *           properties:
 *             HOSPITAL:
 *               type: integer
 *               description: Number of hospital births
 *             HOME:
 *               type: integer
 *               description: Number of home births
 *         averageBirthWeight:
 *           type: number
 *           description: Average birth weight in kilograms
 *         lowBirthWeight:
 *           type: integer
 *           description: Number of low birth weight babies (<2.5kg)
 *
 * /births:
 *   get:
 *     summary: Get all birth records
 *     description: Retrieve a paginated list of birth records with optional filtering
 *     tags: [Births]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by facility ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter births from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter births up to this date
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, other]
 *         description: Filter by baby gender
 *       - in: query
 *         name: deliveryMethod
 *         schema:
 *           type: string
 *           enum: [vaginal, cesarean, assisted, other]
 *         description: Filter by delivery method
 *       - in: query
 *         name: birthType
 *         schema:
 *           type: string
 *           enum: [singleton, twin, triplet, quadruplet, other]
 *         description: Filter by birth type
 *       - in: query
 *         name: placeOfBirth
 *         schema:
 *           type: string
 *           enum: [HOSPITAL, HOME]
 *         description: Filter by place of birth
 *       - in: query
 *         name: lgaResidence
 *         schema:
 *           type: string
 *         description: Filter by mother's LGA of residence
 *     responses:
 *       200:
 *         description: Birth records retrieved successfully
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
 *                   example: Birth records retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     births:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Birth'
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new birth record
 *     description: Register a new birth record in the system
 *     tags: [Births]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBirthRequest'
 *           example:
 *             motherId: "123e4567-e89b-12d3-a456-426614174001"
 *             motherName: "Jane Doe"
 *             motherAge: 28
 *             motherLgaOrigin: "Uyo"
 *             motherLgaResidence: "Uyo"
 *             motherParity: 1
 *             birthDate: "2024-05-29"
 *             birthTime: "14:30:00"
 *             gender: "female"
 *             placeOfBirth: "HOSPITAL"
 *             birthWeight: 3.2
 *             birthType: "singleton"
 *             deliveryMethod: "vaginal"
 *             facilityId: "123e4567-e89b-12d3-a456-426614174002"
 *             apgarScoreOneMin: 8
 *             apgarScoreFiveMin: 9
 *     responses:
 *       201:
 *         description: Birth record created successfully
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
 *                   example: Birth record created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Birth'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Mother or facility not found
 *       500:
 *         description: Server error
 *
 * /births/search:
 *   get:
 *     summary: Search birth records
 *     description: Search birth records using various criteria
 *     tags: [Births]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: motherId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Search by mother's patient ID
 *       - in: query
 *         name: motherName
 *         schema:
 *           type: string
 *         description: Search by mother's name
 *       - in: query
 *         name: fatherName
 *         schema:
 *           type: string
 *         description: Search by father's name
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Search by facility ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Search births from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Search births up to this date
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, other]
 *         description: Search by baby gender
 *       - in: query
 *         name: deliveryMethod
 *         schema:
 *           type: string
 *           enum: [vaginal, cesarean, assisted, other]
 *         description: Search by delivery method
 *       - in: query
 *         name: birthType
 *         schema:
 *           type: string
 *           enum: [singleton, twin, triplet, quadruplet, other]
 *         description: Search by birth type
 *       - in: query
 *         name: placeOfBirth
 *         schema:
 *           type: string
 *           enum: [HOSPITAL, HOME]
 *         description: Search by place of birth
 *       - in: query
 *         name: lgaResidence
 *         schema:
 *           type: string
 *         description: Search by mother's LGA of residence
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
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
 *                   example: Search results retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     births:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Birth'
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /births/statistics:
 *   get:
 *     summary: Get birth statistics
 *     description: Retrieve statistical data about births
 *     tags: [Births]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter statistics by facility
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Statistics from this date (defaults to start of current year)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Statistics up to this date (defaults to current date)
 *       - in: query
 *         name: lgaResidence
 *         schema:
 *           type: string
 *         description: Filter by mother's LGA of residence
 *     responses:
 *       200:
 *         description: Birth statistics retrieved successfully
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
 *                   example: Birth statistics retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/BirthStatistics'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /births/{id}:
 *   get:
 *     summary: Get birth record by ID
 *     description: Retrieve a specific birth record by its ID
 *     tags: [Births]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Birth record ID
 *     responses:
 *       200:
 *         description: Birth record retrieved successfully
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
 *                   example: Birth record retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Birth'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Birth record not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update birth record
 *     description: Update an existing birth record
 *     tags: [Births]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Birth record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motherName:
 *                 type: string
 *                 maxLength: 100
 *               motherAge:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 120
 *               placeOfBirth:
 *                 type: string
 *                 enum: [HOSPITAL, HOME]
 *                 description: Location where the birth occurred
 *               birthWeight:
 *                 type: number
 *                 minimum: 0
 *               apgarScoreOneMin:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *               apgarScoreFiveMin:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *               notes:
 *                 type: string
 *               isBirthCertificateIssued:
 *                 type: boolean
 *               birthCertificateNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Birth record updated successfully
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
 *                   example: Birth record updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Birth'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Birth record not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete birth record
 *     description: Delete a birth record from the system
 *     tags: [Births]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Birth record ID
 *     responses:
 *       200:
 *         description: Birth record deleted successfully
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
 *                   example: Birth record deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Birth record not found
 *       500:
 *         description: Server error
 */