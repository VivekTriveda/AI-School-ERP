/*==========================================================
    AI SCHOOL ERP
    STUDENT ONLINE TEST
==========================================================*/

const API = "/api/online-test";

/*==========================================================
    GLOBAL VARIABLES
==========================================================*/

let test = {};
let questions = [];
let currentQuestion = 0;
let remainingSeconds = 0;

let studentAnswers = {};
let questionStatus = {};

let timerInterval = null;

/*==========================================================
    PAGE LOAD
==========================================================*/

window.addEventListener("load", () => {

    disableRefresh();

    const params = new URLSearchParams(window.location.search);

    const testId = params.get("testId");

    if (!testId) {

        alert("Invalid Test.");

        window.location.href = "student-dashboard.html";

        return;
    }

    loadTest(testId);

});

/*==========================================================
    LOAD TEST
==========================================================*/

async function loadTest(testId) {

    try {

        const response = await fetch(`${API}/${testId}`);

        const data = await response.json();
        console.log("Full API Response:", data);
console.log("Test Object:", data.test);
console.log("Questions From API:", data.test.questions);
console.log("Questions Type:", typeof data.test.questions);
console.log("Is Array:", Array.isArray(data.test.questions));

        if (!data.success) {

            alert(data.message);

            return;
        }

        test = data.test;

        /*
        ----------------------------------
        Normalize Questions
        ----------------------------------
        */

        questions = Array.isArray(test.questions)
    ? test.questions
    : [];

console.log("Questions Loaded:", questions);

        console.log("Questions Loaded :", questions);

        if (!questions.length) {

            alert("No questions found.");

            return;

        }

        loadStudent();

        loadExamInfo();
        // enterFullscreen();

        remainingSeconds = Number(test.duration) * 60;

        startTimer();

        createPalette();

        renderQuestion();

    }

    catch (err) {

        console.error(err);

        alert("Unable to load test.");

    }

}

/*==========================================================
    LOAD STUDENT
==========================================================*/

function loadStudent() {

    const student = JSON.parse(

        localStorage.getItem("student")

    );

    if (!student) return;

    document.getElementById("studentName").textContent =
        student.studentName;

}

/*==========================================================
    LOAD EXAM DETAILS
==========================================================*/

function loadExamInfo() {

    document.getElementById("examName").textContent =
        test.examName;

    document.getElementById("subject").textContent =
        test.subject;

    document.getElementById("totalMarks").textContent =
        test.totalMarks;

    document.getElementById("duration").textContent =
        test.duration + " Minutes";

}

/*==========================================================
    TIMER
==========================================================*/

function startTimer() {

    updateTimer();

    timerInterval = setInterval(() => {

        remainingSeconds--;

        updateTimer();

        if (remainingSeconds <= 0) {

            clearInterval(timerInterval);

            autoSubmit();

        }

    }, 1000);

}

function updateTimer() {

    const hrs = Math.floor(remainingSeconds / 3600);

    const mins = Math.floor((remainingSeconds % 3600) / 60);

    const secs = remainingSeconds % 60;

    document.getElementById("timer").textContent =

        String(hrs).padStart(2, "0") + ":" +

        String(mins).padStart(2, "0") + ":" +

        String(secs).padStart(2, "0");

}

/*==========================================================
    DISABLE REFRESH / BACK BUTTON
==========================================================*/

function disableRefresh() {

    // Disable F5

    document.addEventListener("keydown", function(e){

        if(e.key==="F5"){

            e.preventDefault();

        }

        if(e.ctrlKey && e.key.toLowerCase()=="r"){

            e.preventDefault();

        }

        if(e.ctrlKey && e.shiftKey && e.key=="I"){

            e.preventDefault();

        }

        if(e.key=="F12"){

            e.preventDefault();

        }

    });

    // Browser Refresh

    window.addEventListener("beforeunload",function(e){

        e.preventDefault();

        e.returnValue="";

    });

    // Disable Back Button

    history.pushState(null,null,location.href);

    window.onpopstate=function(){

        history.go(1);

    };

    // Disable Right Click

    document.addEventListener("contextmenu",function(e){

        e.preventDefault();

    });

}

/*==========================================================
    RENDER QUESTION
==========================================================*/

function renderQuestion() {

    if (!questions.length) return;

    const q = questions[currentQuestion];
   
    if (!q) {

        console.error("Question not found");

        return;

    }

   console.log("Rendering Question :", q);
console.log("typeof q =", typeof q);
console.log("q instanceof String =", q instanceof String);
    console.log("Question Text:", q.question);
console.log("Question Type:", q.type);
console.log("Options:", q.options);

console.log(
    "questionText element:",
    document.getElementById("questionText")
);

console.log(
    "mcqOptions element:",
    document.getElementById("mcqOptions")
);

    /*---------------------------------------
        Header
    ---------------------------------------*/

    document.getElementById("questionNumber").innerText =
        currentQuestion + 1;

    document.getElementById("questionText").innerText =
        q.question || "";
        console.log(
    "After setting text:",
    document.getElementById("questionText").innerText
);

    document.getElementById("questionMarks").innerText =
        (q.marks || 0) + " Marks";

    /*---------------------------------------
        Hide all answer boxes
    ---------------------------------------*/

    document.getElementById("mcqOptions").style.display = "none";

    document.getElementById("shortAnswerBox").style.display = "none";

    document.getElementById("longAnswerBox").style.display = "none";

    /*---------------------------------------
        MCQ
    ---------------------------------------*/

    if (q.type === "MCQ") {

        document.getElementById("mcqOptions").style.display = "block";

        const radios = document.querySelectorAll(
            'input[name="answer"]'
        );

        radios.forEach((radio, index) => {

            radio.checked = false;

            radio.value = q.options?.[index] || "";

        });

        document.getElementById("optionA").innerText =
            q.options?.[0] || "";

        document.getElementById("optionB").innerText =
            q.options?.[1] || "";

        document.getElementById("optionC").innerText =
            q.options?.[2] || "";

        document.getElementById("optionD").innerText =
            q.options?.[3] || "";

    }

    /*---------------------------------------
        Short Answer
    ---------------------------------------*/

    else if (q.type === "Short Answer") {

        document.getElementById("shortAnswerBox").style.display = "block";

    }

    /*---------------------------------------
        Long Answer
    ---------------------------------------*/

    else {

        document.getElementById("longAnswerBox").style.display = "block";

    }

    loadSavedAnswer();

    updatePalette();

}

/*==========================================================
    CREATE QUESTION PALETTE
==========================================================*/

function createPalette() {

    const palette = document.getElementById("questionPalette");

    palette.innerHTML = "";

    questions.forEach((q, index) => {

        const btn = document.createElement("button");

        btn.innerText = index + 1;

        btn.className = "notanswered";

        btn.onclick = () => {

            saveCurrentAnswer();

            currentQuestion = index;

            renderQuestion();

        };

        palette.appendChild(btn);

    });

}

/*==========================================================
    UPDATE PALETTE
==========================================================*/

function updatePalette() {

    const buttons = document.querySelectorAll(

        "#questionPalette button"

    );

    buttons.forEach((btn, index) => {

        const q = questions[index];

        btn.className = "";

        if (index === currentQuestion)

            btn.classList.add("current");

        else if (

            questionStatus[q.questionId] === "answered"

        )

            btn.classList.add("answered");

        else if (

            questionStatus[q.questionId] === "review"

        )

            btn.classList.add("review");

        else

            btn.classList.add("notanswered");

    });

}


/*==========================================================
    SAVE CURRENT ANSWER
==========================================================*/

function saveCurrentAnswer() {

    const q = questions[currentQuestion];

    if (!q) return;

    let answer = "";

    // ---------- MCQ ----------

    if (q.type === "MCQ") {

        const selected = document.querySelector(
            'input[name="answer"]:checked'
        );

        if (selected) {

            answer = selected.value;

        }

    }

    // ---------- Short ----------

    else if (q.type === "Short Answer") {

        answer = document
            .getElementById("shortAnswer")
            .value
            .trim();

    }

    // ---------- Long ----------

    else {

        answer = document
            .getElementById("longAnswer")
            .value
            .trim();

    }

    studentAnswers[q.questionId] = answer;

    if (answer !== "") {

        questionStatus[q.questionId] = "answered";

    }
    else {

        if (
            questionStatus[q.questionId] !== "review"
        ) {

            questionStatus[q.questionId] =
                "notanswered";

        }

    }

    updatePalette();

}

/*==========================================================
    LOAD SAVED ANSWER
==========================================================*/

function loadSavedAnswer() {

    const q = questions[currentQuestion];

    if (!q) return;

    // Clear MCQ

    document.querySelectorAll(

        'input[name="answer"]'

    ).forEach(r => r.checked = false);

    // Clear Text

    document.getElementById("shortAnswer").value = "";

    document.getElementById("longAnswer").value = "";

    const saved =

        studentAnswers[q.questionId];

    if (!saved) return;

    // ---------- MCQ ----------

    if (q.type === "MCQ") {

        document.querySelectorAll(

            'input[name="answer"]'

        ).forEach(r => {

            if (r.value === saved)

                r.checked = true;

        });

    }

    // ---------- Short ----------

    else if (q.type === "Short Answer") {

        document.getElementById(

            "shortAnswer"

        ).value = saved;

    }

    // ---------- Long ----------

    else {

        document.getElementById(

            "longAnswer"

        ).value = saved;

    }

}
/*==========================================================
    SAVE & NEXT
==========================================================*/

function saveNext() {

    saveCurrentAnswer();

    if (

        currentQuestion <

        questions.length - 1

    ) {

        currentQuestion++;

        renderQuestion();

    }

}

/*==========================================================
    PREVIOUS
==========================================================*/

function previousQuestion() {

    saveCurrentAnswer();

    if (currentQuestion > 0) {

        currentQuestion--;

        renderQuestion();

    }

}

/*==========================================================
    MARK FOR REVIEW
==========================================================*/

function markReview() {

    const q = questions[currentQuestion];

    if (!q) return;

    saveCurrentAnswer();

    questionStatus[q.questionId] =

        "review";

    updatePalette();

    if (

        currentQuestion <

        questions.length - 1

    ) {

        currentQuestion++;

        renderQuestion();

    }

}

/*==========================================================
    AUTO SAVE
==========================================================*/

setInterval(() => {

    if (questions.length) {

        saveCurrentAnswer();

    }

},15000);

/*==========================================================
    FULL SCREEN
==========================================================*/

async function enterFullscreen() {

    const elem = document.documentElement;

    try {

        if (elem.requestFullscreen) {

            await elem.requestFullscreen();

        }

    } catch (e) {

        console.log(e);

    }

}

/*==========================================================
    TAB SWITCH DETECTION
==========================================================*/

let warningCount = 0;

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        warningCount++;

        alert(

            "Warning " +

            warningCount +

            "/3\n\nDo not switch tabs during examination."

        );

        if (warningCount >= 3) {

            alert(

                "Maximum warning reached.\nExam will be submitted."

            );

            autoSubmit();

        }

    }

});

/*==========================================================
    SUBMIT TEST
==========================================================*/

async function submitTest() {

    saveCurrentAnswer();

    if (!confirm("Submit Examination?")) {

        return;

    }

    try {

        clearInterval(timerInterval);

        const student = JSON.parse(

            localStorage.getItem("student")

        );
        console.log("Student from LocalStorage:", student);

        const payload = {

            testId: test.testId,

            paperId: test.paperId,

           studentId: student._id || student.id,

            schoolId: student.schoolId,

            schoolName: student.schoolName,

            className: student.className,

            section: student.section,

            subject: test.subject,

            examName: test.examName,

            totalMarks: test.totalMarks,

            duration: test.duration,

            answers: []

        };

        questions.forEach(q => {

            payload.answers.push({

                questionId: q.questionId,

                question: q.question,

                correctAnswer: q.answer,

                studentAnswer:

                    studentAnswers[q.questionId] || "",

                marks: q.marks,

                type: q.type,

                status:

                    questionStatus[q.questionId] ||

                    "notanswered"

            });

        });

        const response = await fetch(

            "/api/student-response/submit",

            {

                method: "POST",

                headers: {

                    "Content-Type":

                    "application/json"

                },

                body: JSON.stringify(payload)

            }

        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        alert(

            "Exam Submitted Successfully.\n\nAI Evaluation Started."

        );

        localStorage.removeItem("currentTest");

        window.location.href =

            "student-dashboard.html";

    }

    catch (err) {

        console.error(err);

        alert("Unable to submit test.");

    }

}

/*==========================================================
    AUTO SUBMIT
==========================================================*/

function autoSubmit() {

    submitTest();

}
/*==========================================================
    DISABLE COPY / PASTE
==========================================================*/

["copy","cut","paste"].forEach(eventName=>{

    document.addEventListener(

        eventName,

        e=>{

            e.preventDefault();

        }

    );

});