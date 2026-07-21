const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.evaluateQuestion = async (question, studentAnswer) => {

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    const prompt = `
You are an experienced CBSE examiner.

Evaluate ONLY ONE QUESTION.

Question:
${question.question}

Correct Answer:
${question.answer}

Student Answer:
${studentAnswer || "No Answer"}

Maximum Marks:
${question.marks}

Rules:

1. MCQ
- Exact option = Full marks
- Wrong option = 0

2. Subjective
- Give partial marks if deserved.

Return ONLY JSON.

{
    "obtainedMarks": 0,
    "status":"Wrong",
    "feedback":"Incorrect answer."
}
`;

    const response = await model.generateContent(prompt);

    const text = response.response.text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(text);
};