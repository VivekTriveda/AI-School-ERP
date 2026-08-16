const express = require("express");
const multer = require("multer");

const router = express.Router();

const uploadController = require("../controllers/uploadController");

const upload = multer({
    dest: "uploads/"
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a PDF book
 *     description: Upload a PDF book for processing and question extraction.
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - pdf
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: PDF book file to upload
 *     responses:
 *       200:
 *         description: Book uploaded successfully
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
 *                   example: Book uploaded successfully
 *       400:
 *         description: No PDF file uploaded or invalid file
 *       500:
 *         description: Server error while uploading the book
 */

router.post(
    "/",
    upload.single("pdf"),
    uploadController.uploadBook
);

module.exports = router;
