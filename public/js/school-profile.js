const API = "http://localhost:5000/api/portal/school/";

const params = new URLSearchParams(window.location.search);

const schoolId = params.get("id");

if (!schoolId) {
    window.location.href = "index.html";
}

async function loadSchoolProfile() {

    try {

        const response = await fetch(API + schoolId);

        const data = await response.json();

        if (!data.success) {

            alert(data.message || "School not found");

            return;

        }

        renderSchool(data.school);
        renderUpdates("noticeContainer", data.notices);

renderUpdates("eventContainer", data.events);

renderUpdates("admissionContainer", data.admissions);

    } catch (err) {

        console.error(err);

        alert("Unable to load school profile.");

    }

}

function renderSchool(school) {

    document.title = school.schoolName;

    /* ==========================
       HERO
    ========================== */

    document.getElementById("schoolName").textContent =
        school.schoolName || "";

    document.getElementById("heroLocation").textContent =
        `${school.city || ""}, ${school.state || ""}`;

    document.getElementById("heroBoard").textContent =
        school.board || "";

    /* ==========================
       QUICK INFO
    ========================== */

    document.getElementById("schoolAddress").textContent =
        school.address || "Not Available";

    document.getElementById("schoolPhone").textContent =
        school.phone ||
        school.mobile ||
        "Not Available";

    document.getElementById("schoolEmail").textContent =
        school.email || "Not Available";

    document.getElementById("schoolBoard").textContent =
        school.board || "Not Available";

    /* ==========================
       ABOUT
    ========================== */

    document.getElementById("aboutSchool").textContent =
        school.about ||
        `${school.schoolName} is committed to providing quality education, developing academic excellence, and encouraging students to become responsible citizens through modern learning and holistic development.`;

    /* ==========================
       LOGO
    ========================== */

    const logo = document.getElementById("schoolLogo");

    if (school.logo) {

        logo.src = "http://localhost:5000" + school.logo;

    } else {

        logo.src = "images/logo.png";

    }

    /* ==========================
   CONTACT SECTION
========================== */

document.getElementById("contactAddress").textContent =
    school.address || "Not Available";

document.getElementById("contactPhone").textContent =
    school.phone || school.mobile || "Not Available";

document.getElementById("contactEmail").textContent =
    school.email || "Not Available";

document.getElementById("contactBoard").textContent =
    school.board || "Not Available";

/* ==========================
   FOOTER
========================== */

document.getElementById("footerSchoolName").textContent =
    school.schoolName;

}

function renderUpdates(containerId, list){

    const container = document.getElementById(containerId);

    if(!list || list.length === 0){

        container.innerHTML = `

        <div class="col-12">

            <div class="alert alert-info">

                No updates available.

            </div>

        </div>

        `;

        return;

    }

    container.innerHTML = list.map(item => `

<div class="col-lg-4">

<div class="update-card">

<div class="update-body">

<div class="update-date">

📅 ${new Date(item.createdAt).toLocaleDateString()}

</div>

<div class="update-title">

${item.title}

</div>

<div class="update-desc">

${(item.description || "").substring(0,140)}...

</div>

</div>

<div class="update-footer">

${
item.attachment

?

`<a
href="http://localhost:5000${item.attachment}"
target="_blank"
class="btn btn-primary w-100">

View Details

</a>`

:

`<button
class="btn btn-secondary w-100"
disabled>

No Attachment

</button>`

}

</div>

</div>

</div>

`).join("");

}

loadSchoolProfile();