/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Retrieve statistics for the admin dashboard including user counts, recent activities, and system metrics.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     facilities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     recentActivity:
 *                       type: object
 *                       properties:
 *                         new_patients:
 *                           type: integer
 *                         births:
 *                           type: integer
 *                         deaths:
 *                           type: integer
 *                         anc_visits:
 *                           type: integer
 *                         immunizations:
 *                           type: integer
 *                         disease_cases:
 *                           type: integer
 *                     systemHealth:
 *                       type: object
 *                       properties:
 *                         database:
 *                           type: object
 *                         disk:
 *                           type: object
 *                         uptime:
 *                           type: number
 *       401:
 *         description: Unauthorized - User not logged in or token expired
 *       403:
 *         description: Forbidden - User doesn't have admin privileges
 *       500:
 *         description: Server error
 * 
 * /admin/system-health:
 *   get:
 *     summary: Get system health information
 *     description: Retrieve detailed system health metrics including database status, disk space, and uptime.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: System health information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: connected
 *                         size:
 *                           type: string
 *                           example: 42.5 MB
 *                         tableCounts:
 *                           type: array
 *                           items:
 *                             type: object
 *                     disk:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: string
 *                         used:
 *                           type: string
 *                         free:
 *                           type: string
 *                     uptime:
 *                       type: number
 *                       description: Server uptime in seconds
 *       401:
 *         description: Unauthorized - User not logged in or token expired
 *       403:
 *         description: Forbidden - User doesn't have admin privileges
 *       500:
 *         description: Server error
 * 
 * /admin/audits:
 *   get:
 *     summary: Get system audit logs
 *     description: Retrieve audit logs with filtering options for action, entity type, user, and date range.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type (e.g., CREATE, UPDATE, DELETE)
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *         description: Filter by entity type (e.g., User, Patient, Birth)
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: string
 *         description: Filter by entity ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by user ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (ISO format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (ISO format)
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
 *         description: Audit logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Audit'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       401:
 *         description: Unauthorized - User not logged in or token expired
 *       403:
 *         description: Forbidden - User doesn't have admin privileges
 *       500:
 *         description: Server error
 * 
 * /admin/audits/{id}:
 *   get:
 *     summary: Get audit log by ID
 *     description: Retrieve detailed information about a specific audit log entry.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Audit log ID
 *     responses:
 *       200:
 *         description: Audit log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Audit'
 *       401:
 *         description: Unauthorized - User not logged in or token expired
 *       403:
 *         description: Forbidden - User doesn't have admin privileges
 *       404:
 *         description: Audit log not found
 *       500:
 *         description: Server error
 * 
 * /admin/entity-history:
 *   get:
 *     summary: Get entity change history
 *     description: Retrieve change history for a specific entity (e.g., patient, user).
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: entityType
 *         required: true
 *         schema:
 *           type: string
 *         description: Type of entity (e.g., User, Patient, Birth)
 *       - in: query
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the entity
 *     responses:
 *       200:
 *         description: Entity history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Audit'
 *       401:
 *         description: Unauthorized - User not logged in or token expired
 *       403:
 *         description: Forbidden - User doesn't have admin privileges
 *       500:
 *         description: Server error
 *
 * /admin/settings:
 *   post:
 *     summary: Create a new setting
 *     description: Create a new system setting
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *               - type
 *               - category
 *             properties:
 *               key:
 *                 type: string
 *                 description: Unique setting key
 *               value:
 *                 type: string
 *                 description: Setting value
 *               type:
 *                 type: string
 *                 enum: [string, number, boolean, json, date]
 *                 description: Setting value type
 *               category:
 *                 type: string
 *                 description: Setting category
 *               description:
 *                 type: string
 *                 description: Setting description
 *               isSystemSetting:
 *                 type: boolean
 *                 description: Whether this is a system setting
 *     responses:
 *       201:
 *         description: Setting created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       422:
 *         description: Validation error
 *
 * /admin/settings/{id}:
 *   get:
 *     summary: Get setting by ID
 *     description: Retrieve a specific setting by its ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Setting ID
 *     responses:
 *       200:
 *         description: Setting retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Setting not found
 *
 *   put:
 *     summary: Update setting
 *     description: Update an existing setting
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Setting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 description: Setting value
 *               description:
 *                 type: string
 *                 description: Setting description
 *     responses:
 *       200:
 *         description: Setting updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Setting not found
 *       422:
 *         description: Validation error
 *
 *   delete:
 *     summary: Delete setting
 *     description: Delete a setting by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Setting ID
 *     responses:
 *       200:
 *         description: Setting deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Setting not found
 *
 * /admin/settings/key/{key}:
 *   get:
 *     summary: Get setting by key
 *     description: Retrieve a specific setting by its key
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Setting key
 *     responses:
 *       200:
 *         description: Setting retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Setting not found
 *
 *   put:
 *     summary: Update setting by key
 *     description: Update a setting by its key
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Setting key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: string
 *                 description: Setting value
 *     responses:
 *       200:
 *         description: Setting updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Setting not found
 *
 * /admin/settings/category/{category}:
 *   get:
 *     summary: Get settings by category
 *     description: Retrieve all settings for a specific category
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Setting category
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No settings found for category
 * 
 * /admin/backups:
 *   post:
 *     summary: Create a new backup
 *     description: Manually create a new system backup
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Backup created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 * 
 *   get:
 *     summary: Get all backups
 *     description: Retrieve a list of all system backups
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Backups retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /admin/backups/{id}:
 *   get:
 *     summary: Get backup by ID
 *     description: Retrieve details of a specific backup
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Backup ID
 *     responses:
 *       200:
 *         description: Backup retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Backup not found
 *
 *   delete:
 *     summary: Delete backup
 *     description: Delete a specific backup
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Backup ID
 *     responses:
 *       200:
 *         description: Backup deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Backup not found
 *
 * /admin/backups/restore:
 *   post:
 *     summary: Restore from backup
 *     description: Restore the system from a specific backup
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - backupId
 *             properties:
 *               backupId:
 *                 type: string
 *                 description: ID of the backup to restore from
 *     responses:
 *       200:
 *         description: System restored successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Backup not found
 *       500:
 *         description: Server error
 * 
 * /admin/notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Retrieve notifications for the current user
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 *
 * /admin/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     description: Mark a specific notification as read
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 *
 * /admin/notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     description: Mark all user notifications as read
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 *
 * /admin/notifications/{id}/archive:
 *   put:
 *     summary: Archive notification
 *     description: Archive a specific notification
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification archived
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */