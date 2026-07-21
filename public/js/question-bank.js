let classFilter = "";
let subjectFilter = "";
let chapterFilter = "";


const API = "/api/questions";

const role = localStorage.getItem("role");

const teacher = JSON.parse(localStorage.getItem("teacher"));

const school = role === "teacher"
    ? {
        _id: teacher.schoolId,
        schoolName: teacher.schoolName
    }
    : JSON.parse(localStorage.getItem("currentSchool"));

if (!school) {
    alert("Please select a school.");
    window.location.href = "schools.html";
}

document.getElementById("schoolName").innerText =
    school.schoolName;
    
 // ===============================
// Teacher Mode
// ===============================

if (role === "teacher") {

    // Automatically apply teacher's class and subject
    classFilter = teacher.classes[0];
    subjectFilter = teacher.subjects[0];

    // Hide filter dropdowns
    document.getElementById("classFilter").style.display = "none";
    document.getElementById("subjectFilter").style.display = "none";
    document.getElementById("chapterFilter").style.display = "none";

    // Hide Add Question button
    document.getElementById("addQuestionBtn").style.display = "none";

    // Teacher dashboard back button
    document.getElementById("backBtn").onclick = () => {
        window.location.href = "teacher-dashboard.html";
    };

}   

// ===============================
// Variables
// ===============================

let currentPage = 1;
let totalPages = 1;
let searchText = "";
let deleteId = null;

// ===============================
// Dashboard Counts
// ===============================

async function loadCounts() {

    try {

       const schoolId =
    role === "teacher"
        ? teacher.schoolId
        : school._id;

const url =
    role === "teacher"
        ? `/api/dashboard/${schoolId}?className=${teacher.classes[0]}&subject=${encodeURIComponent(teacher.subjects[0])}`
        : `/api/dashboard/${schoolId}`;

const res = await fetch(url);

        const data = await res.json();

        if (!data.success) return;

        document.getElementById("totalQuestions").innerText =
            data.questions;

        document.getElementById("totalBooks").innerText =
            data.books;

        document.getElementById("totalSubjects").innerText =
            data.subjects;

        document.getElementById("totalChapters").innerText =
            data.chapters;

    } catch (err) {

        console.error(err);

    }

}

// ===============================
// Load Questions
// ===============================

async function loadQuestions(page = 1, search = "") {

    try {

        currentPage = page;

       const schoolId =
    role === "teacher"
        ? teacher.schoolId
        : school._id;

        console.log("Teacher Object:", teacher);

console.log("Filters:", {
    schoolId,
    classFilter,
    subjectFilter
});
const res = await fetch(

`${API}?page=${page}
&limit=25
&search=${encodeURIComponent(search)}
&schoolId=${schoolId}
&className=${classFilter}
&subject=${subjectFilter}
&chapter=${chapterFilter}`

);

        const data = await res.json();

        totalPages = data.totalPages || 1;

        document.getElementById("totalQuestions").innerText =
            data.total || 0;

        renderTable(data.questions || []);

        document.getElementById("pageInfo").innerText =
            `Page ${currentPage} of ${totalPages}`;

        updateButtons();

    } catch (err) {

        console.error(err);

    }

}

// ===============================
// Render Table
// ===============================

function renderTable(questions) {

    const table =
        document.getElementById("questionTable");

    table.innerHTML = "";

    if (questions.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center;padding:40px;">
                    No Questions Found
                </td>
            </tr>
        `;

        return;
    }

    questions.forEach(q => {

        table.innerHTML += `

        <tr>

            <td>${q.subject}</td>

            <td>${q.chapter}</td>

            <td>${q.question}</td>

            <td>${q.marks}</td>

            <td>

${role === "teacher"
    ? `
        <button class="edit-btn"
            onclick="editQuestion('${q._id}')">
            View
        </button>
      `
    : `
        <button class="edit-btn"
            onclick="editQuestion('${q._id}')">
            Edit
        </button>

        <button class="delete-btn"
            onclick="deleteQuestion('${q._id}')">
            Delete
        </button>
      `
}

</td>

        </tr>

        `;

    });

}

// ===============================
// Pagination
// ===============================

function updateButtons() {

    document.getElementById("prevBtn").disabled =
        currentPage === 1;

    document.getElementById("nextBtn").disabled =
        currentPage >= totalPages;

}

document.getElementById("prevBtn")
.addEventListener("click", () => {

    if (currentPage > 1)
        loadQuestions(currentPage - 1, searchText);

});

document.getElementById("nextBtn")
.addEventListener("click", () => {

    if (currentPage < totalPages)
        loadQuestions(currentPage + 1, searchText);

});

// ===============================
// Search
// ===============================

document.getElementById("search")
.addEventListener("keyup", function () {

    searchText = this.value;

    loadQuestions(1, searchText);

});

// ===============================
// Refresh
// ===============================

document.getElementById("refreshBtn")
.addEventListener("click", () => {

    searchText = "";

    
    classFilter = "";
    subjectFilter = "";
    chapterFilter = "";

    document.getElementById("search").value = "";
    document.getElementById("classFilter").value = "";
    document.getElementById("subjectFilter").value = "";
    document.getElementById("chapterFilter").innerHTML =
        `<option value="">All Chapters</option>`;

    loadCounts();

    loadQuestions();

});

// ===============================
// Back
// ===============================

document.getElementById("backBtn")
.addEventListener("click", () => {

    if (role === "teacher") {

        window.location.href = "teacher-dashboard.html";

    } else {

        window.location.href = "school-dashboard.html";

    }

});

// ===============================
// Start
// ===============================


// ======================================
// Delete Question
// ======================================

async function deleteQuestion(id){

    deleteId = id;

    document.getElementById("confirmModal").style.display = "flex";

}

// ======================================
// Confirm Delete
// ======================================

document
.getElementById("confirmDelete")
.addEventListener("click", async ()=>{

    try{

        await fetch(`${API}/${deleteId}`,{

            method:"DELETE"

        });

        closeConfirm();

        showToast("Question deleted successfully.");

        loadCounts();

        loadQuestions(currentPage,searchText);

    }
    catch(err){

        console.error(err);

        alert("Unable to delete question.");

    }

});

// ======================================
// Close Delete Modal
// ======================================

function closeConfirm(){

    document.getElementById("confirmModal").style.display="none";

}

// ======================================
// Edit Question
// ======================================

async function editQuestion(id){

    try{

        const res = await fetch(`${API}/${id}`);

        const q = await res.json();

        document.getElementById("editId").value = q._id;

        document.getElementById("editSubject").value = q.subject;

        document.getElementById("editChapter").value = q.chapter;

        document.getElementById("editQuestion").value = q.question;

        document.getElementById("editMarks").value = q.marks;

        document.getElementById("editModal").style.display="flex";

    }
    catch(err){

        console.error(err);

        alert("Unable to load question.");

    }

}

// ======================================
// Update Question
// ======================================

async function updateQuestion(){

    try{

        const id = document.getElementById("editId").value;

        await fetch(`${API}/${id}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                subject:
                document.getElementById("editSubject").value,

                chapter:
                document.getElementById("editChapter").value,

                question:
                document.getElementById("editQuestion").value,

                marks:
                document.getElementById("editMarks").value

            })

        });

        closeModal();

        showToast("Question updated successfully.");

        loadQuestions(currentPage,searchText);

    }
    catch(err){

        console.error(err);

        alert("Unable to update question.");

    }

}

// ======================================
// Close Edit Modal
// ======================================

function closeModal(){

    document.getElementById("editModal").style.display="none";

}

// ======================================
// Toast
// ======================================

function showToast(message){

    const toast=document.getElementById("toast");

    toast.innerText=message;

    toast.style.display="block";

    setTimeout(()=>{

        toast.style.display="none";

    },2500);

}

// ======================================
// Close Modal on Background Click
// ======================================

window.onclick=(e)=>{

    const editModal=document.getElementById("editModal");

    const confirmModal=document.getElementById("confirmModal");

    if(e.target===editModal){

        closeModal();

    }

    if(e.target===confirmModal){

        closeConfirm();

    }

};


document.getElementById("classFilter")
.addEventListener("change", async function () {

    classFilter = this.value;

    subjectFilter = "";
    chapterFilter = "";

    const subject = document.getElementById("subjectFilter");
    subject.innerHTML = `<option value="">All Subjects</option>`;

    document.getElementById("chapterFilter").innerHTML =
        `<option value="">All Chapters</option>`;

    if(classFilter){

        const res = await fetch(
    `/api/questions/filter?schoolId=${school._id}&className=${encodeURIComponent(classFilter)}`
);

        const data = await res.json();

        data.subjects.forEach(item=>{

            subject.innerHTML += `
                <option value="${item}">
                    ${item}
                </option>
            `;

        });

    }

    loadQuestions(1, searchText);

});

document.getElementById("subjectFilter")
.addEventListener("change", async function () {

    subjectFilter = this.value;

    chapterFilter = "";

    const chapter = document.getElementById("chapterFilter");

    chapter.innerHTML = `
        <option value="">All Chapters</option>
    `;

    if(subjectFilter){

       const res = await fetch(
    `/api/questions/chapters?schoolId=${school._id}&className=${classFilter}&subject=${encodeURIComponent(subjectFilter)}`
);

const data = await res.json();

data.chapters.forEach(item => {

    chapter.innerHTML += `
        <option value="${item}">
            ${item}
        </option>
    `;

});

    }

    loadQuestions(1,searchText);

});

document.getElementById("chapterFilter")
.addEventListener("change", function(){

    chapterFilter=this.value;

    loadQuestions(1,searchText);

});

async function loadFilters(){

    const res=await fetch(
        "/api/dashboard/"+school._id
    );

    const data=await res.json();

    if(!data.success) return;

    // Subjects

    const subject=document.getElementById("subjectFilter");

    data.subjectList?.forEach(item=>{

        subject.innerHTML+=`
        <option value="${item}">
            ${item}
        </option>
        `;

    });

    // Classes

    const classes=document.getElementById("classFilter");

    data.classList?.forEach(item=>{

        classes.innerHTML+=`
        <option value="${item}">
            ${item}
        </option>
        `;

    });

}
loadCounts();

if (role !== "teacher") {

    loadFilters();

}

loadQuestions();