const mongoose = require("mongoose");

const subscriptionPaymentSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: true,
        },

        schoolName: {
            type: String,
            required: true,
            trim: true,
        },

        plan: {
            type: String,
            enum: [
                "basic",
                "standard",
                "premium",
                "ai-enterprise",
                "custom",
            ],
            required: true,
        },

        planName: {
            type: String,
            required: true,
        },

        studentCount: {
            type: Number,
            required: true,
            min: 1,
        },

        customFeatures: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        customFeatureTotal: {
            type: Number,
            default: 0,
        },

        studentAdjustment: {
            type: Number,
            default: 0,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "INR",
        },

        razorpayOrderId: {
            type: String,
            default: null,
        },

        razorpayPaymentId: {
            type: String,
            default: null,
        },

        razorpaySignature: {
            type: String,
            default: null,
        },

        paymentMethod: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: [
                "created",
                "pending",
                "paid",
                "failed",
                "cancelled",
            ],
            default: "created",
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);


module.exports =
    mongoose.model(
        "SubscriptionPayment",
        subscriptionPaymentSchema
    );