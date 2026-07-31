//CREATE INVITATION
/**
 * @swagger
 * /api/v1/project/{id}/invitation:
 *   post:
 *     summary: Create new invitation and/or schedule send.
 *     tags:
 *       - Invitation
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
 *               - inviteeEmail
 *               - role
 *             properties:
 *               inviteeEmail:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ["Project Manager", "Member", "Viewer"]
 *               scheduleSend:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Invitation created successfully
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
 *                     invitation:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           projectId:
 *                             type: string
 *                           roleId:
 *                             type: string
 *                           inviteeEmail:
 *                             type: string
 *                           status:
 *                             type: string
 *                           invitedBy:
 *                             type: string
 *                           scheduleSend:
 *                             type: string
 *                           _id:
 *                             type: string
 *
 */


// SEND INVITATION
/**
 * @swagger
 * /api/v1/project/{id}/invitation/{invitationId}/send:
 *   post:
 *     summary: Send Invitation
 *     tags:
 *       - Invitation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Invitation sent successfully
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
 *                     invitation:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           projectId:
 *                             type: string
 *                           roleId:
 *                             type: string
 *                           inviteeEmail:
 *                             type: string
 *                           status:
 *                             type: string
 *                           invitedBy:
 *                             type: string
 *                           scheduleSend:
 *                             type: string
 *                           _id:
 *                             type: string
 *
 */

// RESEND INVITATION
/**
 * @swagger
 * /api/v1/project/{id}/invitation/{invitationId}/resend:
 *   post:
 *     summary: Resend pending or expired Invitation
 *     tags:
 *       - Invitation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Invitation resent 
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
 *                     invitation:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           projectId:
 *                             type: string
 *                           roleId:
 *                             type: string
 *                           inviteeEmail:
 *                             type: string
 *                           status:
 *                             type: string
 *                           invitedBy:
 *                             type: string
 *                           scheduleSend:
 *                             type: string
 *                           _id:
 *                             type: string
 *
 */

// FETCH SENT INVITATION
/**
 * @swagger
 * /api/v1/project/{id}/invitation:
 *   get:
 *     summary: Fetch sent invitation
 *     tags:
 *       - Invitation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: query
 *         name: token
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful
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
 *                     projectName:
 *                       type: string
 *                     role:
 *                       type: string
 *                     status:
 *                       type: string
 */


// GET ALL INVITATIONS IN A PROJECT
/**
 * @swagger
 * /api/v1/project/{id}/invitation/all:
 *   get:
 *     summary: Fetch all invitations in a project
 *     tags:
 *       - Invitation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invitations returned successfully
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
 *                     invitation:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           projectId:
 *                             type: string
 *                           roleId:
 *                             type: string
 *                           inviteeEmail:
 *                             type: string
 *                           status:
 *                             type: string
 *                           invitedBy:
 *                             type: string
 *                           scheduleSend:
 *                             type: string
 *                           _id:
 *                             type: string
 *
 */


// GET INVITATION BY ID
/**
 * @swagger
 * /api/v1/project/{id}/invitation/{invitationId}:
 *   get:
 *     summary: Fetch an invitation by id
 *     tags:
 *       - Invitation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invitation returned successfully
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
 *                     invitation:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           projectId:
 *                             type: string
 *                           roleId:
 *                             type: string
 *                           inviteeEmail:
 *                             type: string
 *                           status:
 *                             type: string
 *                           invitedBy:
 *                             type: string
 *                           scheduleSend:
 *                             type: string
 *                           _id:
 *                             type: string
 *
 */

// ACCEPT INVITATION
/**
 * @swagger
 * /api/v1/project/{id}/invitation/accept:
 *   patch:
 *     summary: Accept an invitation
 *     tags:
 *       - Invitation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: query
 *         name: token
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invitation accepted
 */

// REJECT INVITATION
/**
 * @swagger
 * /api/v1/project/{id}/invitation/reject:
 *   patch:
 *     summary: Reject an invitation
 *     tags:
 *       - Invitation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: query
 *         name: token
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invitation rejected
 */

// REVOKE INVITATION
/**
 * @swagger
 * /api/v1/project/{id}/invitation/{invitationId}/revoke:
 *   patch:
 *     summary: Revoke an invitation
 *     tags:
 *       - Invitation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invitation revoked
 */

// RESCHEDULE INVITATION
/**
 * @swagger
 * /api/v1/project/{id}/invitation/{invitationId}/reschedule:
 *   patch:
 *     summary: Reschedule an invitation
 *     tags:
 *       - Invitation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: invitationId
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
 *               - scheduleSend
 *             properties:
 *               scheduleSend:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Invitation rescheduled
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
 *                     roleId: 
 *                       type: string
 *                     inviteeEmail: 
 *                       type: string
 *                     status: 
 *                       type: string
 *                     invitedBy: 
 *                       type: string
 *                     scheduleSend: 
 *                       type: string
 *                     _id: 
 *                       type: string
 */



// UPDATE DRAFTED INVITATION
/**
 * @swagger
 * /api/v1/project/{id}/invitation/{invitationId}:
 *   patch:
 *     summary: Update draft invitation
 *     tags:
 *       - Invitation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: invitationId
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
 *             properties:
 *               role:
 *                 type: string
 *                 enum: ["Project Manager", "Member", "Viewer"]
 *               inviteeEmail:
 *                 type: string
 *     responses:
 *       200:
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
 *                     invitation:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           projectId:
 *                             type: string
 *                           roleId:
 *                             type: string
 *                           inviteeEmail:
 *                             type: string
 *                           status:
 *                             type: string
 *                           invitedBy:
 *                             type: string
 *                           scheduleSend:
 *                             type: string
 *                           _id:
 *                             type: string
 *
 */


// DELETE INVITATION
/**
 * @swagger
 * /api/v1/project/{id}/invitation/{invitationId}/delete:
 *   patch:
 *     summary: Delete an invitation
 *     tags:
 *       - Invitation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema: 
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Deletion successful
 */



