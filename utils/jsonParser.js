function parseGeminiJSON(text) {

    if (!text) {
        throw new Error("Empty AI response");
    }

    let cleaned = String(text);

    // Remove markdown
    cleaned = cleaned
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    // Keep only JSON block
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    // Fix Windows paths
    cleaned = cleaned.replace(/\\/g, "\\\\");

    // Remove trailing commas
    cleaned = cleaned.replace(/,\s*}/g, "}");
    cleaned = cleaned.replace(/,\s*]/g, "]");

    // Remove invisible characters
    cleaned = cleaned.replace(/[\u0000-\u001F]+/g, " ");

    console.log("========== CLEANED JSON ==========");
    console.log(cleaned);
    console.log("==================================");

    return JSON.parse(cleaned);
}

module.exports = parseGeminiJSON;