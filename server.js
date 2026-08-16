require("dotenv").config();

const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const connectDB = require("./config/db");

const app = express();

const subjectRoutes = require("./routes/subjectRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const uploadRoutes=require("./routes/uploadRoutes");
const processRoutes = require("./routes/processRoutes");
const paperRoutes = require("./routes/paperRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const authRoutes = require("./routes/authRoutes");
const principalRoutes = require("./routes/principalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const bookRoutes = require("./routes/bookRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const userRoutes = require("./routes/userRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const timeTableRoutes = require("./routes/timeTableRoutes");
const teacherAttendanceRoutes = require("./routes/teacherAttendanceRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const marksRoutes = require("./routes/marksRoutes");
const onlineTestRoutes = require("./routes/onlineTestRoutes");
const studentTestRoutes = require("./routes/studentTestRoutes");
const studentAuthRoutes = require("./routes/studentAuthRoutes");
const feeRoutes = require("./routes/feeRoutes");
const feeStructureRoutes = require("./routes/feeStructureRoutes");
const teacherPerformanceRoutes = require("./routes/teacherPerformanceRoutes");
const studentImportRoutes = require("./routes/studentImportRoutes");
const feeReminderRoutes = require("./routes/feeReminderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const portalRoutes = require("./routes/portalRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const chatRoutes = require("./routes/chatRoutes");
const teacherSalaryRoutes = require("./routes/teacherSalaryRoutes");
const subscriptionPaymentRoutes = require("./routes/subscriptionPaymentRoutes");


connectDB();

app.use(cors());
app.use(express.json());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static("public"));

app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/paper", paperRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api/process-book", processRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/principal", principalRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/upload", express.static("upload"));
app.use("/api/teachers", teacherRoutes);
app.use("/api/timetable", timeTableRoutes);
app.use("/api/teacher-attendance",teacherAttendanceRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/online-test", onlineTestRoutes);
app.use("/api/student-test", studentTestRoutes);
app.use("/api/student-auth", studentAuthRoutes);
app.use("/api/student-response",require("./routes/studentResponseRoutes"));
app.use("/api/fees", feeRoutes);
app.use( "/api/fee-structure", feeStructureRoutes );
app.use( "/api/teacher-performance", teacherPerformanceRoutes);
app.use("/api/students", studentImportRoutes);
app.use("/api/fee-reminders", feeReminderRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/portal", portalRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/teacher-salary", teacherSalaryRoutes);
app.use("/api/subscription-payment", subscriptionPaymentRoutes);


const path = require("path");

app.use( "/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req,res)=>{
    res.redirect("/schools.html");
});
app.get("/check", (req, res) => {
    res.json({
        status: "NEW SERVER",
        time: new Date()
    });
});
const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
