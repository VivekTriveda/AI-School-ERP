/**
 * @swagger
 * tags:
 *   name: Teacher Attendance
 *   description: Teacher attendance and leave management APIs
 */

const express = require("express");

const router = express.Router();

const attendanceController =
require("../controllers/teacherAttendanceController");


/**
 * @swagger
 * /api/teacher-attendance/mark:
 *   post:
 *     summary: Mark teacher attendance
 *     description: Mark attendance or submit a leave request for a teacher.
 *     tags: [Teacher Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - status
 *             properties:
 *               teacherId:
 *                 type: string
 *                 example: 665abc123456789012345678
 *               status:
 *                 type: string
 *                 example: Present
 *                 description: Attendance status such as Present, Absent, CL, EL or SL
 *               reason:
 *                 type: string
 *                 example: Family function
 *     responses:
 *       200:
 *         description: Attendance marked or leave request submitted successfully
 *       400:
 *         description: Attendance already marked for today
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.post(
    "/mark",
    attendanceController.markAttendance
);


/**
 * @swagger
 * /api/teacher-attendance/approve/{id}:
 *   put:
 *     summary: Approve teacher leave
 *     description: Approve a pending teacher leave request.
 *     tags: [Teacher Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher attendance record ID
 *     responses:
 *       200:
 *         description: Leave approved successfully
 *       404:
 *         description: Attendance record not found
 *       500:
 *         description: Server error
 */
router.put(
    "/approve/:id",
    attendanceController.approveLeave
);


/**
 * @swagger
 * /api/teacher-attendance/reject/{id}:
 *   put:
 *     summary: Reject teacher leave
 *     description: Reject a pending teacher leave request.
 *     tags: [Teacher Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher attendance record ID
 *     responses:
 *       200:
 *         description: Leave rejected successfully
 *       404:
 *         description: Attendance record not found
 *       500:
 *         description: Server error
 */
router.put(
    "/reject/:id",
    attendanceController.rejectLeave
);


/**
 * @swagger
 * /api/teacher-attendance/my/{teacherId}:
 *   get:
 *     summary: Get teacher's own attendance
 *     description: Get attendance history and attendance summary for a teacher.
 *     tags: [Teacher Attendance]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: Teacher attendance and summary retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/my/:teacherId",
    attendanceController.getMyAttendance
);


/**
 * @swagger
 * /api/teacher-attendance/{schoolId}:
 *   get:
 *     summary: Get teacher attendance by school
 *     description: Get teacher attendance records for a school, optionally filtered by date.
 *     tags: [Teacher Attendance]
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *         example: "2026-08-15"
 *         description: Attendance date
 *     responses:
 *       200:
 *         description: Teacher attendance records retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/:schoolId",
    attendanceController.getAttendanceBySchool
);


module.exports = router;
