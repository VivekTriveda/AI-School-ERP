const StudentResponse = require("../models/StudentResponse");
const OnlineTest = require("../models/OnlineTest");
const Evaluation = require("../models/Evaluation");
const evaluateController = require("./evaluationController");
const Student = require("../models/Student");

exports.submitExam = async (req, res) => {
  try {

    console.log("========== STUDENT TEST SUBMISSION ==========");
    console.log("REQUEST BODY:", JSON.stringify(req.body, null, 2));

    const {
      testId,
      studentId
    } = req.body;

    // =====================================================
    // SUPPORT BOTH WEB + MOBILE PAYLOAD FORMATS
    // Web:    answers[]
    // Mobile: responses[]
    // =====================================================

    const submittedAnswers =
      Array.isArray(req.body.answers)
        ? req.body.answers
        : Array.isArray(req.body.responses)
        ? req.body.responses
        : [];

    console.log("Submitted Answers:", submittedAnswers.length);

    // =====================================================
    // CHECK EXISTING SUBMISSION
    // =====================================================

    const existing = await StudentResponse.findOne({
      testId,
      studentId
    });

    if (existing) {
      return res.json({
        success: false,
        message: "Exam already submitted."
      });
    }

    // =====================================================
    // FIND ONLINE TEST
    // =====================================================

    const test = await OnlineTest.findOne({
      testId
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Online test not found."
      });
    }

    console.log("Test Questions:", test.questions.length);

    // =====================================================
    // EVALUATE ANSWERS
    // =====================================================

    let obtainedMarks = 0;
    let totalMarks = 0;

    const results = [];

    for (const q of test.questions) {

      const marks = Number(q.marks || 0);

      totalMarks += marks;

      // Find student's answer
      const studentAnswer = submittedAnswers.find(
        a =>
          String(a.questionId) ===
          String(q.questionId)
      );

      // ===================================================
      // SUPPORT DIFFERENT FIELD NAMES
      // Web:    studentAnswer
      // Mobile: selectedAnswer / answer
      // ===================================================

      const selectedAnswer =
        studentAnswer?.studentAnswer ??
        studentAnswer?.selectedAnswer ??
        studentAnswer?.answer ??
        "";

      const correctAnswer = q.answer || "";

      const correct =
        String(selectedAnswer)
          .trim()
          .toLowerCase() ===
        String(correctAnswer)
          .trim()
          .toLowerCase();

      if (correct) {
        obtainedMarks += marks;
      }

      results.push({
        questionId: q.questionId,

        question: q.question,

        studentAnswer: selectedAnswer,

        correctAnswer: correctAnswer,

        obtainedMarks: correct
          ? marks
          : 0,

        maxMarks: marks,

        status: correct
          ? "Correct"
          : "Wrong"
      });
    }

    // =====================================================
    // PERCENTAGE
    // =====================================================

    const percentage =
      totalMarks === 0
        ? 0
        : (obtainedMarks / totalMarks) * 100;

    // =====================================================
    // FIND STUDENT
    // =====================================================

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found."
      });
    }

    // =====================================================
    // GRADE
    // =====================================================

    const grade =
      percentage >= 90
        ? "A+"
        : percentage >= 80
        ? "A"
        : percentage >= 70
        ? "B"
        : percentage >= 60
        ? "C"
        : percentage >= 40
        ? "D"
        : "F";

    // =====================================================
    // SAVE EVALUATION
    // =====================================================

    const evaluation = await Evaluation.create({

      paperId: test.paperId,

      schoolId: test.schoolId,

      schoolName: test.schoolName,

      board: test.board,

      className: test.className,

      section: test.section,

      examName: test.examName,

      subject: test.subject,

      studentName: student.studentName,

      rollNo: student.rollNo,

      fileName: "ONLINE TEST",

      filePath: "ONLINE_TEST",

      extractedText: "",

      totalMarks,

      obtainedMarks,

      percentage,

      grade,

      results,

      status: "Completed"
    });

    // =====================================================
    // CONVERT ANSWERS TO StudentResponse SCHEMA
    // =====================================================

    const responseAnswers = submittedAnswers.map(a => ({

      questionId: a.questionId,

      question: a.question || "",

      answer:
        a.studentAnswer ??
        a.selectedAnswer ??
        a.answer ??
        "",

      maxMarks:
        Number(
          a.marks ??
          a.maxMarks ??
          0
        )
    }));

    // =====================================================
    // SAVE STUDENT RESPONSE
    // =====================================================

    const response = await StudentResponse.create({

      testId,

      paperId: test.paperId,

      studentId,

      studentName: student.studentName,

      rollNo: student.rollNo,

      schoolId: student.schoolId,

      schoolName: student.schoolName,

      board: student.board,

      className: student.className,

      section: student.section,

      subject: test.subject,

      examName: test.examName,

      totalMarks,

      obtainedMarks,

      percentage,

      grade,

      answers: responseAnswers,

      submitted: true,

      submittedAt: new Date()
    });

    // =====================================================
    // LOG RESULT
    // =====================================================

    console.log("========== TEST SAVED ==========");

    console.log("Response ID:", response._id);

    console.log("Evaluation ID:", evaluation._id);

    console.log("Total Marks:", totalMarks);

    console.log("Obtained Marks:", obtainedMarks);

    console.log("Percentage:", percentage);

    console.log("Grade:", grade);

    console.log("================================");

    // =====================================================
    // SEND RESPONSE
    // =====================================================

    res.json({

      success: true,

      message: "Exam submitted successfully.",

      responseId: response._id,

      evaluationId: evaluation._id,

      totalMarks,

      obtainedMarks,

      percentage,

      grade
    });

  } catch (err) {

    console.error("SUBMIT EXAM ERROR:", err);

    res.status(500).json({

      success: false,

      message: err.message

    });
  }
};