document.getElementById("sendAllBtn").addEventListener("click", sendReminderToAll);

const school =
JSON.parse(localStorage.getItem("currentSchool"));

const schoolId =
school?._id || school?.schoolId;

const API = "/api";

document
.getElementById("searchBtn")
.addEventListener("click", loadPendingFees);

window.onload = loadPendingFees;

async function loadPendingFees() {

    const monthValue =
        document.getElementById("monthFilter").value;

    let month = "";
    let year = "";

    if (monthValue) {

        const parts = monthValue.split("-");

        year = parts[0];

        month = parts[1];

    }

    const className =
        document.getElementById("classFilter").value;

    const section =
        document.getElementById("sectionFilter").value;

    const status =
        document.getElementById("statusFilter").value;

        console.log("School ID:", schoolId);

console.log({
    schoolId,
    className,
    section,
    month,
    year,
    status
});

    const res = await fetch(

        API +

        "/fee-reminders/pending?" +

        "schoolId=" + schoolId +

        "&className=" + className +

        "&section=" + section +

        "&month=" + month +

        "&year=" + year +

        "&status=" + status

    );

    const data = await res.json();

    if (!data.success)
        return;

    loadSummary(data.summary);

    loadTable(data.fees);
   

}
function loadSummary(summary){

    document.getElementById("pendingStudents").innerText =
        summary.pendingStudents;

    document.getElementById("pendingAmount").innerText =
        "₹" + summary.pendingAmount;

    document.getElementById("reminderSent").innerText =
        summary.reminderSent;

    document.getElementById("paidStudents").innerText =
        summary.paidStudents;

}

function loadTable(fees){

    const tbody =
        document.getElementById("reminderTable");

    tbody.innerHTML = "";

    if(fees.length===0){

        tbody.innerHTML =

        `<tr>

        <td colspan="11">

        No Pending Fee

        </td>

        </tr>`;

        return;

    }

    fees.forEach(fee=>{

        tbody.innerHTML += `

<tr>

<td>${fee.studentName}</td>

<td>${fee.admissionNo}</td>

<td>${fee.className}-${fee.section}</td>



<td>${fee.mobile}</td>

<td>${fee.month}-${fee.year}</td>

<td>₹${fee.totalFee}</td>

<td>₹${fee.amountPaid}</td>

<td>₹${fee.balance}</td>

<td>

<span class="status-${fee.status.toLowerCase()}">

${fee.status}

</span>

</td>

<td>

<button
class="reminder-btn"
onclick="sendReminder('${fee._id}')">

Send

</button>

</td>

</tr>

`;

    });

}
async function sendReminder(id){

const res = await fetch(

"/api/fee-reminders/send/"+id,

{

method:"POST"

}

);

const data = await res.json();

alert(data.message);

}

async function sendReminderToAll(){

    if(!confirm(
        "Send reminder to all students with pending fees?"
    ))
        return;

    const monthValue =
        document.getElementById("monthFilter").value;

    let month = "";
    let year = "";

    if(monthValue){

        [year, month] = monthValue.split("-");

    }

    const body = {

        schoolId,

        className:
            document.getElementById("classFilter").value,

        section:
            document.getElementById("sectionFilter").value,

        month,

        year

    };

    const res = await fetch(

        "/api/fee-reminders/send-all",

        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(body)

        }

    );

    const data = await res.json();

    alert(data.message);

}