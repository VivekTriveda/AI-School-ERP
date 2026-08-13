const TeacherAttendance = require("../models/TeacherAttendance");
const Teacher = require("../models/Teacher");

// ===============================
// Mark Attendance
// ===============================

exports.markAttendance = async (req, res) => {

    try {

        const { teacherId,status,reason} = req.body;

        // Get latest teacher details from MongoDB
        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {

            return res.status(404).json({

                success: false,

                message: "Teacher not found."

            });

        }

        const today = new Date().toISOString().split("T")[0];

        // Prevent duplicate attendance
        const alreadyMarked = await TeacherAttendance.findOne({

            teacherId,

            date: today

        });

        if (alreadyMarked) {

            return res.status(400).json({

                success: false,

                message: "Attendance already marked for today."

            });

        }

        const now = new Date();

       const attendance = await TeacherAttendance.create({

    teacherId: teacher._id,

    teacherName: teacher.teacherName,

    schoolId: teacher.schoolId,

    schoolName: teacher.schoolName,

    board: teacher.board,

    subjects: teacher.subjects,

    classes: teacher.classes,

    date: today,

    checkIn: now.toLocaleTimeString("en-IN", {

        hour: "2-digit",

        minute: "2-digit"

    }),

    status,

    reason: reason || "",

    approvalStatus:
        ["CL", "EL", "SL"].includes(status)
            ? "Pending"
            : "Approved"

});

        res.json({

            success: true,

            message:["CL","EL","SL"].includes(status)? "Leave request sent to Principal."
                    : "Attendance marked successfully.",

            attendance

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
// ======================================
// Principal - Get Teacher Attendance
// ======================================

exports.getAttendanceBySchool = async (req, res) => {

    try {

        const { schoolId } = req.params;

const { date } = req.query;

const filter = {

    schoolId

};

if (date) {

    filter.date = date;

}

const attendance = await TeacherAttendance.find(filter)

.sort({

    teacherName: 1

});

        res.json({

            success: true,

            attendance

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

// ======================================
// Approve Leave
// ======================================

exports.approveLeave = async (req, res) => {

    try {

        const attendance = await TeacherAttendance.findById(req.params.id);

        if (!attendance) {

            return res.status(404).json({

                success: false,

                message: "Attendance not found."

            });

        }

        attendance.approvalStatus = "Approved";

        await attendance.save();

        res.json({

            success: true,

            message: "Leave approved successfully."

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ======================================
// Reject Leave
// ======================================

exports.rejectLeave = async (req, res) => {

    try {

        const attendance = await TeacherAttendance.findById(req.params.id);

        if (!attendance) {

            return res.status(404).json({

                success: false,

                message: "Attendance not found."

            });

        }

        attendance.approvalStatus = "Rejected";

        await attendance.save();

        res.json({

            success: true,

            message: "Leave rejected successfully."

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ======================================
// Teacher My Attendance
// ======================================

exports.getMyAttendance = async (req, res) => {

    try {

        const { teacherId } = req.params;

        const attendance =
            await TeacherAttendance.find({ teacherId })
            .sort({ date: -1 });

        const present =
            attendance.filter(a => a.status === "Present").length;

        const absent =
            attendance.filter(a => a.status === "Absent").length;

        const leave =
            attendance.filter(a =>
                ["CL","EL","SL"].includes(a.status)
            ).length;

        const today =
            new Date().toISOString().split("T")[0];

        const todayAttendance =
            attendance.find(a => a.date === today);

        const percentage =
            attendance.length
                ? ((present / attendance.length) * 100).toFixed(1)
                : 0;

        res.json({

            success:true,

            summary:{
                total:attendance.length,
                present,
                absent,
                leave,
                percentage,
                todayStatus:
                    todayAttendance?.status || "Not Marked",
                checkIn:
                    todayAttendance?.checkIn || "-",
                checkOut:
                    todayAttendance?.checkOut || "-"
            },

            attendance

        });

    } catch(err){

        console.error(err);

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};