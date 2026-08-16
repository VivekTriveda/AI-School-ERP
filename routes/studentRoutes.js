/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management APIs
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get students
 *     description: Get students optionally filtered by school and class.
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *         description: School ID
 *       - in: query
 *         name: className
 *         schema:
 *           type: string
 *         description: Class name
 *     responses:
 *       200:
 *         description: Students fetched successfully
 *       500:
 *         description: Failed to fetch students
 */

/**
 * @swagger
 * /api/students/search:
 *   get:
 *     summary: Search student
 *     description: Search by admission number, student name, or roll number.
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student found
 *       404:
 *         description: Student not found
 */

/**
 * @swagger
 * /api/students/school/{schoolId}:
 *   get:
 *     summary: Get students by school
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Students fetched successfully
 *       500:
 *         description: Error fetching students
 */

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student found
 *       404:
 *         description: Student not found
 */

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Add a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - admissionNo
 *               - studentName
 *               - schoolId
 *             properties:
 *               admissionNo:
 *                 type: string
 *                 example: ADM001
 *               rollNo:
 *                 type: integer
 *                 example: 1
 *               studentName:
 *                 type: string
 *                 example: Rahul Sharma
 *               fatherName:
 *                 type: string
 *                 example: Rajesh Sharma
 *               motherName:
 *                 type: string
 *                 example: Sunita Sharma
 *               gender:
 *                 type: string
 *                 example: Male
 *               className:
 *                 type: string
 *                 example: Class 10
 *               section:
 *                 type: string
 *                 example: A
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "2010-05-15"
 *               address:
 *                 type: string
 *                 example: Delhi
 *               schoolId:
 *                 type: string
 *                 example: 665abc123456789012345678
 *     responses:
 *       201:
 *         description: Student added successfully
 *       500:
 *         description: Failed to add student
 */

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admissionNo:
 *                 type: string
 *               rollNo:
 *                 type: integer
 *               studentName:
 *                 type: string
 *               fatherName:
 *                 type: string
 *               motherName:
 *                 type: string
 *               gender:
 *                 type: string
 *               className:
 *                 type: string
 *               section:
 *                 type: string
 *               mobile:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Update failed
 */

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Delete failed
 */

const express = require("express");
const router = express.Router();

const {
    getStudents,
    getStudentById,
    getStudentsBySchool,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudent
} = require("../controllers/studentController");

// Get all students
router.get("/", getStudents);

// Search Student
router.get("/search", searchStudent);

router.get("/school/:schoolId", getStudentsBySchool);

// Get single student
router.get("/:id", getStudentById);

// Add new student
router.post("/", addStudent);

// Update student
router.put("/:id", updateStudent);

// Delete student
router.delete("/:id", deleteStudent);

module.exports = router;
