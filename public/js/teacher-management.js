let teacherOptions = [];
let allTeachers = [];

// ===============================
// Get Selected School
// ===============================

const principal = JSON.parse(localStorage.getItem("principal"));

if (!principal) {

    alert("Please login as Principal.");

    window.location.href = "login.html?role=principal";

}

const school = JSON.parse(localStorage.getItem("currentSchool"));

// Show School Name
document.getElementById("schoolTitle").textContent = school.schoolName;


// ===============================
// Load Teachers
// ===============================

async function loadTeachers() {

    try {

        const response = await fetch(`/api/teachers/${school._id}`);

        const data = await response.json();
        allTeachers = data.teachers || [];

       

        // If no teachers
       if (!data.success || !data.teachers) {

    renderTeachers([]);

    return;
}
            document.getElementById("totalTeachers").innerText =
            data.teachers.length;

            document.getElementById("activeTeachers").innerText =
            data.teachers.filter(t => t.status).length;

            const subjects = new Set();

            data.teachers.forEach(t=>{

            t.subjects.forEach(s=>subjects.add(s));

            });

document.getElementById("totalSubjects").innerText =
    subjects.size;

        renderTeachers(allTeachers);

    } catch (err) {

        console.error(err);

        document.getElementById("teacherBody").innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:red;">
                    Failed to load teachers.
                </td>
            </tr>
        `;

    }

}

function renderTeachers(teachers){

    const container =
        document.getElementById("teacherCards");

    container.innerHTML="";

    if(teachers.length===0){

        container.innerHTML=`
        <div class="no-data">

            No Teachers Found

        </div>
        `;

        return;
    }

    teachers.forEach(teacher=>{

        container.innerHTML+=`

<div class="teacher-card">

<div class="teacher-header">

<div class="teacher-name">

<i class="fa-solid fa-user"></i>

${teacher.teacherName}

</div>

<span class="${
teacher.status
? "active"
: "inactive"
}">

${teacher.status
? "Active"
: "Inactive"}

</span>

</div>

<div class="teacher-info">

<i class="fa-solid fa-envelope"></i>

${teacher.email}

</div>

<div class="teacher-info">

<i class="fa-solid fa-phone"></i>

${teacher.mobile || "-"}

</div>

<div class="teacher-info">

<i class="fa-solid fa-book"></i>

${teacher.subjects.join(", ")}

</div>

<div class="teacher-info">

<i class="fa-solid fa-school"></i>

Class :

${teacher.classes.join(", ")}

</div>

<div class="teacher-actions">

<button
class="edit-btn"
onclick="editTeacher('${teacher._id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="delete-btn"
onclick="deleteTeacher('${teacher._id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

`;

    });

}

// ===============================
// Add Teacher Button
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("teacherModal");

    document.getElementById("addTeacherBtn").onclick = () => {
        modal.style.display = "flex";
        loadTeacherOptions();
    };

    document.getElementById("closeModal").onclick = () => {
        modal.style.display = "none";
    };

    document.getElementById("cancelBtn").onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };

});

// ===============================
// Edit Teacher
// ===============================

// ===============================
// Edit Teacher
// ===============================
let editingTeacherId = null;

async function editTeacher(id) {

    try {

        const response = await fetch(`/api/teachers/teacher/${id}`);

        const data = await response.json();

        if (!data.success) {
            alert(data.message || "Unable to load teacher.");
            return;
        }

        const teacher = data.teacher;

        // Store ID for update
        editingTeacherId = teacher._id;

        // Open modal
        const modal = document.getElementById("teacherModal");
        modal.style.display = "flex";

        // Load teacher options first
        await loadTeacherOptions();

        // Fill basic information
        document.getElementById("teacherName").value =
            teacher.teacherName || "";

        document.getElementById("teacherEmail").value =
            teacher.email || "";

        document.getElementById("teacherMobile").value =
            teacher.mobile || "";

        // Password should remain unchanged
        document.getElementById("teacherPassword").value = "";

        // Teacher type
        document.getElementById("teacherType").value =
            teacher.teacherType || "SUBJECT_TEACHER";

        // Load class
        const classSelect =
            document.getElementById("classSelect");

        if (teacher.classes && teacher.classes.length) {

            const classValue = teacher.classes[0];

            const classOption =
                [...classSelect.options]
                .find(option => option.value === classValue);

            if (classOption) {
                classSelect.value = classValue;
            }
        }

        // Load subjects
        loadSubjects();

        const subjectSelect =
            document.getElementById("subjectSelect");

        if (teacher.subjects && teacher.subjects.length) {

            const subjectValue = teacher.subjects[0];

            const subjectOption =
                [...subjectSelect.options]
                .find(option => option.value === subjectValue);

            if (subjectOption) {
                subjectSelect.value = subjectValue;
            }
        }

        // Class teacher section
        if (teacher.teacherType === "CLASS_TEACHER") {

            document.getElementById("sectionGroup").style.display =
                "block";

            if (teacher.classTeacherOf) {

                document.getElementById("sectionSelect").value =
                    teacher.classTeacherOf.section || "";
            }

        } else {

            document.getElementById("sectionGroup").style.display =
                "none";
        }

        // Change button text
        document.getElementById("saveTeacherBtn").innerText =
            "Update Teacher";

    } catch (error) {

        console.error("Edit teacher error:", error);

        alert("Unable to load teacher details.");
    }
}


// ===============================
// Delete Teacher
// ===============================

async function deleteTeacher(id) {

    const confirmDelete = confirm("Delete this teacher?");

    if (!confirmDelete) return;

    try{

    const res=await fetch(`/api/teachers/${id}`,{

        method:"DELETE"

    });

    const data=await res.json();

    alert(data.message);

    loadTeachers();

}catch(err){

    console.error(err);

    alert("Unable to delete teacher.");

}

}


// ===============================
// Load Board / Class / Subject
// ===============================

async function loadTeacherOptions() {

    try {

        const response = await fetch(
            `/api/teachers/options/${school._id}`
        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        teacherOptions = data.books;

          teacherOptions = data.books;

          loadClasses();

    } catch (err) {

        console.error(err);

    }

}

// ===============================
// Load Classes
// ===============================

function loadClasses() {

    const classSelect =
        document.getElementById("classSelect");

    classSelect.innerHTML = "";

    const classes = [

        ...new Set(
            teacherOptions.map(book => book.className)
        )

    ];

    classes.forEach(item => {

        classSelect.innerHTML += `
            <option value="${item}">
                ${item}
            </option>
        `;

    });

    loadSubjects();

}

// ===============================
// Load Subjects
// ===============================

function loadSubjects() {

    const className =
        document.getElementById("classSelect").value;

    const subjectSelect =
        document.getElementById("subjectSelect");

    subjectSelect.innerHTML = "";

    const subjects = [

        ...new Set(

            teacherOptions

            .filter(book =>
                book.className === className
            )

            .map(book => book.subject)

        )

    ];

    subjects.forEach(item => {

        subjectSelect.innerHTML += `
            <option value="${item}">
                ${item}
            </option>
        `;

    });

    loadBook();

}

// ===============================
// Load Book
// ===============================

function loadBook() {

    const className =
        document.getElementById("classSelect").value;

    const subject =
        document.getElementById("subjectSelect").value;

    const book = teacherOptions.find(item =>

        item.className === className &&
        item.subject === subject

    );

    document.getElementById("bookName").value =
        book ? book.fileName : "";

}


document
.getElementById("classSelect")
.addEventListener("change", loadSubjects);

document
.getElementById("subjectSelect")
.addEventListener("change", loadBook);
document
.getElementById("teacherType")
.addEventListener("change", () => {

    const type =
        document.getElementById("teacherType").value;

    const sectionGroup =
        document.getElementById("sectionGroup");

    if (type === "CLASS_TEACHER") {

        sectionGroup.style.display = "block";

    } else {

        sectionGroup.style.display = "none";

    }

});

// ===============================
// Start
// ===============================

loadTeachers();
// ===============================
// Save Teacher
// ===============================

document.getElementById("saveTeacherBtn").addEventListener("click", saveTeacher);

async function saveTeacher() {

    const teacherName = document.getElementById("teacherName").value.trim();
    const email = document.getElementById("teacherEmail").value.trim();
    const password = document.getElementById("teacherPassword").value.trim();
    const mobile = document.getElementById("teacherMobile").value.trim();
    const className = document.getElementById("classSelect").value;
    const subject = document.getElementById("subjectSelect").value;
    const bookName = document.getElementById("bookName").value;

    if (!teacherName || !email || !password) {
        alert("Please fill all required fields.");
        return;
    }

    try {
         console.log(school);
        const response = await fetch("/api/teachers/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
         body: JSON.stringify({

    schoolId: school._id,

    schoolName: school.schoolName,

    board: school.board,

    teacherName,

    email,

    password,

    mobile,

    classes: [className],

    subjects: [subject],

    teacherType: document.getElementById("teacherType").value,

    classTeacherOf:

        document.getElementById("teacherType").value === "CLASS_TEACHER"

        ? {

            board: school.board,

            className,

            section: document.getElementById("sectionSelect").value

        }

        : null

})
        });

        const data = await response.json();

        alert(data.message);

        if (data.success) {

            document.getElementById("teacherModal").style.display = "none";

            loadTeachers();
        }

    } catch (err) {

        console.error(err);

        alert("Failed to save teacher.");

    }

}
document.getElementById("searchTeacher")
.addEventListener("keyup",function(){

    const value=this.value.toLowerCase();

    const filtered=allTeachers.filter(t=>{

        return(

            t.teacherName.toLowerCase().includes(value)

            ||

            t.email.toLowerCase().includes(value)

            ||

            t.subjects.join(",").toLowerCase().includes(value)

        );

    });

    renderTeachers(filtered);

});


document.getElementById("teacherType").dispatchEvent(
    new Event("change")
);

document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "school-dashboard.html";
});