const express = require("express");

const router = express.Router();

const paperController = require("../controllers/paperController");

/*
Generate Paper using Blueprint
*/

router.post(
    "/generate-blueprint",
    paperController.generateBlueprint
);

router.get(
    "/list",
    paperController.getPaperList
);
router.get(
    "/filters",
    paperController.getPaperFilters
);
module.exports = router;