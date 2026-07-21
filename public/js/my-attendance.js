const teacher =
JSON.parse(localStorage.getItem("teacher"));

if(!teacher){

alert("Please login.");

location.href="teacher-login.html";

}

document.getElementById("teacherName").innerText=
teacher.teacherName;

document.getElementById("schoolName").innerText=
teacher.schoolName;

document.getElementById("todayDate").innerText=
new Date().toDateString();

document.getElementById("backBtn").onclick=()=>{

location.href="teacher-dashboard.html";

};

document.getElementById("markAttendanceBtn")
.onclick=markAttendance;

// =====================================
// Show / Hide Leave Reason
// =====================================

const leaveStatuses = ["CL", "EL", "SL"];

document
.querySelectorAll('input[name="status"]')
.forEach(radio => {

    radio.addEventListener("change", () => {

        const value = document.querySelector(
            'input[name="status"]:checked'
        ).value;

        document.getElementById("leaveReasonBox").style.display =
            leaveStatuses.includes(value)
            ? "block"
            : "none";

    });

});

async function markAttendance(){

const status = document.querySelector(
'input[name="status"]:checked'
).value;

const reason =
document.getElementById("leaveReason")
.value
.trim();

if(["CL","EL","SL"].includes(status) && !reason){

    alert("Please enter leave reason.");

    return;

}

const res=await fetch(
"/api/teacher-attendance/mark",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},


body: JSON.stringify({

    teacherId: teacher._id,

    status,
    reason

})

});

const data=await res.json();

const msg=
document.getElementById("attendanceMessage");

msg.innerHTML=data.message;

msg.style.color=
data.success?"green":"red";

if(data.success){

document.getElementById(
"markAttendanceBtn"
).disabled=true;

}

}