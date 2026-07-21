const FeeStructure = require("../models/FeeStructure");

/* ===============================
Create / Update Fee Structure
================================ */

exports.saveFeeStructure = async (req, res) => {

    try {

        const data = req.body;

        data.totalFee =
            Number(data.admissionFee || 0) +
            Number(data.tuitionFee || 0) +
            Number(data.computerFee || 0) +
            Number(data.examinationFee || 0) +
            Number(data.libraryFee || 0) +
            Number(data.sportsFee || 0) +
            Number(data.transportFee || 0) +
            Number(data.hostelFee || 0) +
            Number(data.miscellaneousFee || 0);

        const structure =
            await FeeStructure.findOneAndUpdate(
                {
                    schoolId: data.schoolId,
                    className: data.className,
                    academicYear: data.academicYear
                },
                data,
                {
                    upsert: true,
                    new: true
                }
            );

        res.json({
            success: true,
            structure
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/* ===============================
Get Fee Structure
================================ */

exports.getFeeStructure = async (req, res) => {

    try {

        const structure =
            await FeeStructure.findOne({

                schoolId: req.query.schoolId,

                className: req.query.className,

                academicYear:
                    req.query.academicYear

            });

        res.json({
            success: true,
            structure
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
/* ===============================
List Fee Structures
================================ */

exports.listFeeStructures = async (req, res) => {

    try {

        const structures = await FeeStructure.find({

            schoolId: req.query.schoolId,

            academicYear: req.query.academicYear

        }).sort({ className: 1 });

        res.json({
            success: true,
            structures
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
/* ===============================
Delete Fee Structure
================================ */

exports.deleteFeeStructure = async (req, res) => {

    try {

        await FeeStructure.findByIdAndDelete(
            req.params.id
        );

        res.json({

            success: true,

            message: "Fee Structure Deleted"

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};