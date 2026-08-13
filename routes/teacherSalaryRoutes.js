const express = require("express");
const router = express.Router();

const controller = require("../controllers/teacherSalaryController");

router.post("/pay", controller.paySalary);

router.get("/get", controller.getSalary);

router.get("/history", controller.salaryHistory);

router.get("/dashboard", controller.salaryDashboard);

router.get("/teacher/:teacherId",controller.getTeacherSalaryHistory);
router.get("/pending-teachers",controller.getPendingTeachers);

router.delete("/:id", controller.deleteSalary);

module.exports = router;