const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({

    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    board: {
        type: String,
        required: true
    },

    className: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true
    },

    exam: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },

    marks: [

        {

            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
                required: true
            },

            obtainedMarks: {
                type: Number,
                default: 0
            },

            remarks: {
                type: String,
                default: ""
            }

        }

    ]

}, {

    timestamps: true

});

module.exports = mongoose.model("Marks", marksSchema);