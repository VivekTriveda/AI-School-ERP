/**
 * @swagger
 * tags:
 *   name: Portal
 *   description: Public school portal APIs
 */

const express = require("express");
const router = express.Router();

const portalController = require("../controllers/portalController");


/**
 * @swagger
 * /api/portal/home:
 *   get:
 *     summary: Get public portal homepage
 *     description: Get featured schools, published notices, admissions, events, tenders, live ticker and portal statistics.
 *     tags: [Portal]
 *     responses:
 *       200:
 *         description: Portal homepage data retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/home",
    portalController.getPortalHome
);


/**
 * @swagger
 * /api/portal/school/{id}:
 *   get:
 *     summary: Get public school profile
 *     description: Get school information along with published notices, events, admissions and tenders.
 *     tags: [Portal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School MongoDB ID
 *     responses:
 *       200:
 *         description: School portal profile retrieved successfully
 *       404:
 *         description: School not found
 *       500:
 *         description: Server error
 */
router.get(
    "/school/:id",
    portalController.getSchoolProfile
);


module.exports = router;
