const express = require("express");
const router = express.Router();

const {
    getSettings,
    saveSettings
} = require("../controllers/settingsController");

router.get("/:id", getSettings);

router.put("/:id", saveSettings);

module.exports = router;