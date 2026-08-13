const intents = [

    {
        name: "attendance",
        patterns: [
            "attendance",
            "absent",
            "present",
            "leave",
            "attendance percentage",
            "attendance report",
            "miss class",
            "missed class",
            "attendance status"
        ]
    },

    {
        name: "fees",
        patterns: [
            "fee",
            "fees",
            "pending fee",
            "paid",
            "payment",
            "dues",
            "balance"
        ]
    },

    {
        name: "results",
        patterns: [
            "result",
    "results",
    "marks",
    "grade",
    "score",
    "percentage",
    "topper",
    "pending review",
    "pending reviews",
    "review",
    "published result",
    "published results",
    "publish",
    "average",
    "average performance",
    "performance",
    "pass percentage",
    "pass",
    "fail"
        ]
    },

    {
        name: "timetable",
        patterns: [
            "timetable",
            "time table",
            "schedule",
            "period",
            "next class",
            "today class"
        ]
    },

    {
        name: "homework",
        patterns: [
            "homework",
            "assignment",
            "task"
        ]
    },

    {
        name: "notice",
        patterns: [
            "notice",
            "holiday",
            "event",
            "announcement"
        ]
    },

    {
        name: "library",
        patterns: [
            "library",
            "book issue",
            "issued book",
            "return book"
        ]
    },

    {
        name: "transport",
        patterns: [
            "bus",
            "transport",
            "route",
            "driver"
        ]
    },

    {
        name: "test",
        patterns: [
            "online test",
            "mcq",
            "exam",
            "test"
        ]
    },

    {
        name: "paper",
        patterns: [
            "paper",
            "question paper"
        ]
    },


];

exports.detectIntent = (message = "") => {

    const text = message.toLowerCase();

    for (const intent of intents) {

        for (const pattern of intent.patterns) {

            if (text.includes(pattern)) {
                return intent.name;
            }

        }

    }

    return "general";

};