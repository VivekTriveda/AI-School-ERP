const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacherController");

router.post("/login", teacherController.loginTeacher);
// Add Teacher
router.post("/add", teacherController.addTeacher);

router.get("/options/:schoolId", teacherController.getTeacherOptions);

router.get("/teacher/:id", teacherController.getTeacherById);

// Get Teachers By School
router.get("/:schoolId", teacherController.getTeachersBySchool);

// Delete Teacher

router.delete("/:id", teacherController.deleteTeacher);

module.exports = router;
