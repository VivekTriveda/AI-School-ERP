const Fee = require("../models/Fee");
const Student = require("../models/Student");

/* ================================
   Create Fee Payment
================================ */

exports.createFee = async (req, res) => {

    try {

        const {
            studentId,
            feeType,
            month,
            year,
            totalFee,
            discount = 0,
            fine = 0,
            amountPaid,
            paymentMode,
            transactionId,
            remarks
        } = req.body;

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // ===================================
        // Check existing monthly fee record
        // ===================================

        let fee = await Fee.findOne({
            studentId,
            feeType,
            month,
            year
        });

        // ===================================
        // CREATE NEW RECORD
        // ===================================

        if (!fee) {

            const payable =
                Number(totalFee) -
                Number(discount) +
                Number(fine);

            const paid = Number(amountPaid);

            const balance = payable - paid;

            let status = "Unpaid";

            if (balance <= 0)
                status = "Paid";
            else if (paid > 0)
                status = "Partial";

            fee = new Fee({

                schoolId: student.schoolId,

                studentId: student._id,

                admissionNo: student.admissionNo,

                rollNo: student.rollNo,

                studentName: student.studentName,

                className: student.className,

                section: student.section,

                parentName: student.parentName,

                mobile: student.mobile,

                feeType,

                month,

                year,

                totalFee,

                discount,

                fine,

                amountPaid: paid,

                balance,

                paymentMode,

                transactionId,

                receiptNo: "RCPT-" + Date.now(),

                remarks,

                status,

                payments: [
                    {
                        amount: paid,
                        paymentMode,
                        transactionId,
                        collectedBy: "Teacher"
                    }
                ]

            });

        }

        // ===================================
        // UPDATE EXISTING RECORD
        // ===================================
          
        else {

    const newPayment = Number(amountPaid);

    if (fee.balance <= 0) {

        return res.status(400).json({
            success: false,
            message: "This month's fee is already paid."
        });

    }

    if (newPayment > fee.balance) {

        return res.status(400).json({
            success: false,
            message:
                "Amount exceeds pending balance.\nPending Balance : ₹" +
                fee.balance
        });

    }

    fee.amountPaid += newPayment;

    fee.balance =
        (fee.totalFee - fee.discount + fee.fine)
        - fee.amountPaid;

    if (fee.balance <= 0)
        fee.status = "Paid";
    else
        fee.status = "Partial";

    fee.paymentMode = paymentMode;

    fee.transactionId = transactionId;

    fee.remarks = remarks;

    fee.payments.push({

        amount: newPayment,

        paymentMode,

        transactionId,

        collectedBy: "Teacher"

    });

}
       
        await fee.save();

        res.json({

            success: true,

            message: "Fee collected successfully",

            fee

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* =====================================
GET CURRENT MONTH FEE
===================================== */

exports.getCurrentFee = async (req, res) => {

    try {

        const {
            studentId,
            month,
            year,
            feeType = "Tuition"
        } = req.query;

        const fee = await Fee.findOne({

            studentId,

            feeType,

            month,

            year: Number(year)

        });

        res.json({

            success: true,

            fee

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


/* ================================
   Student Fee History
================================ */

exports.getStudentFees = async (req, res) => {

    try {

        const fees = await Fee.find({
            studentId: req.params.studentId
        }).sort({
            paymentDate: -1
        });

        res.json({
            success: true,
            fees
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.getFeeById = async(req,res)=>{

try{

const fee=await Fee.findById(req.params.id);

if(!fee){

return res.status(404).json({

success:false,

message:"Receipt not found"

});

}

res.json({

success:true,

fee

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

/* ================================
   Delete Fee
================================ */

exports.deleteFee = async (req, res) => {

    try {

        await Fee.findByIdAndDelete(
            req.params.id
        );

        res.json({
            success: true,
            message: "Fee deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/* =====================================
GET ALL FEES OF SCHOOL
===================================== */

exports.getAllFees = async (req, res) => {

    try {

        const { schoolId } = req.query;

        const fees = await Fee.find({ schoolId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: fees.length,
            fees
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/* =====================================
FEE DASHBOARD
===================================== */

exports.getDashboard = async (req, res) => {

    try {

        const { schoolId } = req.query;

        const today = new Date();

        const todayStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const tomorrow = new Date(todayStart);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();

        // Today's Collection
        const todayFees = await Fee.find({
            schoolId,
            paymentDate: {
                $gte: todayStart,
                $lt: tomorrow
            }
        });

        const todayCollection =
            todayFees.reduce(
                (sum, f) => sum + (f.amountPaid || 0),
                0
            );

        // Monthly Collection
        const monthFees = await Fee.find({
            schoolId,
            month,
            year
        });

        const monthlyCollection =
            monthFees.reduce(
                (sum, f) => sum + (f.amountPaid || 0),
                0
            );

        // Pending
        const pendingFees =
            monthFees.reduce(
                (sum, f) => sum + (f.balance || 0),
                0
            );

        // Paid Students
        const studentsPaid =
            monthFees.filter(
                f => f.status === "Paid"
            ).length;

        res.json({

            success: true,

            todayCollection,

            monthlyCollection,

            pendingFees,

            studentsPaid

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* =====================================
PRINCIPAL FEE DASHBOARD
===================================== */

exports.getPrincipalDashboard = async (req, res) => {

    try {

        const {
            schoolId,
            className,
            section,
            month,
            year
        } = req.query;

        const filter = {
            schoolId
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

        const dashboard = {

            totalStudents: fees.length,

            paidStudents: fees.filter(
                f => f.status === "Paid"
            ).length,

            partialStudents: fees.filter(
                f => f.status === "Partial"
            ).length,

            unpaidStudents: fees.filter(
                f => f.status === "Unpaid"
            ).length,

            totalCollection: fees.reduce(
                (sum, f) => sum + Number(f.amountPaid || 0),
                0
            ),

            pendingAmount: fees.reduce(
                (sum, f) => sum + Number(f.balance || 0),
                0
            )

        };

        res.json({

            success: true,

            dashboard

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* =====================================
PRINCIPAL VIEW STUDENT FEE
===================================== */

exports.getPrincipalStudentFee = async (req, res) => {

    try {

        const fees = await Fee.find({

            studentId: req.params.studentId

        }).sort({

            year: -1,

            month: -1

        });

        res.json({

            success: true,

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

/* =====================================
PRINCIPAL FEE LIST
===================================== */

exports.getPrincipalFeeList = async (req, res) => {

    try {

        const {
            schoolId,
            className,
            section,
            status,
            month,
            year
        } = req.query;

        const filter = { schoolId };

        if (className)
            filter.className = className;

        if (section)
            filter.section = section;

        if (status)
            filter.status = status;

        if (month)
            filter.month = month;

        if (year)
            filter.year = Number(year);

        const fees = await Fee.find(filter)
            .sort({
                className: 1,
                studentName: 1
            });

        res.json({
            success: true,
            count: fees.length,
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
/* =====================================
ADMIN FEE DASHBOARD
===================================== */

exports.getAdminDashboard = async (req, res) => {

    try {

        const fees = await Fee.find();

        const totalSchools =
            [...new Set(fees.map(f => String(f.schoolId)))].length;

        const totalStudents =
            [...new Set(fees.map(f => String(f.studentId)))].length;

        const totalCollection =
            fees.reduce(
                (sum, f) => sum + Number(f.amountPaid || 0),
                0
            );

        const pendingAmount =
            fees.reduce(
                (sum, f) => sum + Number(f.balance || 0),
                0
            );

       const paidStudents =
    fees.filter(f => Number(f.balance || 0) <= 0).length;

        const collectionPercent =
            totalStudents === 0
                ? 0
                : Math.round((paidStudents / totalStudents) * 100);

        res.json({

            success: true,

            dashboard: {

                totalSchools,

                totalStudents,

                totalCollection,

                pendingAmount,

                collectionPercent

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
/* =====================================
ADMIN SCHOOL REPORT
===================================== */

exports.getAdminSchoolReport = async (req, res) => {

    try {

        const fees = await Fee.find();

        const report = {};

        fees.forEach(fee => {

            const key = fee.schoolId.toString();

            if (!report[key]) {

                report[key] = {

                    schoolId: fee.schoolId,

                    schoolName: fee.schoolName || "Unknown School",

                    students: new Set(),

                    paid: 0,

                    partial: 0,

                    unpaid: 0,

                    collection: 0,

                    pending: 0

                };

            }

            report[key].students.add(
                fee.studentId.toString()
            );

            if (fee.status === "Paid")
                report[key].paid++;

            else if (fee.status === "Partial")
                report[key].partial++;

            else
                report[key].unpaid++;

            report[key].collection +=
                Number(fee.amountPaid || 0);

            report[key].pending +=
                Number(fee.balance || 0);

        });

        const result = Object.values(report).map(r => ({

            schoolId: r.schoolId,

            schoolName: r.schoolName,

            students: r.students.size,

            paid: r.paid,

            partial: r.partial,

            unpaid: r.unpaid,

            collection: r.collection,

            pending: r.pending

        }));

        res.json({

            success: true,

            schools: result

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* =====================================
ADMIN SINGLE SCHOOL REPORT
===================================== */

exports.getAdminSchoolDetails = async (req, res) => {

    try {

        const fees = await Fee.find({

            schoolId: req.params.schoolId

        }).sort({

            className: 1,

            studentName: 1

        });

        res.json({

            success: true,

            count: fees.length,

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