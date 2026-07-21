// =============================
// Teacher Authentication
// =============================

const teacher = JSON.parse(
    localStorage.getItem("teacher")
);

if(!teacher){

    window.location.href =
        "teacher-login.html";

}

// =============================

document.getElementById("welcome").innerHTML =

`Welcome ${teacher.teacherName} 👋`;

document.getElementById("teacherInfo").innerHTML =

`
${teacher.schoolName}

<br>

Subject :
${teacher.subjects.join(", ")}

<br>

Class :
${teacher.classes.join(", ")}

`;

// =============================
// Logout
// =============================

document
.getElementById("logoutBtn")
.addEventListener("click",()=>{

    localStorage.removeItem("teacher");

    localStorage.removeItem("role");

    window.location.href="teacher-login.html";

});