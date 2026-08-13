const express = require("express");

const router = express.Router();

const controller =
require("../controllers/notificationController");


router.get("/student/:studentId",controller.getStudentNotifications);

router.put("/read/:id",controller.markAsRead);

module.exports = router;