// ===================================
// CURRENT SCHOOL
// ===================================

const school = JSON.parse(localStorage.getItem("currentSchool"));

if (!school) {

    alert("No school selected.");

    window.location.href = "schools.html";

}

// ===================================
// HEADER
// ===================================

document.getElementById("schoolName").innerText =
    school.schoolName;

document.getElementById("schoolBoard").innerText =
    school.board || "";

document.getElementById("schoolCity").innerText =
    school.city || "";

// ===================================
// LOAD SCHOOL OVERVIEW
// ===================================

loadOverview();

async function loadOverview() {

    try {

        // -----------------------------
        // Principal Details
        // -----------------------------

        const principalRes = await fetch(
            "/api/users/principals/" + school._id
        );

        const principalData =
            await principalRes.json();

        if (
            principalData.success &&
            principalData.principals.length > 0
        ) {

            const principal =
                principalData.principals[0];

            document.getElementById("principalName").innerText =
                principal.name;

            document.getElementById("principalEmail").innerText =
                principal.email;

        } else {

            document.getElementById("principalName").innerText =
                "Not Assigned";

            document.getElementById("principalEmail").innerText =
                "";

        }

        // -----------------------------
        // Dashboard Counts
        // -----------------------------

        const dashboardRes = await fetch(
            "/api/dashboard/" + school._id
        );

        const dashboardData =
            await dashboardRes.json();

        if (dashboardData.success) {

            document.getElementById("teacherCount").innerText =
                dashboardData.teachers || 0;

            document.getElementById("studentCount").innerText =
                dashboardData.students || 0;

            document.getElementById("bookCount").innerText =
                dashboardData.books || 0;

            document.getElementById("questionCount").innerText =
                dashboardData.questions || 0;

            document.getElementById("paperCount").innerText =
                dashboardData.papers || 0;

            document.getElementById("evaluationCount").innerText =
                dashboardData.evaluations || 0;

        }

    } catch (err) {

        console.error(err);

    }

}

async function loadFeeDashboard() {

    const res = await fetch("/api/fees/admin/dashboard");

    const data = await res.json();

    if (!data.success) return;

    document.getElementById("totalCollection").textContent =
        "₹" + data.dashboard.totalCollection.toLocaleString("en-IN");

    document.getElementById("pendingAmount").textContent =
        "₹" + data.dashboard.pendingAmount.toLocaleString("en-IN");

    document.getElementById("collectionPercent").textContent =
        data.dashboard.collectionPercent + "%";

    document.getElementById("paidStudents").textContent =
        data.dashboard.paidStudents || 0;
}
loadOverview();

loadFeeDashboard();