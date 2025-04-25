/**
 * @swagger
 * tags:
 *   name: DSR
 *   description: Daily Status Report APIs
 */

/**
 * @swagger
 * /users/api/v1/dsr:
 *   post:
 *     summary: Submit a new DSR
 *     tags: [DSR]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project
 *               - date
 *               - estimatedHour
 *               - description
 *             properties:
 *               project:
 *                 type: string
 *                 example: Internal Project
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-04-24
 *               estimatedHour:
 *                 type: number
 *                 example: 6
 *               description:
 *                 type: string
 *                 example: Completed API integration and testing
 *     responses:
 *       201:
 *         description: DSR submitted successfully
 *       400:
 *         description: Estimated hours exceed limit or validation failed
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/api/v1/dsr:
 *   put:
 *     summary: Update an existing DSR
 *     tags: [DSR]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - estimatedHour
 *               - description
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               estimatedHour:
 *                 type: number
 *                 example: 5
 *               description:
 *                 type: string
 *                 example: Refactored code and updated documentation
 *     responses:
 *       200:
 *         description: DSR updated successfully
 *       404:
 *         description: DSR not found
 *       400:
 *         description: Estimated hours exceed limit
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/api/v1/dsr:
 *   get:
 *     summary: Get list of DSRs with filtering and pagination
 *     tags: [DSR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         example: 2025-04-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         example: 2025-04-24
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: List of DSRs fetched successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/api/v1/dsr/{dsrId}:
 *   get:
 *     summary: Get DSR details by ID
 *     tags: [DSR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dsrId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: DSR fetched successfully
 *       404:
 *         description: DSR not found
 *       500:
 *         description: Internal server error
 */
