const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

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

    date: {
        type: String,
        required: true
    },

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },

    attendance: [

        {

            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
                required: true
            },

            status: {
                type: String,
                enum: ["Present", "Absent", "Leave"],
                default: "Present"
            }

        }

    ]

}, {

    timestamps: true

});

module.exports = mongoose.model("Attendance", attendanceSchema);