/*=========================================================
    STUDENT RESULT
=========================================================*/

const API = "/api/evaluation";

/*=========================================================
    PAGE LOAD
=========================================================*/

window.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {

        alert("Invalid Result.");

        history.back();

        return;

    }

    loadResult(id);

});

/*=========================================================
    LOAD RESULT
=========================================================*/

async function loadResult(id) {

    try {

        const response = await fetch(`${API}/${id}`);

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        const result = data.report || data.evaluation;

        fillStudentInfo(result);

        fillSummary(result);

        fillQuestions(result.results || []);

    }

    catch (err) {

        console.error(err);

        alert("Unable to load result.");

    }

}

/*=========================================================
    STUDENT DETAILS
=========================================================*/

function fillStudentInfo(result){

    document.getElementById("schoolName").innerText =
        result.schoolName || "";

    document.getElementById("examName").innerText =
        result.examName || "";

    document.getElementById("studentName").innerText =
        result.studentName || "";

    document.getElementById("rollNo").innerText =
        result.rollNo || "";

    document.getElementById("className").innerText =
        result.className + " - " + result.section;

    document.getElementById("subject").innerText =
        result.subject || "";

}

/*=========================================================
    SUMMARY
=========================================================*/

function fillSummary(result){

    document.getElementById("totalMarks").innerText =
        result.totalMarks || 0;

    document.getElementById("obtainedMarks").innerText =
        result.obtainedMarks || 0;

    document.getElementById("percentage").innerText =
        Number(result.percentage || 0).toFixed(2) + "%";

    document.getElementById("grade").innerText =
        result.grade || "-";

    const status =

        Number(result.percentage)>=40

        ? "PASS"

        : "FAIL";

    document.getElementById("status").innerText =
        status;

    let performance="Needs Improvement";

    if(result.percentage>=90)
        performance="Outstanding";

    else if(result.percentage>=80)
        performance="Excellent";

    else if(result.percentage>=70)
        performance="Very Good";

    else if(result.percentage>=60)
        performance="Good";

    else if(result.percentage>=40)
        performance="Average";

    document.getElementById("performance").innerText =
        performance;

    document.getElementById("teacherRemarks").innerText =

        result.teacherRemarks ||

        result.remarks ||

        performance;

}

/*=========================================================
    QUESTION TABLE
=========================================================*/

function fillQuestions(results){

    const tbody =
        document.getElementById("resultBody");

    tbody.innerHTML="";

    if(results.length===0){

        tbody.innerHTML=`

<tr>

<td colspan="6" class="text-center">

No Question Found

</td>

</tr>

`;

        return;

    }

    results.forEach((q,index)=>{

        tbody.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${q.question || ""}</td>

<td>${q.studentAnswer || "-"}</td>

<td>${q.correctAnswer || "-"}</td>

<td>

${q.obtainedMarks || 0}

/

${q.maxMarks || 0}

</td>

<td>

<span class="${
q.status==="Correct"
?"badge-correct"
:"badge-wrong"
}">

${q.status || "Wrong"}

</span>

</td>

</tr>

`;

    });

}

/*=========================================================
    DOWNLOAD PDF
=========================================================*/

document
.getElementById("downloadBtn")
.addEventListener("click",()=>{

    window.print();

});