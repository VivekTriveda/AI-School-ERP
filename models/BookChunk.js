const mongoose = require("mongoose");

const BookChunkSchema = new mongoose.Schema({

    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },

    chunkNumber: Number,

    text: String,

    processed: {
        type: Boolean,
        default: false
    },

    questionCount: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model("BookChunk", BookChunkSchema);