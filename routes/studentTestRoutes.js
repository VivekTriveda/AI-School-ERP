const express = require("express");

const router = express.Router();

const controller = require("../controllers/studentTestController");

router.get("/available/:studentId", controller.getAvailableTests);

router.get("/:testId", controller.getTest);

module.exports = router;