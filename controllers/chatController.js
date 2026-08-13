const { getAIResponse } = require("../services/chatService");

exports.chatWithAI = async (req, res) => {

    try {

        const { message, user = {} } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }


        const reply = await getAIResponse(message, user);

        return res.json({
            success: true,
            reply
        });

    } catch (error) {

        console.error("Chat Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};