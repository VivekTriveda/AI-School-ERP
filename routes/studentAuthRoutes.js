const express = require("express");

const router = express.Router();

const {
    loginStudent,
    getProfile,
    verifyToken,
    logoutStudent
} = require("../controllers/studentAuthController");

const studentAuth = require("../middleware/studentAuth");

/*
=========================================
Student Login
POST /api/student-auth/login
=========================================
*/
router.post("/login", loginStudent);

/*
=========================================
Get Logged-in Student Profile
GET /api/student-auth/profile
=========================================
*/
router.get(
    "/profile",
    studentAuth,
    getProfile
);

/*
=========================================
Verify JWT Token
GET /api/student-auth/verify
=========================================
*/
router.get(
    "/verify",
    studentAuth,
    verifyToken
);

/*
=========================================
Logout
POST /api/student-auth/logout
=========================================
*/
router.post(
    "/logout",
    studentAuth,
    logoutStudent
);

module.exports = router;