const params = new URLSearchParams(window.location.search);

const id = params.get("id");

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

        document.getElementById("parentName").innerText =
            s.parentName;

        document.getElementById("mobile").innerText =
            s.mobile;

        document.getElementById("email").innerText =
            s.email || "-";

        document.getElementById("address").innerText =
            s.address || "-";

    }

    catch(err){

        console.error(err);

        alert("Unable to load student.");

    }

}