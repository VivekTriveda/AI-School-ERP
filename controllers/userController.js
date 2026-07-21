const bcrypt = require("bcryptjs");
const User = require("../models/User");

// =============================
// LOGIN
// =============================
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {

            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });

        }
   
        res.json({

    success: true,

    user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        schoolId: user.schoolId,

        schoolName: user.schoolName,

        subjects: user.subjects,

        classes: user.classes,

        status: user.status

    }

});

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =============================
// CREATE USER
// =============================
exports.createUser = async (req, res) => {

    try {

        const {

            name,

            email,

            password,

            role,

            schoolId,

            schoolName,

            subjects,

            classes

        } = req.body;

        const exists = await User.findOne({ email });

        if (exists) {

            return res.status(400).json({

                success: false,

                message: "Email already exists"

            });

        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({

            name,

            email,

            password: hashed,

            role,

            schoolId,

            schoolName,

            subjects,

            classes,

            createdBy: req.body.createdBy || null

        });

        res.json({

            success: true,

            message: `${role} created successfully`,

            user

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.createPrincipal = async (req, res) => {

    try {

        const bcrypt = require("bcryptjs");

        const User = require("../models/User");

        const {
            name,
            email,
            password,
            schoolId,
            schoolName,
            createdBy
        } = req.body;

        const exists = await User.findOne({ email });

        if (exists) {

            return res.status(400).json({

                success: false,

                message: "Principal already exists"

            });

        }

        const hashed = await bcrypt.hash(password, 10);

        const principal = await User.create({

            name,

            email,

            password: hashed,

            role: "principal",

            schoolId,

            schoolName,

            createdBy

        });

        res.json({

            success: true,

            message: "Principal Created Successfully",

            principal

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =============================
// GET PRINCIPALS BY SCHOOL
// =============================
exports.getPrincipals = async (req, res) => {

    try {

        const { schoolId } = req.params;

        const principals = await User.find({

            role: "principal",

            schoolId: schoolId

        })
        .select("-password")
        .sort({ createdAt: -1 });

        res.json({

            success: true,

            principals

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =============================
// DELETE PRINCIPAL
// =============================
exports.deletePrincipal = async (req, res) => {

    try {

        const { id } = req.params;

        const principal = await User.findOneAndDelete({

            _id: id,

            role: "principal"

        });

        if (!principal) {

            return res.status(404).json({

                success: false,

                message: "Principal not found"

            });

        }

        res.json({

            success: true,

            message: "Principal deleted successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =============================
// UPDATE PRINCIPAL
// =============================
exports.updatePrincipal = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            email,
            schoolId,
            schoolName
        } = req.body;

        const principal = await User.findOneAndUpdate(

            {
                _id: id,
                role: "principal"
            },

            {
                name,
                email,
                schoolId,
                schoolName
            },

            {
                new: true
            }

        ).select("-password");

        if (!principal) {

            return res.status(404).json({

                success: false,

                message: "Principal not found"

            });

        }

        res.json({

            success: true,

            message: "Principal updated successfully",

            principal

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
// =============================
// CHANGE PRINCIPAL STATUS
// =============================
exports.changePrincipalStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const principal = await User.findOne({
            _id: id,
            role: "principal"
        });

        if (!principal) {

            return res.status(404).json({
                success: false,
                message: "Principal not found"
            });

        }

        principal.status =
            principal.status === "Active"
                ? "Inactive"
                : "Active";

        await principal.save();

        res.json({

            success: true,

            message: "Status updated successfully",

            status: principal.status

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};