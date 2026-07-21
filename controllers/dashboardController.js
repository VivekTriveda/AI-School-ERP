const Book = require("../models/Book");
const BookChapter = require("../models/BookChapter");
const Question = require("../models/Question");
const Teacher = require("../models/Teacher");
const Paper = require("../models/Paper");
const Evaluation = require("../models/Evaluation");
const Student = require("../models/Student");

exports.getDashboard = async (req, res) => {

    try {

        const { schoolId } = req.params;

        const { className, subject } = req.query;

        let questionFilter = { schoolId };
let bookFilter = { schoolId };

if (className) {

    questionFilter.className = className;
    bookFilter.className = className;

}

if (subject) {

    questionFilter.subject = subject;
    bookFilter.subject = subject;

}

const books = await Book.countDocuments(bookFilter);

const chapters = await BookChapter.countDocuments({
    schoolId
});

const questions = await Question.countDocuments(questionFilter);

const teachers = await Teacher.countDocuments({ schoolId });
const students = await Student.countDocuments({ schoolId });

const subjects = await Book.distinct("subject", bookFilter);

const classes = await Book.distinct("className", bookFilter);


const papers = await Paper.countDocuments({
    schoolId
});

const evaluations = await Evaluation.countDocuments({
    schoolId
});


   res.json({

    success: true,

    books,

    chapters,

    questions,

    teachers,

    students,

    papers,

    evaluations,

    subjects: subjects.length,

    classes: classes.length,

    subjectList: subjects,

    classList: classes

});

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};