// src/docs/swagger/familyPlanning-statistics-endpoints.js

/**
 * @swagger
 * tags:
 *   - name: Family Planning Statistics
 *     description: Statistics and reports for family planning services
 */

/**
 * @swagger
 * /family-planning/statistics:
 *   get:
 *     summary: Get family planning statistics
 *     description: Retrieve aggregated statistics for family planning services grouped by various criteria
 *     tags: [Family Planning Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by specific facility
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics (inclusive)
 *         example: "2025-01-01"
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics (inclusive)
 *         example: "2025-12-31"
 *       - in: query
 *         name: groupBy
 *         required: true
 *         schema:
 *           type: string
 *           enum: [method, clientType, facility, month, maritalStatus, age, serviceType]
 *         description: Field to group statistics by
 *         example: "method"
 *     responses:
 *       200:
 *         description: Family planning statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatisticsResponse'
 *             example:
 *               groupBy: "method"
 *               dateRange:
 *                 from: "2025-01-01"
 *                 to: "2025-12-31"
 *               data:
 *                 - category: "Combined Oral Contraceptive Pills"
 *                   count: 150
 *                   percentage: 35.7
 *                 - category: "Injectable Contraceptives"
 *                   count: 120
 *                   percentage: 28.6
 *                 - category: "Condoms"
 *                   count: 80
 *                   percentage: 19.0
 *                 - category: "IUD"
 *                   count: 70
 *                   percentage: 16.7
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or missing groupBy parameter"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /family-planning/appointments/due:
 *   get:
 *     summary: Get due appointments
 *     description: Retrieve a list of clients with upcoming or overdue appointments
 *     tags: [Family Planning Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by specific facility
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for appointment range (inclusive)
 *         example: "2025-01-01"
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for appointment range (inclusive)
 *         example: "2025-01-31"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Due appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           serviceId:
 *                             type: string
 *                             format: uuid
 *                             description: ID of the service record
 *                           clientId:
 *                             type: string
 *                             format: uuid
 *                             description: ID of the family planning client
 *                           clientName:
 *                             type: string
 *                             description: Name of the client
 *                           patientId:
 *                             type: string
 *                             format: uuid
 *                             description: ID of the patient
 *                           facilityName:
 *                             type: string
 *                             description: Name of the facility
 *                           methodName:
 *                             type: string
 *                             description: Name of the contraceptive method
 *                           nextAppointment:
 *                             type: string
 *                             format: date
 *                             description: Date of next appointment
 *                           daysDue:
 *                             type: integer
 *                             description: Number of days until appointment (negative if overdue)
 *                           phoneNumber:
 *                             type: string
 *                             description: Client's contact number
 *             example:
 *               data:
 *                 - serviceId: "123e4567-e89b-12d3-a456-426614174010"
 *                   clientId: "123e4567-e89b-12d3-a456-426614174003"
 *                   clientName: "Jane Doe"
 *                   patientId: "123e4567-e89b-12d3-a456-426614174001"
 *                   facilityName: "Abuja General Hospital"
 *                   methodName: "Injectable Contraceptives"
 *                   nextAppointment: "2025-01-20"
 *                   daysDue: 5
 *                   phoneNumber: "+234-801-234-5678"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 25
 *                 totalPages: 3
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /family-planning/reports/method-distribution:
 *   get:
 *     summary: Get method distribution report
 *     description: Retrieve the distribution of contraceptive methods being used
 *     tags: [Family Planning Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Method distribution retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClients:
 *                   type: integer
 *                   description: Total number of active clients
 *                 methodDistribution:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       methodId:
 *                         type: string
 *                         format: uuid
 *                         description: ID of the method
 *                       methodName:
 *                         type: string
 *                         description: Name of the method
 *                       category:
 *                         type: string
 *                         description: Category of the method
 *                       userCount:
 *                         type: integer
 *                         description: Number of clients using this method
 *                       percentage:
 *                         type: number
 *                         description: Percentage of total clients
 *                       trend:
 *                         type: string
 *                         enum: [increasing, stable, decreasing]
 *                         description: Usage trend compared to previous period
 *             example:
 *               totalClients: 420
 *               methodDistribution:
 *                 - methodId: "123e4567-e89b-12d3-a456-426614174004"
 *                   methodName: "Combined Oral Contraceptive Pills"
 *                   category: "Hormonal"
 *                   userCount: 150
 *                   percentage: 35.7
 *                   trend: "stable"
 *                 - methodId: "123e4567-e89b-12d3-a456-426614174005"
 *                   methodName: "Injectable Contraceptives"
 *                   category: "Hormonal"
 *                   userCount: 120
 *                   percentage: 28.6
 *                   trend: "increasing"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /family-planning/reports/client-retention:
 *   get:
 *     summary: Get client retention statistics
 *     description: Retrieve statistics on client retention rates over time
 *     tags: [Family Planning Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by specific facility
 *       - in: query
 *         name: yearFrom
 *         schema:
 *           type: integer
 *           minimum: 2000
 *           maximum: 2030
 *         description: Start year for retention analysis
 *         example: 2024
 *       - in: query
 *         name: yearTo
 *         schema:
 *           type: integer
 *           minimum: 2000
 *           maximum: 2030
 *         description: End year for retention analysis
 *         example: 2025
 *     responses:
 *       200:
 *         description: Client retention statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analysisperiod:
 *                   type: object
 *                   properties:
 *                     yearFrom:
 *                       type: integer
 *                       description: Start year of analysis
 *                     yearTo:
 *                       type: integer
 *                       description: End year of analysis
 *                 overallRetentionRate:
 *                   type: number
 *                   description: Overall retention rate as percentage
 *                 retentionByMethod:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       methodName:
 *                         type: string
 *                         description: Name of the contraceptive method
 *                       retentionRate:
 *                         type: number
 *                         description: Retention rate for this method
 *                       averageDuration:
 *                         type: number
 *                         description: Average duration of method use in months
 *                 retentionByYear:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: integer
 *                         description: Year
 *                       newClients:
 *                         type: integer
 *                         description: Number of new clients registered
 *                       activeClients:
 *                         type: integer
 *                         description: Number of clients still active
 *                       retentionRate:
 *                         type: number
 *                         description: Retention rate for this year
 *                 discontinuationReasons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reason:
 *                         type: string
 *                         description: Reason for discontinuation
 *                       count:
 *                         type: integer
 *                         description: Number of clients with this reason
 *                       percentage:
 *                         type: number
 *                         description: Percentage of total discontinuations
 *             example:
 *               analysisperiod:
 *                 yearFrom: 2024
 *                 yearTo: 2025
 *               overallRetentionRate: 78.5
 *               retentionByMethod:
 *                 - methodName: "IUD"
 *                   retentionRate: 95.2
 *                   averageDuration: 36.5
 *                 - methodName: "Injectable Contraceptives"
 *                   retentionRate: 82.1
 *                   averageDuration: 18.3
 *                 - methodName: "Combined Oral Contraceptive Pills"
 *                   retentionRate: 65.8
 *                   averageDuration: 12.7
 *               retentionByYear:
 *                 - year: 2024
 *                   newClients: 250
 *                   activeClients: 195
 *                   retentionRate: 78.0
 *                 - year: 2025
 *                   newClients: 180
 *                   activeClients: 142
 *                   retentionRate: 78.9
 *               discontinuationReasons:
 *                 - reason: "Planning pregnancy"
 *                   count: 45
 *                   percentage: 32.1
 *                 - reason: "Side effects"
 *                   count: 38
 *                   percentage: 27.1
 *                 - reason: "Lost to follow-up"
 *                   count: 25
 *                   percentage: 17.9
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
