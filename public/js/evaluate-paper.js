// ========================================
// AI Answer Sheet Evaluation
// ========================================

const role = localStorage.getItem("role");

const teacher = JSON.parse(
    localStorage.getItem("teacher")
);

const schoolId =
    role === "teacher"
        ? teacher.schoolId
        : localStorage.getItem("schoolId");

// Hidden Paper ID
let selectedPaperId = "";

// DOM

const board =
document.getElementById("board");

const className =
document.getElementById("className");

const section =
document.getElementById("section");

const subject =
document.getElementById("subject");

const examName =
document.getElementById("examName");

const studentTable =
document.getElementById("studentTable");

const multipleFiles =
document.getElementById("multipleFiles");

const uploadAllBtn =
document.getElementById("uploadAllBtn");

const progressFill =
document.getElementById("progressFill");

const progressText =
document.getElementById("progressText");

window.addEventListener("DOMContentLoaded", () => {

    loadFilters();

});

uploadAllBtn.addEventListener(
    "click",
    uploadMultipleAnswerSheets
);

async function loadFilters(){

    try{

        const response =
        await fetch(

`/api/paper/filters?schoolId=${schoolId}`

        );

        const data =
        await response.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        fillSelect(board,data.boards);

        fillSelect(className,data.classes);

        fillSelect(subject,data.subjects);

        fillSelect(examName,data.exams);

    }

    catch(err){

        console.error(err);

        alert("Unable to load filters.");

    }

}

document
.getElementById("loadStudentsBtn")
.addEventListener("click", loadStudents);

async function loadStudents() {

    try {

        if (
            !board.value ||
            !className.value ||
            !subject.value ||
            !examName.value
        ) {

            alert("Please select all exam details.");

            return;

        }

        const response = await fetch(

`/api/evaluation/load-class?schoolId=${schoolId}&board=${encodeURIComponent(board.value)}&className=${encodeURIComponent(className.value)}&section=${encodeURIComponent(section.value)}&subject=${encodeURIComponent(subject.value)}&examName=${encodeURIComponent(examName.value)}`

        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        // Save internally
        selectedPaperId = data.paperId;

        buildStudentTable(data.students);

    }

    catch (err) {

        console.error(err);

        alert("Unable to load students.");

    }

}

function buildStudentTable(students) {

    if (!students.length) {

        studentTable.innerHTML = `
            <tr>
                <td colspan="5">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }

    studentTable.innerHTML = "";

    students.forEach(student => {

        studentTable.innerHTML += `
            <tr>

                <td>${student.rollNo}</td>

                <td>${student.studentName}</td>

                <td>${student.rollNo}</td>

                <td>
                    <span
                        class="status-pending"
                        id="status-${student.rollNo}">
                        Pending
                    </span>
                </td>

                <td id="marks-${student.rollNo}">
                    -
                </td>

            </tr>
        `;

    });

}

async function uploadMultipleAnswerSheets() {

    try {

        if (!selectedPaperId) {

            alert("Please load students first.");

            return;

        }

        if (multipleFiles.files.length === 0) {

            alert("Please select answer sheets.");

            return;

        }

        const formData = new FormData();

        formData.append(
            "paperId",
            selectedPaperId
        );

        for (const file of multipleFiles.files) {

            formData.append(
                "answerSheets",
                file
            );

        }

        uploadAllBtn.disabled = true;

        progressText.innerText = "Uploading...";
        console.log("Uploading paperId:", selectedPaperId);
        const response = await fetch(

            "/api/evaluation/upload-multiple",

            {

                method: "POST",

                body: formData

            }

        );

        const data = await response.json();

        uploadAllBtn.disabled = false;

        if (!data.success) {

            alert(data.message);

            return;

        }

       progressFill.style.width = "100%";

progressText.innerText =
`${data.totalUploaded} papers evaluated successfully`;

// Update Student Table

// Store evaluated roll numbers
const evaluatedRolls = [];

data.evaluations.forEach(e => {

    evaluatedRolls.push(String(e.rollNo));

    const status = document.getElementById(
        `status-${e.rollNo}`
    );

    const marks = document.getElementById(
        `marks-${e.rollNo}`
    );

    if (status) {

        status.className = "status-completed";

        status.innerText = "Evaluated";

    }

    if (marks) {

        marks.innerText =
            `${e.obtainedMarks} / ${e.totalMarks}`;

    }

});

// Mark remaining students as Absent
document.querySelectorAll("[id^='status-']").forEach(status => {

    const rollNo = status.id.replace("status-", "");

    if (!evaluatedRolls.includes(rollNo)) {

        status.className = "status-failed";

        status.innerText = "Absent";

    }

});


alert(
`${data.totalUploaded} papers evaluated successfully.`
);

    }

    catch (err) {

        console.error(err);

        uploadAllBtn.disabled = false;

        alert("Upload failed.");

    }

}

function fillSelect(select,list){

    select.innerHTML = `
        <option value="">
            Select
        </option>
    `;

    list.forEach(item=>{

        select.innerHTML +=
        `<option value="${item}">
            ${item}
        </option>`;

    });

}