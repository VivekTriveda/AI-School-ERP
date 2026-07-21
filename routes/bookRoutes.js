const express = require("express");
const router = express.Router();

const bookController =
require("../controllers/bookController");



// Get Books
router.get(
    "/:schoolId",
    bookController.getBooks
);

// Delete Book
router.delete(
    "/:bookId",
    bookController.deleteBook
);

module.exports = router;