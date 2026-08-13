const express = require("express");

const router = express.Router();

const marksController = require("../controllers/marksController");

router.get(
    "/students",
    marksController.getStudents
);

router.get(
    "/exams",
    marksController.getExams
);

router.get(
    "/",
    marksController.getMarks
);

router.post(
    "/",
    marksController.saveMarks
);

module.exports = router;