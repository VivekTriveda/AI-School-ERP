const express = require("express");

const router = express.Router();

const marksController = require("../controllers/marksController");

/**
 * @swagger
 * /api/marks/students:
 *   get:
 *     summary: Get students for marks entry
 *     description: Retrieve students for a school, class, and section, sorted by roll number.
 *     tags:
 *       - Marks
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *       - in: query
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *           example: "10"
 *       - in: query
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *           example: A
 *     responses:
 *       200:
 *         description: Students retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error while retrieving students.
 */
router.get(
    "/students",
    marksController.getStudents
);

/**
 * @swagger
 * /api/marks/exams:
 *   get:
 *     summary: Get available exams
 *     description: Retrieve exam names available for a school, class, and subject.
 *     tags:
 *       - Marks
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *       - in: query
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *           example: "10"
 *       - in: query
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *           example: Science
 *     responses:
 *       200:
 *         description: Exams retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 exams:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - First Term
 *                     - Half Yearly
 *       500:
 *         description: Server error while retrieving exams.
 */
router.get(
    "/exams",
    marksController.getExams
);

/**
 * @swagger
 * /api/marks:
 *   get:
 *     summary: Get marks
 *     description: Retrieve marks for a specific school, class, section, exam, and subject.
 *     tags:
 *       - Marks
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *       - in: query
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *           example: "10"
 *       - in: query
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *           example: A
 *       - in: query
 *         name: exam
 *         required: true
 *         schema:
 *           type: string
 *           example: First Term
 *       - in: query
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *           example: Science
 *     responses:
 *       200:
 *         description: Marks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 marks:
 *                   type: object
 *                   nullable: true
 *                   description: Marks record for the selected class, section, exam, and subject.
 *       500:
 *         description: Server error while retrieving marks.
 */
router.get(
    "/",
    marksController.getMarks
);

/**
 * @swagger
 * /api/marks:
 *   post:
 *     summary: Save marks
 *     description: Create or update marks for a school, class, section, exam, and subject.
 *     tags:
 *       - Marks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - className
 *               - section
 *               - exam
 *               - subject
 *               - marks
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               board:
 *                 type: string
 *                 example: CBSE
 *               className:
 *                 type: string
 *                 example: "10"
 *               section:
 *                 type: string
 *                 example: A
 *               exam:
 *                 type: string
 *                 example: First Term
 *               subject:
 *                 type: string
 *                 example: Science
 *               teacherId:
 *                 type: string
 *                 example: 64f123456789abcdef654321
 *               marks:
 *                 type: object
 *                 additionalProperties: true
 *                 description: Marks data to save for the selected students.
 *     responses:
 *       200:
 *         description: Marks saved successfully.
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
 *                   example: Marks saved successfully.
 *       500:
 *         description: Server error while saving marks.
 */
router.post(
    "/",
    marksController.saveMarks
);

module.exports = router;
