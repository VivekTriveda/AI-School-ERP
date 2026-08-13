const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    schoolId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"School",
        required:true
    },

    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },

    title:{
        type:String,
        required:true
    },

    message:{
        type:String,
        required:true
    },

    type:{
        type:String,
        enum:["Fee","Result","Exam","General"],
        default:"General"
    },

    isRead:{
        type:Boolean,
        default:false
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);