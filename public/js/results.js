const teacher = JSON.parse(localStorage.getItem("teacher"));

if (!teacher) {
    window.location.href = "teacher-login.html";
}

const schoolId = teacher.schoolId;

const classSelect = document.getElementById("className");
const sectionSelect = document.getElementById("section");
const subjectSelect = document.getElementById("subject");
const examInput = document.getElementById("examName");
const tbody = document.querySelector("#resultTable tbody");

// Load teacher classes
teacher.classes.forEach(cls => {
    const option = document.createElement("option");
    option.value = cls;
    option.textContent = cls;
    classSelect.appendChild(option);
});

// Load teacher subjects
teacher.subjects.forEach(sub => {
    const option = document.createElement("option");
    option.value = sub;
    option.textContent = sub;
    subjectSelect.appendChild(option);
});

// ==============================
// Load Results
// ==============================

document.getElementById("loadBtn").addEventListener("click", loadResults);
classSelect.addEventListener("change", loadExamNames);
sectionSelect.addEventListener("change", loadExamNames);
subjectSelect.addEventListener("change", loadExamNames);

async function loadResults() {

    tbody.innerHTML = "";

    try {

        if (!examInput.value) {

    alert("Please select an exam.");

    return;

}

        const url =
            `http://localhost:5000/api/evaluation/teacher-results?schoolId=${schoolId}` +
            `&className=${classSelect.value}` +
            `&section=${sectionSelect.value}` +
            `&subject=${subjectSelect.value}` +
            `&examName=${encodeURIComponent(examInput.value)}`;

            


        const res = await fetch(url);
        const data = await res.json();

        if (!data.success) {
            alert(data.message);
            return;
        }

        if (data.results.length === 0) {

            tbody.innerHTML =
                `<tr>
                    <td colspan="8">No Results Found</td>
                </tr>`;

            return;
        }

        data.results.forEach(r => {

            tbody.innerHTML += `
            <tr>
                <td>${r.rollNo}</td>
                <td>${r.studentName}</td>
                <td>${r.subject}</td>
                <td>${r.examName}</td>
                <td>${r.finalMarks || r.obtainedMarks}/${r.totalMarks}</td>
                <td>${r.percentage}%</td>
                <td>${r.grade}</td>
                <td>
    ${
        r.published
        ? '<span style="color:green;font-weight:bold">Published</span>'
        : '<span style="color:red;font-weight:bold">Not Published</span>'
    }
</td>
            </tr>`;
        });

    } catch (err) {

        console.error(err);
        alert("Unable to load results.");

    }
}

async function loadExamNames() {

    const examSelect = document.getElementById("examName");

    examSelect.innerHTML =
        `<option value="">Select Exam</option>`;

    if (!classSelect.value || !subjectSelect.value)
        return;

    const res = await fetch(

`http://localhost:5000/api/evaluation/exam-names?schoolId=${schoolId}&className=${classSelect.value}&section=${sectionSelect.value}&subject=${subjectSelect.value}`

    );

    const data = await res.json();

    data.exams.forEach(exam => {

        examSelect.innerHTML +=

        `<option value="${exam}">
            ${exam}
        </option>`;

    });

}

document
.getElementById("publishBtn")
.addEventListener("click", publishResults);

async function publishResults() {

    if (!confirm("Publish this result?"))
        return;

    const res = await fetch(

        "http://localhost:5000/api/evaluation/publish",

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                schoolId,

                className: classSelect.value,

                section: sectionSelect.value,

                subject: subjectSelect.value,

                examName: examInput.value,

                teacherName: teacher.teacherName

            })

        }

    );

    const data = await res.json();

    alert(data.message);

    loadResults();

}