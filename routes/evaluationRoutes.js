/**
 * @swagger
 * tags:
 *   name: Evaluation
 *   description: AI answer-sheet evaluation and result management APIs
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const evaluationController = require("../controllers/evaluationController");

// =======================================
// Upload Directory
// =======================================

const uploadDir = path.join(__dirname, "../uploads/answerSheets");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// =======================================
// Multer Storage
// =======================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// =======================================
// Upload Middleware
// =======================================

const upload = multer({

    storage,

    fileFilter: (req, file, cb) => {

        const allowed = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];

        if (allowed.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only PDF, JPG and PNG files are allowed."
                )
            );

        }

    }

});


/**
 * @swagger
 * /api/evaluation/load-class:
 *   get:
 *     summary: Load students for evaluation
 *     description: Find the generated question paper and load students belonging to the selected class and section.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: board
 *         required: true
 *         schema:
 *           type: string
 *         example: CBSE
 *       - in: query
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *         example: Class 10
 *       - in: query
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *         example: A
 *       - in: query
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *         example: Science
 *       - in: query
 *         name: examName
 *         required: true
 *         schema:
 *           type: string
 *         example: Mid Term Examination
 *     responses:
 *       200:
 *         description: Class students loaded successfully
 *       404:
 *         description: Question paper not found
 *       500:
 *         description: Server error
 */
router.get(
    "/load-class",
    evaluationController.loadClass
);


/**
 * @swagger
 * /api/evaluation/upload:
 *   post:
 *     summary: Upload and evaluate an answer sheet
 *     description: Upload a student's answer sheet and evaluate it using the AI evaluation service.
 *     tags: [Evaluation]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - paperId
 *               - answerSheet
 *             properties:
 *               paperId:
 *                 type: string
 *                 example: PAPER-2026-001
 *               studentName:
 *                 type: string
 *                 example: Rahul Sharma
 *               rollNo:
 *                 type: string
 *                 example: "15"
 *               answerSheet:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Answer sheet uploaded and evaluated successfully
 *       400:
 *         description: Answer sheet missing
 *       404:
 *         description: Question paper not found
 *       500:
 *         description: Server error
 */
router.post(
    "/upload",
    upload.single("answerSheet"),
    evaluationController.uploadAnswerSheet
);


/**
 * @swagger
 * /api/evaluation/upload-multiple:
 *   post:
 *     summary: Upload multiple answer sheets
 *     description: Upload and evaluate multiple student answer sheets. Maximum 100 files per request.
 *     tags: [Evaluation]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - paperId
 *               - answerSheets
 *             properties:
 *               paperId:
 *                 type: string
 *                 example: PAPER-2026-001
 *               answerSheets:
 *                 type: array
 *                 maxItems: 100
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Answer sheets uploaded and evaluated successfully
 *       400:
 *         description: No answer sheets uploaded
 *       404:
 *         description: Question paper not found
 *       500:
 *         description: Server error
 */
router.post(
    "/upload-multiple",
    upload.array("answerSheets", 100),
    evaluationController.uploadMultipleAnswerSheets
);


/**
 * @swagger
 * /api/evaluation/:
 *   get:
 *     summary: Get all evaluation reports
 *     tags: [Evaluation]
 *     responses:
 *       200:
 *         description: All evaluation reports
 *       500:
 *         description: Server error
 */
router.get(
    "/",
    evaluationController.getAllEvaluations
);


/**
 * @swagger
 * /api/evaluation/paper/{paperId}:
 *   get:
 *     summary: Get evaluations by paper ID
 *     tags: [Evaluation]
 *     parameters:
 *       - in: path
 *         name: paperId
 *         required: true
 *         schema:
 *           type: string
 *         example: PAPER-2026-001
 *     responses:
 *       200:
 *         description: Evaluation reports for the paper
 *       500:
 *         description: Server error
 */
router.get(
    "/paper/:paperId",
    evaluationController.getEvaluationByPaper
);


/**
 * @swagger
 * /api/evaluation/classes:
 *   get:
 *     summary: Get evaluation classes
 *     description: Get distinct classes having evaluation records for a school.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Classes retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/classes",
    evaluationController.getClasses
);


/**
 * @swagger
 * /api/evaluation/subjects:
 *   get:
 *     summary: Get evaluation subjects
 *     description: Get distinct subjects for a school and class.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *         example: Class 10
 *     responses:
 *       200:
 *         description: Subjects retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/subjects",
    evaluationController.getSubjects
);


/**
 * @swagger
 * /api/evaluation/filter:
 *   get:
 *     summary: Filter evaluation reports
 *     description: Filter evaluation reports by school, class and subject.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered evaluation reports
 *       500:
 *         description: Server error
 */
router.get(
    "/filter",
    evaluationController.filterReports
);


/**
 * @swagger
 * /api/evaluation/teacher-results:
 *   get:
 *     summary: Get teacher evaluation results
 *     description: Get evaluation results with optional school, class, section, subject and exam filters.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: className
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: section
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: subject
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: examName
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher evaluation results
 *       500:
 *         description: Server error
 */
router.get(
    "/teacher-results",
    evaluationController.teacherResults
);


/**
 * @swagger
 * /api/evaluation/student/{studentId}:
 *   get:
 *     summary: Get published student results
 *     description: Get published evaluation results for a student.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student MongoDB ID
 *     responses:
 *       200:
 *         description: Student results
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get(
    "/student/:studentId",
    evaluationController.getStudentResults
);


/**
 * @swagger
 * /api/evaluation/exam-names:
 *   get:
 *     summary: Get exam names
 *     description: Get distinct exam names for the selected school, class, section and subject.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam names retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/exam-names",
    evaluationController.getExamNames
);


/**
 * @swagger
 * /api/evaluation/publish:
 *   put:
 *     summary: Publish evaluation results
 *     description: Publish results for a school, class, section, subject and examination.
 *     tags: [Evaluation]
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
 *               - subject
 *               - examName
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: 665abc123456789012345678
 *               className:
 *                 type: string
 *                 example: Class 10
 *               section:
 *                 type: string
 *                 example: A
 *               subject:
 *                 type: string
 *                 example: Science
 *               examName:
 *                 type: string
 *                 example: Mid Term Examination
 *               teacherName:
 *                 type: string
 *                 example: Amit Sharma
 *     responses:
 *       200:
 *         description: Evaluation results published successfully
 *       500:
 *         description: Server error
 */
router.put(
    "/publish",
    evaluationController.publishResults
);


/**
 * @swagger
 * /api/evaluation/{id}:
 *   get:
 *     summary: Get evaluation report by ID
 *     tags: [Evaluation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Evaluation MongoDB ID
 *     responses:
 *       200:
 *         description: Evaluation report
 *       404:
 *         description: Evaluation not found
 *       500:
 *         description: Server error
 */
router.get(
    "/:id",
    evaluationController.getEvaluation
);


/**
 * @swagger
 * /api/evaluation/{id}/manual-review:
 *   put:
 *     summary: Save teacher manual review
 *     description: Allow a teacher to modify marks and add remarks for evaluated questions.
 *     tags: [Evaluation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Evaluation MongoDB ID
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
 *               results:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     teacherMarks:
 *                       type: number
 *                       example: 4
 *                     teacherRemarks:
 *                       type: string
 *                       example: Good answer
 *     responses:
 *       200:
 *         description: Teacher review saved successfully
 *       404:
 *         description: Evaluation not found
 *       500:
 *         description: Server error
 */
router.put(
    "/:id/manual-review",
    evaluationController.manualReview
);


/**
 * @swagger
 * /api/evaluation/{id}:
 *   delete:
 *     summary: Delete evaluation report
 *     tags: [Evaluation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Evaluation MongoDB ID
 *     responses:
 *       200:
 *         description: Evaluation deleted successfully
 *       500:
 *         description: Server error
 */
router.delete(
    "/:id",
    evaluationController.deleteEvaluation
);


module.exports = router;
