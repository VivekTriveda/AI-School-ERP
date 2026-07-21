const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({

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

    className: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    fileName: String,

    totalChunks: {
        type: Number,
        default: 0
    },

    processedChunks: {
        type: Number,
        default: 0
    },

    totalQuestions: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        default: "Uploaded"
        // Uploaded
        // Processing
        // Completed
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Book", BookSchema);