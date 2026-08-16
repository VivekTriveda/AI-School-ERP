/**
 * @swagger
 * tags:
 *   name: Student Test
 *   description: Student online test APIs
 */

const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/studentTestController");


/**
 * @swagger
 * /api/student-test/available/{studentId}:
 *   get:
 *     summary: Get available tests for student
 *     description: Get active online tests available to a student. The response also indicates whether each test has already been submitted.
 *     tags: [Student Test]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Available student tests retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/available/:studentId",
    controller.getAvailableTests
);


/**
 * @swagger
 * /api/student-test/{testId}:
 *   get:
 *     summary: Get online test for student
 *     description: Get an online test using its test ID.
 *     tags: [Student Test]
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *         example: TEST-1755000000000-123
 *         description: Online test ID
 *     responses:
 *       200:
 *         description: Online test retrieved successfully
 *       404:
 *         description: Test not found
 *       500:
 *         description: Server error
 */
router.get(
    "/:testId",
    controller.getTest
);


module.exports = router;
