const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    
    schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true
    },

    schoolName: {
    type: String,
    required: true
    },
    
    board:{
        type:String,
        required:true
    },

    className:{
        type:String,
        required:true
    },

    subject:{
        type:String,
        required:true
    },

    chapter:{
        type:String,
        default:"Unknown"
    },

    question:{
        type:String,
        required:true
    },

    answer:{
        type:String,
        default:""
    },

    options:[String],

    type:{
        type:String,
        default:"Short Answer"
    },

    marks:{
        type:Number,
        default:1
    },

    difficulty:{
        type:String,
        default:"Medium"
    }

},{
    timestamps:true
});

questionSchema.index({ subject: 1 });
questionSchema.index({ chapter: 1 });
questionSchema.index({ board: 1 });
questionSchema.index({ className: 1 });
questionSchema.index({ marks: 1 });

module.exports = mongoose.model("Question", questionSchema);