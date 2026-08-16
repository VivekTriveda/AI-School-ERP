/**
 * @swagger
 * tags:
 *   name: Student Response
 *   description: Student online examination submission APIs
 */

const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/studentResponseController");


/**
 * @swagger
 * /api/student-response/submit:
 *   post:
 *     summary: Submit online examination
 *     description: Submit a student's answers for an online test. The backend automatically evaluates the answers, calculates marks, percentage and grade, and saves the evaluation result.
 *     tags: [Student Response]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testId
 *               - studentId
 *             properties:
 *               testId:
 *                 type: string
 *                 example: TEST-1755000000000-123
 *                 description: Online test ID
 *               studentId:
 *                 type: string
 *                 example: 665abc123456789012345678
 *                 description: Student MongoDB ID
 *               answers:
 *                 type: array
 *                 description: Web application answer format
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       example: Q1
 *                     question:
 *                       type: string
 *                       example: What is photosynthesis?
 *                     studentAnswer:
 *                       type: string
 *                       example: The process by which green plants make food.
 *                     marks:
 *                       type: number
 *                       example: 2
 *               responses:
 *                 type: array
 *                 description: Mobile application answer format. Use either answers or responses.
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       example: Q1
 *                     question:
 *                       type: string
 *                       example: What is photosynthesis?
 *                     selectedAnswer:
 *                       type: string
 *                       example: The process by which green plants make food.
 *                     answer:
 *                       type: string
 *                       example: The process by which green plants make food.
 *                     maxMarks:
 *                       type: number
 *                       example: 2
 *     responses:
 *       200:
 *         description: Exam submitted and evaluated successfully
 *       404:
 *         description: Online test or student not found
 *       500:
 *         description: Server error
 */
router.post(
    "/submit",
    controller.submitExam
);


module.exports = router;
