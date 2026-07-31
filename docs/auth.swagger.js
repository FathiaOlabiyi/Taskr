//SIGNUP
/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: User has been created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 */


//VERIFY USER EMAIL
/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   get:
 *     summary: Verify user email
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema: 
 *           type: string
 *       
 *       - in: query
 *         name: token
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       200:
 *         description: Email verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

//RESEND EMAIL VERIFICATION
/**
 * @swagger
 * /api/v1/auth/resend-verification:
 *   post:
 *     summary: Resend email verification email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification Link resent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */


//SIGNIN
/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Signin user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User has Signed In successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 */


//FORGOT PASSWORD
/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: User forgot their password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password Reset Link sent, Please check your email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */


//RESET PASSWORD
/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema: 
 *           type: string
 *       
 *       - in: query
 *         name: token
 *         required: true
 *         schema: 
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *               confirmNewPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */


//DELETE ACCOUNT
/**
 * @swagger
 * /api/v1/auth/delete-account:
 *   patch:
 *     summary: Delete user account
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User has been deleted successfully
 */


//GOOGLE OAUTH
/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     description: Redirects the user to Google's OAuth consent screen for authentication.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects the user to Google's OAuth login page.
 */


//GOOGLE OAUTH CALLBACK
/**
 * @swagger
 * /api/v1/auth/success-callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: |
 *       Handles Google's OAuth callback after the user grants or denies permission.
 *
 *       If authentication succeeds, the user is authenticated.
 *
 *       If authentication fails, the user is redirected with an error.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects the user after authentication.
 *       401:
 *         description: Google authentication failed.
 */













