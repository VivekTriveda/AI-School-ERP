const express = require("express");

const router = express.Router();

const timeTableController = require("../controllers/timeTableController");

// ======================================
// Create Time Table
// ======================================

router.post(
    "/",
    timeTableController.createTimeTable
);

// ======================================
// Get School Time Table
// Example:
// /api/timetable?schoolId=123
// ======================================

router.get(
    "/",
    timeTableController.getTimeTable
);

// ======================================
// Get Teacher Time Table
// Example:
// /api/timetable/teacher/686f1234...
// ======================================

router.get(
    "/teacher/:teacherId",
    timeTableController.getTeacherTimeTable
);

// ======================================
// Delete Time Table
// ======================================

router.delete(
    "/:id",
    timeTableController.deleteTimeTable
);

module.exports = router;