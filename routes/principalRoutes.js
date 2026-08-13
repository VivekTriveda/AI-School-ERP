const express = require("express");

const router = express.Router();

const {
    registerPrincipal,
    loginPrincipal,
    dashboardAnalytics
} = require("../controllers/principalController");

router.get(
    "/dashboard/:schoolId",
    dashboardAnalytics
);

// Register Principal
router.post("/register", registerPrincipal);

// Principal Login
router.post("/login", loginPrincipal);

module.exports = router;