const { GoogleGenerativeAI } = require("@google/generative-ai");
const parseGeminiJSON = require("../utils/jsonParser");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ======================================
// Clean OCR Text using Gemini
// ======================================

async function cleanOCRText(rawText) {

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    

    const prompt = `
You are an OCR correction expert.

The following text was extracted from a student's handwritten answer sheet.

Your job is ONLY to correct OCR mistakes.

Rules:

1. Fix spelling mistakes caused by OCR.
2. Fix broken words.
3. Fix missing spaces.
4. Do NOT rewrite the student's answer.
5. Do NOT add new information.
6. Keep the original meaning exactly.
7. Return ONLY the corrected text.

OCR TEXT:

${rawText}
`;

   let result;

const maxRetries = 3;

for (let attempt = 1; attempt <= maxRetries; attempt++) {

    try {

        result = await model.generateContent(prompt);
        break;

    } catch (err) {

        if (
            err.status === 503 &&
            attempt < maxRetries
        ) {

            console.log(
                `Gemini busy. Retrying (${attempt}/${maxRetries})...`
            );

            await new Promise(resolve =>
                setTimeout(resolve, 3000)
            );

            continue;
        }

        throw err;
    }

}

    return result.response.text().trim();

}

exports.evaluateWithAI = async (paper, studentAnswers) => {

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });
    // Ensure every result has required fields
// Clean OCR before evaluation

// const cleanedAnswer = await cleanOCRText(studentAnswers);
const cleanedAnswer = studentAnswers;

console.log("===== CLEAN OCR TEXT =====");
console.log(cleanedAnswer);
console.log("==========================");

    const prompt = `
You are an experienced CBSE examiner.

Evaluate the student's answer sheet.

=========================
QUESTION PAPER
=========================

${JSON.stringify(paper.questions, null, 2)}

=========================
STUDENT ANSWERS
=========================

${cleanedAnswer}

=========================
INSTRUCTIONS
=========================
You are an experienced CBSE examiner.

The student's answer sheet was extracted using OCR.

IMPORTANT:

The OCR may contain spelling mistakes, broken words, missing letters and formatting errors.

Do NOT deduct marks because of OCR mistakes.

------------------------------------------------
STEP 1
------------------------------------------------


IMPORTANT EVALUATION RULES

1. Evaluate the student's understanding, not exact wording.

2. Accept synonyms and equivalent explanations.

3. Do not deduct marks if the meaning is correct.

4. Ignore minor grammar and spelling mistakes.

5. Award partial marks for partially correct answers.

6. If the answer contains all key concepts but uses different wording, award full marks.

7. Evaluate like an experienced CBSE examiner, not like a keyword-matching system.

------------------------------------------------
STEP 2
------------------------------------------------

Read the student's complete answer sheet.

Identify every answer.

Match each answer with the correct question.

Students may:

- skip questions
- answer in a different order
- continue answers on another page
- write only question numbers like 1,2,3
- write Q1/Q2
- write Answer 1

Match intelligently.

------------------------------------------------
STEP 3
------------------------------------------------

Understand the intended meaning.

Correct OCR mistakes mentally.

Do not change the student's knowledge.

------------------------------------------------
STEP 4
------------------------------------------------

Evaluate each matched answer.

Award partial marks whenever appropriate.

------------------------------------------------
QUESTION PAPER

${JSON.stringify(paper.questions,null,2)}

------------------------------------------------
STUDENT ANSWERS

${studentAnswers}

------------------------------------------------
RETURN ONLY JSON

{
  "totalObtained":0,
  "totalMarks":0,
  "percentage":0,
  "grade":"",

  "results":[
      {
          "questionId":"",
          "studentAnswer":"",
          "correctAnswer":"",
          "obtainedMarks":0,
          "maxMarks":0,
          "status":"",
          "feedback":""
      }
  ]
}
`;

  let result;

const maxRetries = 3;

for (let attempt = 1; attempt <= maxRetries; attempt++) {

    try {

        result = await model.generateContent(prompt);
        break;

    } catch (err) {

        if (
            err.status === 503 &&
            attempt < maxRetries
        ) {

            console.log(
                `Gemini busy. Retrying (${attempt}/${maxRetries})...`
            );

            await new Promise(resolve =>
                setTimeout(resolve, 3000)
            );

            continue;
        }

        throw err;
    }

}

const text = result.response.text();

console.log("===== GEMINI RESPONSE =====");
console.log(text);
console.log("===========================");

let cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

// Remove everything before first {
const firstBrace = cleaned.indexOf("{");

if (firstBrace !== -1) {
    cleaned = cleaned.substring(firstBrace);
}

// Remove everything after last }
const lastBrace = cleaned.lastIndexOf("}");

if (lastBrace !== -1) {
    cleaned = cleaned.substring(0, lastBrace + 1);
}

console.log("===== CLEANED JSON =====");
console.log(cleaned);
console.log("========================");

const aiResult = parseGeminiJSON(text);

console.log("========== AI RESULTS ==========");
aiResult.results.forEach((q, i) => {
    console.log(
        `Q${i + 1}:`,
        "obtainedMarks =", q.obtainedMarks,
        "maxMarks =", q.maxMarks,
        "status =", q.status,
        "feedback =", q.feedback
    );
});
console.log("===============================");

// Ensure every result has required fields
aiResult.results = (aiResult.results || []).map(q => ({
    ...q,
    obtainedMarks: Number(q.obtainedMarks ?? 0),
    maxMarks: Number(q.maxMarks ?? 0),
    status:
        q.status ||
        (Number(q.obtainedMarks ?? 0) === Number(q.maxMarks ?? 0)
            ? "Correct"
            : Number(q.obtainedMarks ?? 0) > 0
                ? "Partial"
                : "Wrong"),
    feedback: q.feedback || ""
}));

return aiResult;    
};