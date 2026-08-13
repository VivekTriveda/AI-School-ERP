const Notification = require("../models/Notification");
const Student = require("../models/Student");
const Fee = require("../models/Fee");
const FeeStructure = require("../models/FeeStructure");


/* =====================================
   CREATE MONTHLY FEE REMINDER
   Reminder starts after 15th of month
===================================== */

async function createMonthlyFeeReminder(student) {

    try {

        const today = new Date();

        // Reminder should start after 15th
        if (today.getDate() <= 15) {
            return;
        }

        const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
        const currentYear = today.getFullYear();

        // Indian academic year
        // April 2026 -> March 2027
        let academicYear;

        if (today.getMonth() >= 3) {
            academicYear = `${currentYear}-${String(currentYear + 1).slice(-2)}`;
        } else {
            academicYear = `${currentYear - 1}-${String(currentYear).slice(-2)}`;
        }


        /* =====================================
           FIND CLASS FEE STRUCTURE
        ===================================== */

        const feeStructure = await FeeStructure.findOne({
            schoolId: student.schoolId,
            className: student.className,
            academicYear: academicYear
        });


        if (!feeStructure) {

            console.log(
                "Fee structure not found for:",
                student.className,
                academicYear
            );

            return;
        }


        const totalFee = Number(feeStructure.totalFee || 0);


        if (totalFee <= 0) {
            return;
        }


        /* =====================================
           FIND CURRENT MONTH PAYMENT
        ===================================== */

        const fee = await Fee.findOne({
            studentId: student._id,
            month: currentMonth,
            year: currentYear
        }).sort({
            createdAt: -1
        });


        let pendingAmount = totalFee;


        if (fee) {

            pendingAmount = Number(
                fee.balance !== undefined
                    ? fee.balance
                    : totalFee - Number(fee.amountPaid || 0)
            );

        }


        // Never allow negative pending amount
        if (pendingAmount < 0) {
            pendingAmount = 0;
        }


        /* =====================================
           FEE ALREADY PAID
        ===================================== */

        if (pendingAmount <= 0) {
            return;
        }


        /* =====================================
           CHECK DUPLICATE REMINDER
        ===================================== */

        const monthStart = new Date(
            currentYear,
            today.getMonth(),
            1
        );

        const nextMonthStart = new Date(
            currentYear,
            today.getMonth() + 1,
            1
        );


        const existingNotification =
            await Notification.findOne({

                studentId: student._id,

                type: "Fee",

                title: "Monthly Fee Reminder",

                createdAt: {
                    $gte: monthStart,
                    $lt: nextMonthStart
                }

            });


        // Already created this month's reminder
        if (existingNotification) {
            return;
        }


        /* =====================================
           MONTH NAME
        ===================================== */

        const monthName = today.toLocaleString(
            "en-IN",
            {
                month: "long"
            }
        );


        /* =====================================
           CREATE NOTIFICATION
        ===================================== */

        await Notification.create({

            schoolId: student.schoolId,

            studentId: student._id,

            title: "Monthly Fee Reminder",

            message:
                `Your ${monthName} ${currentYear} fee is pending. ` +
                `Total Fee: ₹${totalFee.toLocaleString("en-IN")}. ` +
                `Pending Amount: ₹${pendingAmount.toLocaleString("en-IN")}. ` +
                `Please pay your fee as soon as possible.`,

            type: "Fee",

            isRead: false

        });


        console.log(
            `Fee reminder created for ${student.studentName} - ₹${pendingAmount}`
        );

    }
    catch (err) {

        console.error(
            "Fee reminder error:",
            err.message
        );

    }

}


/* =====================================
   GET STUDENT NOTIFICATIONS
===================================== */

exports.getStudentNotifications = async (req, res) => {

    try {

        const student = await Student.findById(
            req.params.studentId
        );


        if (!student) {

            return res.status(404).json({

                success: false,

                message: "Student not found"

            });

        }


        /* =====================================
           CREATE FEE REMINDER IF REQUIRED
        ===================================== */

        await createMonthlyFeeReminder(student);


        /* =====================================
           GET ALL NOTIFICATIONS
        ===================================== */

        const notifications = await Notification.find({

            studentId: req.params.studentId

        })
        .sort({
            createdAt: -1
        });


        res.json({

            success: true,

            count: notifications.length,

            notifications

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


/* =====================================
   MARK AS READ
===================================== */

exports.markAsRead = async (req, res) => {

    try {

        await Notification.findByIdAndUpdate(

            req.params.id,

            {
                isRead: true
            }

        );


        res.json({

            success: true,

            message: "Notification updated"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};