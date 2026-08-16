const express = require("express");

const router = express.Router();

const feeController = require("../controllers/feeController");


/**
 * @swagger
 * tags:
 *   name: Fees
 *   description: School fee management and reporting APIs
 */


/**
 * @swagger
 * /api/fees/create:
 *   post:
 *     summary: Create or update a fee payment
 *     tags: [Fees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - feeType
 *               - month
 *               - year
 *               - totalFee
 *               - amountPaid
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: 665abc123456789012345678
 *               feeType:
 *                 type: string
 *                 example: Tuition
 *               month:
 *                 type: string
 *                 example: "08"
 *               year:
 *                 type: integer
 *                 example: 2026
 *               totalFee:
 *                 type: number
 *                 example: 5000
 *               discount:
 *                 type: number
 *                 example: 500
 *               fine:
 *                 type: number
 *                 example: 0
 *               amountPaid:
 *                 type: number
 *                 example: 4500
 *               paymentMode:
 *                 type: string
 *                 example: Online
 *               transactionId:
 *                 type: string
 *                 example: TXN123456789
 *               remarks:
 *                 type: string
 *                 example: August tuition fee
 *     responses:
 *       200:
 *         description: Fee collected successfully
 *       404:
 *         description: Student not found
 *       400:
 *         description: Invalid payment or fee already paid
 *       500:
 *         description: Server error
 */
router.post("/create", feeController.createFee);


/**
 * @swagger
 * /api/fees/dashboard:
 *   get:
 *     summary: Get fee dashboard
 *     description: Get today's collection, monthly collection, pending fees and paid student count for a school.
 *     tags: [Fees]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: Fee dashboard data
 *       500:
 *         description: Server error
 */
router.get("/dashboard", feeController.getDashboard);


/**
 * @swagger
 * /api/fees/admin/dashboard:
 *   get:
 *     summary: Get admin fee dashboard
 *     description: Get fee statistics across all schools.
 *     tags: [Fees]
 *     responses:
 *       200:
 *         description: Admin fee dashboard
 *       500:
 *         description: Server error
 */
router.get(
    "/admin/dashboard",
    feeController.getAdminDashboard
);


/**
 * @swagger
 * /api/fees/admin/schools:
 *   get:
 *     summary: Get admin school fee report
 *     description: Get fee collection and pending amounts grouped by school.
 *     tags: [Fees]
 *     responses:
 *       200:
 *         description: School fee report
 *       500:
 *         description: Server error
 */
router.get(
    "/admin/schools",
    feeController.getAdminSchoolReport
);


/**
 * @swagger
 * /api/fees/admin/school/{schoolId}:
 *   get:
 *     summary: Get fee details for one school
 *     tags: [Fees]
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School fee details
 *       500:
 *         description: Server error
 */
router.get(
    "/admin/school/:schoolId",
    feeController.getAdminSchoolDetails
);


/**
 * @swagger
 * /api/fees/principal/dashboard:
 *   get:
 *     summary: Get principal fee dashboard
 *     tags: [Fees]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: className
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: section
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Principal fee dashboard
 *       500:
 *         description: Server error
 */
router.get(
    "/principal/dashboard",
    feeController.getPrincipalDashboard
);


/**
 * @swagger
 * /api/fees/principal/list:
 *   get:
 *     summary: Get principal fee list
 *     tags: [Fees]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: className
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: section
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         example: Paid
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Principal fee list
 *       500:
 *         description: Server error
 */
router.get(
    "/principal/list",
    feeController.getPrincipalFeeList
);


/**
 * @swagger
 * /api/fees/principal/student/{studentId}:
 *   get:
 *     summary: Get student fee details for principal
 *     tags: [Fees]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student MongoDB ID
 *     responses:
 *       200:
 *         description: Student fee history
 *       500:
 *         description: Server error
 */
router.get(
    "/principal/student/:studentId",
    feeController.getPrincipalStudentFee
);


/**
 * @swagger
 * /api/fees/all:
 *   get:
 *     summary: Get all fees of a school
 *     tags: [Fees]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: All fee records for the school
 *       500:
 *         description: Server error
 */
router.get(
    "/all",
    feeController.getAllFees
);


/**
 * @swagger
 * /api/fees/current:
 *   get:
 *     summary: Get current month fee
 *     tags: [Fees]
 *     parameters:
 *       - in: query
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         example: "08"
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *       - in: query
 *         name: feeType
 *         required: false
 *         schema:
 *           type: string
 *           default: Tuition
 *         example: Tuition
 *     responses:
 *       200:
 *         description: Current fee record
 *       500:
 *         description: Server error
 */
router.get(
    "/current",
    feeController.getCurrentFee
);


/**
 * @swagger
 * /api/fees/student/{studentId}:
 *   get:
 *     summary: Get student fee history
 *     tags: [Fees]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student MongoDB ID
 *     responses:
 *       200:
 *         description: Student fee history
 *       500:
 *         description: Server error
 */
router.get(
    "/student/:studentId",
    feeController.getStudentFees
);


/**
 * @swagger
 * /api/fees/receipt/{id}:
 *   get:
 *     summary: Get fee receipt
 *     tags: [Fees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Fee record MongoDB ID
 *     responses:
 *       200:
 *         description: Fee receipt
 *       404:
 *         description: Receipt not found
 *       500:
 *         description: Server error
 */
router.get(
    "/receipt/:id",
    feeController.getFeeById
);


/**
 * @swagger
 * /api/fees/{id}:
 *   delete:
 *     summary: Delete fee record
 *     tags: [Fees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Fee record MongoDB ID
 *     responses:
 *       200:
 *         description: Fee deleted successfully
 *       500:
 *         description: Server error
 */
router.delete(
    "/:id",
    feeController.deleteFee
);


module.exports = router;
