const express = require("express");
const router = express.Router();

const teacherPerformanceController = require("../controllers/teacherPerformanceController");

// Get Teacher Performance Dashboard
router.get(
    "/dashboard/:schoolId",
    teacherPerformanceController.getTeacherPerformance
);

module.exports = router;