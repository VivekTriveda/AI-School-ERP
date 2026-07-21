const Principal = require("../models/Principal");
const bcrypt = require("bcryptjs");
const School = require("../models/School");

// =======================
// Register Principal
// =======================
exports.registerPrincipal = async (req, res) => {
    try {

        const {
            schoolId,
            schoolName,
            principalName,
            username,
            password,
            mobile,
            email
        } = req.body;

        // Check existing username
        const existing = await Principal.findOne({ username });

        if (existing) {
            return res.json({
                success: false,
                message: "Username already exists"
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        const principal = await Principal.create({
            schoolId,
            schoolName,
            principalName,
            username,
            password: hashedPassword,
            mobile,
            email
        });

        res.json({
            success: true,
            message: "Principal created successfully",
            principal
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// =======================
// Principal Login
// =======================
exports.loginPrincipal = async (req, res) => {

    console.log("===== Principal Login API Called =====");
    try {

        const { username, password } = req.body;

console.log("Username received:", username);

const principal = await Principal.findOne({
    username: username.trim()
});

console.log("Principal found:", principal);

const allUsers = await Principal.find();

console.log("All Principal Usernames:");
allUsers.forEach(u => console.log(u.username));

        if (!principal) {
            return res.json({
                success: false,
                message: "Invalid Username"
            });
        }

        const match = await bcrypt.compare(password, principal.password);

        if (!match) {
            return res.json({
                success: false,
                message: "Invalid Password"
            });
        }

       const school = await School.findById(principal.schoolId);

res.json({
    success: true,
    role: "principal",
    principal,
    school
});
  
    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};