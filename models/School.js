const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({

    schoolName: {
        type: String,
        required: true
    },

    board: {
        type: String,
        default: "CBSE"
    },

    principal: String,

    examController: String,

    phone: String,

    email: String,

    website: String,

    address: String,

    city: String,

    state: String,

    pincode: String,

    logo: String,

    active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("School", schoolSchema);