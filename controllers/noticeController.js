const Notice = require("../models/Notice");

/* ===========================
   CREATE NOTICE
=========================== */

exports.createNotice = async (req, res) => {

    try {

        const notice = await Notice.create({

            schoolId: req.body.schoolId,
            createdBy: req.body.principalId,

            title: req.body.title,
            description: req.body.description,

            category: req.body.category,
            priority: req.body.priority,

            attachment: req.file ? `/uploads/notices/${req.file.filename}` : "",


            expiryDate: req.body.expiryDate,
            isTicker: req.body.isTicker

        });

        res.status(201).json({

            success: true,

            message: "Published Successfully",

            notice

        });

    }

    catch (err) {

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};


/* ===========================
   SCHOOL NOTICES
=========================== */

exports.getSchoolNotices = async (req, res) => {

    try {

        const notices = await Notice.find({

            schoolId: req.params.schoolId

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            notices

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ===========================
   UPDATE
=========================== */

exports.updateNotice = async (req, res) => {

    try {

        const updateData = {

    category: req.body.category,
    priority: req.body.priority,
    title: req.body.title,
    description: req.body.description,
    expiryDate: req.body.expiryDate,
    isTicker: req.body.isTicker

};

if (req.file) {

    updateData.attachment = `/uploads/notices/${req.file.filename}`;

}

const updatedNotice = await Notice.findByIdAndUpdate(

    req.params.id,

    updateData,

    { new: true }

);

        if (!updatedNotice) {

            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });

        }

        res.json({

            success: true,
            message: "Notice Updated Successfully",
            notice: updatedNotice

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

/* ===========================
   DELETE
=========================== */

exports.deleteNotice = async (req, res) => {

    try {

        const notice = await Notice.findByIdAndDelete(req.params.id);

        if (!notice) {

            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });

        }

        res.json({

            success: true,
            message: "Notice Deleted Successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};