// services/erpService.js

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");
const Evaluation = require("../models/Evaluation");
const Marks = require("../models/Marks");
const TimeTable = require("../models/TimeTable");
const Notice = require("../models/Notice");
const OnlineTest = require("../models/OnlineTest");
const Paper = require("../models/Paper");
const Question = require("../models/Question");
const Book = require("../models/Book");
const StudentResponse = require("../models/StudentResponse");


function hasPermission(user = {}, feature) {

    const permissions = {

        admin: [
            "students",
            "teachers",
            "attendance",
            "fees",
            "results",
            "timetable",
            "notices",
            "tests",
            "papers",
            "questions",
            "books"
        ],

        principal: [
            "students",
            "teachers",
            "attendance",
            "fees",
            "results",
            "timetable",
            "notices",
            "tests",
            "papers",
            "questions",
            "books"
        ],

        teacher: [
            "students",
            "attendance",
            "results",
            "timetable",
            "notices",
            "tests",
            "papers",
            "questions",
            "fees"
        ],

        student: [
            "attendance",
            "results",
            "timetable",
            "tests",
            "notices",
            "fees"
        ]

    };

    return permissions[user.role]?.includes(feature);

}

exports.handleERPQuery = async (message, user = {}) => {

    const text = message.toLowerCase();

    // Student Count
    if (
        text.includes("student") &&
        (text.includes("count") ||
         text.includes("total") ||
         text.includes("how many"))
    ) {
        if (!hasPermission(user, "students")) {
    return "You don't have permission to view student information.";
}

return await getStudentCount(user);
    }

    // Teacher Count
    if (
        text.includes("teacher") &&
        (text.includes("count") ||
         text.includes("total") ||
         text.includes("how many"))
    ) {
        if (!hasPermission(user, "teachers")) {
    return "You don't have permission to view teacher information.";
}

return await getTeacherCount(user);
    }

    // attendance

    if (text.includes("attendance") ||
    text.includes("present") ||
    text.includes("absent")) {

    return await getAttendanceSummary(user, text);
}

// Fee Queries
if (
    text.includes("fee") ||
    text.includes("paid") ||
    text.includes("fee pending") ||
    text.includes("collection") ||
    text.includes("unpaid") ||
    text.includes("receipt") ||
    text.includes("last payment") ||
    text.includes("last paid") ||
    text.includes("balance") ||
    text.includes("due") ||
    text.includes("remaining") ||
    text.includes("outstanding") ||
    text.includes("income") ||
    text.includes("received")
)  {
    if (!hasPermission(user, "fees")) {
    return "You don't have permission to access fee information.";
}

return await getFeeSummary(user, text);
}

// Result Queries
if (
    text.includes("result") ||
    text.includes("results") ||
    text.includes("mark") ||
    text.includes("marks") ||
    text.includes("score") ||
    text.includes("percentage") ||
    text.includes("grade") ||
    text.includes("rank") ||
    text.includes("topper") ||
    text.includes("pass") ||
    text.includes("fail") ||
    text.includes("failed") ||
    text.includes("publish") ||
    text.includes("published") ||
    text.includes("exam") ||
    text.includes("subject") ||
    text.includes("pending review") ||
    text.includes("average") ||
    text.includes("performance") 
) {
    if (!hasPermission(user, "results")) {
        return "You don't have permission to access result information.";
    }

    return await getResultSummary(user, text);
}   


// Timetable Queries
if (
    text.includes("timetable") ||
    text.includes("schedule") ||
    text.includes("period")||
    text.includes("time table")

) {
    return await getTimeTableSummary(user, text);
}

// Notice Queries
if (
    text.includes("notice") ||
    text.includes("holiday") ||
    text.includes("event")
) {
    return await getLatestNotice(user);
}

// online Test 

if (
    text.includes("online test") ||
    text.includes("exam") ||
    text.includes("test") ||
    text.includes("online") ||
    text.includes("exam") ||
    text.includes("mcq")
) {
    return await getOnlineTestSummary(user, text);
}




// paper

if (
    text.includes("paper") ||
    text.includes("question paper")
) {

    if (user.role === "teacher") {
        return await getTeacherPaperSummary(user, text);
    }

    if (user.role === "principal") {
        return await getPrincipalPaperSummary(user, text);
    }

    if (user.role === "admin") {
        return await getAdminPaperSummary(user, text);
    }

    return await getPaperSummary(user, text);
}

//question Bank

if (
    text.includes("question") ||
    text.includes("question bank")
) {
    return await getQuestionSummary(user, text);
}

// book
if (
    text.includes("book") ||
    text.includes("books")
) {
    return await getBookSummary(user);
}
    return "Sorry, I couldn't understand your ERP request.";
};

async function getStudentCount(user) {

    const filter = {};

    if (user.schoolId) {
        filter.schoolId = user.schoolId;
    }

    const total = await Student.countDocuments(filter);

    return `There are ${total} students in your school.`;
}
async function getTeacherCount(user) {

    const filter = {};

    if (user.schoolId) {
        filter.schoolId = user.schoolId;
    }

    const total = await Teacher.countDocuments(filter);

    return `There are ${total} teachers in your school.`;
}
async function  getAttendanceSummary(user = {}, text =" ") {

   let targetDate = new Date();

if (text.includes("yesterday")) {
    targetDate.setDate(targetDate.getDate() - 1);
}

const date = targetDate.toISOString().split("T")[0];

    // ============================
    // STUDENT
    // ============================
    if (user.role === "student") {

        if (text.includes("percentage")) {

     const month = new Date().toISOString().slice(0, 7);

    const records = await Attendance.find({
        schoolId: user.schoolId,
        date: { $regex: "^" + month }
    });

    let present = 0;
    let absent = 0;
    let leave = 0;

    records.forEach(record => {

        const student = record.attendance.find(
            s => String(s.studentId) === String(user.userId)
        );

        if (!student) return;

        if (student.status === "Present") present++;
        else if (student.status === "Absent") absent++;
        else if (student.status === "Leave") leave++;

    });

    const total = present + absent + leave;

    const percentage =
        total > 0
            ? ((present / total) * 100).toFixed(2)
            : 0;

    return `Attendance Summary

Present : ${present}

Absent : ${absent}

Leave : ${leave}

Attendance : ${percentage}%`;
}

        if (text.includes("month")) {

    const month = new Date().toISOString().slice(0, 7);

    const records = await Attendance.find({
        schoolId: user.schoolId,
        date: { $regex: "^" + month }
    });

    let present = 0;
    let absent = 0;
    let leave = 0;

    records.forEach(record => {

        const student = record.attendance.find(
            s => String(s.studentId) === String(user.userId)
        );

        if (!student) return;

        if (student.status === "Present") present++;
        else if (student.status === "Absent") absent++;
        else if (student.status === "Leave") leave++;

    });

    const total = present + absent + leave;

    const percentage =
        total > 0
            ? ((present / total) * 100).toFixed(2)
            : 0;

    return `Attendance Summary

Present : ${present}

Absent : ${absent}

Leave : ${leave}

Attendance : ${percentage}%`;
}



        const record = await Attendance.findOne({

            

            schoolId: user.schoolId,
            date: date ,
            "attendance.studentId": user.userId

        });
       

        if (!record) {
            return "Your attendance has not been marked today.";
        }

        const student = record.attendance.find(item =>
            String(item.studentId) === String(user.userId)
        );

        if (!student) {
            return "Your attendance record was not found.";
        }

       const dayLabel = text.includes("yesterday")
    ? "Yesterday"
    : "Today";

return `Your Attendance

${dayLabel} : ${student.status}`;
    }

    // ============================
    // PRINCIPAL / ADMIN
    // ============================

    const filter = { date };

    if (user.schoolId) {
        filter.schoolId = user.schoolId;
    }

    const records = await Attendance.find(filter);

    let present = 0;
    let absent = 0;
    let leave = 0;

    records.forEach(record => {

        record.attendance.forEach(student => {

            if (student.status === "Present") present++;

            else if (student.status === "Absent") absent++;

            else if (student.status === "Leave") leave++;

        });

    });

    return `Today's Attendance

Present : ${present}
Absent : ${absent}
Leave : ${leave}`;
}



async function getFeeSummary(user = {}, text = "") {

    // =====================================
    // STUDENT FEE
    // =====================================
    if (user.role === "student") {

        const fees = await Fee.find({
            studentId: user.userId
        }).sort({
            year: -1,
            month: -1
        });

        if (!fees.length) {
            return "No fee records found.";
        }

        const totalFee = fees.reduce(
            (sum, fee) => sum + Number(fee.totalFee || 0),
            0
        );

        const totalPaid = fees.reduce(
            (sum, fee) => sum + Number(fee.amountPaid || 0),
            0
        );

        const totalPending = fees.reduce(
            (sum, fee) => sum + Number(fee.balance || 0),
            0
        );

        const latest = fees[0];
        if (
    text.includes("last payment") ||
    text.includes("last paid") ||
    text.includes("receipt")
) {

    const payment = latest.payments?.length
        ? latest.payments[latest.payments.length - 1]
        : null;

    if (!payment) {
        return "No payment history found.";
    }

    return `Last Payment

Amount : ₹${payment.amount}

Date : ${new Date(payment.paymentDate).toLocaleDateString()}

Mode : ${payment.paymentMode}

Receipt : ${latest.receiptNo}`;
}
if (
    text.includes("this month") ||
    text.includes("current month")
) {

    const now = new Date();

    const month = now.toLocaleString("default", {
        month: "long"
    });

    const year = now.getFullYear();

    const fee = fees.find(
        f => f.month === month && f.year === year
    );

    if (!fee) {
        return "No fee record found for this month.";
    }

    return `This Month Fee

Month : ${fee.month}

Total : ₹${fee.totalFee}

Paid : ₹${fee.amountPaid}

Pending : ₹${fee.balance}

Status : ${fee.status}`;
}


        return `My Fee Summary

Student : ${latest.studentName}

Total Fee : ₹${totalFee}

Paid : ₹${totalPaid}

Pending : ₹${totalPending}

Status : ${totalPending > 0 ? "Pending" : "Paid"}`;
    }

    // =====================================
    // PRINCIPAL / ADMIN
    // =====================================

    const filter = {};

    if (user.schoolId) {
        filter.schoolId = user.schoolId;
    }

    const fees = await Fee.find(filter);

    let totalCollected = 0;
    let totalPending = 0;
    let paid = 0;
    let partial = 0;
    let unpaid = 0;

    fees.forEach(fee => {

        totalCollected += Number(fee.amountPaid || 0);
        totalPending += Number(fee.balance || 0);

        if (fee.status === "Paid")
            paid++;

        else if (fee.status === "Partial")
            partial++;

        else if (fee.status === "Unpaid")
            unpaid++;

    });

    if (
    text.includes("pending") ||
    text.includes("due") ||
    text.includes("balance") ||
    text.includes("remaining") ||
    text.includes("outstanding")
) {

        return `Pending Fee

Total Pending Amount : ₹${totalPending}

Students with Pending Fee : ${partial + unpaid}`;
    }

    if (
    text.includes("collection") ||
    text.includes("collected") ||
    text.includes("income") ||
    text.includes("received")
) {

        return `Fee Collection

Total Collected : ₹${totalCollected}`;
    }

    if (text.includes("unpaid")) {

        return `There are ${unpaid} students with unpaid fees.`;
    }

    return `Fee Summary

Collected : ₹${totalCollected}

Pending : ₹${totalPending}

Paid Students : ${paid}

Partial : ${partial}

Unpaid : ${unpaid}`;
}




async function getResultSummary(user = {}, text = "") {


    console.log("Role:", user.role);
console.log("User ID:", user.userId);
console.log("School:", user.schoolId);

  // =====================================
// STUDENT RESULT
// =====================================
if (user.role === "student") {

    const student = await Student.findById(user.userId);

    if (!student) {
        return "Student not found.";
    }

    // Load all published results
    const results = await Evaluation.find({

        schoolId: student.schoolId,
        rollNo: student.rollNo,
        published: true

    }).sort({ createdAt: -1 });


    console.log("Student Results:", results.length);
    if (!results.length) {
        return "No published results found.";
    }

    // Latest Exam
    const latestExam = results[0].examName;

    // All subjects of latest exam
    const latestResults = results.filter(
        r => r.examName === latestExam
    );

    // Calculate total marks
    let totalMarks = 0;
    let obtainedMarks = 0;

    latestResults.forEach(r => {

        totalMarks += Number(r.totalMarks || 0);

        obtainedMarks += Number(
            r.finalMarks > 0
                ? r.finalMarks
                : r.obtainedMarks
        );

    });

    const percentage =
        totalMarks > 0
            ? ((obtainedMarks / totalMarks) * 100).toFixed(2)
            : 0;

    // =========================
    // Percentage
    // =========================
    if (
        text.includes("percentage") ||
        text.includes("percent")
    ) {

        return `Latest Exam Percentage

Exam : ${latestExam}

Percentage : ${percentage}%`;

    }

    // =========================
    // Grade
    // =========================
    if (text.includes("grade")) {

        let reply = `Grades (${latestExam})

`;

        latestResults.forEach(r => {

            reply += `${r.subject} : ${r.grade}\n`;

        });

        return reply;

    }

    // =========================
    // Marks
    // =========================
    if (
        text.includes("marks") ||
        text.includes("score")
    ) {

        return `Latest Exam Marks

Exam : ${latestExam}

Marks : ${obtainedMarks}/${totalMarks}`;

    }

    // =========================
    // Final Marks
    // =========================
    if (text.includes("final")) {

        return `Latest Final Result

Exam : ${latestExam}

Final Marks : ${obtainedMarks}/${totalMarks}

Percentage : ${percentage}%`;

    }

    // =========================
    // Pass / Fail
    // =========================
    if (
        text.includes("pass") ||
        text.includes("fail")
    ) {

        return `Latest Exam Result

Exam : ${latestExam}

Status : ${Number(percentage) >= 33 ? "PASS" : "FAIL"}

Percentage : ${percentage}%`;

    }

    // =========================
    // Default Result
    // =========================

    let reply = `📋 My Latest Result

Exam : ${latestExam}

`;

    latestResults.forEach(r => {

        const marks =
            r.finalMarks > 0
                ? r.finalMarks
                : r.obtainedMarks;

        reply += `${r.subject}
Marks : ${marks}/${r.totalMarks}
Grade : ${r.grade}

`;

    });

    reply += `Total Marks : ${obtainedMarks}/${totalMarks}

Percentage : ${percentage}%`;

    return reply;
}

// =====================================
// PRINCIPAL / ADMIN RESULT
// =====================================
if (
    user.role === "principal" ||
    user.role === "admin"
) {

    const results = await Evaluation.find({
        schoolId: user.schoolId,
        published: true
    });

    if (!results.length) {
        return "No published results found.";
    }

   // Pending Reviews
if (
    text.includes("pending") ||
    text.includes("review")
) {

    const pending = await Evaluation.countDocuments({
    schoolId: user.schoolId,
    teacherChecked: false
});

    if (pending === 0) {

        return `🎉 Pending Reviews

Great! You have no pending evaluations.`;

    }

    return `📝 Pending Reviews

Total Pending Papers : ${pending}

You can also ask:
• Published results
• Subject topper
• Average performance`;

}

    // Published Results
    if (
        text.includes("published") ||
        text.includes("publish")
    ) {

        return `Published Results : ${results.length}`;
    }

    // School Topper
    if (text.includes("topper")) {

        const topper = [...results]
            .sort((a, b) => b.percentage - a.percentage)[0];

        return `🏆 School Topper

Student : ${topper.studentName}

Class : ${topper.className}

Exam : ${topper.examName}

Percentage : ${topper.percentage}%`;
    }

    // Pass Percentage
    if (
        text.includes("pass percentage") ||
        text.includes("pass")
    ) {

        const passed = results.filter(
            r => Number(r.percentage) >= 33
        ).length;

        const percent =
            (
                passed / results.length * 100
            ).toFixed(2);

        return `School Pass Percentage

${percent}%`;
    }

    // Average Percentage
    if (
        text.includes("average") ||
        text.includes("performance")
    ) {

        const avg =
            (
                results.reduce(
                    (sum, r) => sum + Number(r.percentage || 0),
                    0
                ) / results.length
            ).toFixed(2);

        return `School Average Percentage

${avg}%`;
    }

    return `School Result Dashboard

Published Results : ${results.length}

Ask me:
• School topper
• Pass percentage
• Average performance
• Pending reviews
• Published results`;
}

// =====================================
// TEACHER RESULT
// =====================================
if (user.role === "teacher") {

    const teacher = await Teacher.findById(user.userId);

    if (!teacher) {
        return "Teacher not found.";
    }

    const filter = {
        schoolId: teacher.schoolId,
        published: true
    };

    if (teacher.className) {
        filter.className = teacher.className;
    }

    if (teacher.subject) {
        filter.subject = teacher.subject;
    }

    const results = await Evaluation.find(filter);

    if (!results.length) {
        return "No published results found.";
    }

    // Pending Reviews
    if (
        text.includes("pending") ||
        text.includes("review")
    ) {

        const pending = await Evaluation.countDocuments({
            schoolId: teacher.schoolId,
            teacherChecked: false
        });

        return `Pending Result Reviews : ${pending}`;
    }

    // Published Results
if (
    text.includes("published") ||
    text.includes("publish")
) {

    const exams = [...new Set(results.map(r => r.examName))];

    let reply = `📄 Published Results

Total Published Results : ${results.length}

Total Exams : ${exams.length}

Exam List

`;

    exams.forEach((exam, index) => {

        reply += `${index + 1}. ${exam}\n`;

    });

    reply += `

You can also ask:
• Subject topper
• Pending reviews
• Average performance`;

    return reply;
}

    // Subject Topper
    if (text.includes("topper")) {

        const topper = [...results]
            .sort((a, b) => b.percentage - a.percentage)[0];

        return `Subject Topper

Exam : ${topper.examName}

Student : ${topper.studentName}

Subject : ${topper.subject}

Percentage : ${topper.percentage}%`;
    }

    // Average Performance
if (
    text.includes("average") ||
    text.includes("performance")
) {

    const percentages = results.map(r => Number(r.percentage || 0));

    const avg =
        (
            percentages.reduce((a, b) => a + b, 0) /
            percentages.length
        ).toFixed(2);

    const highest = Math.max(...percentages);

    const lowest = Math.min(...percentages);

    return `📊 Class Performance

Subject : ${teacher.subject}

Students Evaluated : ${results.length}

Average Percentage : ${avg}%

Highest : ${highest}%

Lowest : ${lowest}%`;

}

    return `Teacher Result Summary

Published Results : ${results.length}

Ask me:
• Subject topper
• Pending reviews
• Average performance
• Published results`;
}

}




async function getTimeTableSummary(user = {}, text = "") {

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long"
    });

    // =====================================
    // STUDENT
    // =====================================

    if (user.role === "student") {

        const timetable = await TimeTable.find({

            schoolId: user.schoolId,
            className: user.className,
            day: today

        }).sort({ period: 1 });

        if (!timetable.length) {
            return `No timetable available for ${today}.`;
        }

        let reply = `Today's Timetable (${today})\n\n`;

        timetable.forEach(item => {

            reply += `Period ${item.period}\n`;
            reply += `${item.subject}\n`;
            reply += `${item.startTime} - ${item.endTime}\n`;
            reply += `Teacher : ${item.teacherName}\n\n`;

        });

        return reply;
    }

    // =====================================
    // TEACHER
    // =====================================

    if (user.role === "teacher") {

        const timetable = await TimeTable.find({

            teacherId: user.teacherId,
            day: today

        }).sort({ period: 1 });

        if (!timetable.length) {
            return `No classes scheduled for ${today}.`;
        }

        let reply = `Today's Schedule (${today})\n\n`;

        timetable.forEach(item => {

            reply += `Period ${item.period}\n`;
            reply += `Class : ${item.className}\n`;
            reply += `${item.subject}\n`;
            reply += `${item.startTime} - ${item.endTime}\n`;
            reply += `Room : ${item.roomNo}\n\n`;

        });

        return reply;
    }

    // =====================================
    // PRINCIPAL / ADMIN
    // =====================================

    const timetable = await TimeTable.find({

        schoolId: user.schoolId

    });

    const todayClasses = timetable.filter(
        t => t.day === today
    );

    return `Timetable Summary

Today's Classes : ${todayClasses.length}

Total Periods : ${timetable.length}`;
}


async function getLatestNotice(user = {}) {

    const filter = {
        isPublished: true
    };

    if (user.schoolId) {
        filter.schoolId = user.schoolId;
    }

    const notices = await Notice.find(filter)
        .sort({ publishDate: -1 })
        .limit(3);

    if (!notices.length) {
        return "No notices available.";
    }

    let reply = "Latest Notices\n\n";

    notices.forEach(n => {

        reply +=
`${n.title}

${n.description}

`;

    });

    return reply;
}

async function getOnlineTestSummary(user = {}, text = "") {

    // =====================================
// STUDENT
// =====================================
if (user.role === "student") {

    const student = await Student.findById(user.userId);

    if (!student) {
        return "Student not found.";
    }

    // Active tests
    const tests = await OnlineTest.find({
        schoolId: student.schoolId,
        className: student.className,
        section: student.section,
        status: "Active"
    }).sort({ createdAt: -1 });

    // Submitted responses
    const responses = await StudentResponse.find({
        studentId: student._id.toString()
    }).sort({ submittedAt: -1 });

    const submittedIds = responses.map(r => r.testId);

    const pending = tests.filter(
        t => !submittedIds.includes(t.testId)
    );

    // Available Tests
    if (
        text.includes("available") ||
        text.includes("available test")
    ) {

        return `📘 Available Online Tests

Available Tests : ${tests.length}

You can start any available test from your dashboard.`;
    }

    // Pending Tests
    if (
        text.includes("pending") ||
        text.includes("remaining")
    ) {

        return `📝 Pending Online Tests

Pending Tests : ${pending.length}`;
    }

    // Completed Tests
    if (
        text.includes("completed") ||
        text.includes("finished")
    ) {

        return `✅ Completed Online Tests

Completed Tests : ${responses.length}`;
    }

    // No submissions yet
    if (!responses.length) {

        return `Online Test Summary

Available : ${tests.length}

Pending : ${pending.length}

Completed : 0

No tests have been submitted yet.`;
    }

    // Scores
    const scores = responses.map(r => Number(r.score || 0));

    const average =
        (
            scores.reduce((a, b) => a + b, 0) /
            scores.length
        ).toFixed(2);

    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);

    const last = responses[0];

    // Last Score
    if (
        text.includes("last") ||
        text.includes("recent")
    ) {

        return `📄 Last Test Result

Test : ${last.testName || last.testId}

Score : ${last.score}

Submitted : ${new Date(last.submittedAt).toLocaleDateString()}`;
    }

    // Average Score
    if (
        text.includes("average")
    ) {

        return `📊 Average Test Score

Average Score : ${average}`;
    }

    // Highest Score
    if (
        text.includes("highest") ||
        text.includes("best")
    ) {

        return `🏆 Highest Test Score

Highest Score : ${highest}`;
    }

    // Lowest Score
    if (
        text.includes("lowest")
    ) {

        return `📉 Lowest Test Score

Lowest Score : ${lowest}`;
    }

    // Default Summary
    return `📚 Online Test Dashboard

Available Tests : ${tests.length}

Pending Tests : ${pending.length}

Completed Tests : ${responses.length}

Average Score : ${average}

Ask me:
• Available tests
• Pending tests
• Completed tests
• Last score
• Highest score
• Lowest score
• Average score`;
}

   // =====================================
// TEACHER
// =====================================
if (user.role === "teacher") {

    const teacher = await Teacher.findById(user.userId);

    if (!teacher) {
        return "Teacher not found.";
    }

    const filter = {
        schoolId: teacher.schoolId
    };

    // If your OnlineTest schema stores teacherId,
    // uncomment the next line.
    // filter.teacherId = teacher._id;

    const tests = await OnlineTest.find(filter).sort({ createdAt: -1 });

    if (!tests.length) {
        return "No online tests found.";
    }

    const active = tests.filter(t => t.status === "Active").length;
    const completed = tests.filter(t => t.status === "Completed").length;
    const draft = tests.filter(t => t.status === "Draft").length;

    const testIds = tests.map(t => t.testId);

    const responses = await StudentResponse.find({
        testId: { $in: testIds }
    });

    const submissions = responses.length;

    const scores = responses.map(r => Number(r.obtainedMarks || 0));

    const average =
        scores.length
            ? (
                scores.reduce((a,b)=>a+b,0) /
                scores.length
            ).toFixed(2)
            : 0;

    const highest =
        scores.length
            ? Math.max(...scores)
            : 0;

    const lowest =
        scores.length
            ? Math.min(...scores)
            : 0;

    // Active Tests
    if (text.includes("active")) {

        return `📘 Active Online Tests

Active Tests : ${active}`;
    }

    // Completed Tests
    if (text.includes("completed")) {

        return `✅ Completed Online Tests

Completed Tests : ${completed}`;
    }

    // Draft Tests
    if (text.includes("draft")) {

        return `📝 Draft Online Tests

Draft Tests : ${draft}`;
    }

    // Average Score
    if (text.includes("average")) {

        return `📊 Average Student Score

Average : ${average}`;
    }

    // Highest Score
    if (
        text.includes("highest") ||
        text.includes("best")
    ) {

        return `🏆 Highest Score

Highest Score : ${highest}`;
    }

    // Lowest Score
    if (text.includes("lowest")) {

        return `📉 Lowest Score

Lowest Score : ${lowest}`;
    }

    return `📚 Teacher Online Test Dashboard

Total Tests : ${tests.length}

Active : ${active}

Completed : ${completed}

Draft : ${draft}

Student Submissions : ${submissions}

Average Score : ${average}

Ask me:
• Active tests
• Completed tests
• Draft tests
• Highest score
• Lowest score
• Average score`;
}

// =====================================
// PRINCIPAL / ADMIN
// =====================================
if (user.role === "principal" || user.role === "admin") {

    const filter = {};

    if (user.schoolId) {
        filter.schoolId = user.schoolId;
    }

    const tests = await OnlineTest.find(filter).sort({ createdAt: -1 });

    if (!tests.length) {
        return "No online tests found.";
    }

    const active = tests.filter(t => t.status === "Active").length;
    const completed = tests.filter(t => t.status === "Completed").length;
    const draft = tests.filter(t => t.status === "Draft").length;

    const testIds = tests.map(t => t.testId);

    const responses = await StudentResponse.find({
        testId: { $in: testIds }
    });

    const totalAttempts = responses.length;

    const uniqueStudents = new Set(
        responses.map(r => r.studentId)
    ).size;

    const scores = responses.map(
        r => Number(r.obtainedMarks || 0)
    );

    const average =
        scores.length
            ? (
                scores.reduce((a, b) => a + b, 0) /
                scores.length
            ).toFixed(2)
            : 0;

    const highest =
        scores.length
            ? Math.max(...scores)
            : 0;

    const lowest =
        scores.length
            ? Math.min(...scores)
            : 0;

    if (text.includes("active")) {
        return `📘 Active Online Tests : ${active}`;
    }

    if (text.includes("completed")) {
        return `✅ Completed Online Tests : ${completed}`;
    }

    if (text.includes("draft")) {
        return `📝 Draft Online Tests : ${draft}`;
    }

    if (
        text.includes("attempt") ||
        text.includes("submission")
    ) {
        return `👨‍🎓 Student Attempts

Total Attempts : ${totalAttempts}

Unique Students : ${uniqueStudents}`;
    }

    if (text.includes("average")) {
        return `📊 Average Score

Average Score : ${average}`;
    }

    if (
        text.includes("highest") ||
        text.includes("best")
    ) {
        return `🏆 Highest Score

Highest Score : ${highest}`;
    }

    if (text.includes("lowest")) {
        return `📉 Lowest Score

Lowest Score : ${lowest}`;
    }

    return `📊 School Online Test Dashboard

Total Tests : ${tests.length}

Active : ${active}

Completed : ${completed}

Draft : ${draft}

Student Attempts : ${totalAttempts}

Students Appeared : ${uniqueStudents}

Average Score : ${average}

Ask me:
• Active tests
• Completed tests
• Draft tests
• Student attempts
• Average score
• Highest score
• Lowest score`;
}

}

/*

async function getPaperSummary(user = {}) {

    const filter = {};

    if (user.schoolId)
        filter.schoolId = user.schoolId;

    const papers = await Paper.find(filter)
        .sort({ createdAt: -1 });

    if (!papers.length)
        return "No generated papers found.";

    const latest = papers[0];

    return `Question Paper Summary

Total Papers : ${papers.length}

Latest Paper

${latest.subject}

Class ${latest.className}

${latest.examName}`;
}


*/

async function getPaperSummary(user = {}, text = "") {

    try {

        const filter = {};

        if (user.schoolId)
            filter.schoolId = user.schoolId;

        const papers = await Paper.find(filter)
            .sort({ createdAt: -1 });

        if (!papers.length)
            return "No generated papers found.";

        // Latest paper
        const latest = papers[0];

        // Subject wise
        if (text.includes("science")) {

            const count = await Paper.countDocuments({
                ...filter,
                subject: "Science"
            });

            return `📘 Science Papers

Total Papers : ${count}`;
        }

        if (
            text.includes("math") ||
            text.includes("mathematics")
        ) {

            const count = await Paper.countDocuments({
                ...filter,
                subject: "Mathematics"
            });

            return `📗 Mathematics Papers

Total Papers : ${count}`;
        }

        // Class wise
        const classMatch = text.match(/class\s*(\d+)/i);

        if (classMatch) {

            const cls = classMatch[1];

            const count = await Paper.countDocuments({
                ...filter,
                className: cls
            });

            return `🎓 Class ${cls}

Total Papers : ${count}`;
        }

        // Latest paper
        if (
            text.includes("latest") ||
            text.includes("recent")
        ) {

            return `📄 Latest Question Paper

Subject : ${latest.subject}

Class : ${latest.className}

Exam : ${latest.examName}

Marks : ${latest.totalMarks}

Questions : ${latest.questions.length}

Generated :
${new Date(latest.createdAt).toLocaleDateString()}`;
        }

        // Default dashboard
        return `📄 Question Paper Dashboard

Total Papers : ${papers.length}

Latest Subject : ${latest.subject}

Latest Class : ${latest.className}

Latest Exam : ${latest.examName}

Marks : ${latest.totalMarks}

Questions : ${latest.questions.length}

Ask me:
• Latest paper
• Science papers
• Mathematics papers
• Class 10 papers
• Class 12 papers`;

    }

    catch (err) {

        console.log(err);

        return "Unable to load question paper summary.";

    }

}

async function getTeacherPaperSummary(user = {}, text = "") {

    try {

        const teacher = await Teacher.findById(user.userId);
        

        if (!teacher) {
            return "Teacher not found.";
        }

        const filter = {
            schoolId: teacher.schoolId
        };

       // Subject
if (teacher.subjects && teacher.subjects.length) {
    filter.subject = teacher.subjects[0];
}

// Class
if (teacher.teacherType === "CLASS_TEACHER") {

    filter.className = teacher.classTeacherOf.className;
    filter.section = teacher.classTeacherOf.section;

}
else if (teacher.classes && teacher.classes.length) {

    filter.className = teacher.classes[0];

}

        const papers = await Paper.find(filter)
            .sort({ createdAt: -1 });

        if (!papers.length) {
            return "No question papers found.";
        }

        const latest = papers[0];
                if (
            text.includes("latest") ||
            text.includes("recent")
        ) {

            return `📄 Latest Question Paper

Subject : ${latest.subject}

Class : ${latest.className}

Section : ${latest.section || "A"}

Exam : ${latest.examName}

Marks : ${latest.totalMarks}

Questions : ${latest.questions.length}`;
        }
                if (text.includes("science")) {

            const count = await Paper.countDocuments({
                ...filter,
                subject: "Science"
            });

            return `📘 Science Papers

Total Papers : ${count}`;
        }

        if (
            text.includes("math") ||
            text.includes("mathematics")
        ) {

            const count = await Paper.countDocuments({
                ...filter,
                subject: "Mathematics"
            });

            return `📗 Mathematics Papers

Total Papers : ${count}`;
        }
                return `📄 Teacher Question Paper Dashboard

Total Papers : ${papers.length}

Subject : ${teacher.subjects?.join(", ") || "-"}

Class : ${
    teacher.teacherType === "CLASS_TEACHER"
        ? teacher.classTeacherOf.className
        : (teacher.classes?.join(", ") || "-")
}

Latest Exam : ${latest.examName}

Latest Paper : ${latest.subject}

Ask me:

• Latest paper
• Science papers
• Mathematics papers`;

    } catch (err) {

        console.log(err);

        return "Unable to load teacher question papers.";

    }

}

async function getPrincipalPaperSummary(user = {}, text = "") {

    try {

        const filter = {
            schoolId: user.schoolId
        };

        const papers = await Paper.find(filter)
            .sort({ createdAt: -1 });

        if (!papers.length) {
            return "No question papers found.";
        }

        const latest = papers[0];

        // =========================
        // Latest Paper
        // =========================

        if (
            text.includes("latest") ||
            text.includes("recent")
        ) {

            return `📄 Latest Question Paper

Subject : ${latest.subject}

Class : ${latest.className}

Section : ${latest.section || "A"}

Exam : ${latest.examName}

Marks : ${latest.totalMarks}

Questions : ${latest.questions.length}`;
        }

        // =========================
        // Science Papers
        // =========================

        if (text.includes("science")) {

            const count = await Paper.countDocuments({
                ...filter,
                subject: "Science"
            });

            return `📘 Science Papers

Total Papers : ${count}`;
        }

        // =========================
        // Mathematics Papers
        // =========================

        if (
            text.includes("math") ||
            text.includes("mathematics")
        ) {

            const count = await Paper.countDocuments({
                ...filter,
                subject: "Mathematics"
            });

            return `📗 Mathematics Papers

Total Papers : ${count}`;
        }

        // =========================
        // Class Wise
        // =========================

        const classMatch = text.match(/class\s*(\d+)/i);

        if (classMatch) {

            const cls = classMatch[1];

            const count = await Paper.countDocuments({
                ...filter,
                className: cls
            });

            return `🎓 Class ${cls}

Total Papers : ${count}`;
        }

        // =========================
        // Today's Papers
        // =========================

        if (text.includes("today")) {

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayCount = await Paper.countDocuments({
                ...filter,
                createdAt: { $gte: today }
            });

            return `📅 Today's Papers

Generated Today : ${todayCount}`;
        }

        // =========================
        // Default Dashboard
        // =========================

        return `🏫 School Question Paper Dashboard

Total Papers : ${papers.length}

Latest Subject : ${latest.subject}

Latest Class : ${latest.className}

Latest Exam : ${latest.examName}

Latest Marks : ${latest.totalMarks}

Ask me:

• Latest paper

• Science papers

• Mathematics papers

• Class 10 papers

• Class 12 papers

• Today papers`;

    }

    catch (err) {

        console.log(err);

        return "Unable to load school question papers.";

    }

}

async function getAdminPaperSummary(user = {}, text = "") {

    try {

        const papers = await Paper.find({})
            .sort({ createdAt: -1 });

        if (!papers.length) {
            return "No question papers found.";
        }

        const latest = papers[0];

        // =========================
        // Latest Paper
        // =========================
        if (
            text.includes("latest") ||
            text.includes("recent")
        ) {

            return `📄 Latest Question Paper

School : ${latest.schoolName}

Subject : ${latest.subject}

Class : ${latest.className}

Exam : ${latest.examName}

Marks : ${latest.totalMarks}`;
        }

        // =========================
        // Science Papers
        // =========================
        if (text.includes("science")) {

            const count = await Paper.countDocuments({
                subject: "Science"
            });

            return `📘 Science Papers

Total Papers : ${count}`;
        }

        // =========================
        // Mathematics Papers
        // =========================
        if (
            text.includes("math") ||
            text.includes("mathematics")
        ) {

            const count = await Paper.countDocuments({
                subject: "Mathematics"
            });

            return `📗 Mathematics Papers

Total Papers : ${count}`;
        }

        // =========================
        // Today's Papers
        // =========================
        if (text.includes("today")) {

            const today = new Date();
            today.setHours(0,0,0,0);

            const count = await Paper.countDocuments({
                createdAt: { $gte: today }
            });

            return `📅 Today's Papers

Generated Today : ${count}`;
        }

        // =========================
        // Total Schools
        // =========================
        if (text.includes("school")) {

            const schools = [
                ...new Set(
                    papers.map(p => p.schoolName)
                )
            ];

            return `🏫 School Statistics

Total Schools : ${schools.length}`;
        }

        // =========================
        // Default Dashboard
        // =========================

        const schools = [
            ...new Set(
                papers.map(p => p.schoolName)
            )
        ];

        return `🌍 Admin Question Paper Dashboard

Total Schools : ${schools.length}

Total Papers : ${papers.length}

Latest School : ${latest.schoolName}

Latest Subject : ${latest.subject}

Latest Class : ${latest.className}

Ask me:

• Latest paper

• Science papers

• Mathematics papers

• Today papers

• School statistics`;

    }

    catch (err) {

        console.log(err);

        return "Unable to load admin paper summary.";

    }

}


async function getQuestionSummary(user = {}, text = "") {

    const filter = {};

    if (user.schoolId)
        filter.schoolId = user.schoolId;

    const questions = await Question.find(filter);

    if (!questions.length)
        return "No questions available.";

    if (text.includes("science")) {

        const count = await Question.countDocuments({
            ...filter,
            subject: "Science"
        });

        return `Science Question Bank

${count} questions available.`;
    }

    if (text.includes("math")) {

        const count = await Question.countDocuments({
            ...filter,
            subject: "Mathematics"
        });

        return `Mathematics Question Bank

${count} questions available.`;
    }

    return `Question Bank

Total Questions : ${questions.length}`;
}




async function getBookSummary(user = {}) {

    const filter = {};

    if (user.schoolId)
        filter.schoolId = user.schoolId;

    const books = await Book.find(filter);

    if (!books.length)
        return "No books uploaded.";

    let totalQuestions = 0;

    books.forEach(book => {
        totalQuestions += book.totalQuestions;
    });

    return `Book Summary

Books Uploaded : ${books.length}

Questions Extracted : ${totalQuestions}`;
}

