const express = require("express");

const router = express.Router();

const paperController = require("../controllers/paperController");

/**
 * @swagger
 * /api/papers/generate-blueprint:
 *   post:
 *     summary: Generate a question paper from a blueprint
 *     description: Select questions from the question bank according to sections, marks, chapters, question types, and difficulty distribution, then save the generated paper.
 *     tags:
 *       - Paper
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - schoolName
 *               - board
 *               - className
 *               - subject
 *               - blueprint
 *               - difficulty
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               schoolName:
 *                 type: string
 *                 example: Delhi Public School
 *               board:
 *                 type: string
 *                 example: CBSE
 *               className:
 *                 type: string
 *                 example: "10"
 *               subject:
 *                 type: string
 *                 example: Science
 *               chapters:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Chemical Reactions
 *                   - Acids Bases and Salts
 *               blueprint:
 *                 type: array
 *                 description: Sections and their required marks.
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - type
 *                     - marks
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Section A
 *                     type:
 *                       type: string
 *                       example: MCQ
 *                     marks:
 *                       type: integer
 *                       example: 20
 *               difficulty:
 *                 type: object
 *                 description: Difficulty distribution as percentages.
 *                 required:
 *                   - easy
 *                   - medium
 *                 properties:
 *                   easy:
 *                     type: number
 *                     example: 30
 *                   medium:
 *                     type: number
 *                     example: 50
 *                   hard:
 *                     type: number
 *                     example: 20
 *               examName:
 *                 type: string
 *                 example: First Term Examination
 *               section:
 *                 type: string
 *                 example: A
 *               duration:
 *                 type: string
 *                 example: 3 Hours
 *     responses:
 *       200:
 *         description: Question paper generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 paperId:
 *                   type: string
 *                   example: QP-1755051234567
 *                 totalMarks:
 *                   type: integer
 *                   example: 80
 *                 totalQuestions:
 *                   type: integer
 *                   example: 40
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       question:
 *                         type: string
 *                         example: What is a chemical reaction?
 *                       answer:
 *                         type: string
 *                       marks:
 *                         type: integer
 *                         example: 2
 *                       type:
 *                         type: string
 *                         example: Short Answer
 *                       difficulty:
 *                         type: string
 *                         example: Medium
 *                       chapter:
 *                         type: string
 *                         example: Chemical Reactions
 *       500:
 *         description: Server error while generating the paper.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/*
Generate Paper using Blueprint
*/

router.post("/generate-blueprint", paperController.generateBlueprint);

/**
 * @swagger
 * /api/papers/list:
 *   get:
 *     summary: Get generated paper list
 *     description: Get all generated question papers for a school.
 *     tags:
 *       - Paper
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         description: School ID used to filter generated papers.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Paper list retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 papers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       paperId:
 *                         type: string
 *                         example: QP-1755051234567
 *                       examName:
 *                         type: string
 *                         example: First Term Examination
 *                       subject:
 *                         type: string
 *                         example: Science
 *                       className:
 *                         type: string
 *                         example: "10"
 *                       section:
 *                         type: string
 *                         example: A
 *                       board:
 *                         type: string
 *                         example: CBSE
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error while retrieving papers.
 */
router.get("/list", paperController.getPaperList);

/**
 * @swagger
 * /api/papers/filters:
 *   get:
 *     summary: Get paper filters
 *     description: Get available boards, classes, sections, subjects, and exam names for a school.
 *     tags:
 *       - Paper
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         description: School ID used to filter papers.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Paper filters retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 boards:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - CBSE
 *                     - ICSE
 *                 classes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "9"
 *                     - "10"
 *                 sections:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - A
 *                     - B
 *                 subjects:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - Science
 *                     - Mathematics
 *                 exams:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - First Term Examination
 *                     - Half Yearly Examination
 *       500:
 *         description: Server error while retrieving paper filters.
 */
router.get("/filters", paperController.getPaperFilters);

/**
 * @swagger
 * /api/papers/{paperId}:
 *   get:
 *     summary: Get a generated paper by ID
 *     description: Retrieve complete details of a generated question paper using its paper ID.
 *     tags:
 *       - Paper
 *     parameters:
 *       - in: path
 *         name: paperId
 *         required: true
 *         description: Generated paper ID.
 *         schema:
 *           type: string
 *           example: QP-1755051234567
 *     responses:
 *       200:
 *         description: Paper retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 paper:
 *                   type: object
 *                   description: Complete generated paper document.
 *       404:
 *         description: Paper not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Paper not found
 *       500:
 *         description: Server error while retrieving the paper.
 */
router.get("/:paperId", paperController.getPaperById);

module.exports = router;
