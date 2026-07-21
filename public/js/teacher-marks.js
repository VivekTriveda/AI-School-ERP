const marksTable = document.getElementById("marksTable");

const teacher = JSON.parse(localStorage.getItem("teacher"));
const schoolId = localStorage.getItem("schoolId");

document
.getElementById("loadStudentsBtn")
.addEventListener("click", loadStudents);

// ======================================
// Load Students
// ======================================

async function loadStudents() {

    try {

        const className = teacher.classes[0];
        const section = "A";

        const response = await fetch(

`/api/marks/students?schoolId=${schoolId}&className=${className}&section=${section}`

        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        marksTable.innerHTML = "";

        data.students.forEach(student => {

            marksTable.innerHTML += `

<tr>

<td>${student.rollNo}</td>

<td class="student-name">

${student.studentName}

</td>

<td>

<input

type="number"

min="0"

max="${document.getElementById("maxMarks").value}"

class="mark-input"

id="mark-${student._id}"

>

</td>

<td>

<input

type="text"

class="remark-input"

id="remark-${student._id}"

placeholder="Remarks"

>

</td>

</tr>

`;

        });

        loadMarks();

    }

    catch (err) {

        console.error(err);

        alert("Unable to load students.");

    }

}

// ======================================
// Load Existing Marks
// ======================================

async function loadMarks() {

    try {

        const className = teacher.classes[0];
        const section = "A";

        const exam =
            document.getElementById("exam").value;

        if (!exam) return;

        const subject =
            teacher.subjects[0];

        const response = await fetch(

`/api/marks?schoolId=${schoolId}&className=${className}&section=${section}&exam=${exam}&subject=${subject}`

        );

        const data = await response.json();

        if (!data.marks) return;

        data.marks.marks.forEach(item => {

            const mark =
                document.getElementById(`mark-${item.studentId}`);

            const remark =
                document.getElementById(`remark-${item.studentId}`);

            if (mark) {

                mark.value = item.obtainedMarks;

            }

            if (remark) {

                remark.value = item.remarks;

            }

        });

    }

    catch (err) {

        console.error(err);

    }

}

// ======================================
// Save Marks
// ======================================

document
.getElementById("saveMarksBtn")
.addEventListener("click", saveMarks);

async function saveMarks() {

    try {

        const exam =
            document.getElementById("exam").value;

        if (!exam) {

            alert("Please select an exam.");

            return;

        }

        const marks = [];

        document
        .querySelectorAll("#marksTable tr")
        .forEach(row => {

            const markInput =
                row.querySelector(".mark-input");

            if (!markInput) return;

            const studentId =
                markInput.id.replace("mark-", "");

            marks.push({

                studentId,

                obtainedMarks: Number(markInput.value || 0),

                remarks:

                    document
                    .getElementById(`remark-${studentId}`)
                    .value

            });

        });

        const body = {

            schoolId,

            board: teacher.board,

            className: teacher.classes[0],

            section: "A",

            exam,

            subject: teacher.subjects[0],

            teacherId: teacher._id,

            marks

        };

        const response = await fetch("/api/marks", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(body)

        });

        const data = await response.json();

        alert(data.message);

    }

    catch (err) {

        console.error(err);

        alert("Unable to save marks.");

    }

}