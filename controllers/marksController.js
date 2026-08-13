const Marks = require("../models/Marks");
const Student = require("../models/Student");

/* ==========================================
   Get Students
========================================== */

exports.getStudents = async (req, res) => {

    try {

        const { schoolId, className, section } = req.query;

        const students = await Student.find({

            schoolId,
            className,
            section

        }).sort({ rollNo: 1 });

        res.json({

            success: true,

            students

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


/* ==========================================
   Save Marks
========================================== */

exports.saveMarks = async (req, res) => {

    try {

        const {

            schoolId,
            board,
            className,
            section,
            exam,
            subject,
            teacherId,
            marks

        } = req.body;

        let record = await Marks.findOne({

            schoolId,
            className,
            section,
            exam,
            subject

        });

        if (record) {

            record.marks = marks;

            record.teacherId = teacherId;

            await record.save();

        } else {

            record = await Marks.create({

                schoolId,
                board,
                className,
                section,
                exam,
                subject,
                teacherId,
                marks

            });

        }

        res.json({

            success: true,

            message: "Marks saved successfully."

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


/* ==========================================
   Get Marks
========================================== */

exports.getMarks = async (req, res) => {

    try {

        const {

            schoolId,
            className,
            section,
            exam,
            subject

        } = req.query;

        const marks = await Marks.findOne({

            schoolId,
            className,
            section,
            exam,
            subject

        });

        res.json({

            success: true,

            marks

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* ==========================================
   Get Exams
========================================== */

exports.getExams = async (req, res) => {
    try {

        const {
            schoolId,
            className,
            subject
        } = req.query;

        if (!schoolId || !className || !subject) {
            return res.json({
                success: false,
                message: "schoolId, className and subject are required"
            });
        }

        const exams = await Marks.distinct("exam", {
            schoolId,
            className,
            subject
        });

        res.json({
            success: true,
            exams: exams.filter(Boolean)
        });

    } catch (err) {

        console.error(
            "Get Exams Error:",
            err
        );

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};