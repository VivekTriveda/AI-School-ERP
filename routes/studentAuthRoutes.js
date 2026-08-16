/**
 * @swagger
 * tags:
 *   name: Student Authentication
 *   description: Student login, profile, token verification and logout APIs
 */

const express = require("express");

const router = express.Router();

const {
    loginStudent,
    getProfile,
    verifyToken,
    logoutStudent
} = require("../controllers/studentAuthController");

const studentAuth = require("../middleware/studentAuth");


/**
 * @swagger
 * /api/student-auth/login:
 *   post:
 *     summary: Student login
 *     description: Authenticate a student and return a JWT token valid for 7 days.
 *     tags: [Student Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: STU001
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Stu@STU001
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Username and password are required
 *       401:
 *         description: Invalid username or password
 *       403:
 *         description: Student account is inactive
 *       500:
 *         description: Server error
 */
router.post(
    "/login",
    loginStudent
);


/**
 * @swagger
 * /api/student-auth/profile:
 *   get:
 *     summary: Get logged-in student profile
 *     description: Return the profile of the authenticated student.
 *     tags: [Student Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
    "/profile",
    studentAuth,
    getProfile
);


/**
 * @swagger
 * /api/student-auth/verify:
 *   get:
 *     summary: Verify student JWT token
 *     description: Verify that the student's authentication token is valid.
 *     tags: [Student Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
router.get(
    "/verify",
    studentAuth,
    verifyToken
);


/**
 * @swagger
 * /api/student-auth/logout:
 *   post:
 *     summary: Student logout
 *     description: Log out the authenticated student and update the login status.
 *     tags: [Student Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
    "/logout",
    studentAuth,
    logoutStudent
);


module.exports = router;
