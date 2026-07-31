//CREATE TASK
/**
 * @swagger
 * /api/v1/project/{id}/task:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
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
 *               - priority
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: ["low", "medium", "high", "urgent"]
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Task created successfully
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
 *                     task:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:     
 *                           projectId:
 *                             type: string
 *                           title: 
 *                             type: string
 *                           description: 
 *                             type: string
 *                           status: 
 *                             type: string
 *                           priority: 
 *                             type: string
 *                           dueDate: 
 *                             type: string
 *                           _id: 
 *                             type: string
 *                     
 */

//GET ALL TASKS IN A PROJECT
/**
 * @swagger
 * /api/v1/project/{id}/task:
 *   get:
 *     summary: Get all tasks in a project
 *     tags:
 *       - Task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: query
 *         name: status
 *         schema: 
 *           type: string
 *           enum: ["todo", "in-progress", "on-hold", "review", "completed"]
 *       - in: query
 *         name: title
 *         schema: 
 *           type: string
 *       - in: query
 *         name: priority
 *         schema: 
 *           type: string
 *           enum: ["todo", "in-progress", "on-hold", "review", "completed"]
 *       - in: query
 *         name: assigned
 *         schema: 
 *           type: string
 *           enum: ["true", "false"]
 *       - in: query
 *         name: assignedTo
 *         description: Either "me" or the MongoDB ObjectId of a project member.
 *         schema:
 *           oneOf:
 *             - type: string
 *               enum:
 *                 - me
 *             - type: string
 *               pattern: "^[a-fA-F0-9]{24}$"
 *               example: "6889c5f76f4d5e0c4a9f1234"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrived successfully
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
 *                     task:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:     
 *                           projectId:
 *                             type: string
 *                           title: 
 *                             type: string
 *                           description: 
 *                             type: string
 *                           status: 
 *                             type: string
 *                           priority: 
 *                             type: string
 *                           dueDate: 
 *                             type: string
 *                           _id: 
 *                             type: string
 *                     
 */

//GET ALL TASKS ASSIGNED TO A MEMBER
/**
 * @swagger
 * /api/v1/project/{id}/task/member/{memberId}:
 *   get:
 *     summary: Fetch all tasks assigned to a member
 *     tags:
 *       - Task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task returned successfully
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
 *                     task:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:     
 *                           projectId:
 *                             type: string
 *                           title: 
 *                             type: string
 *                           description: 
 *                             type: string
 *                           status: 
 *                             type: string
 *                           priority: 
 *                             type: string
 *                           dueDate: 
 *                             type: string
 *                           _id: 
 *                             type: string
 *                     
 */

//GET A TASK BY ID
/**
 * @swagger
 * /api/v1/project/{id}/task/{taskId}:
 *   get:
 *     summary: Get a task by id
 *     tags:
 *       - Task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task returned successfully
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
 *                     title: 
 *                       type: string
 *                     description: 
 *                       type: string
 *                     status: 
 *                       type: string
 *                     priority: 
 *                       type: string
 *                     dueDate: 
 *                       type: string
 *                     _id: 
 *                       type: string
 *                     
 */

//UPDATE TASK DETAILS BY ID
/**
 * @swagger
 * /api/v1/project/{id}/task/{taskId}:
 *   patch:
 *     summary: Update details of a task in a project
 *     tags:
 *       - Task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Provide at least one field to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: ["low", "medium", "high", "urgent"]
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Update successful
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
 *                     title: 
 *                       type: string
 *                     description: 
 *                       type: string
 *                     status: 
 *                       type: string
 *                     priority: 
 *                       type: string
 *                     dueDate: 
 *                       type: string
 *                     _id: 
 *                       type: string
 *                     
 */

//UPDATE A TASK STATUS
/**
 * @swagger
 * /api/v1/project/{id}/task/{taskId}/status:
 *   patch:
 *     summary: Update the status of a task
 *     tags:
 *       - Task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["todo", "in-progress", "on-hold", "review", "completed"]
 *     responses:
 *       201:
 *         description: Update successful
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
 *                     title: 
 *                       type: string
 *                     description: 
 *                       type: string
 *                     status: 
 *                       type: string
 *                     priority: 
 *                       type: string
 *                     dueDate: 
 *                       type: string
 *                     _id: 
 *                       type: string
 *                     
 */

//DELETE TASK
/**
 * @swagger
 * /api/v1/project/{id}/task/{taskId}/delete:
 *   patch:
 *     summary: Delete a task
 *     tags:
 *       - Task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *                     
 */


//ASSIGN A TASK
/**
 * @swagger
 * /api/v1/project/{id}/task/{taskId}/assign:
 *   patch:
 *     summary: Assign a task to a member
 *     tags:
 *       - Task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberId
 *             properties:
 *               memerId:
 *                 type: string
 *                 pattern: "^[a-fA-F0-9]{24}$"
 *                 example: "6889c5f76f4d5e0c4a9f1234"
 *     responses:
 *       201:
 *         description: Task successfully assigned
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
 *                     title: 
 *                       type: string
 *                     description: 
 *                       type: string
 *                     status: 
 *                       type: string
 *                     assignedTo:
 *                       type: string
 *                     priority: 
 *                       type: string
 *                     dueDate: 
 *                       type: string
 *                     _id: 
 *                       type: string
 *                     
 */

//UNASSIGN A TASK
/**
 * @swagger
 * /api/v1/project/{id}/task/{taskId}/unassign:
 *   patch:
 *     summary: Unassign a task
 *     tags:
 *       - Task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Task unassigned
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
 *                     title: 
 *                       type: string
 *                     description: 
 *                       type: string
 *                     status: 
 *                       type: string
 *                     assignedTo:
 *                       type: string
 *                     priority: 
 *                       type: string
 *                     dueDate: 
 *                       type: string
 *                     _id: 
 *                       type: string
 *                     
 */

