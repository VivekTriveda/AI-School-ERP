/* =====================================================
   Student Dashboard
===================================================== */

const API_BASE = "/api";

/* =====================================================
   Check Login
===================================================== */

const token = localStorage.getItem("studentToken");
const student = JSON.parse(localStorage.getItem("student"));

if (!token || !student) {

    window.location.href = "student-login.html";

}


/* =====================================================
   Student Details
===================================================== */

function loadStudentInfo(){

    document.getElementById("studentName").innerHTML =
        student.studentName;

    document.getElementById("studentClass").innerHTML =
        "Class " +
        student.className +
        " - " +
        student.section;

    if(document.getElementById("profileName"))
        document.getElementById("profileName").innerHTML =
            student.studentName;

    if(document.getElementById("profileAdmission"))
        document.getElementById("profileAdmission").innerHTML =
            student.admissionNo;

    if(document.getElementById("profileClass"))
        document.getElementById("profileClass").innerHTML =
            student.className;

    if(document.getElementById("profileRoll"))
        document.getElementById("profileRoll").innerHTML =
            student.rollNo;

}

/* =====================================================
   Date & Time
===================================================== */

function updateClock(){

    const now = new Date();

    const options = {

        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"

    };

    const date =
        now.toLocaleDateString("en-IN",options);

    const time =
        now.toLocaleTimeString();

    document.getElementById("currentDate").innerHTML =
        date;

    document.getElementById("currentTime").innerHTML =
        time;

}

/* =====================================================
   Logout
===================================================== */

function logoutStudent(){

    if(!confirm("Do you want to logout?"))
        return;

    localStorage.removeItem("student");

    localStorage.removeItem("studentToken");

    window.location.href="student-login.html";

}

/* =====================================================
   Dashboard
===================================================== */

async function loadDashboard(){

    await Promise.all([

    loadTests(),

    loadResults(),
    loadFees()

]);

}

/* =====================================================
   Helper
===================================================== */

async function getJSON(url){

    const response = await fetch(url,{

        headers:{

            Authorization:
            "Bearer "+token

        }

    });

    return await response.json();

}
/* =====================================================
   Load Available Tests
===================================================== */

async function loadTests() {

    try {

        const data = await getJSON(

            API_BASE +

            "/online-test/available/" +

            student.id

        );

        if (!data.success) {

            console.error(data.message);

            return;

        }

        const tbody = document.getElementById("upcomingTests");

        tbody.innerHTML = "";

        let total = 0;
        let pending = 0;
        let completed = 0;

        data.tests.forEach(test => {

            total++;

            if (test.submitted)
                completed++;
            else
                pending++;

            tbody.innerHTML += `

<tr>

<td>${test.examName}</td>

<td>${test.subject}</td>

<td>${test.examDate || "-"}</td>

<td>

${test.submitted ?

'<span class="badge bg-success">Completed</span>'

:

'<span class="badge bg-warning text-dark">Pending</span>'}

</td>

<td>

${test.submitted ?

`<button class="btn btn-secondary btn-sm" disabled>

Completed

</button>`

:

`<button

class="btn btn-primary btn-sm"

onclick="startTest('${test.testId}')">

Start Test

</button>`}

</td>

</tr>

`;

        });

        if (total === 0) {

            tbody.innerHTML = `

<tr>

<td colspan="5" class="text-center">

No Online Test Available

</td>

</tr>

`;

        }

        document.getElementById("totalTests").innerHTML = total;

        document.getElementById("pendingTests").innerHTML = pending;

        document.getElementById("completedTests").innerHTML = completed;

    }

    catch (err) {

        console.error(err);

    }

}

/* =====================================================
   Start Online Test
===================================================== */

function startTest(testId){

    window.location.href =

    "student-test.html?testId=" + testId;

}

function viewResult(id){

    window.location.href =
    "student-results.html?id=" + id;

}

/* =====================================================
   Load Recent Results
===================================================== */

async function loadResults(){

    try{

        const response = await fetch(

            API_BASE +

            "/evaluation/student/" +

            student.id,

            {

                headers:{

                    Authorization:

                    "Bearer " + token

                }

            }

        );

        if(!response.ok){

            return;

        }

        const data = await response.json();

        const tbody = document.getElementById("recentResults");

        if(!tbody) return;

        tbody.innerHTML = "";

        let totalMarks = 0;

        let totalExam = 0;

        data.results.forEach(result=>{

            totalExam++;

            totalMarks += Number(result.percentage);

           tbody.innerHTML += `

<tr>

<td>${result.examName}</td>

<td>${result.subject}</td>

<td>${result.obtainedMarks}/${result.totalMarks}</td>

<td>

<span class="badge bg-success">

${result.grade}

</span>

</td>

<td>

<button
class="btn btn-primary btn-sm"
onclick="viewResult('${result._id}')">

View Result

</button>

</td>

</tr>

`;

        });

        if(totalExam==0){

            tbody.innerHTML=`

<tr>

<td colspan="4" class="text-center">

No Result Available

</td>

</tr>

`;

            document.getElementById("averageScore").innerHTML="0%";

        }

        else{

            document.getElementById("averageScore").innerHTML=

            Math.round(totalMarks/totalExam)+"%";

        }

    }

    catch(err){

        console.log(err);

    }

}

/* =====================================================
   Load Student Profile
===================================================== */

function loadProfile(){

    const attendance =

    student.attendance || 100;

    const photo =

    student.photo ||

    "images/default-student.png";

    if(document.getElementById("attendance"))

        document.getElementById("attendance").innerHTML=

        attendance+"%";

    if(document.getElementById("profilePhoto"))

        document.getElementById("profilePhoto").src=

        photo;

    if(document.getElementById("studentPhoto"))

        document.getElementById("studentPhoto").src=

        photo;

}

/* =====================================================
   Notification
===================================================== */

function showNotification(message,type="success"){

    const toast=document.createElement("div");

    toast.className=

    "alert alert-"+

    (type==="success"

    ?"success"

    :"danger");

    toast.style.position="fixed";

    toast.style.right="20px";

    toast.style.top="20px";

    toast.style.zIndex="9999";

    toast.style.minWidth="250px";

    toast.innerHTML=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },3000);

}

/* =====================================================
   Auto Refresh Every 60 Seconds
===================================================== */

setInterval(()=>{

    loadTests();

    loadResults();

},60000);

/* =====================================================
   Page Ready
===================================================== */

window.onload=()=>{

     loadStudentInfo();

    updateClock();

    loadDashboard();

    loadProfile();

    loadResults();

    loadNotifications();  

    setInterval(updateClock,1000);

};
/* =====================================================
   Load Student Fees
===================================================== */

async function loadFees() {

    try {

        const data = await getJSON(

            API_BASE +
            "/fees/student/" +
            student.id

        );

        if (!data.success || !data.fees.length) {

            document.getElementById("pendingFees").innerHTML = "₹0";
            return;

        }

        let pending = 0;

        data.fees.forEach(fee => {

            pending += Number(fee.balance || 0);

        });

        document.getElementById("pendingFees").innerHTML =

            "₹" + pending.toLocaleString();

    }

    catch(err){

        console.log(err);

    }

}

/* =====================================
   LOAD NOTIFICATIONS
===================================== */

async function loadNotifications() {

    try {

        const res = await fetch(

            "/api/notifications/student/" +

            student.id

        );

        const data = await res.json();

        if (!data.success) return;

        document.getElementById("notificationCount").innerHTML =
            data.notifications.filter(n => !n.isRead).length;

        const list =
            document.getElementById("notificationList");

        list.innerHTML = "";

        if (data.notifications.length === 0) {

            list.innerHTML =
                "<div style='padding:20px'>No Notifications</div>";

            return;

        }

        data.notifications.forEach(n => {

            list.innerHTML += `

<div class="notification-item">

<h5>${n.title}</h5>

<p>${n.message}</p>

<small>

${new Date(n.createdAt).toLocaleString()}

</small>

</div>

`;

        });

    }

    catch (err) {

        console.log(err);

    }

}

/* =====================================
   NOTIFICATION PANEL
===================================== */

const bell =
document.getElementById("notificationBell");

const panel =
document.getElementById("notificationPanel");

if (bell) {

    bell.onclick = () => {

        panel.style.display =

            panel.style.display === "block"

                ? "none"

                : "block";

    };

}