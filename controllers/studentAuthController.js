const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");

/* ===========================================
   Student Login
=========================================== */

exports.loginStudent = async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {

            return res.status(400).json({

                success: false,

                message: "Username and Password are required."

            });

        }

        const student = await Student.findOne({ username });

        if (!student) {

            return res.status(401).json({

                success: false,

                message: "Invalid Username"

            });

        }

        const isMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid Password"

            });

        }

        if (student.status !== "Active") {

            return res.status(403).json({

                success: false,

                message: "Student account is inactive."

            });

        }

        const token = jwt.sign(

            {

                studentId: student._id,

                role: "student",

                schoolId: student.schoolId,

                className: student.className,

                section: student.section

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        student.lastLogin = new Date();

        student.loginStatus = true;

        await student.save();

        res.json({

            success: true,

            message: "Login Successful",

            token,

           student: {

                  id: student._id,

                  studentName: student.studentName,

                  admissionNo: student.admissionNo,

                 rollNo: student.rollNo,

                    schoolId: student.schoolId,

                 className: student.className,

                section: student.section,

                 photo: student.photo
              }

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


/* ===========================================
   Student Profile
=========================================== */

exports.getProfile = async (req, res) => {

    res.json({

        success: true,

        student: req.student

    });

};


/* ===========================================
   Verify Token
=========================================== */

exports.verifyToken = async (req, res) => {

    res.json({

        success: true,

        valid: true,

        student: req.student

    });

};


/* ===========================================
   Logout
=========================================== */

exports.logoutStudent = async (req, res) => {

    try {

        req.student.loginStatus = false;

        await req.student.save();

        res.json({

            success: true,

            message: "Logout Successful"

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