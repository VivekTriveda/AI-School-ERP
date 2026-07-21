const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema(
{
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    className: {
        type: String,
        required: true
    },

    academicYear: {
        type: String,
        required: true
    },

    admissionFee: {
        type: Number,
        default: 0
    },

    tuitionFee: {
        type: Number,
        default: 0
    },

    computerFee: {
        type: Number,
        default: 0
    },

    examinationFee: {
        type: Number,
        default: 0
    },

    libraryFee: {
        type: Number,
        default: 0
    },

    sportsFee: {
        type: Number,
        default: 0
    },

    transportFee: {
        type: Number,
        default: 0
    },

    hostelFee: {
        type: Number,
        default: 0
    },

    miscellaneousFee: {
        type: Number,
        default: 0
    },

    totalFee: {
        type: Number,
        default: 0
    }

},
{
    timestamps: true
});

module.exports = mongoose.model(
    "FeeStructure",
    feeStructureSchema
);