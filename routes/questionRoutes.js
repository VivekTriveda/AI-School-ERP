const express = require("express");
const router = express.Router();

const Question = require("../models/Question");


// Add Question

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
    chapter,
    
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

}  console.log("Question Filter:", filter);

        const total = await Question.countDocuments(filter);
        const totalSubjects = ( await Question.distinct("subject", filter)).length;

const totalChapters = ( await Question.distinct("chapter", filter)).length;

        const questions = await Question.find(filter)
            .select("subject chapter question marks")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.json({
            page,
            limit,
            total,
            totalSubjects,
            totalChapters,
            totalPages: Math.ceil(total / limit),
            questions
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});
router.get("/filter", async (req,res)=>{

    try{

        const { schoolId, className } = req.query;

        const subjects = await Question.distinct("subject",{
            schoolId,
            className
        });

        res.json({
            success:true,
            subjects
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});
router.get("/chapters", async (req,res)=>{

    try{

        const { schoolId, className, subject } = req.query;

        let filter = {
            schoolId,
            subject
        };

        if(className){
            filter.className = className;
        }
         console.log("Chapter Filter:", filter);
        const chapters = await Question.distinct(
            "chapter",
            filter
        );

        res.json({
            success:true,
            chapters
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});
// Get Single Question

router.get("/:id", async (req, res) => {

    try {

        const question = await Question.findById(req.params.id).lean();

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        res.json(question);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// Update Question

router.put("/:id", async (req, res) => {
  try {

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: question
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});


// Generate Paper

router.get("/generate/:subject", async (req, res) => {
  try {

    const questions = await Question.aggregate([
      {
        $match: {
          subject: req.params.subject
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
      message: error.message
    });
  }
});

// Replace Question

router.get("/replace", async (req, res) => {

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
           schoolId: req.query.schoolId,
           subject

        };

// Only filter by chapter if it exists
if (chapter && chapter !== "undefined" && chapter !== "") {
    filter.chapter = chapter;
}

// Only filter by marks if it exists
if (marks) {
    filter.marks = Number(marks);
}

// Only filter by type if it exists
if (type && type !== "undefined") {
    filter.type = type;
}

        let questions = await Question.aggregate([

            {

                $match: filter

            },

            {

                $sample: {

                    size: 200

                }

            }

        ]);

        questions = questions.filter(

            q => q._id.toString() !== exclude

        );

        if (questions.length === 0) {

            return res.json({

                success: false,

                message: "No replacement question found."

            });

        }

        res.json({

            success: true,

            question: questions[0]

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});




//delete Question

router.delete("/:id", async (req,res)=>{

    try{

        await Question.findByIdAndDelete(
            req.params.id
        );

        res.json({
            success:true,
            message:"Deleted Successfully"
        });

    }catch(error){

        res.status(500).json({
            message:error.message
        });
    }
});

//generate paper based on marks

router.post("/generate-marks", async (req, res) => {

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

if(chapter){
    filter.chapter = chapter;
}

        // Get questions by type/marks
       let mcqQuestions = [];
let twoMarks = [];
let threeMarks = [];
let fiveMarks = [];

if (questionType === "MCQ") {

    mcqQuestions = await Question.aggregate([
        { $match: { ...filter, type: "MCQ" } },
        { $sample: { size: 100 } }
    ]);

}
else if (questionType === "DESCRIPTIVE") {

    twoMarks = await Question.aggregate([
        { $match: { ...filter, marks: 2 } },
        { $sample: { size: 100 } }
    ]);

    threeMarks = await Question.aggregate([
        { $match: { ...filter, marks: 3 } },
        { $sample: { size: 100 } }
    ]);

    fiveMarks = await Question.aggregate([
        { $match: { ...filter, marks: 5 } },
        { $sample: { size: 100 } }
    ]);

}
else {

    // ALL QUESTION TYPES

    mcqQuestions = await Question.aggregate([
        { $match: { ...filter, type: "MCQ" } },
        { $sample: { size: 20 } }
    ]);

    twoMarks = await Question.aggregate([
        { $match: { ...filter, marks: 2 } },
        { $sample: { size: 20 } }
    ]);

    threeMarks = await Question.aggregate([
        { $match: { ...filter, marks: 3 } },
        { $sample: { size: 20 } }
    ]);

    fiveMarks = await Question.aggregate([
        { $match: { ...filter, marks: 5 } },
        { $sample: { size: 20 } }
    ]);

}
        let paper = [];
        let marks = 0;

        function addQuestions(list) {
            for (const q of list) {
                if (marks + q.marks <= totalMarks) {
                    paper.push(q);
                    marks += q.marks;
                }
            }
        }

        // Add questions in preferred order
        addQuestions(mcqQuestions);
        addQuestions(twoMarks);
        addQuestions(threeMarks);
        addQuestions(fiveMarks);

        res.json({
            totalMarks: marks,
            questions: paper
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
// Delete All Questions

router.delete("/delete-all", async (req, res) => {

    try {

        const result = await Question.deleteMany({});

        res.json({
            success: true,
            message: `${result.deletedCount} questions deleted successfully.`
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});



module.exports = router;