const readPDF = require("../services/pdfReader");
const Book = require("../models/Book");
const BookChapter = require("../models/BookChapter");
const splitIntoChapters = require("../services/chapterSplitter");

async function uploadBook(req, res) {

    try {

        const {
    board,
    class: className,
    subject,
    schoolId,
    schoolName
} = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF."
            });
        }

        // Read complete PDF
        const pdfText = await readPDF(req.file.path);
        console.log("PDF Length:", pdfText.length);
console.log("First 500 characters:");
console.log(pdfText.substring(0, 500));

      const chapters = splitIntoChapters(pdfText);
       console.log("Total Chunks:", chapters.length);

      const totalChapters = chapters.length;

        

        // Create Book
        const existingBook = await Book.findOne({
    schoolId,
    board,
    className,
    subject,
    fileName: req.file.originalname
});

if (existingBook) {
    return res.status(400).json({
        success: false,
        message: "This book has already been uploaded for this school."
    });
}
        const book = await Book.create({

          schoolId,
          schoolName,
          board,
          className,
          subject,

    fileName: req.file.originalname,

            totalChunks: totalChapters,
            processedChunks: 0,

            totalQuestions: 0,

            status: "Uploaded"

        });

        // Save every chunk

        for (const chapter of chapters) {

    await BookChapter.create({

        schoolId,
        schoolName,
        
        bookId: book._id,

        chapterNo: chapter.chapterNo,

        chapterName: chapter.chapterName,

        text: chapter.text,

        processed: false,

        questionCount: 0,

        status: "Pending"

    });

}

        return res.json({

            success: true,

            message: "Book uploaded successfully.",

            bookId: book._id,

             totalChapters

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

module.exports = {
    uploadBook
};