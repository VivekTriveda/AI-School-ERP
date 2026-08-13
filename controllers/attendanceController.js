const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

/* ==========================================
   Get Students For Attendance
========================================== */

exports.getStudents = async (req, res) => {
    try {
        const { schoolId, className } = req.query;

       

        const students = await Student.find({
            schoolId,
            className
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
   Save Attendance
========================================== */

exports.saveAttendance = async (req, res) => {

    try {

        const {

            schoolId,
            board,
            className,
            section,
            date,
            teacherId,
            attendance

        } = req.body;

        let record = await Attendance.findOne({

            schoolId,
            className,
            section,
            date

        });

        if (record) {

            record.attendance = attendance;

            record.teacherId = teacherId;

            await record.save();

        } else {

            record = await Attendance.create({

                schoolId,
                board,
                className,
                section,
                date,
                teacherId,
                attendance

            });

        }

        res.json({

            success: true,

            message: "Attendance saved successfully."

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
   Get Attendance
========================================== */

exports.getAttendance = async (req, res) => {

    try {

        const {

            schoolId,
            className,
            section,
            date

        } = req.query;

        const attendance = await Attendance.findOne({

            schoolId,
            className,
            section,
            date

        });

        res.json({

            success: true,

            attendance

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
   Student Attendance Report
========================================== */

exports.getStudentAttendance = async (req, res) => {

    try {

        const { studentId } = req.params;

        const { month } = req.query;

        let filter = {};

        if (month) {

            filter.date = {

                $regex: "^" + month

            };

        }

        const records = await Attendance.find(filter);

        const attendance = [];

   records.forEach(record => {

    

    const studentAttendance = record.attendance.find(item => {


        return String(item.studentId) === String(studentId);

    });

   

    if(studentAttendance){

        attendance.push({

            date: record.date,

            status: studentAttendance.status,

            remarks: "",

            day: new Date(record.date)
                .toLocaleDateString("en-IN",{
                    weekday:"long"
                })

        });

    }

});

        res.json({

            success: true,

            attendance

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};