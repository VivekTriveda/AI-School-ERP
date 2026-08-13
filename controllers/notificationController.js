const Notification = require("../models/Notification");

/* =====================================
GET STUDENT NOTIFICATIONS
===================================== */

exports.getStudentNotifications = async (req, res) => {

    try {

        const notifications = await Notification.find({

            studentId: req.params.studentId

        })
        .sort({ createdAt: -1 });

        res.json({

            success: true,

            count: notifications.length,

            notifications

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