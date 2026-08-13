const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const evaluationController = require("../controllers/evaluationController");

// =======================================
// Create uploads/answerSheets folder
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

            cb(new Error("Only PDF, JPG and PNG files are allowed."));

        }

    }

});

// =======================================
// Routes
// =======================================

router.get(
    "/load-class",
    evaluationController.loadClass
);

// Upload Answer Sheet
router.post(
    "/upload",
    upload.single("answerSheet"),
    evaluationController.uploadAnswerSheet
);
// Upload Multiple Answer Sheets
router.post(
    "/upload-multiple",
    upload.array("answerSheets", 100),
    evaluationController.uploadMultipleAnswerSheets
);

// Get all evaluation reports
router.get(
    "/",
    evaluationController.getAllEvaluations
);


// Get report by Paper ID
router.get(
    "/paper/:paperId",
    evaluationController.getEvaluationByPaper
);

router.get("/classes", evaluationController.getClasses);

router.get("/subjects", evaluationController.getSubjects);

router.get("/filter", evaluationController.filterReports);

router.get(
    "/teacher-results",
    evaluationController.teacherResults
);

router.get(
    "/student/:studentId",
    evaluationController.getStudentResults
);

router.get(
    "/exam-names",
    evaluationController.getExamNames
);

router.put(
    "/publish",
    evaluationController.publishResults
);

// Get report by MongoDB ID
router.get(
    "/:id",
    evaluationController.getEvaluation
);

router.put(
    "/:id/manual-review",
    evaluationController.manualReview
);

// Delete report
router.delete(
    "/:id",
    evaluationController.deleteEvaluation
);

module.exports = router;