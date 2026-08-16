const express = require("express");

const router = express.Router();

const {
    registerPrincipal,
    loginPrincipal,
    dashboardAnalytics
} = require("../controllers/principalController");

/**
 * @swagger
 * /api/principal/dashboard/{schoolId}:
 *   get:
 *     summary: Get principal dashboard analytics
 *     description: Retrieve published evaluation analytics for a school, including pass/fail statistics, average percentage, highest and lowest marks, top students, and class performance.
 *     tags:
 *       - Principal
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: School ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Dashboard analytics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     totalPublished:
 *                       type: integer
 *                       example: 120
 *                     passCount:
 *                       type: integer
 *                       example: 105
 *                     failCount:
 *                       type: integer
 *                       example: 15
 *                     passPercentage:
 *                       type: string
 *                       example: "87.50"
 *                     averagePercentage:
 *                       type: string
 *                       example: "78.45"
 *                     highestMarks:
 *                       type: number
 *                       example: 98
 *                     lowestMarks:
 *                       type: number
 *                       example: 22
 *                     topStudents:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           rank:
 *                             type: integer
 *                             example: 1
 *                           studentName:
 *                             type: string
 *                             example: Rahul Sharma
 *                           className:
 *                             type: string
 *                             example: "10"
 *                           percentage:
 *                             type: number
 *                             example: 96
 *                     classPerformance:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           className:
 *                             type: string
 *                             example: "10"
 *                           average:
 *                             type: string
 *                             example: "78.5"
 *                           passPercentage:
 *                             type: string
 *                             example: "90.0"
 *       500:
 *         description: Server error.
 */
router.get(
    "/dashboard/:schoolId",
    dashboardAnalytics
);

/**
 * @swagger
 * /api/principal/register:
 *   post:
 *     summary: Register a principal
 *     description: Create a new principal account for a school.
 *     tags:
 *       - Principal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - schoolName
 *               - principalName
 *               - username
 *               - password
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               schoolName:
 *                 type: string
 *                 example: Delhi Public School
 *               principalName:
 *                 type: string
 *                 example: Amit Sharma
 *               username:
 *                 type: string
 *                 example: principal01
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: principal@school.com
 *     responses:
 *       200:
 *         description: Principal created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Principal created successfully
 *                 principal:
 *                   type: object
 *       500:
 *         description: Server error.
 */
router.post(
    "/register",
    registerPrincipal
);

/**
 * @swagger
 * /api/principal/login:
 *   post:
 *     summary: Principal login
 *     description: Authenticate a principal using username and password.
 *     tags:
 *       - Principal
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
 *                 example: principal01
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 role:
 *                   type: string
 *                   example: principal
 *                 principal:
 *                   type: object
 *                 school:
 *                   type: object
 *       500:
 *         description: Server error.
 */
router.post(
    "/login",
    loginPrincipal
);

module.exports = router;
