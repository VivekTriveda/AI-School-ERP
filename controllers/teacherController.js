const Teacher = require("../models/Teacher");
const bcrypt = require("bcryptjs");
const Book = require("../models/Book");

// =======================
// Add Teacher
// =======================
exports.addTeacher = async (req, res) => {
  try {
    const {
      schoolId,
      schoolName,
      board,
      teacherName,
      email,
      password,
      mobile,
      subjects,
      classes,
      teacherType,
      classTeacherOf,
    } = req.body;

    // Check required fields
    if (!schoolId || !schoolName || !teacherName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check duplicate email
    const existingTeacher = await Teacher.findOne({
      email: email.toLowerCase(),
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher already exists.",
      });
    }
    // =============================
    // Check Class Teacher
    // =============================

    if (
      teacherType === "CLASS_TEACHER" &&
      classTeacherOf &&
      classTeacherOf.className &&
      classTeacherOf.section
    ) {
      const existingClassTeacher = await Teacher.findOne({
        schoolId,

        teacherType: "CLASS_TEACHER",

        "classTeacherOf.board": classTeacherOf.board,

        "classTeacherOf.className": classTeacherOf.className,

        "classTeacherOf.section": classTeacherOf.section,
      });

      if (existingClassTeacher) {
        return res.status(400).json({
          success: false,

          message: `${classTeacherOf.className}-${classTeacherOf.section} already has a Class Teacher.`,
        });
      }
    }
    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("========== ADD TEACHER ==========");
    console.log(req.body);
    console.log("Board:", board);

    // Save teacher
    const teacher = await Teacher.create({
      schoolId,

      schoolName,

      board,

      teacherName,

      email: email.toLowerCase(),

      password: hashedPassword,

      mobile,

      subjects,

      classes,

      teacherType,

      classTeacherOf,

      status: true,
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully.",
      teacher,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// Get Teachers By School
// =======================
exports.getTeachersBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const teachers = await Teacher.find({ schoolId })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      teachers,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Get Teacher Options (Board/Class/Subject/Book)
// ==========================================

exports.getTeacherOptions = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const books = await Book.find({
      schoolId,
      status: "Completed",
    }).sort({
      board: 1,
      className: 1,
      subject: 1,
    });

    const boards = [...new Set(books.map((book) => book.board))];

    const classes = [...new Set(books.map((book) => book.className))];

    const subjects = [...new Set(books.map((book) => book.subject))];

    res.json({
      success: true,

      boards,

      classes,

      subjects,

      books,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};
// ==========================================
// Teacher Login
// ==========================================

exports.loginTeacher = async (req, res) => {
  console.log("🚀 loginTeacher called");
  try {
    console.log("========== TEACHER LOGIN ==========");
    console.log("Request Body:", req.body);

    const { email, password } = req.body;

    const teacher = await Teacher.findOne({
      email: email.toLowerCase(),
    });

    console.log("Teacher Found:", teacher ? teacher.email : "NO");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    console.log("Entered Password:", password);
    console.log("Stored Hash:", teacher.password);

    const match = await bcrypt.compare(password, teacher.password);

    console.log("Password Match:", match);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.json({
      success: true,

      message: "Login Successful.",

      teacher: {
        _id: teacher._id,

        schoolId: teacher.schoolId,

        schoolName: teacher.schoolName,

        board: teacher.board,

        teacherName: teacher.teacherName,

        email: teacher.email,

        mobile: teacher.mobile,

        classes: teacher.classes,

        subjects: teacher.subjects,

        teacherType: teacher.teacherType,

        classTeacherOf: teacher.classTeacherOf,

        role: "teacher",
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,

        message: "Teacher not found.",
      });
    }

    res.json({
      success: true,

      message: "Teacher deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.json({
      success: true,
      teacher,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
