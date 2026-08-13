/*
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

module.exports = model;

*/

const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log("Loading Gemini Utility...");
console.log("Key:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

console.log("Gemini Utility Loaded Successfully");

module.exports = model;