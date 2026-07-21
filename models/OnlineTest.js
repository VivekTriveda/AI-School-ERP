const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema(
{
    questionId: String,
    question: String,
    options: [String],
    answer: String,
    marks: Number,

    type: {
        type: String
    },

    difficulty: String,
    chapter: String,
    section: String
},
{
    _id: false
});

const onlineTestSchema = new mongoose.Schema(
{
    testId: {
        type: String,
        unique: true,
        required: true
    },

    paperId: {
        type: String,
        required: true
    },

    schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true
},
    schoolName: String,

    board: String,

    className: {
    type: String,
    required: true
},

    section: {
    type: String,
    default: "A"
},

    subject: String,

    examName: String,

    duration: Number,

    totalMarks: Number,

    createdBy: String,

    startTime: Date,

    endTime: Date,

    status: {
        type: String,
        enum: ["Draft", "Active", "Completed", "Expired"],
        default: "Draft"
    },

    questions: [QuestionSchema],
},
{
    timestamps: true
});

module.exports = mongoose.model("OnlineTest", onlineTestSchema);