const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
{
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    schoolName: {
        type: String,
        required: true
    },
    
    board: {
    type: String,
    required: true
    },
    
    teacherName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        default: ""
    },

    subjects: [{
        type: String
    }],

    classes: [{
        type: String
    }],
    teacherType: {
    type: String,
    enum: ["CLASS_TEACHER", "SUBJECT_TEACHER"],
    default: "SUBJECT_TEACHER"
},

classTeacherOf: {
    board: {
        type: String,
        default: ""
    },

    className: {
        type: String,
        default: ""
    },

    section: {
        type: String,
        default: ""
    }
},

    status: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Teacher", teacherSchema);