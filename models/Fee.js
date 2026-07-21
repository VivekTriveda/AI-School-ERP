const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
{
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    admissionNo: {
        type: String,
        required: true
    },

    rollNo: Number,

    studentName: {
        type: String,
        required: true
    },

    className: {
        type: String,
        required: true
    },

    section: {
        type: String,
        default: "A"
    },

    parentName: String,

    mobile: String,

    // Fee Details
    feeType: {
        type: String,
        enum: [
            "Tuition",
            "Transport",
            "Hostel",
            "Library",
            "Examination",
            "Computer",
            "Sports",
            "Miscellaneous"
        ],
        default: "Tuition"
    },

    month: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    totalFee: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        default: 0
    },

    fine: {
        type: Number,
        default: 0
    },

    amountPaid: {
        type: Number,
        default: 0
    },

    balance: {
        type: Number,
        default: 0
    },

    paymentMode: {
        type: String,
        enum: [
            "Cash",
            "UPI",
            "Card",
            "Bank Transfer",
            "Cheque"
        ],
        default: "Cash"
    },

    transactionId: {
        type: String,
        default: ""
    },

    paymentDate: {
        type: Date,
        default: Date.now
    },

    receiptNo: {
        type: String,
        unique: true
    },

    status: {
        type: String,
        enum: [
            "Paid",
            "Partial",
            "Unpaid"
        ],
        default: "Unpaid"
    },

    remarks: {
    type: String,
    default: ""
},

// ============================
// Payment History
// ============================

payments: [
{
    amount: {
        type: Number,
        required: true
    },

    paymentMode: {
        type: String,
        default: "Cash"
    },

    transactionId: {
        type: String,
        default: ""
    },

    paymentDate: {
        type: Date,
        default: Date.now
    },

    collectedBy: {
        type: String,
        default: "Teacher"
    }
}
],

createdBy: {
    type: String,
    default: "Teacher"
}

},
{
    timestamps: true
});

feeSchema.index(
{
    studentId: 1,
    feeType: 1,
    month: 1,
    year: 1
},
{
    unique: true
});

module.exports = mongoose.model("Fee", feeSchema);