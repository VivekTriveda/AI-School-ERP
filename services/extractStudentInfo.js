const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const parseGeminiJSON = require("../utils/jsonParser");

exports.extractStudentInfo = async (text) => {

    try {

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `

You are reading a student's answer sheet.

Extract ONLY the following information.

Return ONLY valid JSON.

{
  "studentName":"",
  "rollNo":"",
  "className":"",
  "section":""
}

Rules:

- Do not explain.
- Do not use markdown.
- If value is missing use "".
- Roll number should contain only the roll number.

Answer Sheet:

${text}

`;

        const result = await model.generateContent(prompt);

        const response =
            result.response.text().trim();

        const json = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();


         console.log("========== GEMINI RESPONSE ==========");
         console.log(json);
         console.log("====================================");

           return parseGeminiJSON(response);
    } catch (err) {

        console.error("Student Identification Error");

        console.error(err);

        return {

            studentName: "",

            rollNo: "",

            className: "",

            section: ""

        };

    }

};