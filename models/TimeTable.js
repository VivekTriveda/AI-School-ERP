const mongoose = require("mongoose");

const timeTableSchema = new mongoose.Schema({

    schoolId: String,

    schoolName: String,

    board: String,

    className: String,

    subject: String,

    teacherName: String,

    teacherId: String,

    day: String,

    period: Number,

    startTime: String,

    endTime: String,

    roomNo: String

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "TimeTable",
    timeTableSchema
);