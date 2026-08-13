const express = require("express");
const router = express.Router();

const portalController = require("../controllers/portalController");

// Public Portal Homepage
router.get("/home", portalController.getPortalHome);

router.get("/school/:id", portalController.getSchoolProfile);

module.exports = router;