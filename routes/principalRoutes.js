const express = require("express");

const router = express.Router();

const {
    registerPrincipal,
    loginPrincipal
} = require("../controllers/principalController");

// Register Principal
router.post("/register", registerPrincipal);

// Principal Login
router.post("/login", loginPrincipal);

module.exports = router;