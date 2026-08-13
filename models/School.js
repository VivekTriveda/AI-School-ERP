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

    // ==========================================
    // SCHOOL PACKAGE / SUBSCRIPTION
    // ==========================================

    subscription: {

        package: {
            type: String,
            enum: [
                "basic",
                "standard",
                "premium",
                "ai-enterprise",
                "custom"
            ],
            default: "basic"
        },

        features: {

            principalDashboard: {
                type: Boolean,
                default: true
            },

            teacherDashboard: {
                type: Boolean,
                default: true
            },

            studentDashboard: {
                type: Boolean,
                default: true
            },

            attendance: {
                type: Boolean,
                default: true
            },

            fees: {
                type: Boolean,
                default: true
            },

            salary: {
                type: Boolean,
                default: false
            },

            timetable: {
                type: Boolean,
                default: false
            },

            onlineTests: {
                type: Boolean,
                default: false
            },

            questionBank: {
                type: Boolean,
                default: false
            },

            aiPaperGenerator: {
                type: Boolean,
                default: false
            },

            aiEvaluation: {
                type: Boolean,
                default: false
            },

            aiReports: {
                type: Boolean,
                default: false
            },

            aiAssistant: {
                type: Boolean,
                default: true
            },

            busTracking: {
                type: Boolean,
                default: false
            },

            qrClassroom: {
                type: Boolean,
                default: false
            }
        },

        startDate: {
            type: Date,
            default: Date.now
        },

        expiryDate: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: [
                "active",
                "expired",
                "suspended"
            ],
            default: "active"
        }

    },

    active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("School", schoolSchema);