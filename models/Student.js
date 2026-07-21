const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
{
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },
   
    admissionNo: {
        type: String,
        required: true
    },

    rollNo: {
        type: Number,
        required: true
    },

    studentName: {
        type: String,
        required: true,
        trim: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Male"
    },

    dob: Date,

    className: {
        type: String,
        required: true
    },

    section: {
        type: String,
        default: "A"
    },

    parentName: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true
    },

    email: {
        type: String,
        default: ""
    },
    
    username: {
    type: String,
    unique: true,
    sparse: true
},

password: {
    type: String
},

role: {
    type: String,
    default: "student"
},

lastLogin: Date,

loginStatus: {
    type: Boolean,
    default: false
},

    address: {
        type: String,
        default: ""
    },

    photo: {
        type: String,
        default: "/images/default-student.png"
    },

    attendance: {
        type: Number,
        default: 100
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Student", studentSchema);