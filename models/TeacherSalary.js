const mongoose = require("mongoose");

const teacherSalarySchema = new mongoose.Schema(
{
    schoolId:{
        type:String,
        required:true
    },

    teacherId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Teacher",
        required:true
    },

    teacherName:String,

    employeeId:String,

    month:String,

    year:Number,

    basicSalary:{
        type:Number,
        default:0
    },

    hra:{
        type:Number,
        default:0
    },

    da:{
        type:Number,
        default:0
    },

    allowance:{
        type:Number,
        default:0
    },

    bonus:{
        type:Number,
        default:0
    },

    pf:{
        type:Number,
        default:0
    },

    tax:{
        type:Number,
        default:0
    },

    deduction:{
        type:Number,
        default:0
    },

    netSalary:{
        type:Number,
        default:0
    },

    paymentMode:{
        type:String,
        default:"Cash"
    },

    paymentDate:{
        type:Date,
        default:Date.now
    },

    status:{
        type:String,
        enum:["Pending","Paid"],
        default:"Pending"
    },

    remarks:String

},
{
    timestamps:true
});

module.exports = mongoose.model(
    "TeacherSalary",
    teacherSalarySchema
);