const OnlineTest = require("../models/OnlineTest");
const StudentResponse = require("../models/StudentResponse");

exports.getAvailableTests = async (req, res) => {

    try {

        const { studentId } = req.params;

        const student = req.student || {};

        const tests = await OnlineTest.find({

            schoolId: student.schoolId,

            className: student.className,

            section: student.section,

            status: "Active"

        })
        .sort({ createdAt: -1 });

        const response = [];

        for (const test of tests) {

            const submitted = await StudentResponse.findOne({

                studentId,

                testId: test.testId

            });

            response.push({

                testId: test.testId,

                paperId: test.paperId,

                examName: test.examName,

                subject: test.subject,

                duration: test.duration,

                totalMarks: test.totalMarks,

                submitted: !!submitted

            });

        }

        res.json({

            success: true,

            tests: response

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getTest = async (req, res) => {

    try {

        const test = await OnlineTest.findOne({

            testId: req.params.testId

        });

        if (!test) {

            return res.status(404).json({

                success: false,

                message: "Test not found"

            });

        }

        res.json({

            success: true,

            test

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};