const express = require("express");

const router = express.Router();

const attendanceController = require("../controllers/attendanceController");

router.get(
    "/students",
    attendanceController.getStudents
);

router.get(

    "/student/:studentId",

    attendanceController.getStudentAttendance

);

router.get(
    "/",
    attendanceController.getAttendance
);

router.post(
    "/",
    attendanceController.saveAttendance
);

module.exports = router;