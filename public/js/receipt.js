const params=new URLSearchParams(window.location.search);

const id=params.get("id");

async function loadReceipt(){

const res=await fetch("/api/fees/receipt/"+id);

const data=await res.json();

if(!data.success){

alert("Receipt not found");

return;

}

const fee=data.fee;

document.getElementById("receiptNo").innerText=fee.receiptNo;

document.getElementById("paymentDate").innerText=
new Date(fee.paymentDate).toLocaleDateString();

document.getElementById("studentName").innerText=fee.studentName;

document.getElementById("admissionNo").innerText=fee.admissionNo;

document.getElementById("className").innerText=
fee.className+"-"+fee.section;

document.getElementById("rollNo").innerText=fee.rollNo;

document.getElementById("parentName").innerText=fee.parentName;

document.getElementById("mobile").innerText=fee.mobile;

document.getElementById("totalFee").innerText="₹"+fee.totalFee;

document.getElementById("discount").innerText="₹"+fee.discount;

document.getElementById("fine").innerText="₹"+fee.fine;

document.getElementById("amountPaid").innerText="₹"+fee.amountPaid;

document.getElementById("balance").innerText="₹"+fee.balance;

document.getElementById("status").innerText=fee.status;

// School name from localStorage
const school=JSON.parse(localStorage.getItem("currentSchool"));

if(school){

document.getElementById("schoolName").innerText=school.schoolName;

}

}

loadReceipt();