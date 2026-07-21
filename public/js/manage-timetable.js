const API = "/api/timetable";

const currentSchool =
JSON.parse(localStorage.getItem("currentSchool"));

const schoolId = currentSchool._id;

// ================================
// Elements
// ================================

const teacherSelect =
    document.getElementById("teacher");

const classSelect =
    document.getElementById("className");

const subjectSelect =
    document.getElementById("subject");

const tableBody =
    document.getElementById("timeTableBody");

// ================================
// Initial Load
// ================================

loadTeachers();

loadClasses();

loadTimeTable();

// ================================
// Load Teachers
// ================================

async function loadTeachers() {

    const response = await fetch(
        `/api/teachers/${schoolId}`
    );

    const data = await response.json();

    teacherSelect.innerHTML =
        '<option value="">Select Teacher</option>';

    data.teachers.forEach(t => {

        teacherSelect.innerHTML += `

<option
value="${t._id}"
data-name="${t.teacherName}">

${t.teacherName}

</option>`;

    });

}

// ================================
// Load Classes
// ================================

async function loadClasses() {

    const response = await fetch(
        `/api/books/${schoolId}`
    );

    const books = await response.json();

    classSelect.innerHTML =
        '<option value="">Select Class</option>';

    const classes = [...new Set(
        books.map(book => book.className)
    )];

    classes.forEach(c => {

        classSelect.innerHTML +=
            `<option value="${c}">${c}</option>`;

    });

}

// ================================
// Load Subjects
// ================================

classSelect.addEventListener(
    "change",
    loadSubjects
);

async function loadSubjects() {

    const response = await fetch(
        `/api/books/${schoolId}`
    );

    const books = await response.json();

    subjectSelect.innerHTML =
        '<option value="">Select Subject</option>';

    const subjects = [...new Set(

        books
            .filter(book => book.className === classSelect.value)
            .map(book => book.subject)

    )];

    subjects.forEach(s => {

        subjectSelect.innerHTML +=
            `<option value="${s}">${s}</option>`;

    });

}

// ================================
// Load Existing Time Table
// ================================

async function loadTimeTable() {

    const response = await fetch(

`${API}?schoolId=${schoolId}`

    );

    const data = await response.json();

    tableBody.innerHTML = "";

    data.timetable.forEach(item => {

        tableBody.innerHTML += `

<tr>

<td>${item.day}</td>

<td>${item.period}</td>

<td>${item.teacherName}</td>

<td>${item.className}</td>

<td>${item.subject}</td>

<td>

${item.startTime}
-
${item.endTime}

</td>

<td>${item.roomNo}</td>

<td>

<button
class="deleteBtn"
onclick="deleteTimeTable('${item._id}')">

Delete

</button>

</td>

</tr>

`;

    });

}

document
.getElementById("saveBtn")
.addEventListener("click", saveTimeTable);

async function saveTimeTable() {

    if (
        !teacherSelect.value ||
        !classSelect.value ||
        !subjectSelect.value
    ) {

        alert("Please fill all fields.");

        return;

    }

    const selectedTeacher =
        teacherSelect.options[
            teacherSelect.selectedIndex
        ];

    const timetable = {

        schoolId: currentSchool._id,

        schoolName: currentSchool.schoolName,

        board: currentSchool.board,

        teacherId: teacherSelect.value,

        teacherName:
            selectedTeacher.dataset.name,

        className:
            classSelect.value,

        subject:
            subjectSelect.value,

        day:
            document.getElementById("day").value,

        period:
            Number(
                document.getElementById("period").value
            ),

        startTime:
            document.getElementById("startTime").value,

        endTime:
            document.getElementById("endTime").value,

        roomNo:
            document.getElementById("roomNo").value

    };

    const response = await fetch(API, {

        method: "POST",

        headers: {

            "Content-Type":
            "application/json"

        },

        body: JSON.stringify(timetable)

    });

    const data = await response.json();

    if (data.success) {

        alert("✅ Time Table Saved");

        loadTimeTable();

        document
        .getElementById("startTime")
        .value = "";

        document
        .getElementById("endTime")
        .value = "";

        document
        .getElementById("roomNo")
        .value = "";

    } else {

        alert(data.message);

    }

}

async function deleteTimeTable(id) {

    if (!confirm("Delete this timetable?"))
        return;

    await fetch(`${API}/${id}`, {

        method: "DELETE"

    });

    loadTimeTable();

}