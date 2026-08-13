const mongoose = require("mongoose");
const Fee = require("../models/Fee");
const Notification = require("../models/Notification");


/* =====================================
   GET PENDING FEE REMINDERS
===================================== */

exports.getPendingFees = async (req, res) => {

    try {

        const {
            schoolId,
            className,
            section,
            month,
            year,
            status
        } = req.query;

        const filter = {};
        if (className)
            filter.className = className;

        if (section)
            filter.section = section;

        if (month)
            filter.month = month;

        if (year)
            filter.year = Number(year);

        // Only pending fees
        if (status)
            filter.status = status;
        else
            filter.status = {
                $in: ["Partial", "Unpaid"]
            };

        console.log("Fee Filter:", filter);

const fees = await Fee.find(filter)
    .sort({
        className: 1,
        studentName: 1
    });

console.log("Fees Found:", fees.length);

if (fees.length > 0) {
    console.log("First Fee:", fees[0]);
}

        const summary = {

            pendingStudents: fees.length,

            pendingAmount: fees.reduce(
                (sum, f) => sum + Number(f.balance || 0),
                0
            ),

            paidStudents: fees.filter(
                f => f.status === "Paid"
            ).length,

            reminderSent: 0
        };

        res.json({

            success: true,

            summary,

            fees

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


exports.sendReminder = async (req,res)=>{

try{

const fee = await Fee.findById(req.params.id);

if(!fee){

return res.status(404).json({

success:false,

message:"Fee record not found"

});

}

await Notification.create({

schoolId:fee.schoolId,

studentId:fee.studentId,

title:"Fee Reminder",

message:
`Dear ${fee.studentName},

Your ${fee.month}-${fee.year} fee is pending.

Pending Amount : ₹${fee.balance}

Please pay as soon as possible.`,

type:"Fee"

});

res.json({

success:true,

message:"Reminder sent successfully."

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

exports.sendReminderToAll = async (req, res) => {

    try {

        const {
            schoolId,
            className,
            section,
            month,
            year
        } = req.body;

        const filter = {
            schoolId,
            status: {
                $in: ["Partial", "Unpaid"]
            }
        };

        if (className)
            filter.className = className;

        if (section)
            filter.section = section;

        if (month)
            filter.month = month;

        if (year)
            filter.year = Number(year);

        const fees = await Fee.find(filter);

        if (fees.length === 0) {

            return res.json({
                success: false,
                message: "No pending fee found."
            });

        }

        const notifications = fees.map(fee => ({

            schoolId: fee.schoolId,

            studentId: fee.studentId,

            title: "Monthly Fee Reminder",

            message:
`Dear ${fee.studentName},

Your fee for ${fee.month}-${fee.year} is still pending.

Total Fee : ₹${fee.totalFee}

Paid : ₹${fee.amountPaid}

Pending : ₹${fee.balance}

Please pay before the due date.

Regards,
School Administration`,

            type: "Fee"

        }));

        await Notification.insertMany(notifications);

        res.json({

            success: true,

            message: `${notifications.length} reminder(s) sent successfully.`,

            count: notifications.length

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};