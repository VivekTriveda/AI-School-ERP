const TimeTable = require("../models/TimeTable");

// ======================================
// Create Time Table
// ======================================

exports.createTimeTable = async (req, res) => {

    try {

        const timetable = await TimeTable.create(req.body);

        res.status(201).json({

            success: true,

            message: "Time Table created successfully.",

            timetable

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
// Get School Time Table
// ======================================

exports.getTimeTable = async (req, res) => {

    try {

        const timetable = await TimeTable.find({

            schoolId: req.query.schoolId

        }).sort({

            day: 1,

            period: 1

        });

        res.json({

            success: true,

            timetable

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
// Get Teacher Time Table
// ======================================

exports.getTeacherTimeTable = async (req, res) => {

    try {

        const timetable = await TimeTable.find({

            teacherId: req.params.teacherId

        }).sort({

            day: 1,

            period: 1

        });

        res.json({

            success: true,

            timetable

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
// Delete Time Table
// ======================================

exports.deleteTimeTable = async (req, res) => {

    try {

        await TimeTable.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Time Table deleted successfully."

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