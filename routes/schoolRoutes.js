const express = require("express");

const router = express.Router();

const {
    addSchool,
    getSchools,
    getSchoolById,
    updateSchool,
    deleteSchool
} = require("../controllers/schoolController");

router.post("/", addSchool);

router.get("/", getSchools);

router.get("/:id", getSchoolById);

router.put("/:id", updateSchool);

router.delete("/:id", deleteSchool);



module.exports = router;