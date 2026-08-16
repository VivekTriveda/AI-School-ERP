/**
 * @swagger
 * tags:
 *   name: Fee Structure
 *   description: School fee structure management APIs
 */

const express = require("express");

const router = express.Router();

const controller =
require("../controllers/feeStructureController");


/**
 * @swagger
 * /api/fee-structure/save:
 *   post:
 *     summary: Create or update fee structure
 *     description: Creates or updates a fee structure for a school, class and academic year. Total fee is calculated automatically.
 *     tags: [Fee Structure]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - className
 *               - academicYear
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: 665abc123456789012345678
 *               className:
 *                 type: string
 *                 example: Class 10
 *               academicYear:
 *                 type: string
 *                 example: 2026-27
 *               admissionFee:
 *                 type: number
 *                 example: 5000
 *               tuitionFee:
 *                 type: number
 *                 example: 30000
 *               computerFee:
 *                 type: number
 *                 example: 3000
 *               examinationFee:
 *                 type: number
 *                 example: 2000
 *               libraryFee:
 *                 type: number
 *                 example: 1000
 *               sportsFee:
 *                 type: number
 *                 example: 1000
 *               transportFee:
 *                 type: number
 *                 example: 5000
 *               hostelFee:
 *                 type: number
 *                 example: 0
 *               miscellaneousFee:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Fee structure saved successfully
 *       500:
 *         description: Server error
 */
router.post("/save", controller.saveFeeStructure);


/**
 * @swagger
 * /api/fee-structure/get:
 *   get:
 *     summary: Get fee structure
 *     description: Get the fee structure for a specific school, class and academic year.
 *     tags: [Fee Structure]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *       - in: query
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *         description: Class name
 *       - in: query
 *         name: academicYear
 *         required: true
 *         schema:
 *           type: string
 *         example: 2026-27
 *     responses:
 *       200:
 *         description: Fee structure retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/get",
    controller.getFeeStructure
);


/**
 * @swagger
 * /api/fee-structure/list:
 *   get:
 *     summary: List fee structures
 *     description: Get all fee structures for a school and academic year.
 *     tags: [Fee Structure]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *       - in: query
 *         name: academicYear
 *         required: true
 *         schema:
 *           type: string
 *         example: 2026-27
 *     responses:
 *       200:
 *         description: Fee structures retrieved successfully
 *       500:
 *         description: Server error
 */
router.get(
    "/list",
    controller.listFeeStructures
);


/**
 * @swagger
 * /api/fee-structure/{id}:
 *   delete:
 *     summary: Delete fee structure
 *     tags: [Fee Structure]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Fee structure MongoDB ID
 *     responses:
 *       200:
 *         description: Fee structure deleted successfully
 *       500:
 *         description: Server error
 */
router.delete(
    "/:id",
    controller.deleteFeeStructure
);


module.exports = router;
