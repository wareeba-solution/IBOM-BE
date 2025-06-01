// api/routes/utility.routes.js
const express = require('express');
const router = express.Router();
const UtilityController = require('../controllers/utility.controller');
const { verifyToken } = require('../middlewares/authJwt');

// Apply authentication middleware to all utility routes
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   - name: Utility
 *     description: Utility endpoints for Nigerian states and LGAs
 */

/**
 * @swagger
 * /utility/states:
 *   get:
 *     summary: Get all Nigerian states
 *     description: Retrieve a list of all Nigerian states
 *     tags: [Utility]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: States retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "States retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Lagos"
 *                       capital:
 *                         type: string
 *                         example: "Ikeja"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/states', UtilityController.getStates);

/**
 * @swagger
 * /utility/states/search:
 *   get:
 *     summary: Search Nigerian states
 *     description: Search for states by name using partial matching
 *     tags: [Utility]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term for state names
 *         example: "lag"
 *     responses:
 *       200:
 *         description: States search completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "States search completed"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Lagos"
 *                       capital:
 *                         type: string
 *                         example: "Ikeja"
 *       400:
 *         description: Search query is required
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/states/search', UtilityController.searchStates);

/**
 * @swagger
 * /utility/states/{stateName}/lgas:
 *   get:
 *     summary: Get LGAs for a specific state
 *     description: Retrieve all Local Government Areas for a given state
 *     tags: [Utility]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stateName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the state
 *         example: "Lagos"
 *     responses:
 *       200:
 *         description: LGAs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "LGAs retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Ikeja"
 *                       state:
 *                         type: string
 *                         example: "Lagos"
 *       400:
 *         description: State name is required
 *       404:
 *         description: State not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/states/:stateName/lgas', UtilityController.getLGAsByState);

/**
 * @swagger
 * /utility/lgas:
 *   get:
 *     summary: Get all Nigerian LGAs
 *     description: Retrieve a list of all Local Government Areas in Nigeria
 *     tags: [Utility]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: LGAs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "LGAs retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Ikeja"
 *                       state:
 *                         type: string
 *                         example: "Lagos"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/lgas', UtilityController.getAllLGAs);

/**
 * @swagger
 * /utility/lgas/search:
 *   get:
 *     summary: Search Nigerian LGAs
 *     description: Search for LGAs by name, optionally within a specific state
 *     tags: [Utility]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term for LGA names
 *         example: "ikeja"
 *       - in: query
 *         name: state
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional state name to limit search
 *         example: "Lagos"
 *     responses:
 *       200:
 *         description: LGAs search completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "LGAs search completed"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Ikeja"
 *                       state:
 *                         type: string
 *                         example: "Lagos"
 *       400:
 *         description: Search query is required
 *       404:
 *         description: State not found (when state parameter is provided)
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/lgas/search', UtilityController.searchLGAs);

/**
 * @swagger
 * /utility/validate-location:
 *   post:
 *     summary: Validate location data
 *     description: Validate if provided state and LGA are valid Nigerian locations
 *     tags: [Utility]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 description: State name to validate
 *                 example: "Lagos"
 *               lga:
 *                 type: string
 *                 description: LGA name to validate
 *                 example: "Ikeja"
 *           example:
 *             state: "Lagos"
 *             lga: "Ikeja"
 *     responses:
 *       200:
 *         description: Location validation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Location validation completed"
 *                 data:
 *                   type: object
 *                   properties:
 *                     state:
 *                       type: object
 *                       properties:
 *                         valid:
 *                           type: boolean
 *                           example: true
 *                         data:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "Lagos"
 *                             capital:
 *                               type: string
 *                               example: "Ikeja"
 *                     lga:
 *                       type: object
 *                       properties:
 *                         valid:
 *                           type: boolean
 *                           example: true
 *                         data:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "Ikeja"
 *                             state:
 *                               type: string
 *                               example: "Lagos"
 *             example:
 *               success: true
 *               message: "Location validation completed"
 *               data:
 *                 state:
 *                   valid: true
 *                   data:
 *                     name: "Lagos"
 *                     capital: "Ikeja"
 *                 lga:
 *                   valid: true
 *                   data:
 *                     name: "Ikeja"
 *                     state: "Lagos"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post('/validate-location', UtilityController.validateLocation);

module.exports = router;