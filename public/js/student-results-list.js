/* =====================================================
   STUDENT RESULT LIST
===================================================== */

const API = "/api/evaluation";
const student = JSON.parse(localStorage.getItem("student"));
const token = localStorage.getItem("studentToken");

let allResults = [];

/* =====================================================
   PAGE LOAD
===================================================== */

window.addEventListener("DOMContentLoaded", () => {

    loadResults();

});

/* =====================================================
   LOAD RESULTS
===================================================== */

async function loadResults(){

    try{

        const response = await fetch(

            API + "/student/" + student.id,

            {

                headers:{

                    Authorization:
                    "Bearer " + token

                }

            }

        );

        const data = await response.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        allResults = data.results || [];

        fillSubjectFilter();

        renderResults(allResults);

    }

    catch(err){

        console.log(err);

        alert("Unable to load results.");

    }

}

/* =====================================================
   SUBJECT FILTER
===================================================== */

function fillSubjectFilter(){

    const select =

    document.getElementById("subjectFilter");

    const subjects =

    [...new Set(allResults.map(x=>x.subject))];

    subjects.forEach(subject=>{

        select.innerHTML +=

        `<option value="${subject}">

            ${subject}

        </option>`;

    });

}

/* =====================================================
   RENDER RESULTS
===================================================== */

function renderResults(results){

    const tbody =

    document.getElementById("resultsTable");

    tbody.innerHTML = "";

    if(results.length===0){

        tbody.innerHTML =

        `<tr>

        <td colspan="8"

        class="no-data">

        No Results Found

        </td>

        </tr>`;

        return;

    }

    let highest = 0;

    let pass = 0;

    let average = 0;

    results.forEach(result=>{

        average += Number(result.percentage);

        if(result.obtainedMarks > highest)
            highest = result.obtainedMarks;

        if(result.percentage >= 40)
            pass++;

        tbody.innerHTML +=

        `<tr>

<td>

${result.examName}

</td>

<td>

${result.subject}

</td>

<td>

${new Date(result.createdAt)

.toLocaleDateString("en-IN")}

</td>

<td>

${result.obtainedMarks}/${result.totalMarks}

</td>

<td>

${Number(result.percentage)

.toFixed(2)}%

</td>

<td>

<span class="badge badge-grade">

${result.grade}

</span>

</td>

<td>

<span class="badge

${result.percentage>=40

?"badge-pass"

:"badge-fail"}">

${result.percentage>=40

?"PASS"

:"FAIL"}

</span>

</td>

<td>

<button

class="btn btn-primary btn-sm view-btn"

onclick="viewResult('${result._id}')">

View

</button>

</td>

</tr>`;

    });

    document.getElementById("totalExam").innerHTML =
        results.length;

    document.getElementById("averagePercentage").innerHTML =
        (average/results.length).toFixed(1)+"%";

    document.getElementById("highestMarks").innerHTML =
        highest;

    document.getElementById("passCount").innerHTML =
        pass;

}

/* =====================================================
   VIEW RESULT
===================================================== */

function viewResult(id){

    window.location.href =

    "student-results.html?id="+id;

}

/* =====================================================
   FILTER
===================================================== */

document.getElementById("searchExam")

.addEventListener("keyup",applyFilter);

document.getElementById("subjectFilter")

.addEventListener("change",applyFilter);

document.getElementById("gradeFilter")

.addEventListener("change",applyFilter);

function applyFilter(){

    const exam =

    document.getElementById("searchExam")

    .value

    .toLowerCase();

    const subject =

    document.getElementById("subjectFilter")

    .value;

    const grade =

    document.getElementById("gradeFilter")

    .value;

    const filtered =

    allResults.filter(result=>{

        return(

            result.examName

            .toLowerCase()

            .includes(exam)

            &&

            (subject==="" ||

            result.subject===subject)

            &&

            (grade===""

            ||

            result.grade===grade)

        );

    });

    renderResults(filtered);

}