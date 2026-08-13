const Student = require("../models/Student");

const bcrypt = require("bcryptjs");

/* =====================================================
   Get Students of Logged-in Teacher School & Class
===================================================== */
exports.getStudents = async (req, res) => {
    try {

        const { schoolId, className } = req.query;

        let filter = {};

        if (schoolId) filter.schoolId = schoolId;
        if (className) filter.className = className;

        const students = await Student.find(filter)
            .sort({ rollNo: 1 });

        res.json({
            success: true,
            count: students.length,
            students
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch students"
        });

    }
};


/* =====================================================
   Get Single Student
===================================================== */
exports.getStudentById = async (req, res) => {

    try {

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            student
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error fetching student"
        });

    }

};

exports.getStudentsBySchool = async (req, res) => {
    try {
        const students = await Student.find({
            schoolId: req.params.schoolId
        }).sort({ rollNo: 1 });

        res.json({
            success: true,
            students
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error fetching students"
        });
    }
};
/* =====================================================
   Add Student
===================================================== */
exports.addStudent = async (req, res) => {

    try {

        const data = { ...req.body };

        // Generate Username from Admission Number
        data.username = data.admissionNo;

        // Default Password
        const defaultPassword = "Stu@" + data.admissionNo;

        // Hash Password
        data.password = await bcrypt.hash(defaultPassword, 10);

        data.role = "student";

        const student = await Student.create(data);

        res.status(201).json({

            success: true,

            message: "Student added successfully",

            loginCredentials: {

                username: data.username,

                password: defaultPassword

            },

            student

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ==========================================
   Update Student
========================================== */

exports.updateStudent = async (req, res) => {

    try {

        const student = await Student.findById(req.params.id);

        if (!student) {

            return res.status(404).json({

                success:false,

                message:"Student not found"

            });

        }

        student.admissionNo = req.body.admissionNo;
        student.rollNo = req.body.rollNo;
        student.studentName = req.body.studentName;

        student.fatherName = req.body.fatherName;
        student.motherName = req.body.motherName;

        student.gender = req.body.gender;
        student.className = req.body.className;
        student.section = req.body.section;

        student.mobile = req.body.mobile;
       
        if (req.body.dob) {

            student.dob = new Date(req.body.dob);

        }
        student.address = req.body.address;

        await student.save();

        res.json({

            success:true,

            message:"Student updated successfully",

            student

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
/* =====================================================
   Delete Student
===================================================== */
exports.deleteStudent = async (req, res) => {

    try {

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Delete failed"
        });

    }

};  
/* ===========================================
SEARCH STUDENT
Admission No / Roll No / Name
=========================================== */

exports.searchStudent = async (req, res) => {

    try {

        const { schoolId, keyword } = req.query;

        const student = await Student.findOne({

            schoolId,

            $or: [

                {
                    admissionNo: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    studentName: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    rollNo: Number(keyword) || -1
                }

            ]

        });

        if (!student) {

            return res.status(404).json({

                success: false,

                message: "Student not found"

            });

        }

        res.json({

            success: true,

            student

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};