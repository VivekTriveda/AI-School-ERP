const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacherController");
/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Teacher management APIs
 */

/**
 * @swagger
 * /api/teachers/login:
 *   post:
 *     summary: Teacher login
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: teacher@school.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Teacher@123
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: Teacher not found
 *       401:
 *         description: Invalid password
 *       500:
 *         description: Server error
 */
router.post("/login", teacherController.loginTeacher);


/**
 * @swagger
 * /api/teachers/add:
 *   post:
 *     summary: Add a new teacher
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - schoolName
 *               - teacherName
 *               - email
 *               - password
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
 *               teacherName:
 *                 type: string
 *                 example: Amit Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 example: amit@school.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Teacher@123
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Mathematics
 *                   - Science
 *               classes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Class 9
 *                   - Class 10
 *               teacherType:
 *                 type: string
 *                 example: CLASS_TEACHER
 *               classTeacherOf:
 *                 type: object
 *                 properties:
 *                   board:
 *                     type: string
 *                     example: CBSE
 *                   className:
 *                     type: string
 *                     example: Class 10
 *                   section:
 *                     type: string
 *                     example: A
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       400:
 *         description: Invalid data or teacher already exists
 *       500:
 *         description: Server error
 */
router.post("/add", teacherController.addTeacher);


/**
 * @swagger
 * /api/teachers/options/{schoolId}:
 *   get:
 *     summary: Get teacher options
 *     description: Get available boards, classes, subjects, and completed books for a school.
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: Teacher options retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/options/:schoolId", teacherController.getTeacherOptions);


/**
 * @swagger
 * /api/teachers/teacher/{id}:
 *   get:
 *     summary: Get teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher MongoDB ID
 *     responses:
 *       200:
 *         description: Teacher details
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.get("/teacher/:id", teacherController.getTeacherById);


/**
 * @swagger
 * /api/teachers/{schoolId}:
 *   get:
 *     summary: Get teachers by school
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: List of teachers for the school
 *       500:
 *         description: Server error
 */
router.get("/:schoolId", teacherController.getTeachersBySchool);


/**
 * @swagger
 * /api/teachers/{id}:
 *   delete:
 *     summary: Delete teacher
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher MongoDB ID
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", teacherController.deleteTeacher);


/**
 * @swagger
 * /api/teachers/{id}:
 *   put:
 *     summary: Update teacher
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacherName:
 *                 type: string
 *                 example: Amit Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 example: amit@school.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Mathematics
 *               classes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Class 10
 *               teacherType:
 *                 type: string
 *                 example: CLASS_TEACHER
 *               classTeacherOf:
 *                 type: object
 *                 properties:
 *                   board:
 *                     type: string
 *                   className:
 *                     type: string
 *                   section:
 *                     type: string
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.put("/:id", teacherController.updateTeacher);


module.exports = router;
