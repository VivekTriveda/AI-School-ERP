const express = require("express");

const router = express.Router();

const {
    processBook
} = require("../controllers/processController");

/**
 * @swagger
 * /api/process/{bookId}:
 *   post:
 *     summary: Process a book and generate questions
 *     description: Process all unprocessed chapters of a book and generate questions using the configured AI question extraction service.
 *     tags:
 *       - Process Book
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: MongoDB ID of the book to process.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Question generation completed or book was already processed.
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
 *                   example: Question generation completed.
 *                 totalQuestions:
 *                   type: integer
 *                   example: 175
 *       404:
 *         description: Book not found.
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
 *                   example: Book not found
 *       500:
 *         description: Server error while processing the book.
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

router.post("/:bookId", processBook);

module.exports = router;
