//GET MEMBERS IN A PROJECT
/**
 * @swagger
 * /api/v1/project/{id}/member:
 *   get:
 *     summary: Get all members in a project
 *     tags:
 *       - Member
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: ["Owner", "Project_Manager", "Member", "Viewer"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Members retrieved successfully
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
 *                     member:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           projectId:
 *                             type: string
 *                           userId:
 *                             type: string
 *                           role:
 *                             type: string
 *                           addedBy:
 *                             type: string
 *                           _id:
 *                             type: string
 *
 */


//GET A MEMBER BY ID
/**
 * @swagger
 * /api/v1/project/{id}/member/{memberId}:
 *   get:
 *     summary: Get a member in a project by Id
 *     tags:
 *       - Member
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Member retrieved successfully
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
 *                     projectId:
 *                       type: string
 *                     userId: 
 *                       type: string
 *                     role: 
 *                       type: string
 *                     addedBy: 
 *                       type: string
 *                     _id: 
 *                       type: string
 *                     
 */


//REMOVE MEMBER FROM PROJECT
/**
 * @swagger
 * /api/v1/project/{id}/member/{memberId}/remove:
 *   patch:
 *     summary: Remove a member from project
 *     tags:
 *       - Member
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Member successfully removed
 *                     
 */

//LEAVE A PROJECT
/**
 * @swagger
 * /api/v1/project/{id}/member/leave:
 *   patch:
 *     summary: Leave a project
 *     tags:
 *       - Member
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: You are no longer a member
 *                     
 */