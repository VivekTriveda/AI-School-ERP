const principal = JSON.parse(localStorage.getItem("principal"));
const school = JSON.parse(localStorage.getItem("currentSchool"));

if (!principal || !school) {

    alert("Please login as Principal.");

    location.href = "login.html?role=principal";

}

// ===============================
// Page Header
// ===============================

document.getElementById("schoolName").innerText =
school.schoolName;
document.getElementById("todayDate").innerText =
new Date().toLocaleDateString("en-IN",{
    weekday:"long",
    day:"numeric",
    month:"long",
    year:"numeric"
});

document.getElementById("backBtn").onclick = () => {

    location.href = "school-dashboard.html";

};

// ===============================
// Load Attendance
// ===============================

let attendanceList = [];
document.getElementById("attendanceDate").value =
new Date().toISOString().split("T")[0];

async function loadAttendance() {

    try {

        const selectedDate =
document.getElementById("attendanceDate").value;

const response = await fetch(

`/api/teacher-attendance/${school._id}?date=${selectedDate}`

);

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        attendanceList = data.attendance;

        renderAttendance(attendanceList);

        updateSummary(attendanceList);

    }

    catch(err){

        console.error(err);

    }

}

// ===============================
// Summary Cards
// ===============================

function updateSummary(list){

    document.getElementById("totalTeachers").innerText =
    list.length;

    document.getElementById("presentTeachers").innerText =
    list.filter(x=>x.status==="Present").length;

    document.getElementById("absentTeachers").innerText =
    list.filter(x=>x.status==="Absent").length;

   document.getElementById("leaveTeachers").innerText =
list.filter(x=>

["CL","EL","SL"].includes(x.status)

).length;

}

// ===============================
// Attendance Table
// ===============================

function renderAttendance(list){

    const tbody =
    document.getElementById("attendanceBody");

    tbody.innerHTML="";

    if(list.length===0){

        tbody.innerHTML=`

<tr>

<td colspan="6"
style="text-align:center">

No Attendance Found

</td>

</tr>

`;

return;

}

list.forEach(item=>{

let badge="present";

if(item.status==="Absent"){

badge="absent";

}

if(item.status==="Leave"){

badge="leave";

}

if(item.status==="Half Day"){

badge="half";

}

tbody.innerHTML+=`

<tr>

<td>

${item.teacherName}

</td>

<td>

${item.subjects ?
item.subjects.join(", ")
:
"-"}

</td>

<td>

${item.classes ?
item.classes.join(", ")
:
"-"}

</td>

<td>

<span class="status ${badge}">

${item.status}

</span>

</td>

<td>

${item.reason || "-"}

</td>

<td>

<span class="approval ${(item.approvalStatus || "Approved").toLowerCase()}">

${item.approvalStatus || "Approved"}

</span>

</td>

<td>

${item.checkIn || "-"}

</td>

<td>

${item.date}

</td>

<td>

${item.approvalStatus==="Pending" ? `

<button
class="approve-btn"
onclick="approveLeave('${item._id}')">

Approve

</button>

<button
class="reject-btn"
onclick="rejectLeave('${item._id}')">

Reject

</button>

` : "-"}

</td>

</tr>

`;

});

}

// ===============================
// Search
// ===============================

document
.getElementById("searchTeacher")
.addEventListener("keyup",function(){

const value=this.value.toLowerCase();

const filtered=
attendanceList.filter(item=>{

return item.teacherName
.toLowerCase()
.includes(value);

});

renderAttendance(filtered);

});

async function approveLeave(id){

    if(!confirm("Approve this leave request?")) return;

    const response = await fetch(

        `/api/teacher-attendance/approve/${id}`,

        {

            method:"PUT"

        }

    );

    const data = await response.json();

    alert(data.message);

    loadAttendance();

}

async function rejectLeave(id){

    if(!confirm("Reject this leave request?")) return;

    const response = await fetch(

        `/api/teacher-attendance/reject/${id}`,

        {

            method:"PUT"

        }

    );

    const data = await response.json();

    alert(data.message);

    loadAttendance();

}

document
.getElementById("loadAttendanceBtn")
.onclick = loadAttendance;

document
.getElementById("todayBtn")
.onclick = () => {

    document.getElementById("attendanceDate").value =
    new Date().toISOString().split("T")[0];

    loadAttendance();

};

// ===============================
// Start
// ===============================

loadAttendance();