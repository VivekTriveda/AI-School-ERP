const Book = require("../models/Book");
const BookChapter = require("../models/BookChapter");
const Question = require("../models/Question");

// ============================
// Get Books
// ============================

exports.getBooks = async (req, res) => {

    try {

        const { schoolId } = req.params;

        const books = await Book.find({ schoolId })
            .sort({ createdAt: -1 });

        res.json(books);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ============================
// Delete Book
// ============================

exports.deleteBook = async (req, res) => {

    try {

        const { bookId } = req.params;

        const book = await Book.findById(bookId);

        if (!book) {

            return res.status(404).json({
                success: false,
                message: "Book not found."
            });

        }

        // Delete all chapters

        await BookChapter.deleteMany({

            bookId: book._id

        });

        // Delete all questions

        await Question.deleteMany({

            schoolId: book.schoolId,

            board: book.board,

            className: book.className,

            subject: book.subject

        });

        // Delete book

        await Book.findByIdAndDelete(bookId);

        res.json({

            success: true,

            message: "Book deleted successfully."

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};