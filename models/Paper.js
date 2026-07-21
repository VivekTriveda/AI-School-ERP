const mongoose = require("mongoose");

const PaperSchema = new mongoose.Schema({

    paperId: {
        type: String,
        unique: true
    },

    schoolId: String,

    schoolName: String,

    board: String,

className: String,

section: {
    type: String,
    default: "A"
},

subject: String,

examName: {
    type: String,
    trim: true
},

    duration:{ type:Number,default:180},

    totalMarks: Number,

    generatedBy: String,

    questions: [
    new mongoose.Schema(
        {
            questionId: {
                type: String
            },
            question: {
                type: String
            },
            options: [
                {
                    type: String
                }
            ],
            answer: {
                type: String
            },
            marks: {
                type: Number
            },
            type: {
                type: String
            },
            difficulty: {
                type: String
            },
            chapter: {
                type: String
            },
            section: {
                type: String
            }
        },
        { _id: false }
    )
],

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Paper", PaperSchema);