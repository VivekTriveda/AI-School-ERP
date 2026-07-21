const express = require("express");

const router = express.Router();

const controller = require("../controllers/onlineTestController");

router.post("/create", controller.createOnlineTest);

router.get("/available/:studentId", controller.getAvailableTests);

router.get("/:testId", controller.getOnlineTest);



module.exports = router;