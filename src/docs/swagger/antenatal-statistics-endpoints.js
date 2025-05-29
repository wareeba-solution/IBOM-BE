/**
 * @swagger
 * /antenatal/statistics:
 *   get:
 *     summary: Get antenatal statistics
 *     description: Generate statistical reports about antenatal care grouped by specified criteria
 *     tags: [Antenatal Statistics]
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
 *           enum: [status, outcome, hivStatus, facility, month, age]
 *         description: How to group the statistics
 *         example: outcome
 *     responses:
 *       200:
 *         description: Antenatal statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AntenatalStatistics'
 *       400:
 *         description: Invalid or missing groupBy parameter
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
 * /antenatal/statistics/summary:
 *   get:
 *     summary: Get antenatal summary statistics
 *     description: Get comprehensive summary of antenatal care statistics including key performance indicators
 *     tags: [Antenatal Statistics]
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
 *         description: Summary start date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Summary end date
 *     responses:
 *       200:
 *         description: Antenatal summary statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRegistrations:
 *                   type: integer
 *                   example: 1250
 *                   description: Total number of antenatal registrations
 *                 activePregnancies:
 *                   type: integer
 *                   example: 850
 *                   description: Currently active pregnancies
 *                 completedPregnancies:
 *                   type: integer
 *                   example: 400
 *                   description: Completed pregnancies with outcomes
 *                 averageAge:
 *                   type: number
 *                   example: 26.5
 *                   description: Average maternal age
 *                 hivPositiveRate:
 *                   type: number
 *                   example: 3.2
 *                   description: Percentage of HIV positive cases
 *                 riskLevelDistribution:
 *                   type: object
 *                   properties:
 *                     low:
 *                       type: integer
 *                       example: 800
 *                     medium:
 *                       type: integer
 *                       example: 350
 *                     high:
 *                       type: integer
 *                       example: 100
 *                 deliveryOutcomes:
 *                   type: object
 *                   properties:
 *                     liveBirths:
 *                       type: integer
 *                       example: 385
 *                     stillbirths:
 *                       type: integer
 *                       example: 12
 *                     miscarriages:
 *                       type: integer
 *                       example: 3
 *                 keyIndicators:
 *                   type: object
 *                   properties:
 *                     completionRate:
 *                       type: number
 *                       example: 95.2
 *                       description: Percentage of pregnancies with recorded outcomes
 *                     earlyRegistrationRate:
 *                       type: number
 *                       example: 72.5
 *                       description: Percentage registered in first trimester
 *                     averageVisitsPerPregnancy:
 *                       type: number
 *                       example: 6.8
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /antenatal/statistics/by-trimester:
 *   get:
 *     summary: Get antenatal statistics by trimester
 *     description: Get statistics grouped by pregnancy trimester for care analysis
 *     tags: [Antenatal Statistics]
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
 *     responses:
 *       200:
 *         description: Trimester statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstTrimester:
 *                   type: object
 *                   properties:
 *                     registrations:
 *                       type: integer
 *                       example: 120
 *                       description: Registrations in first trimester
 *                     visits:
 *                       type: integer
 *                       example: 180
 *                       description: Total visits in first trimester
 *                     averageVisitsPerPregnancy:
 *                       type: number
 *                       example: 1.5
 *                     commonComplications:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Morning sickness", "Fatigue"]
 *                 secondTrimester:
 *                   type: object
 *                   properties:
 *                     registrations:
 *                       type: integer
 *                       example: 300
 *                     visits:
 *                       type: integer
 *                       example: 900
 *                     averageVisitsPerPregnancy:
 *                       type: number
 *                       example: 3.0
 *                     commonComplications:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Back pain", "Constipation"]
 *                 thirdTrimester:
 *                   type: object
 *                   properties:
 *                     registrations:
 *                       type: integer
 *                       example: 450
 *                     visits:
 *                       type: integer
 *                       example: 1800
 *                     averageVisitsPerPregnancy:
 *                       type: number
 *                       example: 4.0
 *                     commonComplications:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Swelling", "Shortness of breath"]
 *                 summary:
 *                   type: object
 *                   properties:
 *                     optimalCarePercentage:
 *                       type: number
 *                       example: 68.5
 *                       description: Percentage receiving recommended visits per trimester
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /antenatal/statistics/by-risk:
 *   get:
 *     summary: Get antenatal statistics by risk level
 *     description: Get statistics grouped by pregnancy risk level for risk management analysis
 *     tags: [Antenatal Statistics]
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
 *     responses:
 *       200:
 *         description: Risk level statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 counts:
 *                   type: object
 *                   properties:
 *                     low:
 *                       type: integer
 *                       example: 800
 *                     medium:
 *                       type: integer
 *                       example: 350
 *                     high:
 *                       type: integer
 *                       example: 100
 *                 percentages:
 *                   type: object
 *                   properties:
 *                     low:
 *                       type: number
 *                       example: 64.0
 *                     medium:
 *                       type: number
 *                       example: 28.0
 *                     high:
 *                       type: number
 *                       example: 8.0
 *                 outcomes:
 *                   type: object
 *                   properties:
 *                     low:
 *                       type: object
 *                       properties:
 *                         liveBirths:
 *                           type: integer
 *                           example: 245
 *                         complications:
 *                           type: integer
 *                           example: 12
 *                         cesareanRate:
 *                           type: number
 *                           example: 18.5
 *                     medium:
 *                       type: object
 *                       properties:
 *                         liveBirths:
 *                           type: integer
 *                           example: 105
 *                         complications:
 *                           type: integer
 *                           example: 25
 *                         cesareanRate:
 *                           type: number
 *                           example: 35.2
 *                     high:
 *                       type: object
 *                       properties:
 *                         liveBirths:
 *                           type: integer
 *                           example: 35
 *                         complications:
 *                           type: integer
 *                           example: 18
 *                         cesareanRate:
 *                           type: number
 *                           example: 65.8
 *                 riskFactorAnalysis:
 *                   type: object
 *                   properties:
 *                     totalWithRiskFactors:
 *                       type: integer
 *                       example: 450
 *                     averageRiskFactorsPerPregnancy:
 *                       type: number
 *                       example: 1.8
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /antenatal/statistics/by-age:
 *   get:
 *     summary: Get antenatal statistics by age group
 *     description: Get statistics grouped by maternal age groups for demographic analysis
 *     tags: [Antenatal Statistics]
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
 *     responses:
 *       200:
 *         description: Age group statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ageGroups:
 *                   type: object
 *                   properties:
 *                     under18:
 *                       type: integer
 *                       example: 125
 *                       description: Teenage pregnancies
 *                     age18to24:
 *                       type: integer
 *                       example: 450
 *                       description: Young adult pregnancies
 *                     age25to34:
 *                       type: integer
 *                       example: 550
 *                       description: Prime reproductive age
 *                     age35andOver:
 *                       type: integer
 *                       example: 125
 *                       description: Advanced maternal age
 *                 percentages:
 *                   type: object
 *                   properties:
 *                     under18:
 *                       type: number
 *                       example: 10.0
 *                     age18to24:
 *                       type: number
 *                       example: 36.0
 *                     age25to34:
 *                       type: number
 *                       example: 44.0
 *                     age35andOver:
 *                       type: number
 *                       example: 10.0
 *                 averageAge:
 *                   type: number
 *                   example: 26.5
 *                 riskByAge:
 *                   type: object
 *                   properties:
 *                     under18:
 *                       type: object
 *                       properties:
 *                         highRiskPercentage:
 *                           type: number
 *                           example: 15.2
 *                         commonRisks:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Low birth weight", "Preterm delivery"]
 *                     age35andOver:
 *                       type: object
 *                       properties:
 *                         highRiskPercentage:
 *                           type: number
 *                           example: 25.6
 *                         commonRisks:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Gestational diabetes", "Chromosomal abnormalities"]
 *                 outcomesByAge:
 *                   type: object
 *                   properties:
 *                     under18:
 *                       type: object
 *                       properties:
 *                         liveBirthRate:
 *                           type: number
 *                           example: 92.5
 *                         cesareanRate:
 *                           type: number
 *                           example: 28.5
 *                     age35andOver:
 *                       type: object
 *                       properties:
 *                         liveBirthRate:
 *                           type: number
 *                           example: 89.2
 *                         cesareanRate:
 *                           type: number
 *                           example: 45.8
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /antenatal/statistics/risk-factors:
 *   get:
 *     summary: Get top risk factors
 *     description: Get the most common risk factors in antenatal care for preventive planning
 *     tags: [Antenatal Statistics]
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
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *         description: Number of top risk factors to return
 *       - in: query
 *         name: riskLevel
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by specific risk level
 *     responses:
 *       200:
 *         description: Top risk factors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPregnanciesWithRiskFactors:
 *                   type: integer
 *                   example: 450
 *                   description: Total pregnancies having at least one risk factor
 *                 riskFactors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       factor:
 *                         type: string
 *                         example: "Previous cesarean"
 *                       count:
 *                         type: integer
 *                         example: 85
 *                       percentage:
 *                         type: number
 *                         example: 18.9
 *                       riskLevel:
 *                         type: string
 *                         enum: [low, medium, high]
 *                         example: "medium"
 *                       associatedOutcomes:
 *                         type: object
 *                         properties:
 *                           liveBirthRate:
 *                             type: number
 *                             example: 94.1
 *                           cesareanRate:
 *                             type: number
 *                             example: 65.2
 *                           complicationRate:
 *                             type: number
 *                             example: 12.5
 *                   example:
 *                     - factor: "Previous cesarean"
 *                       count: 85
 *                       percentage: 18.9
 *                       riskLevel: "medium"
 *                       associatedOutcomes:
 *                         liveBirthRate: 94.1
 *                         cesareanRate: 65.2
 *                         complicationRate: 12.5
 *                     - factor: "Diabetes"
 *                       count: 65
 *                       percentage: 14.4
 *                       riskLevel: "high"
 *                       associatedOutcomes:
 *                         liveBirthRate: 91.2
 *                         cesareanRate: 52.3
 *                         complicationRate: 28.5
 *                 trends:
 *                   type: object
 *                   properties:
 *                     increasing:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Diabetes", "Hypertension"]
 *                     decreasing:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Previous stillbirth"]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /antenatal/statistics/monthly:
 *   get:
 *     summary: Get monthly registration statistics
 *     description: Get antenatal registrations grouped by month for seasonal analysis
 *     tags: [Antenatal Statistics]
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
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2024
 *         description: Year for monthly statistics (defaults to current year)
 *     responses:
 *       200:
 *         description: Monthly registration statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 year:
 *                   type: integer
 *                   example: 2024
 *                 months:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "January"
 *                       monthNumber:
 *                         type: integer
 *                         example: 1
 *                       registrations:
 *                         type: integer
 *                         example: 125
 *                       visits:
 *                         type: integer
 *                         example: 380
 *                       deliveries:
 *                         type: integer
 *                         example: 95
 *                       averageGestationalAgeAtRegistration:
 *                         type: number
 *                         example: 12.5
 *                   example:
 *                     - month: "January"
 *                       monthNumber: 1
 *                       registrations: 125
 *                       visits: 380
 *                       deliveries: 95
 *                       averageGestationalAgeAtRegistration: 12.5
 *                     - month: "February"
 *                       monthNumber: 2
 *                       registrations: 118
 *                       visits: 365
 *                       deliveries: 102
 *                       averageGestationalAgeAtRegistration: 11.8
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalRegistrations:
 *                       type: integer
 *                       example: 1450
 *                     averagePerMonth:
 *                       type: number
 *                       example: 120.8
 *                     peakMonth:
 *                       type: string
 *                       example: "March"
 *                     lowestMonth:
 *                       type: string
 *                       example: "December"
 *                     seasonalTrends:
 *                       type: object
 *                       properties:
 *                         spring:
 *                           type: number
 *                           example: 28.5
 *                           description: Percentage of annual registrations
 *                         summer:
 *                           type: number
 *                           example: 24.2
 *                         autumn:
 *                           type: number
 *                           example: 26.8
 *                         winter:
 *                           type: number
 *                           example: 20.5
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /antenatal/statistics/compliance:
 *   get:
 *     summary: Get visit compliance statistics
 *     description: Get statistics about antenatal visit compliance based on WHO recommendations
 *     tags: [Antenatal Statistics]
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
 *     responses:
 *       200:
 *         description: Visit compliance statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPregnancies:
 *                   type: integer
 *                   example: 1250
 *                 averageVisitsPerPregnancy:
 *                   type: number
 *                   example: 6.8
 *                 whoRecommendations:
 *                   type: object
 *                   properties:
 *                     minimumVisits:
 *                       type: integer
 *                       example: 8
 *                       description: WHO recommended minimum visits
 *                     firstVisitByWeek:
 *                       type: integer
 *                       example: 12
 *                       description: WHO recommended first visit timing
 *                 complianceRates:
 *                   type: object
 *                   properties:
 *                     minimumVisits:
 *                       type: number
 *                       example: 65.2
 *                       description: Percentage meeting minimum visit requirements
 *                     earlyRegistration:
 *                       type: number
 *                       example: 72.5
 *                       description: Percentage registered by 12 weeks
 *                     scheduledVisitCompliance:
 *                       type: number
 *                       example: 78.3
 *                       description: Percentage attending scheduled visits on time
 *                 visitDistribution:
 *                   type: object
 *                   properties:
 *                     noVisits:
 *                       type: integer
 *                       example: 25
 *                     oneToThree:
 *                       type: integer
 *                       example: 180
 *                     fourToSeven:
 *                       type: integer
 *                       example: 430
 *                     eightOrMore:
 *                       type: integer
 *                       example: 615
 *                 registrationTiming:
 *                   type: object
 *                   properties:
 *                     firstTrimester:
 *                       type: integer
 *                       example: 420
 *                       description: Registered in weeks 1-12
 *                     secondTrimester:
 *                       type: integer
 *                       example: 680
 *                       description: Registered in weeks 13-27
 *                     thirdTrimester:
 *                       type: integer
 *                       example: 150
 *                       description: Registered in weeks 28+
 *                 visitTiming:
 *                   type: object
 *                   properties:
 *                     onTime:
 *                       type: number
 *                       example: 72.5
 *                       description: Percentage of visits on scheduled date
 *                     delayed:
 *                       type: number
 *                       example: 27.5
 *                       description: Percentage of visits delayed
 *                     averageDelayDays:
 *                       type: number
 *                       example: 5.2
 *                 riskFactorCompliance:
 *                   type: object
 *                   properties:
 *                     highRiskCompliance:
 *                       type: number
 *                       example: 85.2
 *                       description: Compliance rate for high-risk pregnancies
 *                     lowRiskCompliance:
 *                       type: number
 *                       example: 68.5
 *                       description: Compliance rate for low-risk pregnancies
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 *
 * /antenatal/statistics/by-facility:
 *   get:
 *     summary: Get antenatal statistics by facility
 *     description: Get statistics grouped by healthcare facility for performance comparison
 *     tags: [Antenatal Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of facilities to return
 *     responses:
 *       200:
 *         description: Facility statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 facilities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       facilityId:
 *                         type: string
 *                         format: uuid
 *                       facilityName:
 *                         type: string
 *                         example: "Lagos University Teaching Hospital"
 *                       facilityType:
 *                         type: string
 *                         example: "Tertiary"
 *                       location:
 *                         type: string
 *                         example: "Lagos State"
 *                       registrations:
 *                         type: integer
 *                         example: 450
 *                       activePregnancies:
 *                         type: integer
 *                         example: 285
 *                       completedPregnancies:
 *                         type: integer
 *                         example: 165
 *                       averageVisitsPerPregnancy:
 *                         type: number
 *                         example: 7.2
 *                       complianceRate:
 *                         type: number
 *                         example: 68.5
 *                       hivPositiveRate:
 *                         type: number
 *                         example: 2.8
 *                       deliveryOutcomes:
 *                         type: object
 *                         properties:
 *                           liveBirths:
 *                             type: integer
 *                             example: 158
 *                           stillbirths:
 *                             type: integer
 *                             example: 5
 *                           cesareanRate:
 *                             type: number
 *                             example: 32.5
 *                           complicationRate:
 *                             type: number
 *                             example: 8.2
 *                       qualityIndicators:
 *                         type: object
 *                         properties:
 *                           earlyRegistrationRate:
 *                             type: number
 *                             example: 75.2
 *                           averageGestationalAgeAtFirstVisit:
 *                             type: number
 *                             example: 11.5
 *                           maternalMortalityRate:
 *                             type: number
 *                             example: 0.2
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalFacilities:
 *                       type: integer
 *                       example: 15
 *                     bestPerformingFacility:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Lagos University Teaching Hospital"
 *                         complianceRate:
 *                           type: number
 *                           example: 85.2
 *                     averageComplianceRate:
 *                       type: number
 *                       example: 65.2
 *                     facilityTypeComparison:
 *                       type: object
 *                       properties:
 *                         primary:
 *                           type: object
 *                           properties:
 *                             averageCompliance:
 *                               type: number
 *                               example: 62.5
 *                             totalRegistrations:
 *                               type: integer
 *                               example: 2850
 *                         secondary:
 *                           type: object
 *                           properties:
 *                             averageCompliance:
 *                               type: number
 *                               example: 71.2
 *                             totalRegistrations:
 *                               type: integer
 *                               example: 1950
 *                         tertiary:
 *                           type: object
 *                           properties:
 *                             averageCompliance:
 *                               type: number
 *                               example: 78.8
 *                             totalRegistrations:
 *                               type: integer
 *                               example: 1200
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error

 * /antenatal/statistics/delivery-outcomes:
 *   get:
 *     summary: Get delivery outcome statistics
 *     description: Get comprehensive statistics about pregnancy delivery outcomes
 *     tags: [Antenatal Statistics]
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
 *     responses:
 *       200:
 *         description: Delivery outcome statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDeliveries:
 *                   type: integer
 *                   example: 400
 *                 outcomes:
 *                   type: object
 *                   properties:
 *                     liveBirths:
 *                       type: integer
 *                       example: 385
 *                     stillbirths:
 *                       type: integer
 *                       example: 12
 *                     miscarriages:
 *                       type: integer
 *                       example: 3
 *                     abortions:
 *                       type: integer
 *                       example: 0
 *                     ectopicPregnancies:
 *                       type: integer
 *                       example: 0
 *                 outcomePercentages:
 *                   type: object
 *                   properties:
 *                     liveBirthRate:
 *                       type: number
 *                       example: 96.3
 *                     stillbirthRate:
 *                       type: number
 *                       example: 3.0
 *                     miscarriageRate:
 *                       type: number
 *                       example: 0.8
 *                 deliveryModes:
 *                   type: object
 *                   properties:
 *                     vaginalDelivery:
 *                       type: integer
 *                       example: 260
 *                     cesareanSection:
 *                       type: integer
 *                       example: 125
 *                     instrumentalDelivery:
 *                       type: integer
 *                       example: 15
 *                 deliveryModePercentages:
 *                   type: object
 *                   properties:
 *                     vaginalDelivery:
 *                       type: number
 *                       example: 65.0
 *                     cesareanSection:
 *                       type: number
 *                       example: 31.3
 *                     instrumentalDelivery:
 *                       type: number
 *                       example: 3.8
 *                 birthWeights:
 *                   type: object
 *                   properties:
 *                     lowBirthWeight:
 *                       type: integer
 *                       description: Less than 2500g
 *                       example: 38
 *                     normalBirthWeight:
 *                       type: integer
 *                       description: 2500g - 4000g
 *                       example: 330
 *                     highBirthWeight:
 *                       type: integer
 *                       description: Over 4000g
 *                       example: 17
 *                     averageBirthWeight:
 *                       type: number
 *                       example: 3150.5
 *                 gestationalAgeAtDelivery:
 *                   type: object
 *                   properties:
 *                     preterm:
 *                       type: integer
 *                       description: Less than 37 weeks
 *                       example: 45
 *                     term:
 *                       type: integer
 *                       description: 37-42 weeks
 *                       example: 340
 *                     postTerm:
 *                       type: integer
 *                       description: Over 42 weeks
 *                       example: 15
 *                     averageGestationalAge:
 *                       type: number
 *                       example: 38.5
 *                 maternalOutcomes:
 *                   type: object
 *                   properties:
 *                     maternalDeaths:
 *                       type: integer
 *                       example: 1
 *                     maternalMortalityRate:
 *                       type: number
 *                       description: Per 100,000 live births
 *                       example: 259.7
 *                     complications:
 *                       type: integer
 *                       example: 25
 *                     complicationRate:
 *                       type: number
 *                       example: 6.3
 *                     commonComplications:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Post-partum hemorrhage", "Infection", "Hypertension"]
 *                 perinatalOutcomes:
 *                   type: object
 *                   properties:
 *                     perinatalDeaths:
 *                       type: integer
 *                       example: 18
 *                     perinatalMortalityRate:
 *                       type: number
 *                       description: Per 1,000 births
 *                       example: 45.0
 *                     neonatalDeaths:
 *                       type: integer
 *                       example: 6
 *                     neonatalMortalityRate:
 *                       type: number
 *                       description: Per 1,000 live births
 *                       example: 15.6
 *                 apgarScores:
 *                   type: object
 *                   properties:
 *                     averageOneMinute:
 *                       type: number
 *                       example: 8.2
 *                     averageFiveMinutes:
 *                       type: number
 *                       example: 9.1
 *                     lowApgarRate:
 *                       type: number
 *                       description: Percentage with 5-minute APGAR < 7
 *                       example: 3.5
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error

 * /antenatal/statistics/trends:
 *   get:
 *     summary: Get antenatal trends over time
 *     description: Get trending statistics for antenatal care over specified time period
 *     tags: [Antenatal Statistics]
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
 *         name: months
 *         schema:
 *           type: integer
 *           default: 24
 *           minimum: 6
 *           maximum: 60
 *         description: Number of months to include in trends analysis
 *     responses:
 *       200:
 *         description: Antenatal trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: object
 *                   properties:
 *                     months:
 *                       type: integer
 *                       example: 24
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2022-06-01"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-05-31"
 *                 trends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2024-05"
 *                       registrations:
 *                         type: integer
 *                         example: 125
 *                       visits:
 *                         type: integer
 *                         example: 485
 *                       deliveries:
 *                         type: integer
 *                         example: 95
 *                       hivPositiveRate:
 *                         type: number
 *                         example: 3.2
 *                       complianceRate:
 *                         type: number
 *                         example: 68.5
 *                       cesareanRate:
 *                         type: number
 *                         example: 31.6
 *                       averageGestationalAgeAtRegistration:
 *                         type: number
 *                         example: 12.8
 *                       riskFactorPrevalence:
 *                         type: number
 *                         example: 32.5
 *                 summary:
 *                   type: object
 *                   properties:
 *                     averageRegistrationsPerMonth:
 *                       type: number
 *                       example: 118.5
 *                     registrationTrend:
 *                       type: string
 *                       enum: [increasing, decreasing, stable]
 *                       example: "increasing"
 *                     registrationGrowthRate:
 *                       type: number
 *                       description: Percentage change over period
 *                       example: 12.5
 *                     visitComplianceTrend:
 *                       type: string
 *                       enum: [improving, declining, stable]
 *                       example: "improving"
 *                     cesareanTrend:
 *                       type: string
 *                       enum: [increasing, decreasing, stable]
 *                       example: "stable"
 *                     hivPositiveTrend:
 *                       type: string
 *                       enum: [increasing, decreasing, stable]
 *                       example: "decreasing"
 *                     qualityIndicatorTrends:
 *                       type: object
 *                       properties:
 *                         earlyRegistration:
 *                           type: string
 *                           enum: [improving, declining, stable]
 *                           example: "improving"
 *                         maternalMortality:
 *                           type: string
 *                           enum: [improving, declining, stable]
 *                           example: "improving"
 *                         liveBirthRate:
 *                           type: string
 *                           enum: [improving, declining, stable]
 *                           example: "stable"
 *                 seasonality:
 *                   type: object
 *                   properties:
 *                     peakMonths:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["March", "April", "September"]
 *                     lowMonths:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["December", "January"]
 *                     seasonalVariation:
 *                       type: number
 *                       description: Coefficient of variation
 *                       example: 0.15
 *                 forecasting:
 *                   type: object
 *                   properties:
 *                     nextMonthPrediction:
 *                       type: object
 *                       properties:
 *                         expectedRegistrations:
 *                           type: integer
 *                           example: 132
 *                         confidenceInterval:
 *                           type: object
 *                           properties:
 *                             lower:
 *                               type: integer
 *                               example: 115
 *                             upper:
 *                               type: integer
 *                               example: 149
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error

 * /antenatal/statistics/all:
 *   get:
 *     summary: Get comprehensive antenatal statistics
 *     description: Get all antenatal statistics in a single comprehensive report for dashboard use
 *     tags: [Antenatal Statistics]
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
 *     responses:
 *       200:
 *         description: Comprehensive antenatal statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reportMetadata:
 *                   type: object
 *                   properties:
 *                     generatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-05-29T10:30:00Z"
 *                     period:
 *                       type: object
 *                       properties:
 *                         from:
 *                           type: string
 *                           format: date
 *                           example: "2024-01-01"
 *                         to:
 *                           type: string
 *                           format: date
 *                           example: "2024-05-29"
 *                     facilityId:
 *                       type: string
 *                       format: uuid
 *                     facilityName:
 *                       type: string
 *                       example: "Lagos University Teaching Hospital"
 *                     reportType:
 *                       type: string
 *                       example: "comprehensive"
 *                 summary:
 *                   type: object
 *                   description: Overall summary statistics
 *                   properties:
 *                     totalRegistrations:
 *                       type: integer
 *                       example: 1250
 *                     activePregnancies:
 *                       type: integer
 *                       example: 850
 *                     completedPregnancies:
 *                       type: integer
 *                       example: 400
 *                     averageAge:
 *                       type: number
 *                       example: 26.5
 *                     hivPositiveRate:
 *                       type: number
 *                       example: 3.2
 *                 byTrimester:
 *                   type: object
 *                   description: Statistics grouped by trimester
 *                   properties:
 *                     firstTrimester:
 *                       type: object
 *                     secondTrimester:
 *                       type: object
 *                     thirdTrimester:
 *                       type: object
 *                 byRisk:
 *                   type: object
 *                   description: Statistics grouped by risk level
 *                   properties:
 *                     counts:
 *                       type: object
 *                     percentages:
 *                       type: object
 *                     outcomes:
 *                       type: object
 *                 byAge:
 *                   type: object
 *                   description: Statistics grouped by age
 *                   properties:
 *                     ageGroups:
 *                       type: object
 *                     percentages:
 *                       type: object
 *                     averageAge:
 *                       type: number
 *                 riskFactors:
 *                   type: object
 *                   description: Top risk factors analysis
 *                   properties:
 *                     totalPregnanciesWithRiskFactors:
 *                       type: integer
 *                     riskFactors:
 *                       type: array
 *                 visitCompliance:
 *                   type: object
 *                   description: Visit compliance statistics
 *                   properties:
 *                     totalPregnancies:
 *                       type: integer
 *                     averageVisitsPerPregnancy:
 *                       type: number
 *                     complianceRate:
 *                       type: number
 *                     visitDistribution:
 *                       type: object
 *                 deliveryOutcomes:
 *                   type: object
 *                   description: Delivery outcome statistics
 *                   properties:
 *                     totalDeliveries:
 *                       type: integer
 *                     outcomes:
 *                       type: object
 *                     deliveryModes:
 *                       type: object
 *                     maternalOutcomes:
 *                       type: object
 *                     perinatalOutcomes:
 *                       type: object
 *                 trends:
 *                   type: object
 *                   description: Trending data over recent months
 *                   properties:
 *                     period:
 *                       type: object
 *                     trends:
 *                       type: array
 *                     summary:
 *                       type: object
 *                 facilityComparison:
 *                   type: object
 *                   description: How this facility compares to others
 *                   properties:
 *                     ranking:
 *                       type: object
 *                       properties:
 *                         complianceRank:
 *                           type: integer
 *                           example: 3
 *                         outOfTotal:
 *                           type: integer
 *                           example: 15
 *                         percentile:
 *                           type: number
 *                           example: 80.0
 *                     benchmarks:
 *                       type: object
 *                       properties:
 *                         national:
 *                           type: object
 *                           properties:
 *                             complianceRate:
 *                               type: number
 *                               example: 62.5
 *                             cesareanRate:
 *                               type: number
 *                               example: 28.3
 *                         regional:
 *                           type: object
 *                           properties:
 *                             complianceRate:
 *                               type: number
 *                               example: 68.2
 *                             cesareanRate:
 *                               type: number
 *                               example: 31.5
 *                 qualityIndicators:
 *                   type: object
 *                   properties:
 *                     whoStandards:
 *                       type: object
 *                       properties:
 *                         minimumVisitsCompliance:
 *                           type: number
 *                           example: 65.2
 *                         earlyRegistrationRate:
 *                           type: number
 *                           example: 72.5
 *                         skilledAttendanceRate:
 *                           type: number
 *                           example: 98.5
 *                     maternalMortalityRatio:
 *                       type: number
 *                       example: 259.7
 *                     perinatalMortalityRate:
 *                       type: number
 *                       example: 45.0
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         enum: [compliance, risk_management, quality_improvement, resource_allocation, staff_training]
 *                       priority:
 *                         type: string
 *                         enum: [critical, high, medium, low]
 *                       recommendation:
 *                         type: string
 *                       rationale:
 *                         type: string
 *                       expectedImpact:
 *                         type: string
 *                       timeframe:
 *                         type: string
 *                         enum: [immediate, short_term, medium_term, long_term]
 *                   example:
 *                     - category: "compliance"
 *                       priority: "high"
 *                       recommendation: "Implement automated reminder system for missed appointments"
 *                       rationale: "Visit compliance rate of 65.2% is below WHO recommendations of 80%"
 *                       expectedImpact: "Could improve compliance by 10-15%"
 *                       timeframe: "short_term"
 *                     - category: "risk_management"
 *                       priority: "medium"
 *                       recommendation: "Enhanced screening protocol for gestational diabetes"
 *                       rationale: "Diabetes is the second most common risk factor at 14.4%"
 *                       expectedImpact: "Early detection and better outcomes"
 *                       timeframe: "medium_term"
 *                 alerts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [warning, critical, info]
 *                       message:
 *                         type: string
 *                       metric:
 *                         type: string
 *                       value:
 *                         type: number
 *                       threshold:
 *                         type: number
 *                   example:
 *                     - type: "critical"
 *                       message: "Maternal mortality rate exceeds national average"
 *                       metric: "maternalMortalityRate"
 *                       value: 259.7
 *                       threshold: 200.0
 *                     - type: "warning"
 *                       message: "HIV positive rate trending upward"
 *                       metric: "hivPositiveRate"
 *                       value: 3.2
 *                       threshold: 3.0
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */