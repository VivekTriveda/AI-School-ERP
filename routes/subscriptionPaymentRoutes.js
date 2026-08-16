const express = require("express");

const router = express.Router();

const {
    createOrder,
    verifyPayment,
    getRevenue,
    getPaymentHistory
} = require("../controllers/subscriptionPaymentController");

/**
 * @swagger
 * /api/subscription-payment/create-order:
 *   post:
 *     summary: Create a subscription payment order
 *     description: Create a Razorpay payment order for a school subscription. The subscription amount is calculated on the server based on the selected plan and student count.
 *     tags:
 *       - Subscription Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - plan
 *               - studentCount
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               schoolName:
 *                 type: string
 *                 example: Delhi Public School
 *               plan:
 *                 type: string
 *                 description: Subscription plan.
 *                 example: standard
 *               planName:
 *                 type: string
 *                 example: Standard Plan
 *               studentCount:
 *                 type: integer
 *                 minimum: 1
 *                 example: 750
 *               customFeatures:
 *                 type: object
 *                 additionalProperties: true
 *                 description: Custom subscription features when using a custom plan.
 *               customFeatureTotal:
 *                 type: number
 *                 example: 5000
 *               studentAdjustment:
 *                 type: number
 *                 example: 4000
 *               amount:
 *                 type: number
 *                 description: Frontend amount is accepted but the server calculates the final subscription amount independently.
 *                 example: 39999
 *               paymentMethod:
 *                 type: string
 *                 example: razorpay
 *     responses:
 *       200:
 *         description: Payment order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment order created successfully.
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: order_Rzp123456789
 *                     amount:
 *                       type: integer
 *                       description: Razorpay amount in paise.
 *                       example: 3999900
 *                     currency:
 *                       type: string
 *                       example: INR
 *                 paymentId:
 *                   type: string
 *                   example: 64f123456789abcdef654321
 *                 keyId:
 *                   type: string
 *                   example: rzp_test_xxxxxxxxx
 *       400:
 *         description: Invalid or missing subscription information.
 *       404:
 *         description: School not found.
 *       500:
 *         description: Unable to create payment order.
 */
router.post(
    "/create-order",
    createOrder
);

/**
 * @swagger
 * /api/subscription-payment/verify-payment:
 *   post:
 *     summary: Verify a subscription payment
 *     description: Verify a Razorpay payment signature and activate the school's subscription after successful verification.
 *     tags:
 *       - Subscription Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_order_id
 *               - razorpay_payment_id
 *               - razorpay_signature
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *                 example: order_Rzp123456789
 *               razorpay_payment_id:
 *                 type: string
 *                 example: pay_Rzp123456789
 *               razorpay_signature:
 *                 type: string
 *                 example: generated_razorpay_signature
 *     responses:
 *       200:
 *         description: Payment verified and subscription activated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment verified and subscription activated successfully.
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     package:
 *                       type: string
 *                       example: standard
 *                     plan:
 *                       type: string
 *                       example: standard
 *                     planName:
 *                       type: string
 *                       example: Standard Plan
 *                     studentCount:
 *                       type: integer
 *                       example: 750
 *                     customFeatures:
 *                       type: object
 *                       additionalProperties: true
 *                     amount:
 *                       type: number
 *                       example: 49999
 *                     currency:
 *                       type: string
 *                       example: INR
 *                     status:
 *                       type: string
 *                       example: active
 *                     paymentId:
 *                       type: string
 *                       example: pay_Rzp123456789
 *                     orderId:
 *                       type: string
 *                       example: order_Rzp123456789
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Incomplete verification details, duplicate verification, or invalid payment signature.
 *       404:
 *         description: Payment order or school not found.
 *       500:
 *         description: Unable to verify payment.
 */
router.post(
    "/verify-payment",
    verifyPayment
);

/**
 * @swagger
 * /api/subscription-payment/revenue:
 *   get:
 *     summary: Get subscription revenue
 *     description: Get total revenue and number of successful subscription payments. Only payments with paid status are included.
 *     tags:
 *       - Subscription Payment
 *     responses:
 *       200:
 *         description: Subscription revenue retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalRevenue:
 *                   type: number
 *                   example: 1250000
 *                 successfulPayments:
 *                   type: integer
 *                   example: 32
 *       500:
 *         description: Unable to load subscription revenue.
 */
router.get(
    "/revenue",
    getRevenue
);

/**
 * @swagger
 * /api/subscription-payment/history:
 *   get:
 *     summary: Get subscription payment history
 *     description: Retrieve all subscription payment records, sorted from newest to oldest.
 *     tags:
 *       - Subscription Payment
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payments:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Unable to load payment history.
 */
router.get(
    "/history",
    getPaymentHistory
);

module.exports = router;
