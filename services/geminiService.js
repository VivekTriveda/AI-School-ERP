const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


console.log("API Key:", process.env.GEMINI_API_KEY?.substring(0, 10));
async function extractQuestions(pdfText, board, className, subject) {

    const prompt = `
You are an expert CBSE, ICSE and State Board examination paper setter.

Analyze ONLY the textbook content provided below.

Generate a comprehensive examination question bank from this text only.

Rules:

1. Cover every topic, heading, subheading and important point.
2. Do NOT invent information not present in the text.
3. Do NOT repeat questions.
4. Generate questions only from this chunk.
5. Return ONLY valid JSON.
6. Every MCQ must contain exactly 4 options.
7. Mix Easy, Medium and Hard questions.
8. Mix 1, 2, 3 and 5 mark questions.
9. If the text is small, generate fewer questions.
10. If the text is large, generate as many quality questions as possible.

Each question must follow this format:

{
  "question":"",
  "answer":"",
  "chapter":"",
  "marks":1,
  "difficulty":"Easy",
  "type":"MCQ",
  "options":[]
}

Return JSON only in this format:

{
  "questions":[
    {
      "question":"",
      "answer":"",
      "chapter":"",
      "marks":1,
      "difficulty":"Easy",
      "type":"MCQ",
      "options":[]
    }
  ]
}

Board: ${board}

Class: ${className}

Subject: ${subject}

Book Content:

${pdfText}
`;

   for (let attempt = 1; attempt <= 5; attempt++) {

    try {

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        return response.text;

    } catch (err) {

        const errorText = JSON.stringify(err);

        // Gemini server busy
        if (
            errorText.includes('"code":503') ||
            errorText.includes("UNAVAILABLE")
        ) {

            console.log(`Gemini busy. Retry ${attempt}/5`);

            await new Promise(resolve =>
                setTimeout(resolve, 30000)
            );

            continue;
        }

        // Rate limit
        if (
            errorText.includes('"code":429') ||
            errorText.includes("RESOURCE_EXHAUSTED")
        ) {

            console.log(`Rate limit reached. Waiting 20 seconds...`);

            await new Promise(resolve =>
                setTimeout(resolve, 30000)
            );

            continue;
        }

        throw err;
    }
}

throw new Error("Gemini failed after 5 retries.");
}

module.exports = extractQuestions;