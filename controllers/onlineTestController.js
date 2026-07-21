const OnlineTest = require("../models/OnlineTest");
const StudentResponse = require("../models/StudentResponse");

const questionsPath = OnlineTest.schema.path("questions");

if (questionsPath.caster) {
    console.log("Caster Instance:", questionsPath.caster.instance);
    console.log("Caster Options:", questionsPath.caster.options);
}
const QuestionPaper = require("../models/Paper");

exports.createOnlineTest = async (req, res) => {
    try {

        const { paperId } = req.body;

        if (!paperId) {
            return res.status(400).json({
                success: false,
                message: "paperId is required"
            });
        }

        // Check whether the paper exists
        const paper = await QuestionPaper.findOne({ paperId }).lean();
        

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Question paper not found"
            });
        }

        // Prevent duplicate online tests
        const existing = await OnlineTest.findOne({ paperId });

        if (existing) {
            return res.json({
                success: true,
                alreadyCreated: true,
                testId: existing.testId,
                link: `/student-test.html?testId=${existing.testId}`
            });
        }

        // Generate unique Test ID
        const testId =
            "TEST-" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 1000);

            let duration = paper.duration;

     if (typeof duration === "string") {

    if (duration.toLowerCase().includes("hour")) {

        duration = parseInt(duration) * 60;

    }

    else if (duration.toLowerCase().includes("minute")) {

        duration = parseInt(duration);

    }

    else {

        duration = Number(duration);

    }

}

        const onlineTest = new OnlineTest({

            testId,

            paperId,

            schoolId: paper.schoolId,

            schoolName: paper.schoolName,

            board: paper.board,

            className: paper.className,

            section: paper.section,

            subject: paper.subject,

            examName: paper.examName,

            duration: paper.duration,

            totalMarks: paper.totalMarks,

            createdBy: paper.createdBy,

           questions: JSON.parse(JSON.stringify(paper.questions)),

            status: "Active"

        });

        await onlineTest.save();

        return res.json({

            success: true,

            message: "Online Test Created",

            testId,

            link: `/student-test.html?testId=${testId}`

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }
};

/* ===================================================
   Get Online Test By Test ID
=================================================== */

exports.getOnlineTest = async (req, res) => {

    try {

        const { testId } = req.params;

        const test = await OnlineTest.findOne({

            testId,

            status: "Active"

        });

if (!test) {

    return res.status(404).json({

        success: false,

        message: "Online Test Not Found"

    });

}


// Send response
res.json({

    success: true,

    test

});

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const Student = require("../models/Student");

exports.getAvailableTests = async (req, res) => {

    try {

        const student = await Student.findById(req.params.studentId);

        if (!student) {

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        // Load all active tests
        const tests = await OnlineTest.find({

            schoolId: student.schoolId,
            className: student.className,
            section: student.section,
            status: "Active"

        }).sort({ createdAt: -1 });

        // Load submitted tests
        const responses = await StudentResponse.find({

            studentId: student._id.toString()

        }).select("testId");

        const submittedTests = responses.map(r => r.testId);

        // Attach submitted flag
        const finalTests = tests.map(test => {

            const obj = test.toObject();

            obj.submitted = submittedTests.includes(test.testId);

            return obj;

        });

        res.json({

            success: true,
            tests: finalTests

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};