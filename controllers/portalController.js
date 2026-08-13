const Notice = require("../models/Notice");
const School = require("../models/School");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");


exports.getPortalHome = async (req, res) => {

    try {


        // Featured Schools
const schools = await School.find().sort({
    createdAt: -1
});

// Statistics
const totalSchools = await School.countDocuments();

const totalStudents = await Student.countDocuments();

const totalTeachers = await Teacher.countDocuments();

const totalNotices = await Notice.countDocuments({
    isPublished: true
});
        // Live Ticker
       const ticker = await Notice.find({
    isPublished: true,
    isTicker: true
})
.populate(
    "schoolId",
    "schoolName board city state logo"
)
.sort({ createdAt: -1 })
.limit(10);

      // Latest Notices + Events
const notices = await Notice.find({
    isPublished: true,
    category: {
        $in: ["notice", "event"]
    }
})
.populate(
    "schoolId",
    "schoolName board city state logo"
)
.sort({ createdAt: -1 })
.limit(10);

        // Admissions
       const admissions = await Notice.find({
    isPublished: true,
    category: "admission"
})
.populate(
    "schoolId",
    "schoolName board city state logo"
)
.sort({ createdAt: -1 })
.limit(6);

        // Events
       const events = await Notice.find({

    isPublished: true,

    category: "event"

})

.populate(

    "schoolId",

    "schoolName board city state logo"

)

.sort({

    createdAt:-1

})

.limit(6);

        // Tenders
       const tenders = await Notice.find({
    isPublished: true,
    category: "tender"
})
.populate(
    "schoolId",
    "schoolName board city state logo"
)
.sort({ createdAt: -1 })
.limit(6);

        res.json({

    success: true,

    ticker,

    notices,

    admissions,

    events,

    tenders,

    schools,

    stats: {

        schools: totalSchools,

        students: totalStudents,

        teachers: totalTeachers,

        notices: totalNotices

    }

});

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

exports.getSchoolProfile = async (req, res) => {

    try {

        const schoolId = req.params.id;

        const school = await School.findById(schoolId);

        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found"
            });
        }

        const notices = await Notice.find({

    isPublished: true,

    category: {
        $in: ["notice", "event"]
    }

})
.populate(
    "schoolId",
    "schoolName board city state logo"
)
.sort({ createdAt: -1 })
.limit(10);

        const events = await Notice.find({
            schoolId,
            isPublished: true,
            category: "event"
        }).sort({ createdAt: -1 });

        const admissions = await Notice.find({
            schoolId,
            isPublished: true,
            category: "admission"
        }).sort({ createdAt: -1 });

        const tenders = await Notice.find({
            schoolId,
            isPublished: true,
            category: "tender"
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            school,
            notices,
            events,
            admissions,
            tenders
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};