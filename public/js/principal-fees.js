/* ===========================================
        PRINCIPAL FEES
=========================================== */

const school =
    JSON.parse(localStorage.getItem("currentSchool"));

if (!school) {

    alert("School not found. Please login again.");

}

const schoolId =
    school?.schoolId ||
    school?._id ||
    school?.id;

const principalName =
    localStorage.getItem("principalName") || "Principal";

document.getElementById("principalName").innerText =
    principalName;

let feeModal;

/* ===========================================
        PAGE LOAD
=========================================== */

window.onload = async () => {

    feeModal = new bootstrap.Modal(
        document.getElementById("feeModal")
    );

    setCurrentMonth();

    await loadDashboard();

    await loadFees();

};


/* ===========================================
        CURRENT MONTH
=========================================== */

function setCurrentMonth() {

    const today = new Date();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const value =
        today.getFullYear() + "-" + month;

    document.getElementById("monthFilter").value =
        value;

}


/* ===========================================
        LOAD DASHBOARD
=========================================== */

async function loadDashboard() {

    try {

        const monthValue =
            document.getElementById("monthFilter").value;

        let month = "";
        let year = "";

        if (monthValue) {

            year = monthValue.split("-")[0];

            month = monthValue.split("-")[1];

        }

        const className =
            document.getElementById("classFilter").value;

        const section =
            document.getElementById("sectionFilter").value;

        const res = await fetch(

            `/api/fees/principal/dashboard?schoolId=${schoolId}&className=${className}&section=${section}&month=${month}&year=${year}`

        );

        const data = await res.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        const d = data.dashboard;

        document.getElementById("totalStudents").innerText =
            d.totalStudents;

        document.getElementById("paidStudents").innerText =
            d.paidStudents;

        document.getElementById("partialStudents").innerText =
            d.partialStudents;

        document.getElementById("unpaidStudents").innerText =
            d.unpaidStudents;

        document.getElementById("totalCollection").innerText =
            "₹" + d.totalCollection;

        document.getElementById("pendingAmount").innerText =
            "₹" + d.pendingAmount;

    }

    catch (err) {

        console.log(err);

    }

}


/* ===========================================
        LOAD FEES
=========================================== */

async function loadFees() {

    try {

        const className =
            document.getElementById("classFilter").value;

        const section =
            document.getElementById("sectionFilter").value;

        const status =
            document.getElementById("statusFilter").value;

        const monthValue =
            document.getElementById("monthFilter").value;

        let month = "";
        let year = "";

        if (monthValue) {

            year = monthValue.split("-")[0];

            month = monthValue.split("-")[1];

        }

        const res = await fetch(

            `/api/fees/principal/list?schoolId=${schoolId}&className=${className}&section=${section}&status=${status}&month=${month}&year=${year}`

        );

        const data = await res.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        const tbody =
            document.getElementById("feeTableBody");

        tbody.innerHTML = "";

        if (data.fees.length === 0) {

            tbody.innerHTML =

                `<tr>
                    <td colspan="8" class="text-center">
                        No Fee Records Found
                    </td>
                </tr>`;

            return;

        }

        data.fees.forEach(fee => {

            let badge = "";

            if (fee.status === "Paid") {

                badge =
                    `<span class="badge badge-paid">
                        Paid
                    </span>`;

            }

            else if (fee.status === "Partial") {

                badge =
                    `<span class="badge badge-partial">
                        Partial
                    </span>`;

            }

            else {

                badge =
                    `<span class="badge badge-unpaid">
                        Unpaid
                    </span>`;

            }

            tbody.innerHTML += `

            <tr>

                <td>${fee.admissionNo}</td>

                <td>${fee.studentName}</td>

                <td>

                    ${fee.className}-${fee.section}

                </td>

                <td>

                    ₹${fee.totalFee}

                </td>

                <td>

                    ₹${fee.amountPaid}

                </td>

                <td>

                    ₹${fee.balance}

                </td>

                <td>

                    ${badge}

                </td>

                <td>

                    <button

                        class="btn btn-view btn-sm"

                        onclick="viewStudentFee('${fee.studentId}')">

                        <i class="fas fa-eye"></i>

                        View

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (err) {

        console.log(err);

    }

}
/* ===========================================
        VIEW STUDENT FEE
=========================================== */

async function viewStudentFee(studentId) {

    try {

        const res = await fetch(

            `/api/fees/principal/student/${studentId}`

        );

        const data = await res.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        const body =
            document.getElementById("feeModalBody");

        body.innerHTML = "";

        if (data.fees.length === 0) {

            body.innerHTML = `

                <div class="alert alert-warning">

                    No fee records found.

                </div>

            `;

            feeModal.show();

            return;

        }

        const student = data.fees[0];

        let html = `

        <div class="row mb-4">

            <div class="col-md-4">

                <strong>Student :</strong><br>

                ${student.studentName}

            </div>

            <div class="col-md-2">

                <strong>Admission No :</strong><br>

                ${student.admissionNo}

            </div>

            <div class="col-md-2">

                <strong>Class :</strong><br>

                ${student.className}-${student.section}

            </div>

            <div class="col-md-2">

                <strong>Parent :</strong><br>

                ${student.parentName}

            </div>

            <div class="col-md-2">

                <strong>Mobile :</strong><br>

                ${student.mobile}

            </div>

        </div>

        `;

        data.fees.forEach(fee => {

            html += `

            <div class="card shadow-sm mb-4">

                <div class="card-header bg-primary text-white">

                    ${fee.month}-${fee.year}

                    (${fee.feeType})

                </div>

                <div class="card-body">

                    <div class="row mb-3">

                        <div class="col-md-3">

                            <strong>Total Fee</strong><br>

                            ₹${fee.totalFee}

                        </div>

                        <div class="col-md-3">

                            <strong>Paid</strong><br>

                            ₹${fee.amountPaid}

                        </div>

                        <div class="col-md-3">

                            <strong>Balance</strong><br>

                            ₹${fee.balance}

                        </div>

                        <div class="col-md-3">

                            <strong>Status</strong><br>

                            ${fee.status}

                        </div>

                    </div>

            `;

            if (fee.payments && fee.payments.length > 0) {

                html += `

                <table class="table table-bordered payment-table">

                    <thead>

                        <tr>

                            <th>#</th>

                            <th>Date</th>

                            <th>Amount</th>

                            <th>Mode</th>

                            <th>Transaction ID</th>

                            <th>Collected By</th>

                        </tr>

                    </thead>

                    <tbody>

                `;

                fee.payments.forEach((payment, index) => {

                    html += `

                    <tr>

                        <td>${index + 1}</td>

                        <td>

                            ${formatDate(payment.paymentDate)}

                        </td>

                        <td>

                            ₹${payment.amount}

                        </td>

                        <td>

                            ${payment.paymentMode || "-"}

                        </td>

                        <td>

                            ${payment.transactionId || "-"}

                        </td>

                        <td>

                            ${payment.collectedBy || "-"}

                        </td>

                    </tr>

                    `;

                });

                html += `

                    </tbody>

                </table>

                `;

            }

            else {

                html += `

                <div class="alert alert-warning">

                    No payment history available.

                </div>

                `;

            }

            html += `

                </div>

            </div>

            `;

        });

        body.innerHTML = html;

        feeModal.show();

    }

    catch (err) {

        console.log(err);

    }

}
/* ===========================================
        FORMAT DATE
=========================================== */

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


/* ===========================================
        FORMAT CURRENCY
=========================================== */

function formatCurrency(amount) {

    return "₹" + Number(amount || 0).toLocaleString("en-IN");

}

/* ===========================================
        FILTER EVENTS
=========================================== */

document.getElementById("classFilter")
.addEventListener("change", async () => {

    await loadDashboard();

    await loadFees();

});

document.getElementById("sectionFilter")
.addEventListener("change", async () => {

    await loadDashboard();

    await loadFees();

});

document.getElementById("statusFilter")
.addEventListener("change", async () => {

    await loadDashboard();

    await loadFees();

});

document.getElementById("monthFilter")
.addEventListener("change", async () => {

    await loadDashboard();

    await loadFees();

});


/* ===========================================
        LOAD CLASSES
=========================================== */

async function loadClasses() {

    try {

        const res = await fetch(
            `/api/classes?schoolId=${schoolId}`
        );

        if (!res.ok) return;

        const data = await res.json();

        if (!data.success) return;

        const select =
            document.getElementById("classFilter");

        data.classes.forEach(cls => {

            select.innerHTML += `
                <option value="${cls.className}">
                    ${cls.className}
                </option>
            `;

        });

    }

    catch (err) {

        console.log(err);

    }

}


/* ===========================================
        LOAD SECTIONS
=========================================== */

async function loadSections() {

    try {

        const res = await fetch(
            `/api/sections?schoolId=${schoolId}`
        );

        if (!res.ok) return;

        const data = await res.json();

        if (!data.success) return;

        const select =
            document.getElementById("sectionFilter");

        data.sections.forEach(sec => {

            select.innerHTML += `
                <option value="${sec}">
                    ${sec}
                </option>
            `;

        });

    }

    catch (err) {

        console.log(err);

    }

}


/* ===========================================
        EXPORT REPORT
=========================================== */

function exportFees() {

    window.print();

}


/* ===========================================
        REFRESH
=========================================== */

async function refreshPage() {

    await loadDashboard();

    await loadFees();

}


/* ===========================================
        AUTO REFRESH
=========================================== */

setInterval(() => {

    refreshPage();

}, 60000);