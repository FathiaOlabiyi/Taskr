//FETCH USER PROFILE
/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Fetch a user's profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrived successfully
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
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     email_address:
 *                       type: string
 *                     profile_picture:
 *                       type: string
 *
 */

//FETCH USER PROFILE-PICTURE
/**
 * @swagger
 * /api/v1/user/profile-picture:
 *   get:
 *     summary: Fetch a user's profile-picture
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile Picture retrieved successfully
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
 *                     profile_picture:
 *                       type: string
 *
 */

//UPLOAD/UPDATE USER PROFILE-PICTURE
/**
 * @swagger
 * /api/v1/user/profile-picture:
 *   patch:
 *     summary: Upload/Update user profile picture
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profile_picture
 *             properties:
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Upload successful
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
 *                     profile_picture:
 *                       type: string
 *
 */


//REMOVE USER PROFILE-PICTURE
/**
 * @swagger
 * /api/v1/user/profile-picture/remove:
 *   patch:
 *     summary: Remove user profile picture
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Profile Picture removed
 */

