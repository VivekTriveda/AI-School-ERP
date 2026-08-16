const express = require("express");
const router = express.Router();

const teacherPerformanceController = require("../controllers/teacherPerformanceController");

/**
 * @swagger
 * /api/teacher-performance/dashboard/{schoolId}:
 *   get:
 *     summary: Get teacher performance dashboard
 *     description: Retrieve teacher performance statistics and individual performance scores for a school.
 *     tags:
 *       - Teacher Performance
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
 *         description: Teacher performance data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalTeachers:
 *                   type: integer
 *                   example: 25
 *                 bestTeacher:
 *                   type: string
 *                   example: Rahul Sharma
 *                 averageRating:
 *                   type: integer
 *                   example: 82
 *                 needImprovement:
 *                   type: integer
 *                   example: 3
 *                 performance:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       teacherId:
 *                         type: string
 *                       teacherName:
 *                         type: string
 *                       subject:
 *                         type: string
 *                       classes:
 *                         type: string
 *                       attendance:
 *                         type: integer
 *                       tests:
 *                         type: integer
 *                       results:
 *                         type: integer
 *                       studentAverage:
 *                         type: integer
 *                       score:
 *                         type: integer
 *                       rating:
 *                         type: string
 *       500:
 *         description: Server error while retrieving teacher performance.
 */

router.get(
    "/dashboard/:schoolId",
    teacherPerformanceController.getTeacherPerformance
);

module.exports = router;
