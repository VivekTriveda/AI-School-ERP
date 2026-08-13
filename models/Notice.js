const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({

    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        enum: [
            "notice",
            "admission",
            "tender",
            "event",
            "holiday"
        ],
        default: "notice"
    },

    priority: {
        type: String,
        enum: [
            "normal",
            "important",
            "urgent"
        ],
        default: "normal"
    },

    attachment: {
        type: String,
        default: ""
    },

    publishDate: {
        type: Date,
        default: Date.now
    },

    expiryDate: {
        type: Date
    },
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Principal",
    required: true
},

status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "published"
},

isTicker: {
    type: Boolean,
    default: true
},

    isPublished: {
        type: Boolean,
        default: true
    },
    

}, {
    timestamps: true
});

module.exports = mongoose.model("Notice", noticeSchema);