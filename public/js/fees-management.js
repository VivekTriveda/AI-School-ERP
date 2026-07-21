const school = JSON.parse(localStorage.getItem("currentSchool"));

const schoolId = school?._id || school?.schoolId;

let selectedStudent = null;

let currentFeeStructure = null;

const API = "/api";
const monthInput = document.getElementById("feeMonth");

const today = new Date();

const currentMonth =
today.getFullYear() +
"-" +
String(today.getMonth()+1).padStart(2,"0");

monthInput.value = currentMonth;

document.getElementById("searchBtn").addEventListener("click",searchStudent);

async function searchStudent(){

const keyword = document.getElementById("searchStudent").value.trim();

if(!keyword){

alert("Enter Student Name / Admission No / Roll No");

return;

}

const res = await fetch(API + "/students/search?schoolId=" + schoolId + "&keyword=" +
encodeURIComponent(keyword));

const data = await res.json();

if(!data.success){

alert(data.message);

return;

}

selectedStudent = data.student;

fillStudent(data.student);

await loadFeeStructure(data.student.className);

await loadCurrentFee();

}

function fillStudent(student){

document.getElementById("studentName").value =student.studentName;

document.getElementById("admissionNo").value =student.admissionNo;

document.getElementById("rollNo").value =student.rollNo;

document.getElementById("className").value =student.className;

document.getElementById("section").value =student.section;

document.getElementById("parentName").value =student.parentName;

document.getElementById("mobile").value =student.mobile;

}

async function loadFeeStructure(className){

const year = today.getFullYear() + "-" + String(today.getFullYear()+1).slice(-2);

const res = await fetch( "/api/fee-structure/get" + "?schoolId=" + schoolId + "&className=" + className +

"&academicYear=" + year

);



const data = await res.json();

if(!data.success || !data.structure){

alert("Fee Structure Not Found");

return;

}

currentFeeStructure = data.structure;

document.getElementById("totalFee").value =
data.structure.totalFee;

calculateBalance();

}

/* =====================================
LOAD CURRENT MONTH FEE
===================================== */

async function loadCurrentFee() {

    if (!selectedStudent) return;

    const feeMonth = document.getElementById("feeMonth").value;

    const [year, month] = feeMonth.split("-");

    const res = await fetch(

        "/api/fees/current?" +

        "studentId=" + selectedStudent._id +

        "&month=" + month +

        "&year=" + year +

        "&feeType=Tuition"

    );

    const data = await res.json();

    if (!data.success || !data.fee) {

        calculateBalance();

        return;

    }

    document.getElementById("totalFee").value = data.fee.totalFee;

    document.getElementById("discount").value = data.fee.discount;

    document.getElementById("fine").value = data.fee.fine;

    document.getElementById("balance").value = data.fee.balance;

    // Store previous paid amount for balance calculation
    currentFeeStructure.previousPaid = data.fee.amountPaid;
}

async function loadCurrentFee() {

    const feeMonth = document.getElementById("feeMonth").value;

    const [year, month] = feeMonth.split("-");

    const res = await fetch(

        "/api/fees/current?" +

        "studentId=" + selectedStudent._id +

        "&month=" + month +

        "&year=" + year

    );

    const data = await res.json();

    if (!data.success || !data.fee)
        return;

    document.getElementById("totalFee").value =
        data.fee.totalFee;

    document.getElementById("balance").value =
        data.fee.balance;
}

document.getElementById("discount").addEventListener("input",calculateBalance);

document.getElementById("fine").addEventListener("input",calculateBalance);

document.getElementById("amountPaid").addEventListener("input",calculateBalance);

document.getElementById("collectBtn").addEventListener("click",collectFee);


function calculateBalance() {

    const total =
        Number(document.getElementById("totalFee").value) || 0;

    const discount =
        Number(document.getElementById("discount").value) || 0;

    const fine =
        Number(document.getElementById("fine").value) || 0;

    const currentPayment =
        Number(document.getElementById("amountPaid").value) || 0;

    const previousPaid =
        Number(currentFeeStructure?.previousPaid || 0);

    const balance =
        (total - discount + fine)
        - (previousPaid + currentPayment);

    document.getElementById("balance").value =
        balance > 0 ? balance : 0;
}

/* =====================================
LOAD DASHBOARD
===================================== */

async function loadDashboard() {

    const res = await fetch(

        "/api/fees/dashboard?schoolId=" + schoolId

    );

    const data = await res.json();

    if (!data.success) return;

    document.getElementById("todayCollection").innerText =
        "₹" + data.todayCollection;

    document.getElementById("monthlyCollection").innerText =
        "₹" + data.monthlyCollection;

    document.getElementById("pendingFees").innerText =
        "₹" + data.pendingFees;

    document.getElementById("studentsPaid").innerText =
        data.studentsPaid;

}

async function loadFeeHistory() {

    const res = await fetch(
        "/api/fees/all?schoolId=" + schoolId
    );

    const data = await res.json();

    const tbody = document.getElementById("feeHistory");

    tbody.innerHTML = "";

    if (!data.success || data.fees.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="9">No Records Found</td>
        </tr>`;

        return;
    }

    data.fees.forEach(fee => {

        tbody.innerHTML += `

<tr>

<td>${fee.receiptNo}</td>

<td>${fee.studentName}</td>

<td>${fee.className}</td>

<td>${fee.month}-${fee.year}</td>

<td>₹${fee.amountPaid}</td>

<td>₹${fee.balance}</td>

<td>

<span class="status-${fee.status.toLowerCase()}">

${fee.status}

</span>

</td>

<td>

<button
class="print-btn"
onclick="printReceipt('${fee._id}')">

<i class="fa fa-print"></i>

</button>

</td>

<td>

<button
class="delete-btn"
onclick="deleteFee('${fee._id}')">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}


async function collectFee(){




if(!selectedStudent){

alert("Search Student First");

return;

}

const paidAmount = Number(document.getElementById("amountPaid").value);

const feeMonth = document.getElementById("feeMonth").value;

const [year,month]=feeMonth.split("-");

const body={ studentId:selectedStudent._id,feeType:"Tuition", month,year:Number(year),

totalFee:Number( document.getElementById("totalFee").value ),

discount:Number( document.getElementById("discount").value ),

fine:Number( document.getElementById("fine").value ),

amountPaid: paidAmount,

paymentMode: document.getElementById("paymentMode").value,

transactionId: document.getElementById("transactionId").value,

remarks: document.getElementById("remarks").value };

if(paidAmount<=0){

    alert("Enter Amount to Collect");

    return;

}

const res=await fetch( "/api/fees/create",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(body)

}

);

const data=await res.json();

if(data.success){

    await loadDashboard();

await loadFeeHistory();

    alert(
        "Fee Collected Successfully\n\n" +
        "Total Paid : ₹" + data.fee.amountPaid +
        "\nBalance : ₹" + data.fee.balance +
        "\nStatus : " + data.fee.status
    );

    document.getElementById("amountPaid").value = "";

    document.getElementById("transactionId").value = "";

    document.getElementById("remarks").value = "";

    document.getElementById("balance").value =
        data.fee.balance;
}

else{

alert(data.message);

}

}



function clearPayment(){

document.getElementById("discount").value=0;

document.getElementById("fine").value=0;

document.getElementById("amountPaid").value="";

document.getElementById("balance").value="";

document.getElementById("transactionId").value="";

document.getElementById("remarks").value="";

}

loadFeeHistory();

async function deleteFee(id){

    if(!confirm("Delete this fee record?"))
        return;

    const res = await fetch(

        "/api/fees/" + id,

        {
            method:"DELETE"
        }

    );

    const data = await res.json();

    alert(data.message);

    await loadDashboard();

await loadFeeHistory();

}