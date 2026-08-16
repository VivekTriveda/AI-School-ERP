const express = require("express");
const router = express.Router();

const Question = require("../models/Question");

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get questions
 *     description: Retrieve questions with pagination, filtering, and search.
 *     tags:
 *       - Question
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 25
 *           example: 25
 *       - in: query
 *         name: search
 *         required: false
 *         description: Search by subject, chapter, or question text.
 *         schema:
 *           type: string
 *           example: photosynthesis
 *       - in: query
 *         name: schoolId
 *         required: false
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *       - in: query
 *         name: className
 *         required: false
 *         schema:
 *           type: string
 *           example: "10"
 *       - in: query
 *         name: subject
 *         required: false
 *         schema:
 *           type: string
 *           example: Science
 *       - in: query
 *         name: chapter
 *         required: false
 *         schema:
 *           type: string
 *           example: Life Processes
 *     responses:
 *       200:
 *         description: Questions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 25
 *                 total:
 *                   type: integer
 *                   example: 175
 *                 totalSubjects:
 *                   type: integer
 *                   example: 5
 *                 totalChapters:
 *                   type: integer
 *                   example: 12
 *                 totalPages:
 *                   type: integer
 *                   example: 7
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       subject:
 *                         type: string
 *                         example: Science
 *                       chapter:
 *                         type: string
 *                         example: Life Processes
 *                       question:
 *                         type: string
 *                         example: What is photosynthesis?
 *                       marks:
 *                         type: number
 *                         example: 2
 */
router.get("/", async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;
        const search = req.query.search || "";

        const skip = (page - 1) * limit;
        const schoolId = req.query.schoolId;

        const {
            className,
            subject,
            chapter
        } = req.query;

        let filter = {};

        if (schoolId) {
            filter.schoolId = schoolId;
        }

        if (className) {
            filter.className = className;
        }

        if (subject) {
            filter.subject = subject;
        }

        if (chapter) {
            filter.chapter = chapter;
        }

        if (search) {

            filter.$or = [

                {
                    subject: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    chapter: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    question: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];

        }

        console.log("Question Filter:", filter);

        const total =
            await Question.countDocuments(filter);

        const totalSubjects =
            (
                await Question.distinct(
                    "subject",
                    filter
                )
            ).length;

        const totalChapters =
            (
                await Question.distinct(
                    "chapter",
                    filter
                )
            ).length;

        const questions =
            await Question.find(filter)
                .select(
                    "subject chapter question marks"
                )
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(limit)
                .lean();

        res.json({

            page,
            limit,
            total,
            totalSubjects,
            totalChapters,
            totalPages:
                Math.ceil(total / limit),

            questions

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});


/**
 * @swagger
 * /api/questions/filter:
 *   get:
 *     summary: Get question subjects
 *     description: Retrieve distinct subjects available for a school and class.
 *     tags:
 *       - Question
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *       - in: query
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *           example: "10"
 *     responses:
 *       200:
 *         description: Subjects retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 subjects:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - Science
 *                     - Mathematics
 *                     - English
 *       500:
 *         description: Server error.
 */
router.get("/filter", async (req, res) => {

    try {

        const {
            schoolId,
            className
        } = req.query;

        const subjects =
            await Question.distinct(
                "subject",
                {
                    schoolId,
                    className
                }
            );

        res.json({

            success: true,

            subjects

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});


/**
 * @swagger
 * /api/questions/chapters:
 *   get:
 *     summary: Get question chapters
 *     description: Retrieve distinct chapters for a school, subject, and optionally class.
 *     tags:
 *       - Question
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *       - in: query
 *         name: className
 *         required: false
 *         schema:
 *           type: string
 *           example: "10"
 *       - in: query
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *           example: Science
 *     responses:
 *       200:
 *         description: Chapters retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 chapters:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - Life Processes
 *                     - Control and Coordination
 *       500:
 *         description: Server error.
 */
router.get("/chapters", async (req, res) => {

    try {

        const {
            schoolId,
            className,
            subject
        } = req.query;

        let filter = {

            schoolId,
            subject

        };

        if (className) {

            filter.className =
                className;

        }

        console.log(
            "Chapter Filter:",
            filter
        );

        const chapters =
            await Question.distinct(
                "chapter",
                filter
            );

        res.json({

            success: true,

            chapters

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});


/**
 * @swagger
 * /api/questions/generate/{subject}:
 *   get:
 *     summary: Generate random questions by subject
 *     description: Return 10 randomly selected questions for a subject.
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: subject
 *         required: true
 *         description: Subject name.
 *         schema:
 *           type: string
 *           example: Science
 *     responses:
 *       200:
 *         description: Random questions generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error.
 */
router.get(
    "/generate/:subject",
    async (req, res) => {

        try {

            const questions =
                await Question.aggregate([

                    {
                        $match: {
                            subject:
                                req.params.subject
                        }
                    },

                    {
                        $sample: {
                            size: 10
                        }
                    }

                ]);

            res.json(questions);

        } catch (error) {

            res.status(500).json({

                message:
                    error.message

            });

        }

    }
);


/**
 * @swagger
 * /api/questions/replace:
 *   get:
 *     summary: Find a replacement question
 *     description: Find a random replacement question using school, subject, chapter, marks, and type filters.
 *     tags:
 *       - Question
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *       - in: query
 *         name: subject
 *         required: true
 *         schema:
 *           type: string
 *           example: Science
 *       - in: query
 *         name: chapter
 *         required: false
 *         schema:
 *           type: string
 *           example: Life Processes
 *       - in: query
 *         name: marks
 *         required: false
 *         schema:
 *           type: number
 *           example: 2
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           example: Short Answer
 *       - in: query
 *         name: exclude
 *         required: false
 *         description: Question ID to exclude from replacement results.
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Replacement question found or no replacement available.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 question:
 *                   type: object
 *       500:
 *         description: Server error.
 */
router.get(
    "/replace",
    async (req, res) => {

        try {

            const {
                schoolId,
                subject,
                chapter,
                marks,
                type,
                exclude
            } = req.query;

            let filter = {

                schoolId:
                    req.query.schoolId,

                subject

            };

            if (
                chapter &&
                chapter !== "undefined" &&
                chapter !== ""
            ) {

                filter.chapter =
                    chapter;

            }

            if (marks) {

                filter.marks =
                    Number(marks);

            }

            if (
                type &&
                type !== "undefined"
            ) {

                filter.type =
                    type;

            }

            let questions =
                await Question.aggregate([

                    {
                        $match:
                            filter
                    },

                    {
                        $sample: {
                            size: 200
                        }
                    }

                ]);

            questions =
                questions.filter(
                    q =>
                        q._id.toString() !==
                        exclude
                );

            if (questions.length === 0) {

                return res.json({

                    success: false,

                    message:
                        "No replacement question found."

                });

            }

            res.json({

                success: true,

                question:
                    questions[0]

            });

        }

        catch (err) {

            res.status(500).json({

                success: false,

                message:
                    err.message

            });

        }

    }
);


/**
 * @swagger
 * /api/questions/generate-marks:
 *   post:
 *     summary: Generate question paper by marks
 *     description: Generate a set of random questions based on school, subject, chapter, total marks, and question type.
 *     tags:
 *       - Question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - subject
 *               - totalMarks
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *               subject:
 *                 type: string
 *                 example: Science
 *               chapter:
 *                 type: string
 *                 example: Life Processes
 *               totalMarks:
 *                 type: number
 *                 example: 20
 *               questionType:
 *                 type: string
 *                 example: DESCRIPTIVE
 *     responses:
 *       200:
 *         description: Questions generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMarks:
 *                   type: number
 *                   example: 20
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error.
 */
router.post(
    "/generate-marks",
    async (req, res) => {

        try {

            const {
                schoolId,
                subject,
                chapter,
                totalMarks,
                questionType
            } = req.body;

            const filter = {

                schoolId,
                subject

            };

            if (chapter) {

                filter.chapter =
                    chapter;

            }

            let mcqQuestions = [];
            let twoMarks = [];
            let threeMarks = [];
            let fiveMarks = [];

            if (questionType === "MCQ") {

                mcqQuestions =
                    await Question.aggregate([

                        {
                            $match: {
                                ...filter,
                                type: "MCQ"
                            }
                        },

                        {
                            $sample: {
                                size: 100
                            }
                        }

                    ]);

            }

            else if (
                questionType === "DESCRIPTIVE"
            ) {

                twoMarks =
                    await Question.aggregate([

                        {
                            $match: {
                                ...filter,
                                marks: 2
                            }
                        },

                        {
                            $sample: {
                                size: 100
                            }
                        }

                    ]);

                threeMarks =
                    await Question.aggregate([

                        {
                            $match: {
                                ...filter,
                                marks: 3
                            }
                        },

                        {
                            $sample: {
                                size: 100
                            }
                        }

                    ]);

                fiveMarks =
                    await Question.aggregate([

                        {
                            $match: {
                                ...filter,
                                marks: 5
                            }
                        },

                        {
                            $sample: {
                                size: 100
                            }
                        }

                    ]);

            }

            else {

                mcqQuestions =
                    await Question.aggregate([

                        {
                            $match: {
                                ...filter,
                                type: "MCQ"
                            }
                        },

                        {
                            $sample: {
                                size: 20
                            }
                        }

                    ]);

                twoMarks =
                    await Question.aggregate([

                        {
                            $match: {
                                ...filter,
                                marks: 2
                            }
                        },

                        {
                            $sample: {
                                size: 20
                            }
                        }

                    ]);

                threeMarks =
                    await Question.aggregate([

                        {
                            $match: {
                                ...filter,
                                marks: 3
                            }
                        },

                        {
                            $sample: {
                                size: 20
                            }
                        }

                    ]);

                fiveMarks =
                    await Question.aggregate([

                        {
                            $match: {
                                ...filter,
                                marks: 5
                            }
                        },

                        {
                            $sample: {
                                size: 20
                            }
                        }

                    ]);

            }

            let paper = [];
            let marks = 0;

            function addQuestions(list) {

                for (const q of list) {

                    if (
                        marks + q.marks <=
                        totalMarks
                    ) {

                        paper.push(q);

                        marks += q.marks;

                    }

                }

            }

            addQuestions(mcqQuestions);
            addQuestions(twoMarks);
            addQuestions(threeMarks);
            addQuestions(fiveMarks);

            res.json({

                totalMarks: marks,

                questions: paper

            });

        }

        catch (error) {

            res.status(500).json({

                message:
                    error.message

            });

        }

    }
);


/**
 * @swagger
 * /api/questions/delete-all:
 *   delete:
 *     summary: Delete all questions
 *     description: Delete every question from the Question collection.
 *     tags:
 *       - Question
 *     responses:
 *       200:
 *         description: All questions deleted successfully.
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
 *                   example: 175 questions deleted successfully.
 *       500:
 *         description: Server error.
 */
router.delete(
    "/delete-all",
    async (req, res) => {

        try {

            const result =
                await Question.deleteMany({});

            res.json({

                success: true,

                message:
                    `${result.deletedCount} questions deleted successfully.`

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);


/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get a single question
 *     description: Retrieve a question by its MongoDB ID.
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Question retrieved successfully.
 *       404:
 *         description: Question not found.
 *       500:
 *         description: Server error.
 */
router.get(
    "/:id",
    async (req, res) => {

        try {

            const question =
                await Question.findById(
                    req.params.id
                ).lean();

            if (!question) {

                return res.status(404).json({

                    message:
                        "Question not found"

                });

            }

            res.json(question);

        }

        catch (err) {

            res.status(500).json({

                message:
                    err.message

            });

        }

    }
);


/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update a question
 *     description: Update a question using its MongoDB ID.
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *               subject:
 *                 type: string
 *                 example: Science
 *               chapter:
 *                 type: string
 *                 example: Life Processes
 *               question:
 *                 type: string
 *                 example: Explain photosynthesis.
 *               answer:
 *                 type: string
 *                 example: Photosynthesis is the process...
 *               marks:
 *                 type: number
 *                 example: 3
 *               difficulty:
 *                 type: string
 *                 example: Medium
 *               type:
 *                 type: string
 *                 example: Short Answer
 *     responses:
 *       200:
 *         description: Question updated successfully.
 *       500:
 *         description: Server error.
 */
router.put(
    "/:id",
    async (req, res) => {

        try {

            const question =
                await Question.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new: true
                    }
                );

            res.json({

                success: true,

                data: question

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);


/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     description: Delete a question by its MongoDB ID.
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Question deleted successfully.
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
 *                   example: Deleted Successfully
 *       500:
 *         description: Server error.
 */
router.delete(
    "/:id",
    async (req, res) => {

        try {

            await Question.findByIdAndDelete(
                req.params.id
            );

            res.json({

                success: true,

                message:
                    "Deleted Successfully"

            });

        }

        catch (error) {

            res.status(500).json({

                message:
                    error.message

            });

        }

    }
);


module.exports = router;
