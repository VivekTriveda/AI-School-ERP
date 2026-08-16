const express = require("express");
const router = express.Router();
const multer = require("multer");

const studentImportController =
require("../controllers/studentImportController");

const upload = multer({
    dest: "uploads/"
});

/**
 * @swagger
 * /api/student-import/import:
 *   post:
 *     summary: Import students from Excel
 *     description: Import student records from the first worksheet of an Excel file. Existing students with the same admission number for the school are skipped as duplicates.
 *     tags:
 *       - Student Import
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - excel
 *               - schoolId
 *             properties:
 *               excel:
 *                 type: string
 *                 format: binary
 *                 description: Excel file containing student records.
 *               schoolId:
 *                 type: string
 *                 description: School ID for the students being imported.
 *                 example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Students imported successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 imported:
 *                   type: integer
 *                   example: 45
 *                 duplicates:
 *                   type: integer
 *                   example: 3
 *                 duplicateStudents:
 *                   type: array
 *                   items:
 *                     type: string
 *                 message:
 *                   type: string
 *                   example: 45 students imported successfully.
 *                 login:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: Admission Number
 *                     password:
 *                       type: string
 *                       example: Stu@AdmissionNumber
 *       500:
 *         description: Import failed or server error while importing students.
 */

router.post(
    "/import",
    upload.single("excel"),
    studentImportController.importStudents
);

module.exports = router;
