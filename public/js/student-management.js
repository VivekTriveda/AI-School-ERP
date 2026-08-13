// =============================================
// Student Management
// =============================================

const API = "http://localhost:5000/api";

const school = JSON.parse(localStorage.getItem("currentSchool"));

const schoolId =
    school?._id ||
    school?.schoolId ||
    localStorage.getItem("schoolId");

    let allStudents = [];

// ===============================
// Page Load
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    if (!schoolId) {

        alert("School not found");

        location.href = "school-login.html";

        return;
    }

    document.getElementById("schoolName").innerText =
        school?.schoolName || "School";

    loadStudents();

});

// ===============================
// Load Students
// ===============================

async function loadStudents() {

    try {

       const response = await fetch(`/api/students?schoolId=${schoolId}`);

const data = await response.json();

if (!data.success) {
    alert(data.message);
    return;
}

const students = data.students;

allStudents = students;

        if (!response.ok) {

            throw new Error(data.message);

        }

        renderStudents(students);

updateSummary(students);

loadFilters(students);

    } catch (err) {

        console.error(err);

    }

}

// ===============================
// Student Table
// ===============================

function renderStudents(students) {

    const tbody =
        document.getElementById("studentTableBody");

    tbody.innerHTML = "";

    if (!students.length) {

        tbody.innerHTML = `

<tr>

<td colspan="9"
style="text-align:center">

No Students Found

</td>

</tr>

`;

        return;

    }

    students.forEach(student => {

        tbody.innerHTML += `

<tr>

<td>${student.admissionNo || "-"}</td>

<td>${student.rollNo || "-"}</td>

<td>${student.studentName}</td>

<td>${student.fatherName || "-"}</td>

<td>${student.gender || "-"}</td>

<td>${student.className}</td>

<td>${student.section}</td>

<td>${student.mobile || "-"}</td>

<td>

<button onclick="editStudent('${student._id}')">

Edit

</button>

<button onclick="deleteStudent('${student._id}')">

Delete

</button>

</td>

</tr>

`;

    });

}

// ===============================
// Summary Cards
// ===============================

function updateSummary(students) {

    document.getElementById("totalStudents").innerText =
        students.length;

    const boys =
        students.filter(
            s => s.gender === "Male"
        ).length;

    const girls =
        students.filter(
            s => s.gender === "Female"
        ).length;

    const classes =
        new Set(
            students.map(
                s => s.className
            )
        );

    document.getElementById("boysCount").innerText =
        boys;

    document.getElementById("girlsCount").innerText =
        girls;

    document.getElementById("classCount").innerText =
        classes.size;

}

// ===============================
// Filters
// ===============================

function loadFilters(students) {

    

    const classSelect =
        document.getElementById("filterClass");

    const sectionSelect =
        document.getElementById("filterSection");

        classSelect.innerHTML =
        '<option value="">All Classes</option>';

    sectionSelect.innerHTML =
        '<option value="">All Sections</option>';

    const classes =
        [...new Set(students.map(s => s.className))];

    const sections =
        [...new Set(students.map(s => s.section))];

    classes.forEach(c => {

        classSelect.innerHTML +=
            `<option value="${c}">${c}</option>`;

    });

    sections.forEach(s => {

        sectionSelect.innerHTML +=
            `<option value="${s}">${s}</option>`;

    });

}

// ===============================
// Search
// ===============================

document
.getElementById("searchStudent")
.addEventListener("keyup", searchStudent);

document
.getElementById("filterClass")
.addEventListener("change", applyFilters);

document
.getElementById("filterSection")
.addEventListener("change", applyFilters);

document
.getElementById("searchStudent")
.addEventListener("keyup", applyFilters);

function applyFilters() {

    const selectedClass =
        document.getElementById("filterClass").value;

    const selectedSection =
        document.getElementById("filterSection").value;

    const keyword =
        document.getElementById("searchStudent")
        .value
        .toLowerCase();

    const filtered = allStudents.filter(student => {

        const matchClass =
            !selectedClass ||
            student.className == selectedClass;

        const matchSection =
            !selectedSection ||
            student.section == selectedSection;

        const matchSearch =
            !keyword ||
            student.studentName.toLowerCase().includes(keyword) ||
            student.admissionNo.toString().includes(keyword) ||
            student.rollNo.toString().includes(keyword);

        return matchClass && matchSection && matchSearch;

    });

    renderStudents(filtered);
    updateSummary(filtered);

}

// ===============================
// Refresh
// ===============================

document
.getElementById("refreshBtn")
.onclick = loadStudents;

// ===============================
// Buttons
// ===============================

const modal=document.getElementById("importModal");

document.getElementById("importExcelBtn").onclick=()=>{

modal.style.display="block";

};

document.getElementById("closeModal").onclick=()=>{

modal.style.display="none";

};

document.querySelectorAll("input[name='importMode']").forEach(r=>{

r.onchange=function(){

document.getElementById("classSelection").style.display=

this.value==="class"

?"block"

:"none";

};

});

document
.getElementById("startImport")
.addEventListener("click", uploadExcel);

async function uploadExcel(){

const file = document.getElementById("excelFile").files[0];

if (!file) {
    alert("Please select an Excel file.");
    return;
}

if(!file) return;

const formData=new FormData();

formData.append("excel",file);

formData.append("schoolId",schoolId);

try{

const response=await fetch(

`${API}/students/import`,

{

method:"POST",

body:formData

}

);

const data = await response.json();

if (data.success) {

    let message = `✅ Import Completed Successfully

Imported Students : ${data.imported}

Duplicate Students Skipped : ${data.duplicates}`;

    if (data.duplicates > 0) {

        message += `

Duplicate Admission Numbers:

${data.duplicateStudents.join(", ")}`;

    }

    alert(message);

    document.getElementById("importModal").style.display = "none";

    loadStudents();

} else {

    alert(data.message);

}

}

catch(err){

console.error(err);

alert("Import Failed");

}

}




// ===============================
// Edit
// ===============================

async function editStudent(id) {

    try {

        const response = await fetch(`${API}/students/${id}`);

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        const student = data.student;

        document.getElementById("editStudentId").value = student._id;

        document.getElementById("editAdmissionNo").value =
            student.admissionNo || "";

        document.getElementById("editRollNo").value =
            student.rollNo || "";

        document.getElementById("editStudentName").value =
            student.studentName || "";

        document.getElementById("editFatherName").value =
            student.fatherName || student.parentName || "";

        document.getElementById("editMotherName").value =
            student.motherName || "";

        document.getElementById("editGender").value =
            student.gender || "Male";

        document.getElementById("editClass").value =
            student.className || "";

        document.getElementById("editSection").value =
            student.section || "A";

        document.getElementById("editMobile").value =
            student.mobile || "";

       document.getElementById("editDOB").value =
    student.dob
        ? new Date(student.dob).toISOString().split("T")[0]
        : "";

        document.getElementById("editAddress").value =
            student.address || "";

        document.getElementById("editStudentModal").style.display = "block";

    } catch (err) {

        console.error(err);

        alert("Unable to load student details.");

    }

}

document
.getElementById("closeEditModal")
.onclick = () => {

    document.getElementById("editStudentModal").style.display = "none";

};

window.onclick = function(event){

    const modal =
        document.getElementById("editStudentModal");

    if(event.target === modal){

        modal.style.display = "none";

    }

};


// ======================================
// SAVE EDITED STUDENT
// ======================================

document
.getElementById("saveStudentBtn")
.onclick = async function(){

    try{

        const id =
            document.getElementById("editStudentId").value;

        const student = {

            admissionNo:
                document.getElementById("editAdmissionNo").value,

            rollNo:
                document.getElementById("editRollNo").value,

            studentName:
                document.getElementById("editStudentName").value,

            fatherName:
                document.getElementById("editFatherName").value,

            motherName:
                document.getElementById("editMotherName").value,

            gender:
                document.getElementById("editGender").value,

            className:
                document.getElementById("editClass").value,

            section:
                document.getElementById("editSection").value,

            mobile:
                document.getElementById("editMobile").value,

            dob:
                document.getElementById("editDOB").value,

            address:
                document.getElementById("editAddress").value

        };

        const response = await fetch(

            `${API}/students/${id}`,

            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(student)

            }

        );

        const data = await response.json();

        if(data.success){

            alert("Student Updated Successfully");

            document.getElementById("editStudentModal").style.display="none";

            loadStudents();

        }else{

            alert(data.message);

        }

    }

    catch(err){

        console.error(err);

        alert("Unable to update student.");

    }

};




// ===============================
// Delete
// ===============================

async function deleteStudent(id){

    if(!confirm("Delete this student?"))

        return;

    try{

        const response=await fetch(

`${API}/students/${id}`,

{

method:"DELETE"

}

);

        const data=await response.json();

        alert(data.message);

        loadStudents();

    }

    catch(err){

        console.error(err);

    }

}


// =====================================
// EXPORT STUDENTS TO EXCEL
// =====================================

document
.getElementById("exportExcel")
.addEventListener("click", exportStudents);


function exportStudents() {

    let studentsToExport = [];

    // If filters are applied, export filtered students.
    // Otherwise export all students.

    const classValue =
        document.getElementById("filterClass").value;

    const sectionValue =
        document.getElementById("filterSection").value;

    const searchValue =
        document
        .getElementById("searchStudent")
        .value
        .toLowerCase();

    studentsToExport = allStudents.filter(student => {

        const matchClass =
            !classValue ||
            student.className == classValue;

        const matchSection =
            !sectionValue ||
            student.section == sectionValue;

        const matchSearch =
            !searchValue ||

            student.studentName
                .toLowerCase()
                .includes(searchValue) ||

            student.admissionNo
                .toString()
                .includes(searchValue);

        return (
            matchClass &&
            matchSection &&
            matchSearch
        );

    });

    if(studentsToExport.length===0){

        alert("No students found.");

        return;

    }

    createExcel(studentsToExport);

}
function createExcel(students){

    const excelData = students.map(student=>({

        "Admission No":student.admissionNo,

        "Roll No":student.rollNo,

        "Student Name":student.studentName,

        "Father Name":
            student.fatherName || "",

        "Mother Name":
            student.motherName || "",

        "Gender":
            student.gender,

        "Class":
            student.className,

        "Section":
            student.section,

        "Mobile":
            student.mobile,

        "DOB":
            student.dob
                ? new Date(student.dob)
                    .toLocaleDateString("en-GB")
                : "",

        "Address":
            student.address || ""

    }));

    const worksheet =
        XLSX.utils.json_to_sheet(excelData);

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Students"

    );

    const classFilter =
        document.getElementById("filterClass").value;

    let fileName =
        "Students";

    if(classFilter){

        fileName += `_Class_${classFilter}`;

    }

    fileName += ".xlsx";

    XLSX.writeFile(

        workbook,

        fileName

    );

}
document
.getElementById("downloadTemplate")
.addEventListener("click", function () {

    window.location.href =
        "/templates/Student_Import_Template.xlsx";

});