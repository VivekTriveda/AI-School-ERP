const teacher = JSON.parse(localStorage.getItem("teacher"));

if (!teacher) {

    window.location.href = "teacher-login.html";

}

// ================================
// Teacher Details
// ================================

document.getElementById("teacherName").innerText =
    teacher.teacherName;

document.getElementById("teacherSubject").innerText =
    `${teacher.subjects[0]} | Class ${teacher.classes[0]}`;

// ================================
// Elements
// ================================

const dayFilter =
    document.getElementById("dayFilter");

const container =
    document.getElementById("timeTableContainer");

let timetable = [];

// ================================
// Current Day
// ================================

const days = [

    "Sunday",

    "Monday",

    "Tuesday",

    "Wednesday",

    "Thursday",

    "Friday",

    "Saturday"

];

const today =
    days[new Date().getDay()];

if (today !== "Sunday") {

    dayFilter.value = today;

}

// ================================
// Load Time Table
// ================================

loadTimeTable();

async function loadTimeTable() {

    const response = await fetch(

        `/api/timetable/teacher/${teacher._id}`

    );

    const data = await response.json();

    timetable = data.timetable || [];

    displayTimeTable();

}

// ================================
// Filter
// ================================

dayFilter.addEventListener(

    "change",

    displayTimeTable

);

// ================================
// Display
// ================================

function displayTimeTable() {

    container.innerHTML = "";

    const list = timetable.filter(

        t => t.day === dayFilter.value

    );

    if (list.length === 0) {

        container.innerHTML = `

<div class="period-card free-period">

<h3>

🎉 Free Day

</h3>

<p>

No classes assigned.

</p>

</div>

`;

        return;

    }

    list.sort((a, b) => a.period - b.period);

    list.forEach(item => {

        container.innerHTML += `

<div class="period-card">

<h3>

⏰ Period ${item.period}

</h3>

<p>

<b>📚 Class :</b>

${item.className}

</p>

<p>

<b>📖 Subject :</b>

${item.subject}

</p>

<p>

<b>🕘 Time :</b>

${item.startTime}
-
${item.endTime}

</p>

<p>

<b>🚪 Room :</b>

${item.roomNo}

</p>

</div>

`;

    });

}

// ================================
// Logout
// ================================

function logout() {

    if (!confirm("Logout?"))

        return;

    localStorage.removeItem("teacher");

    localStorage.removeItem("role");

    window.location.href =
        "teacher-login.html";

}