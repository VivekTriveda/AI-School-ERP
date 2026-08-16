const express = require("express");
const router = express.Router();

const controller = require("../controllers/teacherSalaryController");

/**
 * @swagger
 * /api/teacher-salary/pay:
 *   post:
 *     summary: Save or update teacher salary
 *     description: Save a teacher salary record for a specific month and year. If a salary record already exists for the teacher, month, and year, it is updated. Net salary is calculated automatically from earnings and deductions.
 *     tags:
 *       - Teacher Salary
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - month
 *               - year
 *             properties:
 *               teacherId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               schoolId:
 *                 type: string
 *                 example: 64f123456789abcdef654321
 *               month:
 *                 type: string
 *                 example: "08"
 *               year:
 *                 type: integer
 *                 example: 2026
 *               basicSalary:
 *                 type: number
 *                 example: 30000
 *               hra:
 *                 type: number
 *                 example: 5000
 *               da:
 *                 type: number
 *                 example: 3000
 *               allowance:
 *                 type: number
 *                 example: 2000
 *               bonus:
 *                 type: number
 *                 example: 1000
 *               pf:
 *                 type: number
 *                 example: 1800
 *               tax:
 *                 type: number
 *                 example: 500
 *               deduction:
 *                 type: number
 *                 example: 200
 *               status:
 *                 type: string
 *                 example: Paid
 *     responses:
 *       200:
 *         description: Salary saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Salary saved successfully.
 *                 salary:
 *                   type: object
 *                   description: Saved teacher salary record.
 *       500:
 *         description: Server error while saving salary.
 */
router.post("/pay", controller.paySalary);

/**
 * @swagger
 * /api/teacher-salary/get:
 *   get:
 *     summary: Get teacher salary
 *     description: Retrieve a teacher salary record for a specific month and year.
 *     tags:
 *       - Teacher Salary
 *     parameters:
 *       - in: query
 *         name: teacherId
 *         required: true
 *         description: Teacher ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *       - in: query
 *         name: month
 *         required: true
 *         description: Salary month.
 *         schema:
 *           type: string
 *           example: "08"
 *       - in: query
 *         name: year
 *         required: true
 *         description: Salary year.
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Salary retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 salary:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Server error while retrieving salary.
 */
router.get("/get", controller.getSalary);

/**
 * @swagger
 * /api/teacher-salary/history:
 *   get:
 *     summary: Get teacher salary history
 *     description: Retrieve salary records, optionally filtered by school or teacher.
 *     tags:
 *       - Teacher Salary
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: false
 *         description: Filter salary records by school.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *       - in: query
 *         name: teacherId
 *         required: false
 *         description: Filter salary records by teacher.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef654321
 *     responses:
 *       200:
 *         description: Salary history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 salaries:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error while retrieving salary history.
 */
router.get("/history", controller.salaryHistory);

/**
 * @swagger
 * /api/teacher-salary/dashboard:
 *   get:
 *     summary: Get teacher salary dashboard
 *     description: Retrieve teacher salary statistics for a school.
 *     tags:
 *       - Teacher Salary
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         description: School ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Salary dashboard retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalTeachers:
 *                   type: integer
 *                   example: 25
 *                 totalSalary:
 *                   type: number
 *                   example: 750000
 *                 pendingSalary:
 *                   type: integer
 *                   example: 4
 *       500:
 *         description: Server error while retrieving salary dashboard.
 */
router.get("/dashboard", controller.salaryDashboard);

/**
 * @swagger
 * /api/teacher-salary/teacher/{teacherId}:
 *   get:
 *     summary: Get salary history for a teacher
 *     description: Retrieve all salary records for a specific teacher, sorted by newest first.
 *     tags:
 *       - Teacher Salary
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         description: Teacher ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Teacher salary history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 salaries:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error while retrieving teacher salary history.
 */
router.get(
    "/teacher/:teacherId",
    controller.getTeacherSalaryHistory
);

/**
 * @swagger
 * /api/teacher-salary/pending-teachers:
 *   get:
 *     summary: Get teachers with pending salary
 *     description: Retrieve teachers who have not yet received salary for the current month.
 *     tags:
 *       - Teacher Salary
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         description: School ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Pending teachers retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 teachers:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error while retrieving pending teachers.
 */
router.get(
    "/pending-teachers",
    controller.getPendingTeachers
);

/**
 * @swagger
 * /api/teacher-salary/{id}:
 *   delete:
 *     summary: Delete a salary record
 *     description: Delete a teacher salary record by its ID.
 *     tags:
 *       - Teacher Salary
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Salary record ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Salary deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Salary deleted successfully.
 *       500:
 *         description: Server error while deleting salary.
 */
router.delete("/:id", controller.deleteSalary);

module.exports = router;
