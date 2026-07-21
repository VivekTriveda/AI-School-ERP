const mongoose = require("mongoose");

const teacherAttendanceSchema = new mongoose.Schema({

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },

    teacherName: {
        type: String,
        required: true
    },
    
    subjects: [

    String

],

classes: [

    String

],

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

    date: {
        type: String,
        required: true
    },

    checkIn: {
        type: String,
        default: ""
    },

    status: {
    type: String,
    enum: [
        "Present",
        "Late",
        "Half Day",
        "CL",
        "EL",
        "SL",
        "Absent"
    ],
    default: "Present"
},

checkOut: {
    type: String,
    default: ""
},

reason: {
    type: String,
    default: ""
},

approvalStatus: {
    type: String,
    enum: [
        "Pending",
        "Approved",
        "Rejected"
    ],
    default: "Approved"
},

approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Principal"
},

remarks: {
    type: String,
    default: ""
}

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "TeacherAttendance",
    teacherAttendanceSchema
);