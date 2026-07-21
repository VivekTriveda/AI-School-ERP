const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentResponseController");

router.post("/submit", controller.submitExam);

module.exports = router;