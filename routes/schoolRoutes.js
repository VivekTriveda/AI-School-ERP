const express = require("express");

const router = express.Router();

const {
    addSchool,
    getSchools,
    getSchoolById,
    updateSchool,
    deleteSchool,
    updateSchoolPackage
} = require("../controllers/schoolController");


/**
 * @swagger
 * tags:
 *   name: Schools
 *   description: School management APIs
 */


/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Create a new school and principal account
 *     tags: [Schools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolName
 *               - board
 *               - principal
 *               - username
 *               - password
 *               - phone
 *               - email
 *             properties:
 *               schoolName:
 *                 type: string
 *                 example: ABC Public School
 *               board:
 *                 type: string
 *                 example: CBSE
 *               principal:
 *                 type: string
 *                 example: Rajesh Kumar
 *               username:
 *                 type: string
 *                 example: principal
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Principal@123
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: principal@abcschool.com
 *               website:
 *                 type: string
 *                 example: https://abcschool.com
 *               address:
 *                 type: string
 *                 example: Main Road, Sector 10
 *               city:
 *                 type: string
 *                 example: Jaipur
 *               state:
 *                 type: string
 *                 example: Rajasthan
 *               pincode:
 *                 type: string
 *                 example: "302001"
 *               package:
 *                 type: string
 *                 enum:
 *                   - basic
 *                   - standard
 *                   - premium
 *                   - ai-enterprise
 *                   - custom
 *                 example: basic
 *     responses:
 *       201:
 *         description: School and principal created successfully
 *       400:
 *         description: Invalid package or duplicate principal/email
 *       500:
 *         description: Server error
 */
router.post("/", addSchool);


/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Get all schools
 *     tags: [Schools]
 *     responses:
 *       200:
 *         description: List of all schools
 *       500:
 *         description: Server error
 */
router.get("/", getSchools);


/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Get a school by ID
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB school ID
 *         example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: School details
 *       404:
 *         description: School not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getSchoolById);


/**
 * @swagger
 * /api/schools/{id}/package:
 *   put:
 *     summary: Update school package and features
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB school ID
 *         example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - packageName
 *             properties:
 *               packageName:
 *                 type: string
 *                 enum:
 *                   - basic
 *                   - standard
 *                   - premium
 *                   - ai-enterprise
 *                   - custom
 *                 example: premium
 *               features:
 *                 type: object
 *                 description: Custom feature overrides when packageName is custom
 *                 properties:
 *                   attendance:
 *                     type: boolean
 *                     example: true
 *                   fees:
 *                     type: boolean
 *                     example: true
 *                   salary:
 *                     type: boolean
 *                     example: true
 *                   timetable:
 *                     type: boolean
 *                     example: true
 *                   onlineTests:
 *                     type: boolean
 *                     example: true
 *                   questionBank:
 *                     type: boolean
 *                     example: true
 *                   aiPaperGenerator:
 *                     type: boolean
 *                     example: true
 *                   aiEvaluation:
 *                     type: boolean
 *                     example: true
 *                   aiReports:
 *                     type: boolean
 *                     example: true
 *                   aiAssistant:
 *                     type: boolean
 *                     example: true
 *                   busTracking:
 *                     type: boolean
 *                     example: true
 *                   qrClassroom:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: School package updated successfully
 *       400:
 *         description: Invalid package
 *       404:
 *         description: School not found
 *       500:
 *         description: Server error
 */
router.put("/:id/package", updateSchoolPackage);


/**
 * @swagger
 * /api/schools/{id}:
 *   put:
 *     summary: Update school details
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB school ID
 *         example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolName:
 *                 type: string
 *                 example: ABC Public School
 *               board:
 *                 type: string
 *                 example: CBSE
 *               principal:
 *                 type: string
 *                 example: Rajesh Kumar
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: principal@abcschool.com
 *               website:
 *                 type: string
 *                 example: https://abcschool.com
 *               address:
 *                 type: string
 *                 example: Main Road
 *               city:
 *                 type: string
 *                 example: Jaipur
 *               state:
 *                 type: string
 *                 example: Rajasthan
 *               pincode:
 *                 type: string
 *                 example: "302001"
 *     responses:
 *       200:
 *         description: School updated successfully
 *       500:
 *         description: Server error
 */
router.put("/:id", updateSchool);


/**
 * @swagger
 * /api/schools/{id}:
 *   delete:
 *     summary: Delete a school and its principal account
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB school ID
 *         example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: School and principal account deleted successfully
 *       404:
 *         description: School not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteSchool);


module.exports = router;
