const API = "/api/fee-structure";

const school =
JSON.parse(localStorage.getItem("currentSchool"));

const schoolId =
school?._id || school?.schoolId;

const saveBtn =
document.getElementById("saveBtn");

const feeInputs = [

"admissionFee",

"tuitionFee",

"computerFee",

"examinationFee",

"libraryFee",

"sportsFee",

"transportFee",

"hostelFee",

"miscellaneousFee"

];

/* ===================================
AUTO TOTAL
=================================== */

feeInputs.forEach(id=>{

document
.getElementById(id)
.addEventListener(
"input",
calculateTotal
);

});

calculateTotal();

function calculateTotal(){

let total=0;

feeInputs.forEach(id=>{

total+=Number(

document
.getElementById(id)
.value||0

);

});

document.getElementById(
"grandTotal"
).innerHTML=

"₹"+total.toLocaleString();

return total;

}

/* ===================================
SAVE
=================================== */

saveBtn.addEventListener(
"click",
saveStructure
);

async function saveStructure(){

const className=
document.getElementById(
"className"
).value;

if(!className){

alert("Select Class");

return;

}

const body={

schoolId,

academicYear:

document.getElementById(
"academicYear"
).value,

className,

admissionFee:Number(
document.getElementById(
"admissionFee"
).value
),

tuitionFee:Number(
document.getElementById(
"tuitionFee"
).value
),

computerFee:Number(
document.getElementById(
"computerFee"
).value
),

examinationFee:Number(
document.getElementById(
"examinationFee"
).value
),

libraryFee:Number(
document.getElementById(
"libraryFee"
).value
),

sportsFee:Number(
document.getElementById(
"sportsFee"
).value
),

transportFee:Number(
document.getElementById(
"transportFee"
).value
),

hostelFee:Number(
document.getElementById(
"hostelFee"
).value
),

miscellaneousFee:Number(
document.getElementById(
"miscellaneousFee"
).value
)

};

const res=await fetch(

API+"/save",

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},

body:JSON.stringify(body)

}

);

const data=

await res.json();

if(data.success){

alert(

"Fee Structure Saved"

);

loadStructures();

clearForm();

}

else{

alert(

data.message

);

}

}

/* ===================================
LOAD TABLE
=================================== */

async function loadStructures(){

const year=

document.getElementById(
"academicYear"
).value;

const res=await fetch(

API+
"/list?schoolId="+
schoolId+
"&academicYear="+
year

);

const data=

await res.json();

const tbody=

document.getElementById(
"feeTableBody"
);

tbody.innerHTML="";

if(

!data.success ||

data.structures.length===0

){

tbody.innerHTML=

`<tr>

<td colspan="5">

No Fee Structure Found

</td>

</tr>`;

return;

}

document.getElementById("totalClasses").innerHTML = data.structures.length;

let highest=0;

let latest="--";

data.structures.forEach(item=>{

if(item.totalFee>highest)

highest=item.totalFee;

latest=

new Date(

item.updatedAt

).toLocaleDateString();

tbody.innerHTML += `

<tr>

<td>

<span class="class-badge">

${item.className}

</span>

</td>

<td>

${item.academicYear}

</td>

<td>

<span class="fee-badge">

₹${Number(item.totalFee).toLocaleString()}

</span>

</td>

<td>

<div class="action-buttons">

<button
class="edit-btn"
onclick="editStructure('${item._id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="delete-btn"
onclick="deleteStructure('${item._id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;
});

document.getElementById(
"highestFee"
).innerHTML=

"₹"+highest;

document.getElementById(
"lastUpdated"
).innerHTML=

latest;

}

/* ===================================
EDIT
=================================== */

async function editStructure(id){

const year=

document.getElementById(
"academicYear"
).value;

const className=

prompt(

"Enter Class Name"

);

if(!className)return;

const res=

await fetch(

API+
"/get?schoolId="+
schoolId+
"&className="+
className+
"&academicYear="+
year

);

const data=

await res.json();

if(

!data.success ||

!data.structure

){

alert(

"Not Found"

);

return;

}

const s=data.structure;

document.getElementById(
"className"
).value=s.className;

feeInputs.forEach(id=>{

document.getElementById(id)

.value=

s[id]||0;

});

calculateTotal();

window.scrollTo({

top:0,

behavior:"smooth"

});

}

/* ===================================
DELETE
=================================== */

async function deleteStructure(id){

if(

!confirm(

"Delete Fee Structure?"

)

)return;

const res=

await fetch(

API+
"/"+id,

{

method:"DELETE"

}

);

const data=

await res.json();

alert(data.message);

loadStructures();

}

/* ===================================
CLEAR
=================================== */

function clearForm(){

document.getElementById(
"className"
).value="";

feeInputs.forEach(id=>{

document.getElementById(id)

.value=0;

});

calculateTotal();

}

/* ===================================
START
=================================== */

loadStructures();