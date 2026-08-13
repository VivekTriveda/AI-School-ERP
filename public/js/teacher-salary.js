const school = JSON.parse(localStorage.getItem("currentSchool"));

const schoolId = school?._id || school?.schoolId;

const API = "/api";

let selectedTeacher = null;

/* =====================================
   INITIALIZE
===================================== */

loadDashboard();

loadTeachers();

loadSalaryHistory();

/* =====================================
   DASHBOARD
===================================== */

async function loadDashboard() {

    try {

        const res = await fetch(
            API + "/teacher-salary/dashboard?schoolId=" + schoolId
        );

        const data = await res.json();

        if (!data.success)
            return;

        document.getElementById("totalTeachers").innerText =
            data.totalTeachers;

        document.getElementById("totalSalary").innerText =
            "₹" + Number(data.totalSalary).toLocaleString();

        document.getElementById("pendingSalary").innerText =
            data.pendingSalary;

    } catch (err) {

        console.error(err);

    }

}

/* =====================================
   LOAD TEACHERS
===================================== */

async function loadTeachers() {

    try {

        const res = await fetch(
    API + "/teacher-salary/pending-teachers?schoolId=" + schoolId
);

        const data = await res.json();

        const tbody =
            document.getElementById("teacherSalaryList");

        tbody.innerHTML = "";

        if (!data.success || data.teachers.length === 0) {

            tbody.innerHTML =
                `<tr>
                    <td colspan="4">
                        No Teachers Found
                    </td>
                </tr>`;

            return;

        }

        data.teachers.forEach(teacher => {

            tbody.innerHTML += `

<tr>

<td>${teacher.teacherName}</td>

<td>${teacher.classes || "-"}</td>

<td>${teacher.subjects || "-"}</td>

<td>

<button
class="pay-btn"
onclick="paySalary('${teacher._id}')">

Pay Salary

</button>

</td>

</tr>

`;

        });

    } catch (err) {

        console.error(err);

    }

}

/* =====================================
   PAY SALARY
===================================== */

async function paySalary(id) {

    const teacherRes =
        await fetch(API + "/teachers/teacher/" + id);

    const teacherData =
        await teacherRes.json();

    if (!teacherData.success)
        return;

    selectedTeacher = teacherData.teacher;

    document.getElementById("salaryModal").style.display = "block";

    return;

}
/* =====================================
   CLOSE MODAL
===================================== */

function closeSalaryModal() {

    document.getElementById("salaryModal").style.display = "none";

}

/* =====================================
   CALCULATE NET SALARY
===================================== */

function calculateNetSalary() {

    const basic =
        Number(document.getElementById("basicSalary").value) || 0;

    const hra =
        Number(document.getElementById("hra").value) || 0;

    const da =
        Number(document.getElementById("da").value) || 0;

    const allowance =
        Number(document.getElementById("allowance").value) || 0;

    const bonus =
        Number(document.getElementById("bonus").value) || 0;

    const pf =
        Number(document.getElementById("pf").value) || 0;

    const tax =
        Number(document.getElementById("tax").value) || 0;

    const deduction =
        Number(document.getElementById("deduction").value) || 0;

    const total =
        basic +
        hra +
        da +
        allowance +
        bonus -
        pf -
        tax -
        deduction;

    document.getElementById("netSalary").innerText =
        total.toLocaleString();

}

/* =====================================
   SAVE SALARY
===================================== */

async function saveSalary() {

    if (!selectedTeacher) return;

    const today = new Date();

    const body = {

        schoolId,

        teacherId: selectedTeacher._id,

        teacherName: selectedTeacher.teacherName,

        employeeId: selectedTeacher.employeeId,

        month: String(today.getMonth() + 1).padStart(2, "0"),

        year: today.getFullYear(),

        basicSalary:
            Number(document.getElementById("basicSalary").value) || 0,

        hra:
            Number(document.getElementById("hra").value) || 0,

        da:
            Number(document.getElementById("da").value) || 0,

        allowance:
            Number(document.getElementById("allowance").value) || 0,

        bonus:
            Number(document.getElementById("bonus").value) || 0,

        pf:
            Number(document.getElementById("pf").value) || 0,

        tax:
            Number(document.getElementById("tax").value) || 0,

        deduction:
            Number(document.getElementById("deduction").value) || 0,

        paymentMode:
            document.getElementById("paymentMode").value,

        remarks:
            document.getElementById("remarks").value,

        status: "Paid"

    };

    const res = await fetch(
        API + "/teacher-salary/pay",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(body)
        }
    );

    const data = await res.json();

    alert(data.message);

    closeSalaryModal();

    loadDashboard();

loadSalaryHistory();

}
[
"basicSalary",
"hra",
"da",
"allowance",
"bonus",
"pf",
"tax",
"deduction"
].forEach(id=>{

    document
        .getElementById(id)
        .addEventListener(
            "input",
            calculateNetSalary
        );

});

/* =====================================
   SALARY HISTORY
===================================== */

async function loadSalaryHistory() {

    const res = await fetch(
        API +
        "/teacher-salary/history?schoolId=" +
        schoolId
    );

    const data = await res.json();

    const tbody =
        document.getElementById("salaryHistory");

    tbody.innerHTML = "";

    if (!data.success || data.salaries.length === 0) {

        tbody.innerHTML =

        `<tr>

            <td colspan="6">

                No Salary Records

            </td>

        </tr>`;

        return;

    }

    data.salaries.forEach(salary=>{

        tbody.innerHTML +=`

<tr>

<td>${salary.teacherName}</td>

<td>${salary.month}-${salary.year}</td>

<td>₹${salary.netSalary}</td>

<td>${salary.paymentMode}</td>

<td>

<span class="status-paid">

${salary.status}

</span>

</td>

<td>

<button
class="pay-btn"
onclick="printSalary('${salary._id}')">

Print

</button>

</td>

</tr>

`;

    });

}

async function printSalary(id){

    const res = await fetch(
        API +
        "/teacher-salary/history?schoolId=" +
        schoolId
    );

    const data = await res.json();

    const salary =
        data.salaries.find(s=>s._id===id);

    if(!salary)
        return;

    const win = window.open("");

    win.document.write(`

<h2>Teacher Salary Slip</h2>

<hr>

<p><b>Teacher :</b> ${salary.teacherName}</p>

<p><b>Employee :</b> ${salary.employeeId}</p>

<p><b>Month :</b> ${salary.month}-${salary.year}</p>

<p><b>Net Salary :</b> ₹${salary.netSalary}</p>

<p><b>Payment Mode :</b> ${salary.paymentMode}</p>

<p><b>Status :</b> ${salary.status}</p>

<p><b>Remarks :</b> ${salary.remarks||""}</p>

`);

    win.print();

}