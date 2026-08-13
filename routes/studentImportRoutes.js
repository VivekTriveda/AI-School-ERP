const express = require("express");
const router = express.Router();
const multer = require("multer");

const studentImportController =
require("../controllers/studentImportController");

const upload = multer({
    dest: "uploads/"
});

router.post(
    "/import",
    upload.single("excel"),
    studentImportController.importStudents
);

module.exports = router;