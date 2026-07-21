const attendanceTable = document.getElementById("attendanceTable");
const attendanceDate = document.getElementById("attendanceDate");

const teacher = JSON.parse(localStorage.getItem("teacher"));
const school = JSON.parse(localStorage.getItem("currentSchool"));

const schoolId = school?._id;

// =====================================
// Dashboard Counters
// =====================================

const totalStudentsEl = document.getElementById("totalStudents");
const presentCountEl = document.getElementById("presentCount");
const absentCountEl = document.getElementById("absentCount");
const leaveCountEl = document.getElementById("leaveCount");
const attendancePercentEl = document.getElementById("attendancePercent");

const footerTotal = document.getElementById("footerTotal");
const footerPresent = document.getElementById("footerPresent");
const footerAbsent = document.getElementById("footerAbsent");
const footerLeave = document.getElementById("footerLeave");


// Default today's date
attendanceDate.value = new Date().toISOString().split("T")[0];

// =====================================
// Load Students
// =====================================

document.getElementById("loadStudentsBtn")
.addEventListener("click", loadStudents);

async function loadStudents(){

    try{

        const className =
            teacher.classes[0];

        const section =
            "A";

        const response =
        await fetch(

`/api/attendance/students?schoolId=${schoolId}&className=${className}&section=${section}`

        );

        const data =
        await response.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        attendanceTable.innerHTML="";

        data.students.forEach(student=>{

            attendanceTable.innerHTML+=`

<tr>

<td>${student.rollNo}</td>

<td class="student-name">

${student.studentName}

</td>

<td>

<input

type="radio"

class="status-radio"

name="${student._id}"

value="Present"

checked>

</td>

<td>

<input

type="radio"

class="status-radio"

name="${student._id}"

value="Absent">

</td>

<td>

<input

type="radio"

class="status-radio"

name="${student._id}"

value="Leave">

</td>

</tr>

`;

        });

        // Update dashboard

updateSummary();

// Attach change events

bindAttendanceEvents();

        loadAttendance();

    }

    catch(err){

        console.error(err);

        alert("Unable to load students.");

    }

}

// =====================================
// Load Attendance
// =====================================

async function loadAttendance(){

try{

const className=
teacher.classes[0];

const section="A";

const response=
await fetch(

`/api/attendance?schoolId=${schoolId}&className=${className}&section=${section}&date=${attendanceDate.value}`

);

const data=
await response.json();

if(!data.attendance) return;

data.attendance.attendance.forEach(item=>{

const radio=document.querySelector(

`input[name="${item.studentId}"][value="${item.status}"]`

);

if(radio){

radio.checked=true;

}

updateSummary();

});

}catch(err){

console.error(err);

}

}

// =====================================
// Update Summary
// =====================================

function updateSummary(){

    const total =
    document.querySelectorAll("tbody tr").length;

    let present = 0;
    let absent = 0;
    let leave = 0;

    document
    .querySelectorAll("tbody tr")
    .forEach(row=>{

        const checked =
        row.querySelector("input:checked");

        if(!checked) return;

        if(checked.value==="Present")
            present++;

        if(checked.value==="Absent")
            absent++;

        if(checked.value==="Leave")
            leave++;

    });

    const percent =
    total===0
    ?0
    :((present/total)*100).toFixed(1);

    totalStudentsEl.innerText=total;

    presentCountEl.innerText=present;

    absentCountEl.innerText=absent;

    leaveCountEl.innerText=leave;

    attendancePercentEl.innerText=
    percent+"%";

    footerTotal.innerText=total;

    footerPresent.innerText=present;

    footerAbsent.innerText=absent;

    footerLeave.innerText=leave;

}

// =====================================
// Bind Radio Events
// =====================================

function bindAttendanceEvents(){

    document
    .querySelectorAll(".status-radio")
    .forEach(radio=>{

        radio.onchange=updateSummary;

    });

}

// =====================================
// Mark All Present
// =====================================

document
.getElementById("markAllPresentBtn")
.addEventListener("click",()=>{

document
.querySelectorAll(
'input[value="Present"]'
)
.forEach(r=>{

r.checked=true;

});

updateSummary();

});

// =====================================
// Search Student
// =====================================

document
.getElementById("searchStudent")
.addEventListener("keyup",function(){

const value=
this.value.toLowerCase();

document
.querySelectorAll("#attendanceTable tr")
.forEach(row=>{

const text=
row.innerText.toLowerCase();

row.style.display=
text.includes(value)
?""
:"none";

});

});

// =====================================
// Save Attendance
// =====================================

document
.getElementById("saveAttendanceBtn")
.addEventListener("click",saveAttendance);

async function saveAttendance(){

try{

const attendance=[];

document
.querySelectorAll("tbody tr")
.forEach(row=>{

const radio=
row.querySelector("input:checked");

attendance.push({

studentId:radio.name,

status:radio.value

});

});

const body={

schoolId,

board:teacher.board,

className:teacher.classes[0],

section:"A",

date:attendanceDate.value,

teacherId:teacher._id,

attendance

};

const response=
await fetch("/api/attendance",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(body)

});

const data=
await response.json();

alert(data.message);

}catch(err){

console.error(err);

alert("Unable to save attendance.");

}

}