const Razorpay = require("razorpay");
const crypto = require("crypto");

const SubscriptionPayment = require("../models/SubscriptionPayment");
const School = require("../models/School");


/* =========================================================
   RAZORPAY INSTANCE
========================================================= */

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


/* =========================================================
   PLAN PRICES
========================================================= */

const PLAN_PRICES = {

    basic: 19999,

    standard: 39999,

    premium: 69999,

    "ai-enterprise": 129999,

};


/* =========================================================
   CREATE RAZORPAY ORDER
========================================================= */

exports.createOrder = async (req, res) => {

    try {

        const {
            schoolId,
            schoolName,
            plan,
            planName,
            studentCount,
            customFeatures,
            customFeatureTotal,
            studentAdjustment,
            amount,
            paymentMethod,
        } = req.body;


        /* -------------------------------------------------
           BASIC VALIDATION
        ------------------------------------------------- */

        if (!schoolId) {

            return res.status(400).json({
                success: false,
                message: "School ID is required.",
            });

        }


        if (!plan) {

            return res.status(400).json({
                success: false,
                message: "Subscription plan is required.",
            });

        }


        if (!studentCount || studentCount < 1) {

            return res.status(400).json({
                success: false,
                message: "Valid student count is required.",
            });

        }


        /* -------------------------------------------------
           VERIFY SCHOOL EXISTS
        ------------------------------------------------- */

        const school =
            await School.findById(
                schoolId
            );


        if (!school) {

            return res.status(404).json({
                success: false,
                message: "School not found.",
            });

        }


        /* -------------------------------------------------
           CALCULATE PRICE ON SERVER
           
           IMPORTANT:
           Never trust amount coming from frontend.
        ------------------------------------------------- */

        let finalAmount = 0;


        if (plan === "custom") {

            finalAmount =
                Number(customFeatureTotal || 0) +
                Number(studentAdjustment || 0);

        }

        else {

            if (
                !Object.prototype.hasOwnProperty.call(
                    PLAN_PRICES,
                    plan
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid subscription plan.",
                });

            }


            finalAmount =
                PLAN_PRICES[plan];


            /*
               First 500 students included.
               Additional students = ₹40/student/year.
            */

            if (
                Number(studentCount) > 500
            ) {

                const additionalStudents =
                    Number(studentCount) - 500;


                finalAmount +=
                    additionalStudents * 40;

            }

        }


        /* -------------------------------------------------
           SECURITY CHECK
        ------------------------------------------------- */

        if (
            !Number.isFinite(finalAmount) ||
            finalAmount <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid subscription amount.",
            });

        }


        /* -------------------------------------------------
           RAZORPAY AMOUNT
           
           Razorpay expects amount in paise.
           
           ₹39,999
           becomes
           3,999,900 paise
        ------------------------------------------------- */

        const amountInPaise =
            Math.round(
                finalAmount * 100
            );


        /* -------------------------------------------------
           CREATE RAZORPAY ORDER
        ------------------------------------------------- */

        const razorpayOrder =
            await razorpay.orders.create({

                amount:
                    amountInPaise,

                currency:
                    "INR",

                receipt:
                    `school_${schoolId}_${Date.now()}`,

                notes: {

                    schoolId:
                        String(schoolId),

                    schoolName:
                        schoolName ||
                        school.schoolName ||
                        "",

                    plan:
                        plan,

                    studentCount:
                        String(studentCount),

                },

            });


        /* -------------------------------------------------
           SAVE PAYMENT RECORD
        ------------------------------------------------- */

        const payment =
            await SubscriptionPayment.create({

                schoolId:
                    schoolId,

                schoolName:
                    schoolName ||
                    school.schoolName ||
                    "",

                plan:
                    plan,

                planName:
                    planName ||
                    plan,

                studentCount:
                    Number(studentCount),

                customFeatures:
                    customFeatures || {},

                customFeatureTotal:
                    Number(
                        customFeatureTotal || 0
                    ),

                studentAdjustment:
                    Number(
                        studentAdjustment || 0
                    ),

                amount:
                    finalAmount,

                currency:
                    "INR",

                razorpayOrderId:
                    razorpayOrder.id,

                paymentMethod:
                    paymentMethod || null,

                status:
                    "created",

            });


        /* -------------------------------------------------
           SEND ORDER TO FRONTEND
        ------------------------------------------------- */

        return res.status(200).json({

            success: true,

            message:
                "Payment order created successfully.",

            order: {

                id:
                    razorpayOrder.id,

                amount:
                    razorpayOrder.amount,

                currency:
                    razorpayOrder.currency,

            },

            paymentId:
                payment._id,

            keyId:
                process.env.RAZORPAY_KEY_ID,

        });

    }

    catch (error) {

        console.error(
            "Create Razorpay Order Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to create payment order.",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,

        });

    }

};


/* =========================================================
   VERIFY RAZORPAY PAYMENT
========================================================= */

exports.verifyPayment = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;


        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment verification details are incomplete.",

            });

        }


        /* -------------------------------------------------
           FIND PAYMENT RECORD
        ------------------------------------------------- */

        const payment =
            await SubscriptionPayment.findOne({

                razorpayOrderId:
                    razorpay_order_id,

            });


        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment order not found.",

            });

        }


        /* -------------------------------------------------
           PREVENT DUPLICATE PROCESSING
        ------------------------------------------------- */

        if (
            payment.status === "paid"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This payment has already been verified.",

            });

        }


        /* -------------------------------------------------
           CREATE SIGNATURE
           
           HMAC SHA256
        ------------------------------------------------- */

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id
                )
                .digest("hex");


        /* -------------------------------------------------
           SAFE SIGNATURE COMPARISON
        ------------------------------------------------- */

        const signaturesMatch =
            crypto.timingSafeEqual(

                Buffer.from(
                    generatedSignature,
                    "utf8"
                ),

                Buffer.from(
                    razorpay_signature,
                    "utf8"
                )

            );


        if (!signaturesMatch) {

            payment.status =
                "failed";

            await payment.save();


            return res.status(400).json({

                success: false,

                message:
                    "Payment signature verification failed.",

            });

        }


        /* -------------------------------------------------
           PAYMENT VERIFIED
        ------------------------------------------------- */

        payment.razorpayPaymentId =
            razorpay_payment_id;

        payment.razorpaySignature =
            razorpay_signature;

        payment.status =
            "paid";

        payment.paidAt =
            new Date();


        await payment.save();


        /* -------------------------------------------------
           FIND SCHOOL
        ------------------------------------------------- */

        const school =
            await School.findById(
                payment.schoolId
            );


        if (!school) {

            return res.status(404).json({

                success: false,

                message:
                    "School not found after payment verification.",

            });

        }


        /* -------------------------------------------------
           ACTIVATE SUBSCRIPTION
        ------------------------------------------------- */

        const subscriptionData = {

            package:
                payment.plan,

            plan:
                payment.plan,

            planName:
                payment.planName,

            studentCount:
                payment.studentCount,

            customFeatures:
                payment.customFeatures || {},

            amount:
                payment.amount,

            currency:
                "INR",

            status:
                "active",

            paymentId:
                razorpay_payment_id,

            orderId:
                razorpay_order_id,

            startDate:
                new Date(),

            endDate:
                new Date(
                    new Date().setFullYear(
                        new Date().getFullYear() + 1
                    )
                ),

        };


        /*
           Preserve other subscription fields
           if your School model already has them.
        */

        school.subscription =
            {
                ...(school.subscription || {}),
                ...subscriptionData,
            };


        await school.save();


        /* -------------------------------------------------
           SUCCESS
        ------------------------------------------------- */

        return res.status(200).json({

            success: true,

            message:
                "Payment verified and subscription activated successfully.",

            subscription:
                subscriptionData,

        });

    }

    catch (error) {

        console.error(
            "Verify Razorpay Payment Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to verify payment.",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,

        });

    }

};

/* =========================================================
   GET TOTAL REVENUE COLLECTED
   Only successful / verified payments are counted
   GET /api/subscription-payment/revenue
========================================================= */

exports.getRevenue = async (req, res) => {

    try {

        const result =
            await SubscriptionPayment.aggregate([

                {
                    $match: {
                        status: "paid"
                    }
                },

                {
                    $group: {

                        _id: null,

                        totalRevenue: {
                            $sum: "$amount"
                        },

                        successfulPayments: {
                            $sum: 1
                        }

                    }
                }

            ]);


        const revenue =
            result.length > 0
                ? result[0]
                : {
                    totalRevenue: 0,
                    successfulPayments: 0
                };


        return res.status(200).json({

            success: true,

            totalRevenue:
                Number(
                    revenue.totalRevenue || 0
                ),

            successfulPayments:
                Number(
                    revenue.successfulPayments || 0
                )

        });

    }
    catch (error) {

        console.error(
            "Get Subscription Revenue Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load subscription revenue."

        });

    }

};

/* =========================================================
   ADMIN PAYMENT HISTORY
   GET /api/subscription-payment/history
========================================================= */

exports.getPaymentHistory = async (req, res) => {
    try {

        const payments = await SubscriptionPayment
            .find({})
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            payments
        });

    } catch (error) {

        console.error(
            "Payment History Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load payment history."
        });

    }
};