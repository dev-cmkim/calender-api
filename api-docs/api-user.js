/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
