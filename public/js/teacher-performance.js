const API_BASE = "/api";

document.addEventListener("DOMContentLoaded", () => {

    loadTeacherPerformance();

});

function resetFilters(){

    document.getElementById("academicYear").value="";
    document.getElementById("classFilter").value="";
    document.getElementById("subjectFilter").value="";
    document.getElementById("teacherFilter").value="";
    document.getElementById("ratingFilter").value="";

    loadTeacherPerformance();

}

async function loadTeacherPerformance(){

   const school =
    JSON.parse(localStorage.getItem("school")) ||
    JSON.parse(localStorage.getItem("currentSchool"));
    if (!school) {

    alert("School information not found. Please login again.");

    return;

}
console.log(localStorage.getItem("school"));
console.log(localStorage.getItem("currentSchool"));

    const tbody =
        document.getElementById("teacherPerformanceTable");

    tbody.innerHTML = `
    <tr>
        <td colspan="10" class="loading">
            Loading...
        </td>
    </tr>
    `;

    try{

        const response = await fetch(

            API_BASE +
            "/teacher-performance/dashboard/" +
            school._id

        );

        const data = await response.json();

        document.getElementById("totalTeachers").innerHTML =
            data.totalTeachers;
            document.getElementById("bestTeacher").innerHTML =
data.bestTeacher;

document.getElementById("averageRating").innerHTML =
data.averageRating + "%";

document.getElementById("needImprovement").innerHTML =
data.needImprovement;

        tbody.innerHTML = "";

        if(data.performance.length===0){

            tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    No Teacher Found
                </td>
            </tr>
            `;

            return;

        }

        data.performance.forEach(t=>{

            tbody.innerHTML += `

<tr>

<td>${t.teacherName}</td>

<td>${t.subject}</td>

<td>${t.classes}</td>

<td>${t.studentAverage}%</td>

<td>${t.attendance}%</td>

<td>${t.tests}</td>

<td>${t.results}</td>

<td>

<span class="badge
${
t.rating==="Excellent"
? "badge-success"
:
t.rating==="Very Good"
? "badge-success"
:
t.rating==="Good"
? "badge-warning"
:
"badge-danger"
}">

${t.rating}

</span>

</td>

<td>${t.score}%</td>

<td>

<button
class="view-btn"
onclick='viewTeacherPerformance(${JSON.stringify(t)})'>

View

</button>

</td>

</tr>

`;

        });

    }

    catch(err){

        console.log(err);

    }

}
function viewTeacherPerformance(teacher){

    document.getElementById("modalTeacherName").innerHTML =
        teacher.teacherName;

    document.getElementById("modalTeacherSubject").innerHTML =
        "Subject : " + teacher.subject;

    document.getElementById("modalTeacherClasses").innerHTML =
        "Classes : " + teacher.classes;

    document.getElementById("modalScore").innerHTML =
        teacher.score + "%";

    document.getElementById("modalStudentAverage").innerHTML =
        teacher.studentAverage + "%";

    document.getElementById("modalAttendance").innerHTML =
        teacher.attendance + "%";

    document.getElementById("modalTests").innerHTML =
        teacher.tests;

    document.getElementById("modalResults").innerHTML =
        teacher.results;

    document.getElementById("modalRating").innerHTML =
        teacher.rating;

    let recommendation = "";

    if(teacher.score >= 90){

        recommendation =
        "🏆 Outstanding performance. Continue mentoring other teachers and maintain the excellent academic results.";

    }
    else if(teacher.score >= 80){

        recommendation =
        "✅ Very good performance. Focus on improving student outcomes to achieve an excellent rating.";

    }
    else if(teacher.score >= 70){

        recommendation =
        "📘 Good performance. Increase classroom engagement and conduct more academic assessments.";

    }
    else{

        recommendation =
        "⚠ Performance needs improvement. Improve attendance, conduct regular tests, and provide timely result submissions.";

    }

    document.getElementById("modalRecommendation").innerHTML =
        recommendation;

    document.getElementById("teacherModal").style.display =
        "block";

}

function closeTeacherModal(){

    document.getElementById("teacherModal").style.display =
        "none";

}

window.onclick = function(event){

    const modal =
        document.getElementById("teacherModal");

    if(event.target===modal){

        modal.style.display="none";

    }

};