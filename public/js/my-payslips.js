const teacher = JSON.parse(localStorage.getItem("teacher"));

if (!teacher) {
    alert("Teacher not logged in.");
    window.location.href = "teacher-login.html";
}

const teacherId = teacher._id;
const API = "/api";

loadPayslips();

async function loadPayslips() {

    try {

        const res = await fetch(
            API + "/teacher-salary/teacher/" + teacherId
        );

        const data = await res.json();

        const tbody = document.getElementById("salaryTable");

        tbody.innerHTML = "";

        if (!data.success || data.salaries.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No Salary Records Found
                    </td>
                </tr>
            `;

            return;
        }

        data.salaries.forEach(salary => {

            tbody.innerHTML += `
                <tr>

                    <td>${salary.month}</td>

                    <td>${salary.year}</td>

                    <td>₹${Number(salary.netSalary).toLocaleString()}</td>

                    <td>${salary.paymentMode}</td>

                    <td>
                        <span class="status-paid">
                            ${salary.status}
                        </span>
                    </td>

                    <td>

                        <button
                            class="download-btn"
                            onclick="downloadPayslip('${salary._id}')">

                            <i class="fa-solid fa-download"></i>
                            Download

                        </button>

                    </td>

                </tr>
            `;

        });

    } catch (err) {

        console.error(err);

        document.getElementById("salaryTable").innerHTML = `
            <tr>
                <td colspan="6">
                    Failed to load salary history.
                </td>
            </tr>
        `;
    }

}

async function downloadPayslip(id) {

    const res = await fetch(
        API + "/teacher-salary/teacher/" + teacherId
    );

    const data = await res.json();

    const salary = data.salaries.find(s => s._id === id);

    if (!salary) return;

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    // ===========================
    // Header
    // ===========================

    doc.setFontSize(20);
    

    doc.setFontSize(15);
    doc.text("Teacher Salary Payslip", 105, y, { align: "center" });

    y += 12;

    doc.setFontSize(11);

    doc.text(`Teacher Name : ${salary.teacherName}`, 20, y);
    y += 8;

    doc.text(`Month : ${salary.month}-${salary.year}`, 20, y);
    y += 8;

    doc.text(`Payment Mode : ${salary.paymentMode}`, 20, y);
    y += 8;

    doc.text(`Status : ${salary.status}`, 20, y);

    y += 15;

    // ===========================
    // Salary Details
    // ===========================

    doc.setFontSize(13);
    doc.text("Salary Details", 20, y);

    y += 10;

    const rows = [

        ["Basic Salary", salary.basicSalary],

        ["HRA", salary.hra],

        ["DA", salary.da],

        ["Allowance", salary.allowance],

        ["Bonus", salary.bonus],

        ["PF", salary.pf],

        ["Tax", salary.tax],

        ["Deduction", salary.deduction],

        ["Net Salary", salary.netSalary]

    ];

    rows.forEach(row => {

        doc.rect(20, y - 5, 80, 8);

        doc.rect(100, y - 5, 70, 8);

        doc.text(String(row[0]), 24, y);

        doc.text(
    "Rs. " + Number(row[1]).toLocaleString("en-IN"),
    105,
    y
);

        y += 8;

    });

    y += 20;

    // ===========================
    // Signature
    // ===========================

    doc.line(25, y, 70, y);

    doc.line(135, y, 180, y);

    y += 5;

    doc.text("Teacher Signature", 25, y);

    doc.text("Principal Signature", 135, y);

    // ===========================
    // Footer
    // ===========================

    doc.setFontSize(10);

    doc.text(
        "Computer Generated Payslip - No Signature Required",
        105,
        285,
        { align: "center" }
    );

    doc.save(
        `${salary.teacherName}-${salary.month}-${salary.year}-Payslip.pdf`
    );

}