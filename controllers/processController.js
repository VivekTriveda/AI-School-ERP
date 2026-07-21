const Book = require("../models/Book");
const BookChapter = require("../models/BookChapter");
const Question = require("../models/Question");

const extractQuestions = require("../services/geminiService");
const cleanGeminiResponse = require("../services/questionExtractor");

async function processBook(req, res) {

    try {

        const { bookId } = req.params;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Find all unprocessed chapters for the book, sorted by chapter number
        const chapters = await BookChapter.find({
           bookId,
             processed: false
           }).sort({ chapterNo: 1 });

        if (chapters.length === 0) {

            book.status = "Completed";
            await book.save();

            return res.json({
                success: true,
                message: "Book already processed.",
                totalQuestions: book.totalQuestions
            });

        }

        book.status = "Processing";
        await book.save();

        let generatedQuestions = 0;

        for (const chapter of chapters) {

            console.log(
                `Processing Chapter ${chapter.chapterNo}/${book.totalChunks}`
            );

            try {

                const response = await extractQuestions(

                    chapter.text,

                    book.board,

                    book.className,

                    book.subject

                );

                const data = cleanGeminiResponse(response);

                if (data.questions && data.questions.length > 0) {

                    const questionsToSave = data.questions.map(q => ({
                      
                        schoolId: book.schoolId,
                        schoolName: book.schoolName,
                        board: book.board,

                        className: book.className,

                        subject: book.subject,

                        chapter: q.chapter || "Unknown",

                        question: q.question,

                        answer: q.answer || "",

                        marks: q.marks || 1,

                        difficulty: q.difficulty || "Medium",

                        type: q.type || "Short Answer",

                        options: q.options || []

                    }));

                    await Question.insertMany(questionsToSave);

                    generatedQuestions += questionsToSave.length;

                    chapter.questionCount = questionsToSave.length;

                }

                chapter.processed = true;

                await chapter.save();

                book.processedChunks += 1;

                book.totalQuestions += chapter.questionCount;

                await book.save();

                console.log(
                    `Chapter ${chapter.chapterNo} completed`
                );

            } catch (err) {

                console.error(
                    `Chapter ${chapter.chapterNo} failed`,
                    err.message
                );

            }

        }

      if (book.processedChunks === book.totalChunks) {
    book.status = "Completed";
} else {
    book.status = "Partially Completed";
}

await book.save();

        return res.json({

            success: true,

            message: "Question generation completed.",

            totalQuestions: book.totalQuestions

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
    processBook
};