const express = require("express");
const router = express.Router();

const { chatWithAI } = require("../controllers/chatController");

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat with AI
 *     description: Send a message to the AI chatbot and receive an AI-generated response. Optional user information can be provided as context.
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Message or question to send to the AI.
 *                 example: Explain the student attendance report.
 *               user:
 *                 type: object
 *                 description: Optional user context used by the AI service.
 *                 additionalProperties: true
 *                 example:
 *                   role: principal
 *                   schoolName: Delhi Public School
 *                   schoolId: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: AI response generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 reply:
 *                   type: string
 *                   example: The attendance report shows that Class 10 has an attendance rate of 94%.
 *       400:
 *         description: Message is required.
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
 *                   example: Message is required
 *       500:
 *         description: Internal server error while communicating with the AI service.
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
 *                   example: Internal Server Error
 */

router.post("/", chatWithAI);

module.exports = router;
