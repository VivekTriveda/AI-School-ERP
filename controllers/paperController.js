const mongoose = require("mongoose");
const Question = require("../models/Question");
const Paper = require("../models/Paper");
/**
 * Shuffle Array
 */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * Select questions until required marks are reached
 */
function selectQuestions(questions, targetMarks, usedIds) {
  let selected = [];
  let marks = 0;

  const shuffled = shuffle([...questions]);

  for (const q of shuffled) {
    if (usedIds.has(q._id.toString())) continue;

    if (marks + q.marks <= targetMarks) {
      selected.push(q);

      marks += q.marks;

      usedIds.add(q._id.toString());
    }

    if (marks === targetMarks) break;
  }

  return {
    selected,
    marks,
  };
}

/**
 * Blueprint Generator
 */
exports.generateBlueprint = async (req, res) => {
  try {
    const {
      schoolId,
      schoolName,
      board,
      className,
      subject,
      chapters,
      blueprint,
      difficulty,
    } = req.body;

    const used = new Set();

    let finalQuestions = [];

    let totalMarks = 0;

    for (const section of blueprint) {
      let sectionQuestions = [];

      let filter = {
        schoolId: new mongoose.Types.ObjectId(schoolId),
        schoolName,
        board,
        className,
        subject,
        type: section.type,
      };

      if (chapters && chapters.length > 0) {
        filter.chapter = { $in: chapters };
      }

      let questions = await Question.find(filter).lean();

      questions = questions.filter((q) => !used.has(q._id.toString()));

      questions.sort(() => Math.random() - 0.5);

      const easyQuestions = questions.filter((q) => q.difficulty === "Easy");
      const mediumQuestions = questions.filter(
        (q) => q.difficulty === "Medium",
      );
      const hardQuestions = questions.filter((q) => q.difficulty === "Hard");

      const easyMarks = Math.round((section.marks * difficulty.easy) / 100);
      const mediumMarks = Math.round((section.marks * difficulty.medium) / 100);
      const hardMarks = section.marks - easyMarks - mediumMarks;

      let marks = 0;

      function pick(list, targetMarks) {
        let current = 0;

        for (const q of list) {
          if (used.has(q._id.toString())) continue;

          if (current + q.marks > targetMarks) continue;

          q.section = section.title;

          sectionQuestions.push(q);

          used.add(q._id.toString());

          current += q.marks;

          marks += q.marks;
        }
      }

      pick(easyQuestions, easyMarks);
      pick(mediumQuestions, mediumMarks);
      pick(hardQuestions, hardMarks);

      const remainingQuestions = questions.filter(
        (q) => !used.has(q._id.toString()),
      );

      for (const q of remainingQuestions) {
        if (marks + q.marks > section.marks) continue;

        q.section = section.title;

        sectionQuestions.push(q);

        used.add(q._id.toString());

        marks += q.marks;

        if (marks >= section.marks) break;
      }

      totalMarks += sectionQuestions.reduce(
        (a, b) => a + b.marks,

        0,
      );

      finalQuestions.push(...sectionQuestions);
    }
    const paperId = "QP-" + Date.now();

    await Paper.create({
      paperId,

      schoolId,

      schoolName,

      board,

      className,

      subject,

      examName: (req.body.examName || "").trim(),

      section: req.body.section || "A",

      duration: req.body.duration,

      totalMarks,

      questions: finalQuestions.map((q) => ({
        questionId: q._id,

        question: q.question,

        options: q.options,

        answer: q.answer,

        marks: q.marks,

        type: q.type,

        difficulty: q.difficulty,

        chapter: q.chapter,

        section: q.section,
      })),
    });
    res.json({
      success: true,

      paperId,

      totalMarks,

      totalQuestions: finalQuestions.length,

      questions: finalQuestions,
    });
  } catch (err) {
    console.log("========== PAPER ERROR ==========");

    console.log(err.message);

    if (err.errors) {
      Object.keys(err.errors).forEach((key) => {
        console.log(key, "=>", err.errors[key].message);
      });
    }

    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};

/* ==========================================
   Get All Generated Papers
========================================== */

exports.getPaperList = async (req, res) => {
  try {
    const { schoolId } = req.query;

    const papers = await Paper.find({
      schoolId,
    })
      .select("paperId examName subject className section board createdAt")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,

      papers,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};
/* ==========================================
   Get Paper Filters
========================================== */

exports.getPaperFilters = async (req, res) => {
  try {
    const { schoolId } = req.query;

    const papers = await Paper.find({ schoolId });

    const boards = [...new Set(papers.map((p) => p.board))];

    const classes = [...new Set(papers.map((p) => p.className))];

    const sections = [...new Set(papers.map((p) => p.section || "A"))];

    const subjects = [...new Set(papers.map((p) => p.subject))];

    const exams = [
      ...new Set(
        papers
          .map((p) => (p.examName || "").trim())
          .filter((name) => name !== ""),
      ),
    ];

    res.json({
      success: true,

      boards,

      classes,

      sections,

      subjects,

      exams,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};

/* ==========================================
   Get Single Paper
========================================== */

exports.getPaperById = async (req, res) => {
  try {
    const { paperId } = req.params;

    const paper = await Paper.findOne({ paperId });

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found",
      });
    }

    res.json({
      success: true,
      paper,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
