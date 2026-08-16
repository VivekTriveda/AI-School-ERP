const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/chapters:
 *   get:
 *     summary: Check Chapter routes
 *     description: Test endpoint to verify that Chapter routes are working.
 *     tags:
 *       - Chapter
 *     responses:
 *       200:
 *         description: Chapter routes are working successfully
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
 *                   example: Chapter Routes Working
 */

// Test Route
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Chapter Routes Working"
    });
});

module.exports = router;
