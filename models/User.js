const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "principal", "teacher"],
        required: true
    },

    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        default: null
    },

    schoolName: {
        type: String,
        default: ""
    },

    subjects: [{
        type: String
    }],

    classes: [{
        type: String
    }],

    status: {
        type: String,
        default: "Active"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);