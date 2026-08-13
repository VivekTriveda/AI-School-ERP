/*=========================================================
    PRINCIPAL DASHBOARD
=========================================================*/

const school = JSON.parse(localStorage.getItem("currentSchool"));
// ==========================================
// PACKAGE FEATURE ACCESS
// ==========================================

const PACKAGE_FEATURES = {
    basic: {
        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,
        attendance: true,
        fees: true,
        salary: false,
        timetable: false,
        onlineTests: false,
        questionBank: false,
        aiPaperGenerator: false,
        aiEvaluation: false,
        aiReports: false,
        aiAssistant: true,
        busTracking: false,
        qrClassroom: false
    },

    standard: {
        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,
        attendance: true,
        fees: true,
        salary: true,
        timetable: true,
        onlineTests: false,
        questionBank: false,
        aiPaperGenerator: false,
        aiEvaluation: false,
        aiReports: false,
        aiAssistant: true,
        busTracking: false,
        qrClassroom: false
    },

    premium: {
        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,
        attendance: true,
        fees: true,
        salary: true,
        timetable: true,
        onlineTests: true,
        questionBank: true,
        aiPaperGenerator: false,
        aiEvaluation: false,
        aiReports: false,
        aiAssistant: true,
        busTracking: false,
        qrClassroom: true
    },

    "ai-enterprise": {
        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,
        attendance: true,
        fees: true,
        salary: true,
        timetable: true,
        onlineTests: true,
        questionBank: true,
        aiPaperGenerator: true,
        aiEvaluation: true,
        aiReports: true,
        aiAssistant: true,
        busTracking: true,
        qrClassroom: true
    }
};


// ==========================================
// CHECK FEATURE
// ==========================================

function hasFeature(featureName) {

    const packageName =
        school.subscription?.package || "basic";

    // Custom package
    if (packageName === "custom") {

        return school.subscription?.features?.[featureName] === true;
    }

    const packageFeatures =
        PACKAGE_FEATURES[packageName];

    if (!packageFeatures) {
        return false;
    }

    return packageFeatures[featureName] === true;
}

// ==========================================
// APPLY PACKAGE ACCESS
// SHOW LOCKED FEATURES
// ==========================================

function applyPackageAccess() {

    const packageElements =
        document.querySelectorAll(".package-feature");


    packageElements.forEach(element => {

        const feature =
            element.dataset.feature;

        if (!feature) {
            return;
        }


        const allowed =
            hasFeature(feature);


        // =====================================
        // FEATURE AVAILABLE
        // =====================================

        if (allowed) {

            element.classList.remove(
                "package-locked"
            );

            element.dataset.locked =
                "false";

            return;
        }


        // =====================================
        // FEATURE LOCKED
        // =====================================

        element.classList.add(
            "package-locked"
        );

        element.dataset.locked =
            "true";


        // Change click to subscription page
        element.setAttribute(
            "onclick",
            "openSubscriptionPage(event)"
        );


        // Add lock icon
        if (
            !element.querySelector(
                ".package-lock-icon"
            )
        ) {

            const lockIcon =
                document.createElement("i");

            lockIcon.className =
                "fa-solid fa-lock package-lock-icon";

            element.insertBefore(
                lockIcon,
                element.firstChild
            );
        }


        // Add Upgrade text
        if (
            !element.querySelector(
                ".package-upgrade-text"
            )
        ) {

            const upgradeText =
                document.createElement("small");

            upgradeText.className =
                "package-upgrade-text";

            upgradeText.textContent =
                " Upgrade";

            element.appendChild(
                upgradeText
            );
        }

    });


    // ==========================================
    // HEADER IMPORT BOOK
    // ==========================================

    const importBookButton =
        document.querySelector(
            '.header-btn[onclick*="import-book.html"]'
        );


    if (
        importBookButton &&
        !hasFeature("questionBank")
    ) {

        importBookButton.setAttribute(
            "onclick",
            "openSubscriptionPage(event)"
        );

        importBookButton.classList.add(
            "package-locked"
        );

    }

}


// ==========================================
// OPEN SUBSCRIPTION PAGE
// ==========================================

function openSubscriptionPage(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }

    window.location.href =
        "subscription.html";

}


if (!school) {

    alert("Please select a school.");

    window.location.href = "schools.html";

}

/*=========================================================
    HEADER
=========================================================*/

document.getElementById("schoolName").textContent =
    school.schoolName || "School";

document.getElementById("schoolBoard").textContent =
`${school.board || ""} ${school.city ? " | " + school.city : ""}`;

/*=========================================================
    PAGE LOAD
=========================================================*/

window.addEventListener("DOMContentLoaded", () => {

  applyPackageAccess();
loadDashboard();

});

/*=========================================================
    LOAD DASHBOARD
=========================================================*/

async function loadDashboard(){

    try{

        /*==========================
            PRINCIPAL
        ==========================*/

        const principalRes = await fetch(

            "/api/users/principals/" + school._id

        );

        const principalData = await principalRes.json();

        if(

            principalData.success &&

            principalData.principals.length

        ){

            const principal =

            principalData.principals[0];

            document.getElementById(

                "principalName"

            ).textContent =

            principal.name || principal.principalName;

        }

        /*==========================
            SCHOOL COUNTS
        ==========================*/

        const dashboardRes = await fetch(

            "/api/dashboard/" + school._id

        );

        const dashboardData =

        await dashboardRes.json();

        if(dashboardData.success){

            animateCounter(

                "studentCount",

                dashboardData.students || 0

            );

            animateCounter(

                "teacherCount",

                dashboardData.teachers || 0

            );

            animateCounter(

                "bookCount",

                dashboardData.books || 0

            );
/*==========================
    FEE COLLECTION
==========================*/

const feeRes = await fetch(

    "/api/fees/dashboard?schoolId=" + school._id

);

const feeData = await feeRes.json();

if(feeData.success){

    document.getElementById("feeCollection").textContent =
        "₹" + Number(
            feeData.monthlyCollection || 0
        ).toLocaleString();


    const pendingAmount =
        document.getElementById("pendingAmount");

    if(pendingAmount){

        pendingAmount.textContent =
            "₹" + Number(
                feeData.pendingFees || 0
            ).toLocaleString();

    }

}

}

        /*==========================
            RESULT ANALYTICS
        ==========================*/

        const analyticsRes = await fetch(

            "/api/principal/dashboard/" + school._id

        );

        const analyticsData =

        await analyticsRes.json();

        if(analyticsData.success){

            const a = analyticsData.analytics;

            animateCounter(

                "publishedExamCount",

                a.totalPublished || 0

            );

            document.getElementById(

                "passPercentage"

            ).textContent =

            (a.passPercentage || 0) + "%";

            document.getElementById(

                "averagePercentage"

            ).textContent =

            (a.averagePercentage || 0) + "%";

            animateCounter(

                "failedStudents",

                a.failCount || 0

            );

            loadTopStudents(

                a.topStudents || []

            );

            loadClassPerformance(

                a.classPerformance || []

            );

        }

    }

    catch(err){

        console.error(err);

    }

}
/*=========================================================
    TOP STUDENTS
=========================================================*/

function loadTopStudents(students){

    const div = document.getElementById("topStudents");

    if(!div) return;

    if(students.length===0){

        div.innerHTML=`

        <div class="empty-panel">

            No published results found.

        </div>

        `;

        return;

    }

    div.innerHTML="";

    students.forEach(student=>{

        let medal="";

        if(student.rank===1)
            medal="🥇";
        else if(student.rank===2)
            medal="🥈";
        else if(student.rank===3)
            medal="🥉";
        else
            medal=student.rank;

        div.innerHTML+=`

        <div class="student-row">

            <div>

                <strong>

                    ${medal} ${student.studentName}

                </strong>

                <br>

                <small>

                    Class ${student.className}

                </small>

            </div>

            <div class="student-score">

                ${Number(student.percentage).toFixed(1)}%

            </div>

        </div>

        `;

    });

}

/*=========================================================
    CLASS PERFORMANCE
=========================================================*/

function loadClassPerformance(classes){

    const div=document.getElementById(

        "classPerformance"

    );

    if(!div) return;

    if(classes.length===0){

        div.innerHTML=`

        <div class="empty-panel">

            No class performance available.

        </div>

        `;

        return;

    }

    div.innerHTML="";

    classes.forEach(cls=>{

        let color="#16a34a";

        if(cls.average<40)

            color="#ef4444";

        else if(cls.average<60)

            color="#f59e0b";

        else if(cls.average<80)

            color="#3b82f6";

        div.innerHTML+=`

        <div class="class-card">

            <div class="class-header">

                <strong>

                    ${cls.className}

                </strong>

                <strong>

                    ${cls.average}%

                </strong>

            </div>

            <div class="progress">

                <div
                    class="progress-bar"

                    style="width:${cls.average}%;
                    background:${color};">

                </div>

            </div>

            <small>

                Pass Percentage :
                ${cls.passPercentage}%

            </small>

        </div>

        `;

    });

}
/*=========================================================
    COUNTER ANIMATION
=========================================================*/

function animateCounter(id,endValue){

    const element=document.getElementById(id);

    if(!element) return;

    let current=0;

    const increment=Math.max(

        1,

        Math.ceil(endValue/40)

    );

    const timer=setInterval(()=>{

        current+=increment;

        if(current>=endValue){

            current=endValue;

            clearInterval(timer);

        }

        element.textContent=current;

    },20);

}

/*=========================================================
    LOGOUT
=========================================================*/

function logoutPrincipal(){

    localStorage.removeItem("principal");

    localStorage.removeItem("currentSchool");

    localStorage.removeItem("schoolId");

    localStorage.removeItem("schoolName");

    localStorage.removeItem("role");

    window.location.href="login.html?role=principal";

}