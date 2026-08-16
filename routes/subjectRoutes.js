const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Check Subject routes
 *     description: Test endpoint to verify that Subject routes are working.
 *     tags:
 *       - Subject
 *     responses:
 *       200:
 *         description: Subject routes are working successfully
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
 *                   example: Subject Routes Working
 */

// Test Route
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Subject Routes Working"
    });
});

module.exports = router;
