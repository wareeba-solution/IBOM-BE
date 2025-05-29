/**
 * @swagger
 * /diseases/statistics:
 *   get:
 *     summary: Get disease statistics
 *     description: Generate statistical reports about disease surveillance grouped by specified criteria
 *     tags: [Disease Statistics]
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
 *           enum: [disease, facility, month, outcome, severity, status, age, gender]
 *         description: How to group the statistics
 *         example: disease
 *     responses:
 *       200:
 *         description: Disease statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalCases:
 *                       type: integer
 *                       example: 2450
 *                       description: Total number of disease cases
 *                     activeCases:
 *                       type: integer
 *                       example: 185
 *                       description: Currently active cases
 *                     resolvedCases:
 *                       type: integer
 *                       example: 2180
 *                       description: Resolved cases
 *                     deaths:
 *                       type: integer
 *                       example: 85
 *                       description: Number of deaths
 *                     caseFatalityRate:
 *                       type: number
 *                       example: 3.47
 *                       description: Case fatality rate percentage
 *                     hospitalizedCases:
 *                       type: integer
 *                       example: 320
 *                       description: Cases that required hospitalization
 *                     hospitalizationRate:
 *                       type: number
 *                       example: 13.06
 *                       description: Hospitalization rate percentage
 *                 groupedData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       group:
 *                         type: string
 *                         description: Group category
 *                         example: "COVID-19"
 *                       count:
 *                         type: integer
 *                         description: Number of cases in this group
 *                         example: 1250
 *                       percentage:
 *                         type: number
 *                         description: Percentage of total cases
 *                         example: 51.02
 *                       activeCases:
 *                         type: integer
 *                         example: 95
 *                       deaths:
 *                         type: integer
 *                         example: 45
 *                       caseFatalityRate:
 *                         type: number
 *                         example: 3.6
 *                       averageSeverity:
 *                         type: string
 *                         enum: [mild, moderate, severe]
 *                         example: "moderate"
 *                       trend:
 *                         type: string
 *                         enum: [increasing, decreasing, stable]
 *                         example: "decreasing"
 *                 periodComparison:
 *                   type: object
 *                   properties:
 *                     currentPeriod:
 *                       type: object
 *                       properties:
 *                         totalCases:
 *                           type: integer
 *                         newCases:
 *                           type: integer
 *                         deaths:
 *                           type: integer
 *                     previousPeriod:
 *                       type: object
 *                       properties:
 *                         totalCases:
 *                           type: integer
 *                         newCases:
 *                           type: integer
 *                         deaths:
 *                           type: integer
 *                     percentageChange:
 *                       type: object
 *                       properties:
 *                         totalCases:
 *                           type: number
 *                           example: -15.2
 *                         newCases:
 *                           type: number
 *                           example: -22.5
 *                         deaths:
 *                           type: number
 *                           example: -8.3
 *                 riskFactors:
 *                   type: object
 *                   properties:
 *                     outbreakRisk:
 *                       type: string
 *                       enum: [low, medium, high, critical]
 *                       example: "medium"
 *                     notifiableDiseaseCompliance:
 *                       type: number
 *                       example: 85.4
 *                       description: Percentage of notifiable diseases reported to authorities
 *                     averageReportingDelay:
 *                       type: number
 *                       example: 2.5
 *                       description: Average days between diagnosis and reporting
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
 * /diseases/statistics/trends:
 *   get:
 *     summary: Get disease trends over time
 *     description: Get trending statistics for disease surveillance over a specified period
 *     tags: [Disease Statistics]
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
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter, year]
 *           default: month
 *         description: Time period for trend analysis
 *       - in: query
 *         name: diseaseId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by specific disease
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 12
 *           minimum: 1
 *           maximum: 60
 *         description: Number of months to include in trends analysis
 *     responses:
 *       200:
 *         description: Disease trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: string
 *                       example: "month"
 *                     months:
 *                       type: integer
 *                       example: 12
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2023-06-01"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-05-31"
 *                     diseaseFilter:
 *                       type: string
 *                       example: "COVID-19"
 *                 trends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       period:
 *                         type: string
 *                         example: "2024-05"
 *                       newCases:
 *                         type: integer
 *                         example: 125
 *                       activeCases:
 *                         type: integer
 *                         example: 85
 *                       resolvedCases:
 *                         type: integer
 *                         example: 110
 *                       deaths:
 *                         type: integer
 *                         example: 5
 *                       caseFatalityRate:
 *                         type: number
 *                         example: 4.0
 *                       hospitalizationRate:
 *                         type: number
 *                         example: 12.8
 *                       averageSeverity:
 *                         type: number
 *                         example: 2.1
 *                         description: Numeric severity (1=mild, 2=moderate, 3=severe)
 *                       outbreakCount:
 *                         type: integer
 *                         example: 2
 *                         description: Number of outbreak events
 *                       contactsTraced:
 *                         type: integer
 *                         example: 485
 *                         description: Number of contacts traced
 *                       contactsPositive:
 *                         type: integer
 *                         example: 18
 *                         description: Contacts who tested positive
 *                       reportingDelay:
 *                         type: number
 *                         example: 2.3
 *                         description: Average days from diagnosis to reporting
 *                 summary:
 *                   type: object
 *                   properties:
 *                     overallTrend:
 *                       type: string
 *                       enum: [increasing, decreasing, stable, fluctuating]
 *                       example: "decreasing"
 *                     peakPeriod:
 *                       type: string
 *                       example: "2024-01"
 *                       description: Period with highest case count
 *                     lowestPeriod:
 *                       type: string
 *                       example: "2024-05"
 *                       description: Period with lowest case count
 *                     averageCasesPerPeriod:
 *                       type: number
 *                       example: 143.5
 *                     totalCases:
 *                       type: integer
 *                       example: 1722
 *                     totalDeaths:
 *                       type: integer
 *                       example: 68
 *                     averageCaseFatalityRate:
 *                       type: number
 *                       example: 3.95
 *                     seasonalPattern:
 *                       type: object
 *                       properties:
 *                         detectedPattern:
 *                           type: boolean
 *                           example: true
 *                         peakSeason:
 *                           type: string
 *                           example: "Winter"
 *                         description:
 *                           type: string
 *                           example: "Cases tend to increase during winter months"
 *                 forecasting:
 *                   type: object
 *                   properties:
 *                     nextPeriodPrediction:
 *                       type: object
 *                       properties:
 *                         expectedCases:
 *                           type: integer
 *                           example: 95
 *                         confidenceInterval:
 *                           type: object
 *                           properties:
 *                             lower:
 *                               type: integer
 *                               example: 75
 *                             upper:
 *                               type: integer
 *                               example: 120
 *                         riskLevel:
 *                           type: string
 *                           enum: [low, medium, high, critical]
 *                           example: "medium"
 *                     alerts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             enum: [trend_alert, threshold_alert, seasonal_alert]
 *                           severity:
 *                             type: string
 *                             enum: [info, warning, critical]
 *                           message:
 *                             type: string
 *                           recommendation:
 *                             type: string
 *                       example:
 *                         - type: "trend_alert"
 *                           severity: "warning"
 *                           message: "Case fatality rate increasing over last 3 months"
 *                           recommendation: "Review treatment protocols and resource allocation"
 *                 diseaseBreakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       diseaseName:
 *                         type: string
 *                         example: "COVID-19"
 *                       totalCases:
 *                         type: integer
 *                         example: 1250
 *                       trend:
 *                         type: string
 *                         enum: [increasing, decreasing, stable]
 *                         example: "decreasing"
 *                       changePercentage:
 *                         type: number
 *                         example: -15.2
 *                       riskLevel:
 *                         type: string
 *                         enum: [low, medium, high, critical]
 *                         example: "medium"
 *                 contactTracingEffectiveness:
 *                   type: object
 *                   properties:
 *                     totalContacts:
 *                       type: integer
 *                       example: 5840
 *                     contactsReached:
 *                       type: integer
 *                       example: 5125
 *                     reachRate:
 *                       type: number
 *                       example: 87.8
 *                       description: Percentage of contacts successfully reached
 *                     contactsCompleted:
 *                       type: integer
 *                       example: 4580
 *                     completionRate:
 *                       type: number
 *                       example: 78.4
 *                       description: Percentage of contacts who completed monitoring
 *                     contactsPositive:
 *                       type: integer
 *                       example: 285
 *                     positiveRate:
 *                       type: number
 *                       example: 4.88
 *                       description: Percentage of contacts who tested positive
 *                     averageContactsPerCase:
 *                       type: number
 *                       example: 3.4
 *                     averageMonitoringDuration:
 *                       type: number
 *                       example: 14.2
 *                       description: Average monitoring period in days
 *       400:
 *         description: Invalid parameters
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
 */