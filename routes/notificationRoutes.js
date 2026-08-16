const express = require("express");

const router = express.Router();

const controller =
require("../controllers/notificationController");

/**
 * @swagger
 * /api/notification/student/{studentId}:
 *   get:
 *     summary: Get student notifications
 *     description: Retrieve all notifications for a student, sorted from newest to oldest. The endpoint also checks whether a monthly fee reminder should be created.
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: Student ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Student notifications retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f123456789abcdef123456
 *                       schoolId:
 *                         type: string
 *                         example: 64f123456789abcdef123456
 *                       studentId:
 *                         type: string
 *                         example: 64f123456789abcdef654321
 *                       title:
 *                         type: string
 *                         example: Monthly Fee Reminder
 *                       message:
 *                         type: string
 *                         example: Your August 2026 fee is pending.
 *                       type:
 *                         type: string
 *                         example: Fee
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Student not found.
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
 *                   example: Student not found
 *       500:
 *         description: Server error while retrieving notifications.
 */
router.get(
    "/student/:studentId",
    controller.getStudentNotifications
);

/**
 * @swagger
 * /api/notification/read/{id}:
 *   put:
 *     summary: Mark notification as read
 *     description: Mark a notification as read by setting its isRead value to true.
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Notification updated successfully.
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
 *                   example: Notification updated
 *       500:
 *         description: Server error while updating the notification.
 */
router.put(
    "/read/:id",
    controller.markAsRead
);

module.exports = router;
