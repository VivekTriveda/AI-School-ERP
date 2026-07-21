const mongoose = require("mongoose");

const BookChapterSchema = new mongoose.Schema({

    schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School"
    },

    schoolName: String,
    
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },

    chapterNo: Number,

    chapterName: {
        type: String,
        default: ""
    },

    text: String,

    processed: {
        type: Boolean,
        default: false
    },

    questionCount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        default: "Pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("BookChapter", BookChapterSchema);