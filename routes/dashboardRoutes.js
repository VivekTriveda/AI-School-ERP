const express = require("express");

const router = express.Router();

const dashboardController =
require("../controllers/dashboardController");

/**
 * @swagger
 * /api/dashboard/{schoolId}:
 *   get:
 *     summary: Get school dashboard statistics
 *     description: Retrieve dashboard statistics and available subjects/classes for a school, with optional class and subject filters.
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: School ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *       - in: query
 *         name: className
 *         required: false
 *         description: Filter books and questions by class.
 *         schema:
 *           type: string
 *           example: "10"
 *       - in: query
 *         name: subject
 *         required: false
 *         description: Filter books and questions by subject.
 *         schema:
 *           type: string
 *           example: Science
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 books:
 *                   type: integer
 *                   example: 6
 *                 chapters:
 *                   type: integer
 *                   example: 48
 *                 questions:
 *                   type: integer
 *                   example: 1174
 *                 teachers:
 *                   type: integer
 *                   example: 25
 *                 students:
 *                   type: integer
 *                   example: 500
 *                 papers:
 *                   type: integer
 *                   example: 15
 *                 evaluations:
 *                   type: integer
 *                   example: 10
 *                 subjects:
 *                   type: integer
 *                   example: 6
 *                 classes:
 *                   type: integer
 *                   example: 10
 *                 subjectList:
 *                   type: array
 *                   items:
 *                     type: string
 *                 classList:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Server error while retrieving dashboard data.
 */

router.get(
    "/:schoolId",
    dashboardController.getDashboard
);

module.exports = router;
