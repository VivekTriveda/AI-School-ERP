const StudentResponse = require("../models/StudentResponse");
const OnlineTest = require("../models/OnlineTest");
const Evaluation = require("../models/Evaluation");
const evaluateController = require("./evaluationController");
 const Student = require("../models/Student");

exports.submitExam = async (req, res) => {

    try {

        const existing = await StudentResponse.findOne({

            testId: req.body.testId,

            studentId: req.body.studentId

        });

        if (existing) {

            return res.json({

                success: false,

                message: "Exam already submitted."

            });

        }

        const response = await StudentResponse.create({

            ...req.body,

            submitted: true,

            submittedAt: new Date()

        });
        // ===================== AUTO EVALUATION =====================

const test = await OnlineTest.findOne({
    testId: req.body.testId
});

let obtainedMarks = 0;
let totalMarks = 0;

const results = [];

for (const q of test.questions) {

    totalMarks += Number(q.marks || 0);

   const studentAnswer =
    (req.body.answers || []).find(
        a => a.questionId == q.questionId
    );

const selectedAnswer = studentAnswer
    ? studentAnswer.studentAnswer
    : "";
    
const correct =
    String(selectedAnswer).trim().toLowerCase() ===
    String(q.answer).trim().toLowerCase();

    if (correct) {

        obtainedMarks += Number(q.marks || 0);

    }

    results.push({

        questionId: q.questionId,

        question: q.question,

        studentAnswer: selectedAnswer,

        correctAnswer: q.answer,

        obtainedMarks: correct
            ? Number(q.marks || 0)
            : 0,

        maxMarks: Number(q.marks || 0),

        status: correct ? "Correct" : "Wrong"

    });

}

const percentage =
    totalMarks === 0
        ? 0
        : (obtainedMarks / totalMarks) * 100;



const student = await Student.findById(req.body.studentId);     

await Evaluation.create({

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

    grade:
        percentage >= 90 ? "A+" :
        percentage >= 80 ? "A" :
        percentage >= 70 ? "B" :
        percentage >= 60 ? "C" :
        percentage >= 40 ? "D" : "F",

    results,

    status: "Completed"

});

// ===================== END =====================

        res.json({

            success: true,

            responseId: response._id

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
