const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

module.exports = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Authorization header missing."
            });

        }

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Invalid authorization format."
            });

        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const student = await Student.findById(decoded.studentId);

        if (!student) {

            return res.status(401).json({
                success: false,
                message: "Student not found."
            });

        }

        if (student.status !== "Active") {

            return res.status(403).json({
                success: false,
                message: "Student account is inactive."
            });

        }

        req.student = student;

        next();

    }

    catch (err) {

        console.error(err);

        return res.status(401).json({

            success: false,

            message: "Invalid or expired token."

        });

    }

};