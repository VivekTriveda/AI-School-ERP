/**
 * @swagger
 * tags:
 *   name: Notices
 *   description: School notice and announcement management APIs
 */

const express = require("express");
const router = express.Router();

const uploadNotice = require("../middleware/uploadNotice");
const noticeController = require("../controllers/noticeController");


/**
 * @swagger
 * /api/notices:
 *   post:
 *     summary: Create a notice
 *     description: Create and publish a school notice with an optional attachment.
 *     tags: [Notices]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: 665abc123456789012345678
 *               principalId:
 *                 type: string
 *                 example: 665def123456789012345678
 *               title:
 *                 type: string
 *                 example: Parent Teacher Meeting
 *               description:
 *                 type: string
 *                 example: Parent Teacher Meeting will be held on Saturday.
 *               category:
 *                 type: string
 *                 example: notice
 *               priority:
 *                 type: string
 *                 example: High
 *               expiryDate:
 *                 type: string
 *                 example: "2026-09-30"
 *               isTicker:
 *                 type: boolean
 *                 example: true
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Notice published successfully
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    uploadNotice.single("attachment"),
    noticeController.createNotice
);


/**
 * @swagger
 * /api/notices/school/{schoolId}:
 *   get:
 *     summary: Get school notices
 *     description: Get all notices belonging to a school, sorted by newest first.
 *     tags: [Notices]
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School MongoDB ID
 *     responses:
 *       200:
 *         description: School notices retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/school/:schoolId",
    noticeController.getSchoolNotices
);


/**
 * @swagger
 * /api/notices/{id}:
 *   put:
 *     summary: Update a notice
 *     description: Update notice information and optionally replace its attachment.
 *     tags: [Notices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notice MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: event
 *               priority:
 *                 type: string
 *                 example: Medium
 *               title:
 *                 type: string
 *                 example: Annual Sports Day
 *               description:
 *                 type: string
 *                 example: Annual sports day information.
 *               expiryDate:
 *                 type: string
 *                 example: "2026-10-15"
 *               isTicker:
 *                 type: boolean
 *                 example: false
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Notice updated successfully
 *       404:
 *         description: Notice not found
 *       500:
 *         description: Server error
 */
router.put(
    "/:id",
    uploadNotice.single("attachment"),
    noticeController.updateNotice
);


/**
 * @swagger
 * /api/notices/{id}:
 *   delete:
 *     summary: Delete a notice
 *     tags: [Notices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notice MongoDB ID
 *     responses:
 *       200:
 *         description: Notice deleted successfully
 *       404:
 *         description: Notice not found
 *       500:
 *         description: Server error
 */
router.delete(
    "/:id",
    noticeController.deleteNotice
);


module.exports = router;
