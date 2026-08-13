const express = require("express");

const router = express.Router();

const controller =
require("../controllers/feeReminderController");

router.get(
    "/pending",
    controller.getPendingFees
);
router.post(
    "/send/:id",
    controller.sendReminder
);

router.post(
    "/send-all",
    controller.sendReminderToAll
);
module.exports = router;