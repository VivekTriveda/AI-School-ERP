const TeacherSalary = require("../models/TeacherSalary");
const Teacher = require("../models/Teacher");

/* ===========================================
   PAY / SAVE SALARY
=========================================== */

exports.paySalary = async (req, res) => {
  try {
    const data = req.body;

    data.netSalary =
      Number(data.basicSalary || 0) +
      Number(data.hra || 0) +
      Number(data.da || 0) +
      Number(data.allowance || 0) +
      Number(data.bonus || 0) -
      Number(data.pf || 0) -
      Number(data.tax || 0) -
      Number(data.deduction || 0);

    const salary = await TeacherSalary.findOneAndUpdate(
      {
        teacherId: data.teacherId,
        month: data.month,
        year: data.year,
      },
      data,
      {
        upsert: true,
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Salary saved successfully.",
      salary,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===========================================
   GET SINGLE SALARY
=========================================== */

exports.getSalary = async (req, res) => {
  try {
    const salary = await TeacherSalary.findOne({
      teacherId: req.query.teacherId,
      month: req.query.month,
      year: req.query.year,
    });

    res.json({
      success: true,
      salary,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===========================================
   SALARY HISTORY
=========================================== */

exports.salaryHistory = async (req, res) => {
  try {
    const query = {};

    if (req.query.schoolId)
      query.schoolId = req.query.schoolId;

    if (req.query.teacherId)
      query.teacherId = req.query.teacherId;

    const salaries = await TeacherSalary.find(query)
      .sort({ year: -1, month: -1 });

    res.json({
      success: true,
      salaries,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===========================================
   DASHBOARD
=========================================== */

exports.salaryDashboard = async (req, res) => {
  try {
    const schoolId = req.query.schoolId;

    const teachers = await Teacher.countDocuments({
      schoolId,
    });

    const totalPaid = await TeacherSalary.aggregate([
      {
        $match: {
          schoolId,
          status: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$netSalary",
          },
        },
      },
    ]);

    const pending = await TeacherSalary.countDocuments({
      schoolId,
      status: "Pending",
    });

    res.json({
      success: true,
      totalTeachers: teachers,
      totalSalary: totalPaid[0]?.total || 0,
      pendingSalary: pending,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// pending teacher salary 
exports.getPendingTeachers = async (req, res) => {
    try {

        const { schoolId } = req.query;

        const today = new Date();

        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();

        // All teachers
        const teachers = await Teacher.find({ schoolId });

        // Already paid this month
        const paid = await TeacherSalary.find({
            schoolId,
            month,
            year
        }).select("teacherId");

        const paidIds = paid.map(s => s.teacherId.toString());

        const pendingTeachers = teachers.filter(
            t => !paidIds.includes(t._id.toString())
        );

        res.json({
            success: true,
            teachers: pendingTeachers
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
/* ===========================================
   DELETE SALARY
=========================================== */

exports.deleteSalary = async (req, res) => {
  try {
    await TeacherSalary.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Salary deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// teacher salary
exports.getTeacherSalaryHistory = async (req, res) => {
    try {
        const salaries = await TeacherSalary
            .find({ teacherId: req.params.teacherId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            salaries
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};