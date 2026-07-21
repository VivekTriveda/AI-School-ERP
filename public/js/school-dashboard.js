// ===============================
// CURRENT SCHOOL
// ===============================

const school = JSON.parse(localStorage.getItem("currentSchool"));

if (!school) {

    alert("Please select a school.");

    window.location.href = "schools.html";

}

// ===============================
// HEADER
// ===============================

document.getElementById("schoolName").innerText = school.schoolName;

document.getElementById("schoolBoard").innerText =
    `${school.board} | ${school.city || ""}`;

// ===============================
// LOAD DASHBOARD
// ===============================

loadDashboard();

async function loadDashboard() {

    try {

        // -------------------------------
        // Principal
        // -------------------------------

        const principalRes = await fetch(
            "/api/users/principals/" + school._id
        );

        const principalData = await principalRes.json();

        if (
            principalData.success &&
            principalData.principals.length > 0
        ) {

            const principal = principalData.principals[0];

            document.getElementById("principalName").innerText =
                principal.name;

            document.getElementById("principalEmail").innerText =
                principal.email;

        } else {

            document.getElementById("principalName").innerText =
                "No Principal Assigned";

            document.getElementById("principalEmail").innerText =
                "";

        }

    // ---------------------------------
// Dashboard Counts
// ---------------------------------

const dashboardRes = await fetch(
    "/api/dashboard/" + school._id
);

const dashboardData = await dashboardRes.json();
if (dashboardData.success) {

    document.getElementById("teacherCount").innerText =
        dashboardData.teachers || 0;

    document.getElementById("studentCount").innerText =
        dashboardData.students || 0;

    document.getElementById("bookCount").innerText =
        dashboardData.books || 0;

}        

    } catch (err) {

        console.error(err);

    }

}

// ===================================
// BUTTON FUNCTIONS
// ===================================

function manageTeachers() {

    localStorage.setItem("schoolId", school._id);

    window.location.href = "teacher-management.html";

}

function editPrincipal() {

    alert("Edit Principal Module Coming Next");

}

function resetPrincipalPassword() {

    alert("Reset Password Module Coming Next");

}

function logoutPrincipal() {

    localStorage.removeItem("principal");
    localStorage.removeItem("currentSchool");
    localStorage.removeItem("schoolId");
    localStorage.removeItem("schoolName");
    localStorage.removeItem("role");

    window.location.href = "login.html?role=principal";

}