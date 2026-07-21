const School = require("../models/School");
const bcrypt = require("bcryptjs");
 const User = require("../models/User");

// Add School

exports.addSchool = async (req, res) => {

    
   

    try {

        const {
            schoolName,
            board,
            principal,
            username,
            password,
            phone,
            email,
            website,
            address,
            city,
            state,
            pincode
        } = req.body;

        // Check duplicate username first
        const existing = await User.findOne({ email, role: "principal"});

        if (existing) {

            

            return res.json({
                success: false,
                message: "Principal username already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       const school = await School.create({
    schoolName,
    board,
    principal,
    phone,
    email,
    website,
    address,
    city,
    state,
    pincode
});

    

await User.create({

    name: principal,

    email,

    password: hashedPassword,

    role: "principal",

    schoolId: school._id,

    schoolName,

    status: "Active",

    createdBy: null

});

       

        res.status(201).json({

            success: true,

            message: "School and Principal created successfully",

            school

        });

    } catch (err) {

        

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// Get All Schools
exports.getSchools = async (req, res) => {
    try {

        const schools = await School.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            schools
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Update School
exports.updateSchool = async (req, res) => {

    try {

        const school = await School.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            message: "School Updated",
            school
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Delete School
exports.deleteSchool = async (req, res) => {

    try {

        await School.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "School Deleted"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
// Get Single School
exports.getSchoolById = async (req, res) => {

    try {

        const school = await School.findById(req.params.id);

        if (!school) {

            return res.status(404).json({
                success: false,
                message: "School not found"
            });

        }

        res.json({
            success: true,
            school
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};