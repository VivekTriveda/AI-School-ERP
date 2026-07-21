async function createPrincipal() {

    const school = document.getElementById("school");

    const body = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value,

        password: document.getElementById("password").value,

        schoolId: school.value,

        schoolName: school.options[school.selectedIndex].text,

        createdBy: localStorage.getItem("userId")

    };

    const res = await fetch("/api/users/create-principal", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(body)

    });

    const data = await res.json();

    alert(data.message);

}