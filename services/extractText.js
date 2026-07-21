const fs = require("fs");
const path = require("path");
const os = require("os");
const { exec } = require("child_process");
const util = require("util");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

const execAsync = util.promisify(exec);

// =========================
// OCR IMAGE
// =========================
async function ocrImage(imagePath) {

    console.log("OCR:", imagePath);

    const result = await Tesseract.recognize(
        imagePath,
        "eng"
    );

    return result.data.text;
}

// =========================
// PDF -> IMAGE
// =========================
async function convertPdfToImages(pdfPath) {

    const outputDir = path.join(
        os.tmpdir(),
        "ocr_" + Date.now()
    );

    fs.mkdirSync(outputDir, {
        recursive: true
    });

    const prefix = path.join(outputDir, "page");

    const command =
        `pdftoppm -png "${pdfPath}" "${prefix}"`;

    await execAsync(command);

    const images = fs.readdirSync(outputDir)
        .filter(f => f.endsWith(".png"))
        .map(f => path.join(outputDir, f));

    return images;
}

// =========================
// MAIN
// =========================
async function extractText(filePath, mimeType) {

    // -------------------------
    // IMAGE
    // -------------------------
    if (
        mimeType === "image/jpeg" ||
        mimeType === "image/png"
    ) {

        console.log("📷 Image Uploaded");

        return await ocrImage(filePath);

    }

    // -------------------------
    // PDF
    // -------------------------
    if (mimeType === "application/pdf") {

        const buffer = fs.readFileSync(filePath);

        const pdf = await pdfParse(buffer);

        // Text PDF
        if (pdf.text && pdf.text.trim().length > 50) {

            console.log("✅ Text PDF");

            return pdf.text;

        }

        console.log("📄 Scanned PDF");

        const images = await convertPdfToImages(filePath);

        let finalText = "";

        for (const image of images) {

            finalText += "\n";

            finalText += await ocrImage(image);

        }

        return finalText;

    }

    throw new Error("Unsupported file.");

}

module.exports = extractText;