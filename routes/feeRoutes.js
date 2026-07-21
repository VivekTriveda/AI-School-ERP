const express = require("express");

const router = express.Router();

const feeController = require("../controllers/feeController");

router.post("/create", feeController.createFee);

router.get("/dashboard", feeController.getDashboard);

router.get(
    "/admin/dashboard",
    feeController.getAdminDashboard
);

router.get(
    "/admin/schools",
    feeController.getAdminSchoolReport
);

router.get(
    "/admin/school/:schoolId",
    feeController.getAdminSchoolDetails
);
router.get("/principal/dashboard",feeController.getPrincipalDashboard);

router.get("/principal/list",feeController.getPrincipalFeeList);

router.get("/principal/student/:studentId",feeController.getPrincipalStudentFee);



router.get("/all", feeController.getAllFees);

router.get("/current", feeController.getCurrentFee);


router.get("/student/:studentId",feeController.getStudentFees );

router.get("/receipt/:id", feeController.getFeeById);

router.delete( "/:id", feeController.deleteFee );

module.exports = router;