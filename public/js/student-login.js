// ==========================================
// Show / Hide Password
// ==========================================

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        passwordInput.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});

// ==========================================
// Student Login
// ==========================================

document
.getElementById("studentLoginForm")
.addEventListener("submit", loginStudent);

async function loginStudent(e) {

    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const loginBtn =
        document.getElementById("loginBtn");

    const message =
        document.getElementById("message");

    message.innerHTML = "";

    loginBtn.disabled = true;

    loginBtn.innerHTML =
        '<i class="fa fa-spinner fa-spin"></i> Logging in...';

    try {

        const response = await fetch(
            "/api/student-auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username,
                    password

                })

            }
        );

        const data = await response.json();

        if (!data.success) {

            message.style.color = "red";

            message.innerHTML = data.message;

            loginBtn.disabled = false;

            loginBtn.innerHTML = "LOGIN";

            return;

        }

        // Save JWT

        localStorage.setItem(
            "studentToken",
            data.token
        );

        // Save Student

        localStorage.setItem(
            "student",
            JSON.stringify(data.student)
        );
    

        localStorage.setItem("role", "student");

localStorage.setItem("schoolId", data.student.schoolId);

localStorage.setItem("currentUser", JSON.stringify({

    _id: data.student._id || data.student.id,

    role: "student",

    schoolId: data.student.schoolId,

    name: data.student.studentName,

    className: data.student.className,

    section: data.student.section,

    studentId: data.student.studentId

}));

        message.style.color = "green";

        message.innerHTML =
            "Login Successful";

        setTimeout(() => {

            window.location.href =
                "student-dashboard.html";

        }, 800);

    }
    catch (err) {

        console.error(err);

        message.style.color = "red";

        message.innerHTML =
            "Unable to connect to server.";

        loginBtn.disabled = false;

        loginBtn.innerHTML = "LOGIN";

    }

}