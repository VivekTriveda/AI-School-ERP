/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Student attendance management APIs
 */

const express = require("express");

const router = express.Router();

const attendanceController = require("../controllers/attendanceController");


/**
 * @swagger
 * /api/attendance/students:
 *   get:
 *     summary: Get students for attendance
 *     description: Get students filtered by school and class.
 *     tags: [Attendance]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *       - in: query
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *         description: Class name
 *     responses:
 *       200:
 *         description: Students fetched successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/students",
    attendanceController.getStudents
);


/**
 * @swagger
 * /api/attendance/student/{studentId}:
 *   get:
 *     summary: Get attendance of a student
 *     description: Get attendance records for a specific student. Optionally filter by month.
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student MongoDB ID
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: string
 *         description: Month prefix used to filter attendance dates
 *         example: "2026-08"
 *     responses:
 *       200:
 *         description: Student attendance fetched successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/student/:studentId",
    attendanceController.getStudentAttendance
);


/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Get attendance
 *     description: Get attendance for a school, class, section and date.
 *     tags: [Attendance]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *       - in: query
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *         description: Class name
 *       - in: query
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *         description: Section
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance date
 *         example: "2026-08-15"
 *     responses:
 *       200:
 *         description: Attendance fetched successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/",
    attendanceController.getAttendance
);


/**
 * @swagger
 * /api/attendance:
 *   post:
 *     summary: Save attendance
 *     description: Create or update attendance for a class, section and date.
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - className
 *               - section
 *               - date
 *               - attendance
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: 665abc123456789012345678
 *               board:
 *                 type: string
 *                 example: CBSE
 *               className:
 *                 type: string
 *                 example: Class 10
 *               section:
 *                 type: string
 *                 example: A
 *               date:
 *                 type: string
 *                 example: "2026-08-15"
 *               teacherId:
 *                 type: string
 *                 example: 665def123456789012345678
 *               attendance:
 *                 type: array
 *                 description: Attendance entries for students
 *                 items:
 *                   type: object
 *                   properties:
 *                     studentId:
 *                       type: string
 *                       example: 665abc123456789012345679
 *                     status:
 *                       type: string
 *                       example: Present
 *     responses:
 *       200:
 *         description: Attendance saved successfully
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    attendanceController.saveAttendance
);


module.exports = router;
