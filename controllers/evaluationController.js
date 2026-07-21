const extractText = require("../services/extractText");
const Evaluation = require("../models/Evaluation");
const Paper = require("../models/Paper");
const { evaluateWithAI } = require("../services/evaluateWithAI");
const Student = require("../models/Student");
const { extractStudentInfo } = require("../services/extractStudentInfo");


exports.uploadAnswerSheet = async (req, res) => {

    try {

        const {
            paperId,
            studentName,
            rollNo
        } = req.body;

        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "Please upload an answer sheet."

            });

        }
        console.log("Uploaded File:", req.file.path);


 const extractedText = await extractText(
    req.file.path,
    req.file.mimetype
);       

console.log("========== STUDENT ANSWERS ==========");
console.log(extractedText);
console.log("=====================================");


// Find the generated paper
const paper = await Paper.findOne({
    paperId: paperId
});

console.log("========== PAPER SELECTED ==========");
console.log({
    paperId: paper.paperId,
    examName: paper.examName,
    subject: paper.subject,
    totalQuestions: paper.questions.length,
    totalMarks: paper.totalMarks
});
console.log("====================================");

if (!paper) {
    return res.status(404).json({
        success: false,
        message: "Question paper not found."
    });
}   
 

        aiResult.results = aiResult.results.map(q => ({

    ...q,

    obtainedMarks: Number(q.obtainedMarks || 0),

    maxMarks: Number(q.maxMarks || 0),

    status: q.status || "Wrong",

    feedback: q.feedback || ""

}));

// ADD THIS
const schoolId = paper.schoolId;

const schoolName = paper.schoolName;

const board = paper.board;

const className = paper.className;

const section = paper.section || "A";

const examName = paper.examName || "";

const subject = paper.subject;

     const evaluation = await Evaluation.create({

    paperId,

    schoolId,

    schoolName,

    board,

    className,

    section,

    examName,

    subject,

    studentName,

    rollNo,

    fileName: req.file.filename,

    filePath: req.file.path,

    extractedText,

    totalMarks: aiResult.totalMarks,

    obtainedMarks: aiResult.totalObtained,

    percentage: aiResult.percentage,

    grade: aiResult.grade,

    results: aiResult.results

});



        res.json({

            success: true,

            message: "Answer Sheet Uploaded Successfully",

            evaluation

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


// ==========================================
// Upload Multiple Answer Sheets
// ==========================================

exports.uploadMultipleAnswerSheets = async (req, res) => {

    try {

        const {
            paperId
        } = req.body;

        if (!req.files || req.files.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Please upload answer sheets."
            });

        }

        // Find Question Paper
        const paper = await Paper.findOne({
            paperId
        });

        if (!paper) {

            return res.status(404).json({
                success: false,
                message: "Question paper not found."
            });

        }

        const evaluations = [];

        // Process every uploaded file
        for (const file of req.files) {

            console.log("Processing:", file.originalname);

            const extractedText = await extractText(
    file.path,
    file.mimetype
);

// Identify Student
const studentInfo = await extractStudentInfo(extractedText);

console.log(studentInfo);

const student = await Student.findOne({

    schoolId: paper.schoolId,

    rollNo: studentInfo.rollNo

});

if (!student) {

    console.log("Student Not Found");

    continue;

}

const studentName = student.studentName;

const rollNo = student.rollNo;

// Evaluate Answer Sheet
const aiResult = await evaluateWithAI(
    paper,
    extractedText
);

            aiResult.results = aiResult.results.map(q => ({
                ...q,
                obtainedMarks: Number(q.obtainedMarks || 0),
                maxMarks: Number(q.maxMarks || 0),
                status: q.status || "Wrong",
                feedback: q.feedback || ""
            }));


            const evaluation = await Evaluation.create({

                paperId: paper.paperId,

                schoolId: paper.schoolId,

                schoolName: paper.schoolName,

                board: paper.board,

                className: paper.className,

                section: paper.section,

                examName: paper.examName,

                subject: paper.subject,

                studentName,

                rollNo,

                fileName: file.filename,

                filePath: file.path,

                extractedText,

                totalMarks: aiResult.totalMarks,

                obtainedMarks: aiResult.totalObtained,

                percentage: aiResult.percentage,

                grade: aiResult.grade,

                results: aiResult.results

            });

            evaluations.push(evaluation);

        }
    res.json({

    success: true,

    totalUploaded: evaluations.length,

    evaluations: evaluations.map(e => ({

        studentName: e.studentName,

        rollNo: e.rollNo,

        obtainedMarks: e.obtainedMarks,

        totalMarks: e.totalMarks

    }))

});

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =============================
// Get Evaluation by ID
// =============================
exports.getEvaluation = async (req, res) => {

    try {

        const evaluation = await Evaluation.findById(req.params.id);

        if (!evaluation) {
            return res.status(404).json({
                success: false,
                message: "Evaluation not found."
            });
        }

        res.json({
            success: true,
            evaluation
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};


// =============================
// Get Evaluation by Paper ID
// =============================
exports.getEvaluationByPaper = async (req, res) => {

    try {

        const evaluations = await Evaluation.find({
            paperId: req.params.paperId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: evaluations.length,
            evaluations
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// ===============================
// GET ALL EVALUATION REPORTS
// ===============================

exports.getAllEvaluations = async (req, res) => {

    try {

        const reports = await Evaluation.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            reports
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


// ===============================
// GET SINGLE REPORT
// ===============================

exports.getEvaluation = async (req, res) => {

    try {

        const report = await Evaluation.findById(req.params.id);

        if (!report) {

            return res.status(404).json({

                success: false,

                message: "Report not found"

            });

        }

        res.json({

            success: true,

            report

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ===============================
// DELETE REPORT
// ===============================

exports.deleteEvaluation = async (req, res) => {

    try {

        await Evaluation.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Evaluation deleted successfully"

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
// ===============================
// TEACHER MANUAL REVIEW
// ===============================

exports.manualReview = async (req, res) => {

    try {

        const { results, teacherName } = req.body;
        console.log("===== REQUEST BODY =====");
console.log(JSON.stringify(results, null, 2));
console.log("========================");

        const evaluation = await Evaluation.findById(req.params.id);

        if (!evaluation) {
            return res.status(404).json({
                success: false,
                message: "Evaluation not found."
            });
        }

       
       // Update teacher marks and remarks
evaluation.results.forEach((question, index) => {

    if (!results[index]) return;

    const teacherMarks = results[index].teacherMarks;

    if (
        teacherMarks === null ||
        teacherMarks === undefined ||
        teacherMarks === ""
    ) {

        // Teacher didn't change anything
        question.teacherMarks = Number(question.obtainedMarks);

    } else {

        question.teacherMarks = Number(teacherMarks);

    }

    question.teacherRemarks =
        results[index].teacherRemarks || "";

});

        // Calculate Final Marks
let final = 0;

evaluation.results.forEach(q => {

    final += Number(
        q.teacherMarks ?? q.obtainedMarks ?? 0
    );

});

evaluation.finalMarks = final;

        evaluation.teacherChecked = true;

        evaluation.teacherName = teacherName || "";

        const modified = evaluation.results.some(q =>
    Number(q.teacherMarks) !== Number(q.obtainedMarks)
);

evaluation.status = modified
    ? "Teacher Modified"
    : "Teacher Approved";

        await evaluation.save();
        console.log("========== FINAL REVIEW ==========");

console.log("Teacher :", evaluation.teacherName);

console.log("Final Marks :", evaluation.finalMarks);

console.log(
    evaluation.results.map(q => ({
        teacherMarks: q.teacherMarks,
        obtainedMarks: q.obtainedMarks
    }))
);

console.log("==================================");

        res.json({

            success: true,

            message: "Teacher review saved successfully.",

            evaluation

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
// ===============================
// GET CLASSES
// ===============================

exports.getClasses = async (req, res) => {

    try {

        const classes = await Evaluation.distinct("className", {
            schoolId: req.query.schoolId
        });

        res.json({
            success: true,
            classes
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
// ===============================
// GET SUBJECTS
// ===============================

exports.getSubjects = async (req, res) => {

    try {

        const subjects = await Evaluation.distinct("subject", {

            schoolId: req.query.schoolId,

            className: req.query.className

        });

        res.json({

            success: true,

            subjects

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
// ===============================
// FILTER REPORTS
// ===============================

exports.filterReports = async (req, res) => {

    try {

        const reports = await Evaluation.find({

            schoolId: req.query.schoolId,

            className: req.query.className,

            subject: req.query.subject

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            reports

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* ==========================================
   Load Class For Evaluation
========================================== */

exports.loadClass = async (req, res) => {

    try {

        const {

            schoolId,
            board,
            className,
            section,
            subject,
            examName

        } = req.query;

       const paper = await Paper.findOne({

    schoolId,

    board,

    className,

    section,

    subject,

    examName: (examName || "").trim()

});

        if (!paper) {

            return res.status(404).json({

                success: false,

                message: "Question paper not found."

            });

        }

        const students = await Student.find({

            schoolId,
            className,
            section

        })
        .select("_id rollNo studentName")
        .sort({

            rollNo: 1

        });

        res.json({

            success: true,

            paperId: paper.paperId,

            students

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getStudentResults = async (req, res) => {

    try {

        const student = await Student.findById(req.params.studentId);

        if (!student) {

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        const results = await Evaluation.find({

            schoolId: student.schoolId,
            rollNo: student.rollNo

        }).sort({ createdAt: -1 });

        res.json({

            success: true,
            results

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};