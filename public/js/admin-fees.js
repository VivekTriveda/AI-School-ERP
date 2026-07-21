/* ==========================================
   ADMIN FEES
========================================== */

const API = "/api/fees";

let schoolModal = null;

document.addEventListener("DOMContentLoaded", () => {

    schoolModal = new bootstrap.Modal(
        document.getElementById("schoolModal")
    );

    loadDashboard();

    loadSchoolReport();

});


/* ==========================================
   LOAD DASHBOARD
========================================== */

async function loadDashboard() {

    try {

        const res = await fetch(
            `${API}/admin/dashboard`
        );

        const data = await res.json();

        if (!data.success) {

            return;

        }

        const d = data.dashboard;

        document.getElementById("totalSchools").textContent =
            d.totalSchools || 0;

        document.getElementById("totalStudents").textContent =
            d.totalStudents || 0;

        document.getElementById("totalCollection").textContent =
            "₹" + formatCurrency(d.totalCollection);

        document.getElementById("pendingAmount").textContent =
            "₹" + formatCurrency(d.pendingAmount);

        document.getElementById("collectionPercent").textContent =
            (d.collectionPercent || 0) + "%";

        if (document.getElementById("monthCollection")) {

            document.getElementById("monthCollection").textContent =
                "₹" + formatCurrency(d.monthCollection || 0);

        }

    }

    catch (err) {

        console.error(
            "Dashboard Error:",
            err
        );

    }

}


/* ==========================================
   LOAD SCHOOL REPORT
========================================== */

async function loadSchoolReport() {

    try {

        const school =
            document.getElementById("schoolFilter").value;

        const status =
            document.getElementById("statusFilter").value;

        const month =
            document.getElementById("monthFilter").value;

        let url =
            `${API}/admin/schools`;

        const params =
            new URLSearchParams();

        if (school)
            params.append(
                "schoolId",
                school
            );

        if (status)
            params.append(
                "status",
                status
            );

        if (month)
            params.append(
                "month",
                month
            );

        if (params.toString()) {

            url +=
                "?" + params.toString();

        }

        const res =
            await fetch(url);

        const data =
            await res.json();

        const tbody =
            document.getElementById(
                "schoolTableBody"
            );

        tbody.innerHTML = "";

        if (
            !data.success ||
            data.schools.length === 0
        ) {

            tbody.innerHTML = `
<tr>
<td colspan="8" class="text-center text-muted">
No records found
</td>
</tr>`;

            return;

        }

        data.schools.forEach(school => {

            tbody.innerHTML += `

<tr>

<td class="text-start fw-semibold">

${school.schoolName}

</td>

<td>

${school.students}

</td>

<td>

<span class="badge badge-paid">

${school.paid}

</span>

</td>

<td>

<span class="badge badge-partial">

${school.partial}

</span>

</td>

<td>

<span class="badge badge-unpaid">

${school.unpaid}

</span>

</td>

<td>

₹${formatCurrency(school.collection)}

</td>

<td>

₹${formatCurrency(school.pending)}

</td>

<td>

<button
class="btn btn-view btn-sm"
onclick="viewSchool('${school.schoolId}')">

<i class="fas fa-eye"></i>

View

</button>

</td>

</tr>

`;

        });

    }

    catch (err) {

        console.error(
            "School Report Error:",
            err
        );

    }

}


/* ==========================================
   FORMAT CURRENCY
========================================== */

function formatCurrency(value) {

    return Number(
        value || 0
    ).toLocaleString("en-IN");

}

/* ==========================================
   VIEW SCHOOL DETAILS
========================================== */

async function viewSchool(schoolId) {

    try {

        const res = await fetch(
            `${API}/admin/school/${schoolId}`
        );

        const data = await res.json();

        if (!data.success) {

            alert("Unable to load school details.");

            return;

        }

        renderSchoolModal(data.fees);

        schoolModal.show();

    }

    catch (err) {

        console.error(
            "School Detail Error:",
            err
        );

    }

}


/* ==========================================
   RENDER SCHOOL DETAILS
========================================== */

function renderSchoolModal(fees) {

    const body =
        document.getElementById(
            "schoolModalBody"
        );

    if (!fees || fees.length === 0) {

        body.innerHTML = `

<div class="alert alert-warning text-center">

No fee records found.

</div>

`;

        return;

    }

    let html = `

<div class="table-responsive">

<table class="table table-bordered table-hover align-middle">

<thead>

<tr>

<th>Student</th>

<th>Class</th>

<th>Section</th>

<th>Fee Type</th>

<th>Total Fee</th>

<th>Paid</th>

<th>Balance</th>

<th>Status</th>

</tr>

</thead>

<tbody>

`;

    fees.forEach(fee => {

        let badgeClass = "badge-secondary";

        if (fee.status === "Paid")
            badgeClass = "badge-paid";

        else if (fee.status === "Partial")
            badgeClass = "badge-partial";

        else if (fee.status === "Unpaid")
            badgeClass = "badge-unpaid";

        html += `

<tr>

<td>

${fee.studentName || "-"}

</td>

<td>

${fee.className || "-"}

</td>

<td>

${fee.section || "-"}

</td>

<td>

${fee.feeType || "-"}

</td>

<td>

₹${formatCurrency(fee.totalFee)}

</td>

<td>

₹${formatCurrency(fee.amountPaid)}

</td>

<td>

₹${formatCurrency(fee.balance)}

</td>

<td>

<span class="badge ${badgeClass}">

${fee.status}

</span>

</td>

</tr>

`;

    });

    html += `

</tbody>

</table>

</div>

`;

    body.innerHTML = html;

}


/* ==========================================
   CLOSE MODAL
========================================== */

function closeSchoolModal() {

    if (schoolModal) {

        schoolModal.hide();

    }

}

/* ==========================================
   LOAD SCHOOL DROPDOWN
========================================== */

async function loadSchoolDropdown() {

    try {

        const res = await fetch(`${API}/admin/schools`);

        const data = await res.json();

        if (!data.success) return;

        const select = document.getElementById("schoolFilter");

        if (!select) return;

        select.innerHTML = `
            <option value="">All Schools</option>
        `;

        data.schools.forEach(school => {

            select.innerHTML += `
                <option value="${school.schoolId}">
                    ${school.schoolName}
                </option>
            `;

        });

    }

    catch (err) {

        console.error("School Dropdown Error:", err);

    }

}


/* ==========================================
   FILTER EVENTS
========================================== */

const schoolFilter = document.getElementById("schoolFilter");
const monthFilter = document.getElementById("monthFilter");
const statusFilter = document.getElementById("statusFilter");

if (schoolFilter)
    schoolFilter.addEventListener(
        "change",
        loadSchoolReport
    );

if (monthFilter)
    monthFilter.addEventListener(
        "change",
        loadSchoolReport
    );

if (statusFilter)
    statusFilter.addEventListener(
        "change",
        loadSchoolReport
    );


/* ==========================================
   EXPORT REPORT
========================================== */

function exportReport() {

    window.print();

}


/* ==========================================
   AUTO REFRESH
========================================== */

setInterval(() => {

    loadDashboard();

    loadSchoolReport();

}, 60000);


/* ==========================================
   PAGE INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadSchoolDropdown();

});


/* ==========================================
   HELPER FUNCTIONS
========================================== */

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

function formatAmount(amount) {

    return "₹" + Number(amount || 0).toLocaleString("en-IN");

}


/* ==========================================
   OPTIONAL SUMMARY ROW
========================================== */

function calculateTotals(rows) {

    let students = 0;
    let paid = 0;
    let partial = 0;
    let unpaid = 0;
    let collection = 0;
    let pending = 0;

    rows.forEach(r => {

        students += Number(r.students || 0);
        paid += Number(r.paid || 0);
        partial += Number(r.partial || 0);
        unpaid += Number(r.unpaid || 0);
        collection += Number(r.collection || 0);
        pending += Number(r.pending || 0);

    });

    return {

        students,
        paid,
        partial,
        unpaid,
        collection,
        pending

    };

}