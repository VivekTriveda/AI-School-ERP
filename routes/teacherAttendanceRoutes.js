const express = require("express");

const router = express.Router();

const attendanceController =
require("../controllers/teacherAttendanceController");

router.post(

    "/mark",

    attendanceController.markAttendance

);

router.put(

    "/approve/:id",

    attendanceController.approveLeave

);

router.put(

    "/reject/:id",

    attendanceController.rejectLeave

);

router.get(

    "/:schoolId",

    attendanceController.getAttendanceBySchool

);

module.exports = router;