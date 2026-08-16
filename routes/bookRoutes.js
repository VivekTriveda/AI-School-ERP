const express = require("express");
const router = express.Router();

const bookController =
require("../controllers/bookController");

/**
 * @swagger
 * /api/books/{schoolId}:
 *   get:
 *     summary: Get books for a school
 *     description: Retrieve all uploaded books belonging to a specific school, sorted by newest first.
 *     tags:
 *       - Book
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
 *         description: List of books retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   schoolId:
 *                     type: string
 *                   schoolName:
 *                     type: string
 *                   board:
 *                     type: string
 *                   className:
 *                     type: string
 *                   subject:
 *                     type: string
 *                   fileName:
 *                     type: string
 *                   totalChunks:
 *                     type: integer
 *                   processedChunks:
 *                     type: integer
 *                   totalQuestions:
 *                     type: integer
 *                   status:
 *                     type: string
 *       500:
 *         description: Server error while retrieving books.
 */
router.get(
    "/:schoolId",
    bookController.getBooks
);

/**
 * @swagger
 * /api/books/{bookId}:
 *   delete:
 *     summary: Delete a book
 *     description: Delete a book and its associated chapters and questions.
 *     tags:
 *       - Book
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: MongoDB ID of the book to delete.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Book deleted successfully.
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
 *                   example: Book deleted successfully.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Server error while deleting the book.
 */
router.delete(
    "/:bookId",
    bookController.deleteBook
);

module.exports = router;
