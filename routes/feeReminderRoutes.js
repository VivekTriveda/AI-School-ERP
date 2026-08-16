const express = require("express");

const router = express.Router();

const controller =
require("../controllers/feeReminderController");

/**
 * @swagger
 * /api/fee-reminder/pending:
 *   get:
 *     summary: Get pending fee records
 *     description: Retrieve fee records with Partial or Unpaid status, with optional class, section, month, year, and status filters.
 *     tags:
 *       - Fee Reminder
 *     parameters:
 *       - in: query
 *         name: className
 *         required: false
 *         description: Filter fees by class.
 *         schema:
 *           type: string
 *           example: "10"
 *       - in: query
 *         name: section
 *         required: false
 *         description: Filter fees by section.
 *         schema:
 *           type: string
 *           example: A
 *       - in: query
 *         name: month
 *         required: false
 *         description: Filter fees by month.
 *         schema:
 *           type: string
 *           example: August
 *       - in: query
 *         name: year
 *         required: false
 *         description: Filter fees by year.
 *         schema:
 *           type: integer
 *           example: 2026
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter by fee status. If omitted, Partial and Unpaid records are returned.
 *         schema:
 *           type: string
 *           example: Unpaid
 *     responses:
 *       200:
 *         description: Pending fee records retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 summary:
 *                   type: object
 *                   properties:
 *                     pendingStudents:
 *                       type: integer
 *                       example: 25
 *                     pendingAmount:
 *                       type: number
 *                       example: 125000
 *                     paidStudents:
 *                       type: integer
 *                       example: 0
 *                     reminderSent:
 *                       type: integer
 *                       example: 0
 *                 fees:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error while retrieving pending fees.
 */
router.get(
    "/pending",
    controller.getPendingFees
);

/**
 * @swagger
 * /api/fee-reminder/send/{id}:
 *   post:
 *     summary: Send a fee reminder
 *     description: Send a fee reminder notification for a specific fee record.
 *     tags:
 *       - Fee Reminder
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Fee record ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Fee reminder sent successfully.
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
 *                   example: Reminder sent successfully.
 *       404:
 *         description: Fee record not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Fee record not found
 *       500:
 *         description: Server error while sending the reminder.
 */
router.post(
    "/send/:id",
    controller.sendReminder
);

/**
 * @swagger
 * /api/fee-reminder/send-all:
 *   post:
 *     summary: Send fee reminders to all pending students
 *     description: Send fee reminder notifications to all students with Partial or Unpaid fees, with optional class, section, month, and year filters.
 *     tags:
 *       - Fee Reminder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *             properties:
 *               schoolId:
 *                 type: string
 *                 description: School ID.
 *                 example: 64f123456789abcdef123456
 *               className:
 *                 type: string
 *                 example: "10"
 *               section:
 *                 type: string
 *                 example: A
 *               month:
 *                 type: string
 *                 example: August
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       200:
 *         description: Fee reminders processed successfully.
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
 *                   example: 25 reminder(s) sent successfully.
 *                 count:
 *                   type: integer
 *                   example: 25
 *       500:
 *         description: Server error while sending reminders.
 */
router.post(
    "/send-all",
    controller.sendReminderToAll
);

module.exports = router;
