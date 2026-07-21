function cleanGeminiResponse(text) {
    try {
        // Remove markdown fences
        text = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Extract only JSON
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");

        if (start === -1 || end === -1) {
            throw new Error("Gemini did not return JSON.");
        }

        text = text.substring(start, end + 1);

        // Remove invalid control characters
        text = text.replace(/[\u0000-\u001F]+/g, " ");

        return JSON.parse(text);

    } catch (err) {
        console.error("========= GEMINI RAW RESPONSE =========");
        console.error(text);
        console.error("=======================================");

        throw err;
    }
}

module.exports = cleanGeminiResponse;