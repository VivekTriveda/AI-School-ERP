const Teacher = require("../models/Teacher");
const Evaluation = require("../models/Evaluation");
const OnlineTest = require("../models/OnlineTest");

exports.getTeacherPerformance = async (req, res) => {

    try {

        const { schoolId } = req.params;

        const teachers = await Teacher.find({
            schoolId
        }).lean();

        const result = [];



for (const teacher of teachers) {

    // Total Tests Created
 const tests = await OnlineTest.countDocuments({
    schoolId,
    subject: {
    $regex: `^${teacher.subjects[0].trim()}$`,
    $options: "i"
},
    className: { $in: teacher.classes }
});

    // Results Published
 const evaluations = await Evaluation.find({
    schoolId,
    subject: {
    $regex: `^${teacher.subjects[0].trim()}$`,
    $options: "i"
},
    className: { $in: teacher.classes }
});

    const resultsPublished = evaluations.length;

    // Student Average %
    let averagePercentage = 0;

    if (evaluations.length > 0) {

        const totalPercentage = evaluations.reduce(

            (sum, item) => sum + Number(item.percentage || 0),

            0

        );

        averagePercentage =

            Math.round(totalPercentage / evaluations.length);

    }

    // Attendance (temporary until attendance module)
    const attendance = 100;

    // ===========================
    // Performance Score
    // ===========================

    const score = Math.round(

        averagePercentage * 0.40 +

        attendance * 0.20 +

        Math.min(tests * 5,100) * 0.20 +

        Math.min(resultsPublished * 3,100) * 0.20

    );

    let rating = "Needs Improvement";

    if(score>=90){

        rating="Excellent";

    }
    else if(score>=80){

        rating="Very Good";

    }
    else if(score>=70){

        rating="Good";

    }
    else if(score>=60){

        rating="Average";

    }

    result.push({

    teacherId: teacher._id,

    teacherName: teacher.teacherName,

    subject:
        teacher.subjects && teacher.subjects.length
            ? teacher.subjects.join(", ")
            : "-",

    classes:
        teacher.classes && teacher.classes.length
            ? teacher.classes.join(", ")
            : (

                teacher.classTeacherOf &&
                teacher.classTeacherOf.className

                    ? teacher.classTeacherOf.className +
                      "-" +
                      teacher.classTeacherOf.section

                    : "-"

            ),

    attendance,

    tests,

    results: resultsPublished,

    studentAverage: averagePercentage,

    score,

    rating

});

}
result.sort((a,b)=>b.score-a.score);

        const bestTeacher =
result.length
? result[0].teacherName
: "--";

const avgRating =
result.length
? Math.round(
result.reduce(
(s,t)=>s+t.score,0
)/result.length)
:0;

const needImprovement =
result.filter(
t=>t.score<60
).length;

res.json({

    success:true,

    totalTeachers:teachers.length,

    bestTeacher,

    averageRating:avgRating,

    needImprovement,

    performance:result

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