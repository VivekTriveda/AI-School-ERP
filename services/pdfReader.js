const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const poppler = require("pdf-poppler");
const { createWorker } = require("tesseract.js");

async function readPDF(filePath) {

    try {

        // Try normal text extraction first
        const buffer = fs.readFileSync(filePath);

        const data = await pdf(buffer);

        if (data.text && data.text.trim().length > 5000) {

            console.log("✅ Text PDF Detected");
           console.log("Pages:", data.numpages);
    console.log("Characters:", data.text.length);
    console.log("First 300 characters:");
    console.log(data.text.substring(0, 300));
            return data.text;

        }

        console.log("📷 Scanned PDF Detected");

        // Create temp folder
        const outputDir = path.join(__dirname, "../temp");

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Remove old images
        fs.readdirSync(outputDir).forEach(file => {
            fs.unlinkSync(path.join(outputDir, file));
        });

        // Convert PDF pages to PNG
        const opts = {
            format: "png",
            out_dir: outputDir,
            out_prefix: "page",
            page: null
        };

        await poppler.convert(filePath, opts);

        console.log("✅ PDF converted");

        const files = fs
            .readdirSync(outputDir)
            .filter(file => file.endsWith(".png"))
            .sort();

        console.log("Total Images:", files.length);

        let fullText = "";

        // Create OCR worker
        const worker = await createWorker("eng");

        let count = 1;

        for (const file of files) {

            console.log(`OCR ${count}/${files.length}`);

            const imagePath = path.join(outputDir, file);

            const {
                data: { text }
            } = await worker.recognize(imagePath);

            fullText += text + "\n";

            count++;

        }

        await worker.terminate();

        console.log("OCR Finished");

        console.log("Characters:", fullText.length);

        return fullText;

    } catch (err) {

        console.error(err);

        throw err;

    }

}

module.exports = readPDF;