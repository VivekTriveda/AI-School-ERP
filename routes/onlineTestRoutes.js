/**
 * @swagger
 * tags:
 *   name: Online Test
 *   description: Online examination management APIs
 */

const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/onlineTestController");


/**
 * @swagger
 * /api/online-test/create:
 *   post:
 *     summary: Create online test
 *     description: Create an online test from an existing question paper.
 *     tags: [Online Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paperId
 *             properties:
 *               paperId:
 *                 type: string
 *                 example: PAPER-2026-001
 *                 description: Generated question paper ID
 *     responses:
 *       200:
 *         description: Online test created successfully
 *       400:
 *         description: paperId is required
 *       404:
 *         description: Question paper not found
 *       500:
 *         description: Server error
 */
router.post(
    "/create",
    controller.createOnlineTest
);


/**
 * @swagger
 * /api/online-test/available/{studentId}:
 *   get:
 *     summary: Get available online tests for student
 *     description: Get active online tests available for a student based on the student's school, class and section.
 *     tags: [Online Test]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student MongoDB ID
 *     responses:
 *       200:
 *         description: Available online tests retrieved successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get(
    "/available/:studentId",
    controller.getAvailableTests
);


/**
 * @swagger
 * /api/online-test/{testId}:
 *   get:
 *     summary: Get online test
 *     description: Get an active online test using its test ID.
 *     tags: [Online Test]
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
 *         description: Online test not found
 *       500:
 *         description: Server error
 */
router.get(
    "/:testId",
    controller.getOnlineTest
);


module.exports = router;
