const mongoose = require("mongoose");

const principalSchema = new mongoose.Schema(
{
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    schoolName: {
        type: String,
        required: true
    },

    principalName: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    mobile: String,

    email: String,

    status: {
        type: String,
        default: "Active"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Principal", principalSchema);