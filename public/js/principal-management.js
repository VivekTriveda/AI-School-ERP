const school = JSON.parse(
    localStorage.getItem("selectedSchool")
);

if (!school) {

    alert("Please select a school first.");

    window.location.href = "schools.html";

}

document.getElementById("schoolTitle").innerHTML =
    school.schoolName;

async function loadPrincipals() {

    const response = await fetch(
        "/api/users/principals/" + school._id
    );

    const data = await response.json();

    const tbody = document.getElementById("principalBody");

    tbody.innerHTML = "";

    data.principals.forEach(principal => {

        tbody.innerHTML += `

        <tr>

            <td>${principal.name}</td>

            <td>${principal.email}</td>

            <td>${principal.status}</td>

            <td>

                <button onclick="editPrincipal('${principal._id}')">
                    Edit
                </button>

                <button onclick="deletePrincipal('${principal._id}')">
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

loadPrincipals();