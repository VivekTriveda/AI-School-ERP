const tableBody = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");

let students = [];
let filteredStudents = [];
let editMode = false;
let deleteStudentId = "";

// ================================
// Modal Elements
// ================================

const modal = document.getElementById("studentModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const studentForm = document.getElementById("studentForm");
const addStudentBtn = document.getElementById("addStudentBtn");

/* ===============================
   Load Students
================================= */

async function loadStudents() {

    try {

        const schoolId = localStorage.getItem("schoolId");
        const teacherData = JSON.parse(localStorage.getItem("teacher")) || {};

const className =
    teacherData.classes && teacherData.classes.length
        ? teacherData.classes[0]
        : "";

        const response = await fetch(
            `/api/students?schoolId=${schoolId}&className=${className}`
        );

        const data = await response.json();

        if (data.success) {

            students = data.students;
            filteredStudents = [...students];

            displayStudents(filteredStudents);

        }

    } catch (err) {

        console.error(err);

    }

}

/* ===============================
   Display Students
================================= */

function displayStudents(studentList) {

    tableBody.innerHTML = "";

    if (studentList.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;padding:40px;">
                    No Students Found
                </td>
            </tr>
        `;

        return;
    }

    studentList.forEach(student => {

        tableBody.innerHTML += `

        <tr>

            <td>
                <img src="${student.photo}" class="student-photo">
            </td>

            <td>${student.rollNo}</td>

            <td>${student.studentName}</td>

            <td>${student.gender}</td>

            <td>${student.parentName}</td>

            <td>${student.mobile}</td>

            <td>${student.attendance}%</td>

            <td>
                <span class="status ${student.status.toLowerCase()}">
                    ${student.status}
                </span>
            </td>

           <td>

    <div class="action-buttons">

        <button class="action-btn view-btn"
            onclick="viewStudent('${student._id}')">

            <i class="fas fa-eye"></i>

        </button>

        <button class="action-btn edit-btn"
            onclick="editStudent('${student._id}')">

            <i class="fas fa-edit"></i>

        </button>

        <button class="action-btn delete-btn"
            onclick="deleteStudent('${student._id}')">

            <i class="fas fa-trash"></i>

        </button>

    </div>

</td>

        </tr>

        `;

    });

}

/* ===============================
   Search
================================= */

searchInput.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    filteredStudents = students.filter(student =>

        student.studentName.toLowerCase().includes(keyword) ||

        student.rollNo.toString().includes(keyword)

    );

    displayStudents(filteredStudents);

});

/* ===============================
   View Student
================================= */

function viewStudent(id){

    window.location.href =
        `student-profile.html?id=${id}`;

}

/* ===============================
   Edit Student
================================= */

// ====================================
// Edit Student
// ====================================

async function editStudent(id) {

    try {

        const response = await fetch(`/api/students/${id}`);

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        const student = data.student;

        editMode = true;

        document.getElementById("modalTitle").innerText = "Edit Student";

        document.getElementById("studentId").value = student._id;

        document.getElementById("admissionNo").value = student.admissionNo;

        document.getElementById("rollNo").value = student.rollNo;

        document.getElementById("studentName").value = student.studentName;

        document.getElementById("gender").value = student.gender;

        document.getElementById("dob").value =
            student.dob ? student.dob.substring(0,10) : "";

        document.getElementById("section").value = student.section;

        document.getElementById("parentName").value = student.parentName;

        document.getElementById("mobile").value = student.mobile;

        document.getElementById("email").value = student.email;

        document.getElementById("address").value = student.address;

        modal.style.display = "flex";

    } catch (err) {

        console.error(err);

        alert("Unable to load student.");

    }

}

/* ===============================
   Delete Student
================================= */

async function deleteStudent(id){

    const student =
        students.find(s=>s._id===id);

    deleteStudentId=id;

    document.getElementById("deleteStudentName").innerText=
        student.studentName;

    document.getElementById("deleteModal").style.display="flex";

}

/* ===============================
   Add Student
================================= */

// ====================================
// Open Modal
// ====================================

addStudentBtn.addEventListener("click", () => {

    editMode = false;

    studentForm.reset();

    document.getElementById("studentId").value = "";

    document.getElementById("modalTitle").innerText = "Add New Student";

    modal.style.display = "flex";

});

// ====================================
// Close Modal
// ====================================

closeModal.addEventListener("click", () => {

    modal.style.display = "none";

});

cancelBtn.addEventListener("click", () => {

    modal.style.display = "none";

});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});
// ====================================
// Save Student
// ====================================
studentForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    try {

        const schoolId = localStorage.getItem("schoolId");
        const teacher = JSON.parse(localStorage.getItem("teacher")) || {};

        const student = {

            schoolId,

            admissionNo: document.getElementById("admissionNo").value,

            rollNo: document.getElementById("rollNo").value,

            studentName: document.getElementById("studentName").value,

            gender: document.getElementById("gender").value,

            dob: document.getElementById("dob").value,

            className: teacher.classes && teacher.classes.length
                ? teacher.classes[0]
                : "",

            section: document.getElementById("section").value,

            parentName: document.getElementById("parentName").value,

            mobile: document.getElementById("mobile").value,

            email: document.getElementById("email").value,

            address: document.getElementById("address").value

        };

        const url = editMode
            ? `/api/students/${document.getElementById("studentId").value}`
            : "/api/students";

        const method = editMode ? "PUT" : "POST";

        const response = await fetch(url, {

            method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(student)

        });

        const data = await response.json();

        if (data.success) {

            alert(editMode
                ? "Student Updated Successfully"
                : "Student Added Successfully");

            modal.style.display = "none";

            studentForm.reset();

            editMode = false;

            document.getElementById("modalTitle").innerText =
                "Add New Student";

            loadStudents();

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);

        alert("Server Error");

    }

});



// ============================
// Delete Student Confirm
// ============================

document
.getElementById("cancelDelete")
.onclick=()=>{

document.getElementById("deleteModal").style.display="none";

};

document
.getElementById("closeDeleteModal")
.onclick=()=>{

document.getElementById("deleteModal").style.display="none";

};

document
.getElementById("confirmDelete")
.onclick=async()=>{

try{

const response=
await fetch(`/api/students/${deleteStudentId}`,{

method:"DELETE"

});

const data=
await response.json();

alert(data.message);

document.getElementById("deleteModal").style.display="none";

loadStudents();

}catch(err){

console.error(err);

alert("Delete Failed");

}

};
/* ===============================
   Start
================================= */

loadStudents();