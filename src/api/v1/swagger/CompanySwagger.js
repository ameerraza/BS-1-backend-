/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - fk_userId
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the company
 *         image:
 *           type: string
 *           description: URL of the company image
 *         title:
 *           type: string
 *           description: The title of the company
 *         description:
 *           type: string
 *           description: Detailed description of the company
 *         metaTitle:
 *           type: string
 *           description: Meta title for SEO
 *         metaDescription:
 *           type: string
 *           description: Meta description for SEO
 *         awards:
 *           type: array
 *           items:
 *             type: string
 *           description: List of awards received by the company
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags related to the company
 *         rentalConditions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: Rental condition question
 *               answer:
 *                 type: string
 *                 description: Answer to the rental condition question
 *           description: Rental conditions for the company
 *         fleets:
 *           type: array
 *           items:
 *             type: string
 *           description: Fleet information for the company
 *         ourPicks:
 *           type: string
 *           description: Featured picks for the company
 *         slug:
 *           type: string
 *           description: The unique slug for the company
 *         specialPricingPeriods:
 *           type: string
 *           description: Special pricing periods for the company
 *         loyaltyProgram:
 *           type: string
 *           description: Loyalty program details
 *         fk_userId:
 *           type: string
 *           description: User ID associated with the company
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

/**
 * @swagger
 * tags:
 *   - name: Companies
 *     description: Company management APIs
 */

/**
 * @swagger
 * /api/v1/company:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: List of all companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 */

/**
 * @swagger
 * /api/v1/company/findOne:
 *   get:
 *     summary: Get a single company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the company
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *
 * /api/v1/company/{slug}:
 *   get:
 *     summary: Get a company by slug
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of the company
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 */

/**
 * @swagger
 * /api/v1/company/{id}:
 *   patch:
 *     summary: Update a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the company to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *
 *   delete:
 *     summary: Delete a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the company to delete
 *     responses:
 *       200:
 *         description: Company deleted successfully
 */

