const express = require("express");
const router = express.Router();

const {
    getSettings,
    saveSettings
} = require("../controllers/settingsController");

/**
 * @swagger
 * /api/settings/{id}:
 *   get:
 *     summary: Get school settings
 *     description: Retrieve the settings and details of a school using its school ID.
 *     tags:
 *       - Settings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the school.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: School settings retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 school:
 *                   type: object
 *                   description: School settings and details.
 *       404:
 *         description: School not found.
 *       500:
 *         description: Server error while retrieving school settings.
 *
 *   put:
 *     summary: Update school settings
 *     description: Update school settings and details using the school ID.
 *     tags:
 *       - Settings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the school.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             description: School settings fields to update.
 *     responses:
 *       200:
 *         description: Settings updated successfully.
 *       500:
 *         description: Server error while updating school settings.
 */

router.get("/:id", getSettings);

router.put("/:id", saveSettings);

module.exports = router;
