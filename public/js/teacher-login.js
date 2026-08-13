// ===============================
// Teacher Login
// ===============================

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", loginTeacher);

// Allow Enter key
document.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        loginTeacher();

    }

});

async function loginTeacher() {

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    const message = document.getElementById("message");

    message.className = "";
    message.innerHTML = "";

    if (!email || !password) {

        message.className = "error";
        message.innerHTML = "Please enter Email and Password.";

        return;

    }

    loginBtn.disabled = true;

    loginBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Logging In...
    `;

    try {

        const response = await fetch("/api/teachers/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (!data.success) {

            message.className = "error";
            message.innerHTML = data.message;

            loginBtn.disabled = false;

            loginBtn.innerHTML = `
                <i class="fa-solid fa-right-to-bracket"></i>
                Login
            `;

            return;

        }

        // Save Teacher Session
        localStorage.setItem(
            "teacher",
            JSON.stringify(data.teacher)
        );

        localStorage.setItem("role", "teacher");
localStorage.setItem("schoolId", data.teacher.schoolId);
localStorage.setItem("schoolName", data.teacher.schoolName);


        localStorage.setItem("currentUser", JSON.stringify({

    _id: data.teacher._id,

    role: "teacher",

    schoolId: data.teacher.schoolId,

    name: data.teacher.teacherName,

    className: data.teacher.className,

    section: data.teacher.section,

    teacherId: data.teacher.teacherId

}));

        message.className = "success";
        message.innerHTML = "Login Successful...";

        setTimeout(() => {

            window.location.href = "teacher-dashboard.html";

        }, 800);

    } catch (err) {

        console.error(err);

        message.className = "error";
        message.innerHTML = "Server Error.";

        loginBtn.disabled = false;

        loginBtn.innerHTML = `
            <i class="fa-solid fa-right-to-bracket"></i>
            Login
        `;

    }

}