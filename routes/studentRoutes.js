const express = require("express");
const router = express.Router();

const {
    getStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudent
} = require("../controllers/studentController");

// Get all students
router.get("/", getStudents);

// Search Student
router.get("/search", searchStudent);

// Get single student
router.get("/:id", getStudentById);

// Add new student
router.post("/", addStudent);

// Update student
router.put("/:id", updateStudent);



// Delete student
router.delete("/:id", deleteStudent);

module.exports = router;