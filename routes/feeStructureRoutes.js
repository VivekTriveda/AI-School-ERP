const express = require("express");

const router = express.Router();

const controller =
require("../controllers/feeStructureController");

router.post("/save", controller.saveFeeStructure );

router.get( "/get", controller.getFeeStructure);

router.get("/list",controller.listFeeStructures);

router.delete("/:id",controller.deleteFeeStructure);

module.exports = router;