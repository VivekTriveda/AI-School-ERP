const express = require("express");

const router = express.Router();

const {
    registerAdmin,
    loginAdmin
} = require("../controllers/authController");

const {
    loginPrincipal
} = require("../controllers/principalController");


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Admin and Principal authentication APIs
 */


/**
 * @swagger
 * /api/auth/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - mobile
 *               - username
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: School Administrator
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@school.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Admin created or admin already exists
 *       500:
 *         description: Server error
 */
router.post("/admin/register", registerAdmin);


/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Login result
 *       500:
 *         description: Server error
 */
router.post("/admin/login", loginAdmin);


/**
 * @swagger
 * /api/auth/principal/login:
 *   post:
 *     summary: Principal login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: principal
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Principal@123
 *     responses:
 *       200:
 *         description: Principal login result with principal and school information
 *       500:
 *         description: Server error
 */
router.post("/principal/login", loginPrincipal);


module.exports = router;
