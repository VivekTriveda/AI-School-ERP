const express = require("express");

const router = express.Router();

const {
    processBook
} = require("../controllers/processController");

router.post("/:bookId", processBook);

module.exports = router;