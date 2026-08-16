/**
 * @swagger
 * tags:
 *   name: Timetable
 *   description: School timetable management APIs
 */

const express = require("express");

const router = express.Router();

const timeTableController = require("../controllers/timeTableController");


/**
 * @swagger
 * /api/timetable:
 *   post:
 *     summary: Create timetable
 *     description: Create a timetable entry for a school, class and teacher.
 *     tags: [Timetable]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: 665abc123456789012345678
 *               schoolName:
 *                 type: string
 *                 example: ABC Public School
 *               board:
 *                 type: string
 *                 example: CBSE
 *               className:
 *                 type: string
 *                 example: Class 10
 *               subject:
 *                 type: string
 *                 example: Mathematics
 *               teacherName:
 *                 type: string
 *                 example: Amit Sharma
 *               teacherId:
 *                 type: string
 *                 example: 665def123456789012345678
 *               day:
 *                 type: string
 *                 example: Monday
 *               period:
 *                 type: integer
 *                 example: 1
 *               startTime:
 *                 type: string
 *                 example: "08:00"
 *               endTime:
 *                 type: string
 *                 example: "08:45"
 *               roomNo:
 *                 type: string
 *                 example: Room 101
 *     responses:
 *       201:
 *         description: Time Table created successfully
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    timeTableController.createTimeTable
);


/**
 * @swagger
 * /api/timetable:
 *   get:
 *     summary: Get school timetable
 *     description: Get all timetable entries for a school.
 *     tags: [Timetable]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School timetable retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/",
    timeTableController.getTimeTable
);


/**
 * @swagger
 * /api/timetable/teacher/{teacherId}:
 *   get:
 *     summary: Get teacher timetable
 *     description: Get all timetable entries assigned to a specific teacher.
 *     tags: [Timetable]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: Teacher timetable retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/teacher/:teacherId",
    timeTableController.getTeacherTimeTable
);


/**
 * @swagger
 * /api/timetable/{id}:
 *   delete:
 *     summary: Delete timetable
 *     tags: [Timetable]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timetable MongoDB ID
 *     responses:
 *       200:
 *         description: Time Table deleted successfully
 *       500:
 *         description: Server error
 */
router.delete(
    "/:id",
    timeTableController.deleteTimeTable
);


module.exports = router;
