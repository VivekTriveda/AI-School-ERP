const student = JSON.parse(localStorage.getItem("student"));

const id =
    student?._id ||
    student?.id ||
    localStorage.getItem("studentId");

loadStudent();

async function loadStudent(){

    try{

        const response =
        await fetch(`/api/students/${id}`);

        const data =
        await response.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        const s = data.student;

        document.getElementById("studentPhoto").src =
            s.photo || "/images/default-student.png";

        document.getElementById("studentName").innerText =
            s.studentName;

        document.getElementById("admissionNo").innerText =
            s.admissionNo;

        document.getElementById("rollNo").innerText =
            s.rollNo;

        document.getElementById("gender").innerText =
            s.gender;

        document.getElementById("dob").innerText =
            s.dob
            ? new Date(s.dob).toLocaleDateString()
            : "-";

        document.getElementById("className").innerText =
            s.className;

        document.getElementById("section").innerText =
            s.section;

        document.getElementById("fatherName").innerText =
    s.fatherName || "-";

document.getElementById("motherName").innerText =
    s.motherName || "-";

        document.getElementById("mobile").innerText =
            s.mobile;

        document.getElementById("email").innerText =
            s.email || "-";

        document.getElementById("address").innerText =
            s.address || "-";

            document.getElementById("studentName2").innerText =
    s.studentName;

document.getElementById("admissionNo2").innerText =
    s.admissionNo;

document.getElementById("rollNo2").innerText =
    s.rollNo;

document.getElementById("className2").innerText =
    s.className;

document.getElementById("section2").innerText =
    s.section;

    }

    catch(err){

        console.error(err);

        alert("Unable to load student.");

    }

}