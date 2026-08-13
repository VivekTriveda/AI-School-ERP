
const model = require("../utils/gemini"); // use your existing Gemini service
const { handleERPQuery } = require("./erpService");



const { detectIntent } = require("./intentService");



// ERP keywords
const ERP_KEYWORDS = [

    "student",
    "teacher",

    "attendance",
    "present",
    "absent",
    "leave",

    "fee",
    "fees",
    "paid",
    "pending",

    "result",
    "marks",
    "grade",
    "percentage",

    "exam",
    "online test",
    "test",
    "mcq",

    "timetable",
    "time table",
    "schedule",
    "period",

    "notice",
    "holiday",
    "event",

    "homework",

    "library",

    "transport",

    "school",

    "paper",
    "question paper",

    "question",

    "book"
];

// Detect ERP query
function isERPQuery(message) {
    const text = message.toLowerCase();

    return ERP_KEYWORDS.some(keyword => text.includes(keyword));
}

// Main function
exports.getAIResponse = async (message, user = {}) => {


    const intent = detectIntent(message);

    switch (intent) {

        case "attendance":
            return await handleERPQuery("attendance " + message, user);

        case "fees":
            return await handleERPQuery("fees " + message, user);

        case "results":
            return await handleERPQuery("result " + message, user);

        case "timetable":
            return await handleERPQuery("timetable " + message, user);

        case "notice":
            return await handleERPQuery("notice " + message, user);

        case "homework":
            return await handleERPQuery("homework " + message, user);

        case "library":
            return await handleERPQuery("library " + message, user);

        case "transport":
            return await handleERPQuery("transport " + message, user);

        case "test":
            return await handleERPQuery("test " + message, user);

        case "paper":
            return await handleERPQuery("paper " + message, user);

        case "teacher_pending_reviews":
            return await handleERPQuery("pending reviews " + message, user);

        default:
            return await askGemini(message);

    }


    return await askGemini(message);
};

// Gemini
async function askGemini(message) {

    const result = await model.generateContent(message);

    return result.response.text();
}

// ERP
