// =============================
// Teacher Authentication
// =============================

const teacher = JSON.parse(
    localStorage.getItem("teacher")
);

if (!teacher) {

    window.location.href =
        "teacher-login.html";

}


// =============================
// Teacher Information
// =============================

document.getElementById("welcome").innerHTML =
    `Welcome ${teacher.teacherName} 👋`;

document.getElementById("teacherInfo").innerHTML =

`
${teacher.schoolName}

<br>

Subject :
${teacher.subjects.join(", ")}

<br>

Class :
${teacher.classes.join(", ")}
`;




// =====================================================
// SCHOOL SUBSCRIPTION
// =====================================================

let teacherPlan = "basic";
let schoolFeatures = {};


// =====================================================
// LOAD SCHOOL SUBSCRIPTION
// =====================================================

async function loadSchoolSubscription() {

    try {

        const schoolId = teacher.schoolId;

        if (!schoolId) {

            console.error(
                "Teacher schoolId not found."
            );

            return;

        }


        const response = await fetch(
            `/api/schools/${schoolId}`
        );


        if (!response.ok) {

            throw new Error(
                `School API error: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !data.school
        ) {

            throw new Error(
                "School information not found."
            );

        }


        const school =
            data.school;


        // -----------------------------------------
        // GET ACTUAL SCHOOL PACKAGE
        // -----------------------------------------

        teacherPlan =
            String(
                school.subscription?.package ||
                "basic"
            )
            .toLowerCase()
            .trim();


        // -----------------------------------------
        // GET ACTUAL SCHOOL FEATURES
        // -----------------------------------------

        schoolFeatures =
            school.subscription?.features ||
            {};


        console.log(
            "Teacher School:",
            school.schoolName
        );


        console.log(
            "Teacher School Package:",
            teacherPlan
        );


        console.log(
            "Teacher School Features:",
            schoolFeatures
        );


    } catch (error) {

        console.error(
            "Subscription loading error:",
            error
        );

    }

}


// =====================================================
// CHECK TEACHER FEATURE
// =====================================================

function teacherHasFeature(feature) {

    // -----------------------------------------
    // CUSTOM PACKAGE
    // -----------------------------------------

    if (teacherPlan === "custom") {

        return (
            schoolFeatures[feature] === true
        );

    }


    // -----------------------------------------
    // STANDARD PACKAGE FEATURES
    // -----------------------------------------

    const PACKAGE_FEATURES = {

        basic: [
            "myStudents",
            "studentAttendance",
            "marksEntry",
            "results",
            "myAttendance",
            "myProfile",
            "feeCollection"
        ],


        standard: [
            "myStudents",
            "studentAttendance",
            "marksEntry",
            "results",
            "myAttendance",
            "myProfile",
            "feeCollection",

            "timetable",
            "teacherSalary",
            "performance"
        ],


        premium: [
            "myStudents",
            "studentAttendance",
            "marksEntry",
            "results",
            "myAttendance",
            "myProfile",
            "feeCollection",

            "timetable",
            "teacherSalary",
            "performance",

            "questionBank",
            "onlineTests",
            "qrClassroom",
            "academicAnalytics"
        ],


        "ai-enterprise": [
            "myStudents",
            "studentAttendance",
            "marksEntry",
            "results",
            "myAttendance",
            "myProfile",
            "feeCollection",

            "timetable",
            "teacherSalary",
            "performance",

            "questionBank",
            "onlineTests",
            "qrClassroom",
            "academicAnalytics",

            "generatePaper",
            "aiEvaluation",
            "evaluationReports",
            "aiReports",
            "aiAssistant",
            "smartBusTracking"
        ]

    };


    const features =
        PACKAGE_FEATURES[teacherPlan] || [];


    return features.includes(
        feature
    );

}




// =====================================================
// FEATURE CARD CONTROL
// =====================================================

function setupTeacherFeatureAccess() {

    const featureCards = {

        generatePaper:
            "generate-paper.html",

        questionBank:
            "question-bank.html",

        aiEvaluation:
            "evaluate-paper.html",

        evaluationReports:
            "evaluation-list.html?role=teacher",

        timetable:
            "teacher-timetable.html",

        myAttendance:
            "my-attendance.html",

        teacherSalary:
            "my-payslips.html",

        myStudents:
            "teacher-students.html",

        studentAttendance:
            "teacher-attendance.html",

        marksEntry:
            "teacher-marks.html",

        feeCollection:
            "fees-management.html",

        results:
            "results.html",

        performance:
            "class-performance.html"
    };


    Object.entries(featureCards).forEach(
        ([feature, url]) => {

            const cards =
                document.querySelectorAll(".card");


            cards.forEach(card => {

                const onclick =
                    card.getAttribute("onclick");


                if (
                    !onclick ||
                    !onclick.includes(url)
                ) {
                    return;
                }


                if (
                    teacherHasFeature(feature)
                ) {

                    card.classList.remove(
                        "feature-locked"
                    );

                    return;
                }


                // Lock feature

                card.classList.add(
                    "feature-locked"
                );


                card.setAttribute(
                    "data-feature",
                    feature
                );


                card.setAttribute(
                    "title",
                    "This feature requires a higher subscription"
                );


                card.onclick = function(event) {

                    event.preventDefault();

                    showUpgradeMessage(feature);

                };


                // Add lock badge

                if (
                    !card.querySelector(
                        ".subscription-lock"
                    )
                ) {

                    const lock =
                        document.createElement(
                            "span"
                        );

                    lock.className =
                        "subscription-lock";

                    lock.innerHTML =
                       "🔒 Locked";


                    card.appendChild(lock);

                }

            });

        }
    );

}


// =====================================================
// LOCKED FEATURE MESSAGE FOR TEACHER
// =====================================================

function showUpgradeMessage(feature) {

    const featureNames = {

        generatePaper:
            "AI Paper Generator",

        questionBank:
            "Question Bank",

        aiEvaluation:
            "AI Evaluation",

        evaluationReports:
            "Evaluation Reports",

        timetable:
            "Timetable",

        teacherSalary:
            "Teacher Salary",

        performance:
            "Performance Reports",

        onlineTests:
            "Online Tests",

        qrClassroom:
            "QR Classroom",

        academicAnalytics:
            "Academic Analytics",

        aiReports:
            "AI Reports",

        aiAssistant:
            "AI Assistant",

        smartBusTracking:
            "Smart Bus Tracking"

    };


    const name =
        featureNames[feature] ||
        "This feature";


    alert(
        `${name} is not available in your school's current subscription.\n\nPlease contact your Principal or School Administrator to enable this feature.`
    );

}

// =====================================================
// LOGOUT
// =====================================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "teacher"
            );

            localStorage.removeItem(
                "role"
            );

            window.location.href =
                "teacher-login.html";

        }
    );


// =====================================================
// PAGE READY
// =====================================================

window.addEventListener(
    "DOMContentLoaded",
    async () => {

        // First load the school's
        // real subscription

        await loadSchoolSubscription();


        // Then apply feature permissions

        setupTeacherFeatureAccess();

    }
);