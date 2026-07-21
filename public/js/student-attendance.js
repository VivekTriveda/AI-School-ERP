// =======================================
// Student & School
// =======================================

const student = JSON.parse(localStorage.getItem("student"));

const school = JSON.parse(localStorage.getItem("currentSchool"));

if (!student || !school) {

    alert("Please login first.");

    location.href = "student-login.html";

}

// =======================================
// Header
// =======================================

document.getElementById("studentName").innerText =
student.studentName;

document.getElementById("schoolName").innerText =
school.schoolName;

document.getElementById("backBtn").onclick = () => {

    location.href = "student-dashboard.html";

};

// =======================================
// Current Month
// =======================================

const today = new Date();

document.getElementById("attendanceMonth").value =
today.toISOString().slice(0,7);

// =======================================
// Variables
// =======================================

let attendanceList = [];

// =======================================
// Load Attendance
// =======================================

async function loadAttendance(){

    try{

        const month =
        document.getElementById("attendanceMonth").value;
        console.log("Student Object:", student);

console.log("Student ID:", student.id);

        const response = await fetch(

`/api/attendance/student/${student.id}?month=${month}`

);

        const data = await response.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        attendanceList = data.attendance;

        renderAttendance(attendanceList);

        updateSummary(attendanceList);

    }

    catch(err){

        console.error(err);

        alert("Unable to load attendance.");

    }

}

// =======================================
// Summary
// =======================================

function updateSummary(list){

    const present =
    list.filter(x=>x.status==="Present").length;

    const absent =
    list.filter(x=>x.status==="Absent").length;

    const leave =
    list.filter(x=>x.status==="Leave").length;

    const total =
    list.length;

    const percent =
    total===0
    ?0
    :Math.round((present/total)*100);

    document.getElementById("attendancePercent").innerText =
    percent+"%";

    document.getElementById("presentDays").innerText =
    present;

    document.getElementById("absentDays").innerText =
    absent;

    document.getElementById("leaveDays").innerText =
    leave;

}

// =======================================
// Table
// =======================================

function renderAttendance(list){

    const tbody =
    document.getElementById("attendanceBody");

    tbody.innerHTML="";

    if(list.length===0){

        tbody.innerHTML=`

<tr>

<td colspan="4"
style="text-align:center">

No Attendance Found

</td>

</tr>

`;

        return;

    }

    list.forEach(item=>{

        let badge="present";

        if(item.status==="Absent")
            badge="absent";

        if(item.status==="Leave")
            badge="leave";

        tbody.innerHTML+=`

<tr>

<td>

${item.date}

</td>

<td>

${item.day || "-"}

</td>

<td>

<span class="status ${badge}">

${item.status}

</span>

</td>

<td>

${item.remarks || "-"}

</td>

</tr>

`;

    });

}

// =======================================
// Button
// =======================================

document
.getElementById("loadAttendance")
.onclick = loadAttendance;

// =======================================
// Start
// =======================================

loadAttendance();