const mongoose = require("mongoose");

const studentResponseSchema = new mongoose.Schema({

    testId: String,

    paperId: String,

    studentId: String,

    studentName: String,

    rollNo: String,

    schoolId: String,

    schoolName: String,

    board: String,

    className: String,

    section: String,

    subject: String,

    examName: String,

    totalMarks: Number,

    answers: [{

        questionId: String,

        question: String,

        answer: String,

        maxMarks: Number

    }],

    submitted: {

        type: Boolean,

        default: false

    },

    submittedAt: Date

},
{
    timestamps:true
});

module.exports = mongoose.model(
    "StudentResponse",
    studentResponseSchema
);