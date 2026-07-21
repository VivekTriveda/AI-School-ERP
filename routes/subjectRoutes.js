const express = require("express");
const router = express.Router();

// Test Route
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Subject Routes Working"
    });
});

module.exports = router;