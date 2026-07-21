const student = JSON.parse(localStorage.getItem("student"));

if (!student) {
    alert("Please login again.");
    window.location.href = "student-login.html";
}

const studentId = student.id;

console.log(JSON.parse(localStorage.getItem("student")));
// ==============================
// Load Student Fee Details
// ==============================

async function loadFees() {

    try {

        const res = await fetch("/api/fees/student/" + studentId);

        const data = await res.json();

        const tbody = document.getElementById("feeTable");

        tbody.innerHTML = "";

        if (!data.success || data.fees.length === 0) {

            tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No Fee Record Found
                </td>
            </tr>
            `;

            return;
        }

        let totalFee = 0;
        let totalPaid = 0;
        let totalBalance = 0;

        data.fees.forEach(fee => {

            totalFee += Number(fee.totalFee || 0);
            totalPaid += Number(fee.amountPaid || 0);
            totalBalance += Number(fee.balance || 0);

            tbody.innerHTML += `

<tr>

<td>${fee.receiptNo}</td>

<td>${fee.month}-${fee.year}</td>

<td>₹${fee.totalFee}</td>

<td>₹${fee.amountPaid}</td>

<td>₹${fee.balance}</td>

<td>${fee.status}</td>

<td>

<button
class="btn btn-sm btn-primary"
onclick="printReceipt('${fee._id}')">

<i class="fa fa-print"></i>

</button>

</td>

</tr>

`;

        });

        document.getElementById("totalFee").innerText =
            "₹" + totalFee;

        document.getElementById("totalPaid").innerText =
            "₹" + totalPaid;

        document.getElementById("balanceFee").innerText =
            "₹" + totalBalance;

        document.getElementById("feeStatus").innerText =
            totalBalance > 0 ? "Partial" : "Paid";

    }

    catch (err) {

        console.log(err);

    }

}

loadFees();

// ==============================
// Print Receipt
// ==============================

function printReceipt(id){

    window.open(
        "/receipt.html?id=" + id,
        "_blank"
    );

}