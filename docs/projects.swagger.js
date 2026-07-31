//CREATE PROJECT
/**
 * @swagger
 * /api/v1/project:
 *   post:
 *     summary: Create a new project
 *     tags:
 *       - Project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:     
 *                           ownerId:
 *                             type: string
 *                           title: 
 *                             type: string
 *                           description: 
 *                             type: string
 *                           status: 
 *                             type: string
 *                           dueDate: 
 *                             type: string
 *                           _id: 
 *                             type: string
 *                     
 */



//GET PROJECTS
/**
 * @swagger
 * /api/v1/project:
 *   get:
 *     summary: Fetch all projects user is in
 *     tags:
 *       - Project
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: 
 *           type: string
 *       
 *       - in: query
 *         name: type
 *         schema: 
 *           type: string
 *           enum: ["mine", "member"]
 *       
 *       - in: query
 *         name: title
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:     
 *                           ownerId:
 *                             type: string
 *                           title: 
 *                             type: string
 *                           description: 
 *                             type: string
 *                           status: 
 *                             type: string
 *                           dueDate: 
 *                             type: string
 *                           _id: 
 *                             type: string
 *                     
 */


//GET PROJECT BY ID
/**
 * @swagger
 * /api/v1/project/{id}:
 *   get:
 *     summary: Fetch a project by id
 *     tags:
 *       - Project
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: 
 *           type: string
 *       
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     ownerId:
 *                       type: string
 *                     title: 
 *                       type: string
 *                     description: 
 *                       type: string
 *                     status: 
 *                       type: string
 *                     dueDate: 
 *                       type: string
 *                     _id: 
 *                       type: string
 *                     
 */
