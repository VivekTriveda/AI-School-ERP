const express = require("express");

const router = express.Router();

const {
    login,
    createUser,
    createPrincipal,
    getPrincipals,
    deletePrincipal,
    updatePrincipal,
    changePrincipalStatus
} = require("../controllers/userController");

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user using email and password.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: principal@school.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid password.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error during login.
 */
router.post("/login", login);

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a user
 *     description: Create an Admin, Principal, or Teacher user account.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rahul@school.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               role:
 *                 type: string
 *                 example: teacher
 *               schoolId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               schoolName:
 *                 type: string
 *                 example: Delhi Public School
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Science
 *                   - Mathematics
 *               classes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "9"
 *                   - "10"
 *               createdBy:
 *                 type: string
 *                 example: 64f123456789abcdef654321
 *     responses:
 *       200:
 *         description: User created successfully.
 *       400:
 *         description: Email already exists.
 *       500:
 *         description: Server error while creating user.
 */
router.post("/create", createUser);

/**
 * @swagger
 * /api/users/create-principal:
 *   post:
 *     summary: Create a principal
 *     description: Create a new principal account for a school.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - schoolId
 *               - schoolName
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amit Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 example: principal@school.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               schoolId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               schoolName:
 *                 type: string
 *                 example: Delhi Public School
 *               createdBy:
 *                 type: string
 *                 example: 64f123456789abcdef654321
 *     responses:
 *       200:
 *         description: Principal created successfully.
 *       400:
 *         description: Principal already exists.
 *       500:
 *         description: Server error while creating principal.
 */
router.post("/create-principal", createPrincipal);

/**
 * @swagger
 * /api/users/principals:
 *   get:
 *     summary: Get principals
 *     description: Retrieve principal users.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Principals retrieved successfully.
 *       500:
 *         description: Server error while retrieving principals.
 */
router.get("/principals", getPrincipals);

/**
 * @swagger
 * /api/users/principals/{schoolId}:
 *   get:
 *     summary: Get principals by school
 *     description: Retrieve all principal users belonging to a specific school.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: School ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Principals retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 principals:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error while retrieving principals.
 */
router.get("/principals/:schoolId", getPrincipals);

/**
 * @swagger
 * /api/users/principal/{id}:
 *   put:
 *     summary: Update a principal
 *     description: Update principal name, email, school ID, or school name.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Principal user ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amit Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 example: principal@school.com
 *               schoolId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               schoolName:
 *                 type: string
 *                 example: Delhi Public School
 *     responses:
 *       200:
 *         description: Principal updated successfully.
 *       404:
 *         description: Principal not found.
 *       500:
 *         description: Server error while updating principal.
 */
router.put("/principal/:id", updatePrincipal);

/**
 * @swagger
 * /api/users/principal/status/{id}:
 *   patch:
 *     summary: Change principal status
 *     description: Toggle a principal's status between Active and Inactive.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Principal user ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Principal status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Status updated successfully
 *                 status:
 *                   type: string
 *                   example: Active
 *       404:
 *         description: Principal not found.
 *       500:
 *         description: Server error while changing principal status.
 */
router.patch("/principal/status/:id", changePrincipalStatus);

/**
 * @swagger
 * /api/users/principal/{id}:
 *   delete:
 *     summary: Delete a principal
 *     description: Delete a principal user account.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Principal user ID.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Principal deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Principal deleted successfully
 *       404:
 *         description: Principal not found.
 *       500:
 *         description: Server error while deleting principal.
 */
router.delete("/principal/:id", deletePrincipal);

module.exports = router;
