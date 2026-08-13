const Principal = require("../models/Principal");
const bcrypt = require("bcryptjs");
const School = require("../models/School");
const Evaluation = require("../models/Evaluation");


// =======================
// Register Principal
// =======================
exports.registerPrincipal = async (req, res) => {
    try {

        const {
            schoolId,
            schoolName,
            principalName,
            username,
            password,
            mobile,
            email
        } = req.body;

        // Check existing username
        const existing = await Principal.findOne({ username });

        if (existing) {
            return res.json({
                success: false,
                message: "Username already exists"
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        const principal = await Principal.create({
            schoolId,
            schoolName,
            principalName,
            username,
            password: hashedPassword,
            mobile,
            email
        });

        res.json({
            success: true,
            message: "Principal created successfully",
            principal
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// =======================
// Principal Login
// =======================
exports.loginPrincipal = async (req, res) => {

   
    try {

        const { username, password } = req.body;



const principal = await Principal.findOne({
    username: username.trim()
});



const allUsers = await Principal.find();



        if (!principal) {
            return res.json({
                success: false,
                message: "Invalid Username"
            });
        }

        const match = await bcrypt.compare(password, principal.password);

        if (!match) {
            return res.json({
                success: false,
                message: "Invalid Password"
            });
        }

       const school = await School.findById(principal.schoolId);

res.json({
    success: true,
    role: "principal",
    principal,
    school
});
  
    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
// =======================
// Principal Dashboard Analytics
// =======================
exports.dashboardAnalytics = async (req, res) => {

    try {

        const { schoolId } = req.params;

        const results = await Evaluation.find({

            schoolId,
            published: true

        });

        let totalPublished = results.length;

        let passCount = 0;
        let failCount = 0;

        let totalPercentage = 0;

        let highestMarks = 0;
        let lowestMarks = 0;

        if (results.length > 0) {

            lowestMarks = Number(results[0].obtainedMarks || 0);

        }

        // =====================================
        // Overall Analytics
        // =====================================

        results.forEach(result => {

            const marks = Number(result.obtainedMarks || 0);

            const percentage = Number(result.percentage || 0);

            totalPercentage += percentage;

            if (marks > highestMarks)
                highestMarks = marks;

            if (marks < lowestMarks)
                lowestMarks = marks;

            if (percentage >= 40)
                passCount++;
            else
                failCount++;

        });

        const averagePercentage =

            totalPublished > 0

                ? (totalPercentage / totalPublished).toFixed(2)

                : 0;

        const passPercentage =

            totalPublished > 0

                ? ((passCount * 100) / totalPublished).toFixed(2)

                : 0;

        // =====================================
        // Top Students
        // =====================================

        const topStudents = [...results]

            .sort((a, b) =>

                Number(b.percentage || 0) -

                Number(a.percentage || 0)

            )

            .slice(0, 10)

            .map((r, index) => ({

                rank: index + 1,

                studentName:

                    r.studentName ||

                    r.name ||

                    "Student",

                className:

                    r.className ||

                    "-",

                percentage:

                    Number(r.percentage || 0)

            }));

        // =====================================
        // Class Performance
        // =====================================

        const classMap = {};

        results.forEach(r => {

            const cls = r.className || "Unknown";

            if (!classMap[cls]) {

                classMap[cls] = {

                    total: 0,

                    pass: 0,

                    percentage: 0

                };

            }

            classMap[cls].total++;

            classMap[cls].percentage +=

                Number(r.percentage || 0);

            if (Number(r.percentage || 0) >= 40)

                classMap[cls].pass++;

        });

        const classPerformance = [];

        Object.keys(classMap).forEach(cls => {

            const c = classMap[cls];

            classPerformance.push({

                className: cls,

                average:

                    (c.percentage / c.total).toFixed(1),

                passPercentage:

                    ((c.pass * 100) / c.total).toFixed(1)

            });

        });

        // =====================================
        // Response
        // =====================================

        res.json({

            success: true,

            analytics: {

                totalPublished,

                passCount,

                failCount,

                passPercentage,

                averagePercentage,

                highestMarks,

                lowestMarks,

                topStudents,

                classPerformance

            }

        });

    }

    catch (err) {

        console.error("Dashboard Analytics Error:");

        console.error(err);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};