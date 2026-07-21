const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({

    paperId: {
        type: String,
        required: true
    },

    schoolId: {
        type: String,
        required: true
    },
    schoolName: {
    type: String,
    default: ""
},

board: {
    type: String,
    default: ""
},

className: {
    type: String,
    default: ""
},

    studentName: {
        type: String,
        required: true
    },

    rollNo: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        default: ""
    },
    examName: {
    type: String,
    default: ""
},

section: {
    type: String,
    default: "A"
},

    fileName: {
        type: String,
        required: true
    },

    filePath: {
        type: String,
        required: true
    },

    extractedText: {
        type: String,
        default: ""
    },

    totalMarks: {
        type: Number,
        default: 0
    },

    obtainedMarks: {
        type: Number,
        default: 0
    },

    percentage: {
        type: Number,
        default: 0
    },

    grade: {
        type: String,
        default: "Pending"
    },

    results: [
    {
        questionId: String,

        question: String,

        studentAnswer: String,

        correctAnswer: String,

        // AI Evaluation
        obtainedMarks: {
            type: Number,
            default: 0
        },

        maxMarks: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            default: "Wrong"
        },

        feedback: {
            type: String,
            default: ""
        },

        // Teacher Review
        teacherMarks: {
            type: Number,
            default: null
        },

        teacherRemarks: {
            type: String,
            default: ""
        }
    }
],

   status: {
    type: String,
    default: "Pending Teacher Review"
},

teacherChecked: {
    type: Boolean,
    default: false
},

teacherName: {
    type: String,
    default: ""
},

finalMarks: {
    type: Number,
    default: 0
},
published: {
    type: Boolean,
    default: false
},

publishedBy: {
    type: String,
    default: ""
},

publishedAt: {
    type: Date,
    default: null
},

},


{

    timestamps: true

});

module.exports = mongoose.model("Evaluation", evaluationSchema);