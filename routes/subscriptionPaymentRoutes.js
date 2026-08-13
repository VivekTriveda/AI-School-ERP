const express = require("express");

const router = express.Router();

const {
    createOrder,
    verifyPayment,
    getRevenue,
    getPaymentHistory
} = require("../controllers/subscriptionPaymentController");


/* =========================================================
   CREATE RAZORPAY ORDER
   POST /api/subscription-payment/create-order
========================================================= */

router.post(
    "/create-order",
    createOrder
);


/* =========================================================
   VERIFY RAZORPAY PAYMENT
   POST /api/subscription-payment/verify-payment
========================================================= */

router.post(
    "/verify-payment",
    verifyPayment
);

/* =========================================================
   GET SUBSCRIPTION REVENUE
   GET /api/subscription-payment/revenue
========================================================= */

router.get(
    "/revenue",
    getRevenue
);

/* =========================================================
   ADMIN PAYMENT HISTORY
   GET /api/subscription-payment/history
========================================================= */

router.get(
    "/history",
    getPaymentHistory
);

module.exports = router;