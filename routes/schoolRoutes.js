const express = require("express");

const router = express.Router();

const {
    addSchool,
    getSchools,
    getSchoolById,
    updateSchool,
    deleteSchool,
    updateSchoolPackage
} = require("../controllers/schoolController");


// Add School
router.post("/", addSchool);


// Get All Schools
router.get("/", getSchools);


// Get Single School
router.get("/:id", getSchoolById);


// Update Package
router.put("/:id/package", updateSchoolPackage);


// Update School
router.put("/:id", updateSchool);


// Delete School
router.delete("/:id", deleteSchool);


module.exports = router;