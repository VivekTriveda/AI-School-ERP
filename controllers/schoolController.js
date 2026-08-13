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
            pincode,
            package: selectedPackage
        } = req.body;

      // ==========================================
// CHECK DUPLICATE PRINCIPAL LOGIN
// ==========================================

const existingUsername = await User.findOne({
    username: username.trim().toLowerCase(),
    role: "principal"
});

if (existingUsername) {
    return res.json({
        success: false,
        message: "Principal username already exists."
    });
}
const existingEmail = await User.findOne({
    email: email.trim().toLowerCase()
});

if (existingEmail) {
    return res.json({
        success: false,
        message: "Email already exists."
    });
}

        const hashedPassword = await bcrypt.hash(password, 10);

        const allowedPackages = [
    "basic",
    "standard",
    "premium",
    "ai-enterprise",
    "custom"
];

const finalPackage =
    selectedPackage || "basic";

if (!allowedPackages.includes(finalPackage)) {

    return res.status(400).json({
        success: false,
        message: "Invalid school package."
    });

}

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
    pincode,
    subscription: {
        package: finalPackage,

        features:
            finalPackage === "custom"
                ? {}
                : PACKAGE_FEATURES[finalPackage],

        status: "active",

        startDate: new Date()
    }
});

    

await User.create({

    name: principal,

    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),

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

// ==========================================
// Delete School
// ==========================================

exports.deleteSchool = async (req, res) => {

    try {

        const school = await School.findById(req.params.id);

        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found"
            });
        }

        // Delete principal account belonging to this school
        await User.deleteMany({
            schoolId: school._id,
            role: "principal"
        });

        // Delete school
        await School.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "School and Principal account deleted successfully"
        });

    } catch (err) {

        console.error("Delete School Error:", err);

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

// ==========================================
// PACKAGE FEATURE DEFINITIONS
// ==========================================

const PACKAGE_FEATURES = {

    basic: {

        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,

        attendance: true,
        fees: true,

        salary: false,
        timetable: false,
        onlineTests: false,
        questionBank: false,

        aiPaperGenerator: false,
        aiEvaluation: false,
        aiReports: false,

        aiAssistant: true,

        busTracking: false,
        qrClassroom: false
    },


    standard: {

        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,

        attendance: true,
        fees: true,
        salary: true,
        timetable: true,

        onlineTests: false,
        questionBank: false,

        aiPaperGenerator: false,
        aiEvaluation: false,
        aiReports: false,

        aiAssistant: true,

        busTracking: false,
        qrClassroom: false
    },


    premium: {

        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,

        attendance: true,
        fees: true,
        salary: true,
        timetable: true,

        onlineTests: true,
        questionBank: true,

        aiPaperGenerator: false,
        aiEvaluation: false,
        aiReports: false,

        aiAssistant: true,

        busTracking: false,
        qrClassroom: true
    },


    "ai-enterprise": {

        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,

        attendance: true,
        fees: true,
        salary: true,
        timetable: true,

        onlineTests: true,
        questionBank: true,

        aiPaperGenerator: true,
        aiEvaluation: true,
        aiReports: true,

        aiAssistant: true,

        busTracking: true,
        qrClassroom: true
    }

};

// ==========================================
// UPDATE SCHOOL PACKAGE
// ==========================================

exports.updateSchoolPackage = async (req, res) => {

    try {

        const { packageName, features } = req.body;

        const school = await School.findById(req.params.id);

        if (!school) {

            return res.status(404).json({
                success: false,
                message: "School not found"
            });

        }


        // ==========================================
        // STANDARD PACKAGE
        // ==========================================

        if (packageName !== "custom") {

            if (!PACKAGE_FEATURES[packageName]) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid package"
                });

            }

            school.subscription.package = packageName;

            school.subscription.features =
                PACKAGE_FEATURES[packageName];

        }


        // ==========================================
        // CUSTOM PACKAGE
        // ==========================================

        else {

            school.subscription.package = "custom";

            school.subscription.features = {
                ...school.subscription.features.toObject(),
                ...features
            };

        }


        school.subscription.status = "active";

        school.subscription.startDate = new Date();

        await school.save();


        res.json({

            success: true,

            message: "School package updated successfully",

            subscription: school.subscription

        });


    } catch (err) {

        console.error("Package Update Error:", err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};