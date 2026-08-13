const role = localStorage.getItem("role");

if(role === "principal"){

    alert("Access Denied");

    window.location.href = "school-dashboard.html";

}

const user = JSON.parse(localStorage.getItem("user"));

if(!user){

    window.location.href = "login.html";

}

const container = document.getElementById("schoolsContainer");

let schools = [];
let editMode = false;

let editingSchoolId = null;

// ==========================================
// SUBSCRIPTION PRICES
// ==========================================

const PACKAGE_PRICES = {

    basic: 19999,

    standard: 39999,

    premium: 69999,

    "ai-enterprise": 129999

};

let collectedRevenue = 0;

let successfulPayments = 0;


// ==========================================
// LOAD ACTUAL RAZORPAY REVENUE
// ==========================================

async function loadCollectedRevenue() {

    try {

        const response =
            await fetch(
                "/api/subscription-payment/revenue"
            );


        if (!response.ok) {

            throw new Error(
                `Revenue API error: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Revenue loading failed"
            );

        }


        collectedRevenue =
            Number(
                data.totalRevenue || 0
            );


        successfulPayments =
            Number(
                data.successfulPayments || 0
            );

            const paymentText =
    document.getElementById(
        "successfulPaymentsText"
    );


if (paymentText) {

    paymentText.innerText =
        successfulPayments +
        (
            successfulPayments === 1
                ? " successful payment"
                : " successful payments"
        );

}


        // Update revenue card

        const revenueElement =
            document.getElementById(
                "totalRevenue"
            );


        if (revenueElement) {

            revenueElement.innerText =
                "₹" +
                collectedRevenue.toLocaleString(
                    "en-IN"
                );

        }


        // Optional payment count

        const paymentCountElement =
            document.getElementById(
                "successfulPayments"
            );


        if (paymentCountElement) {

            paymentCountElement.innerText =
                successfulPayments;

        }


        console.log(
            "Revenue Collected:",
            collectedRevenue
        );


        console.log(
            "Successful Payments:",
            successfulPayments
        );

    }
    catch (error) {

        console.error(
            "Revenue loading error:",
            error
        );


        const revenueElement =
            document.getElementById(
                "totalRevenue"
            );


        if (revenueElement) {

            revenueElement.innerText =
                "₹0";

        }

    }

}

async function loadSchools() {

    try {

        const response = await fetch("/api/schools");

        const data = await response.json();

        schools = data.schools || [];

        updateSubscriptionSummary(schools);

        displaySchools(schools);

        loadCollectedRevenue();

    } catch (err) {

        console.error(err);

        container.innerHTML = `
            <h2 style="color:red;text-align:center;">
                Failed to load schools
            </h2>
        `;
    }
}

// ==========================================
// UPDATE SUBSCRIPTION SUMMARY
// ==========================================

function updateSubscriptionSummary(list) {

    let basic = 0;
    let standard = 0;
    let premium = 0;
    let enterprise = 0;
    let custom = 0;

    let totalValue = 0;


    list.forEach(school => {

        const packageName =
            String(
                school.subscription?.package ||
                "basic"
            )
            .toLowerCase()
            .trim();


        // Count packages

        if (packageName === "basic") {

            basic++;

        }
        else if (packageName === "standard") {

            standard++;

        }
        else if (packageName === "premium") {

            premium++;

        }
        else if (
            packageName === "ai-enterprise"
        ) {

            enterprise++;

        }
        else if (packageName === "custom") {

            custom++;

        }


        // Calculate annual subscription value

        if (
            PACKAGE_PRICES[
                packageName
            ]
        ) {

            totalValue +=
                PACKAGE_PRICES[
                    packageName
                ];

        }


        // Custom package
        // uses saved custom price if available

        if (
            packageName === "custom"
        ) {

            const customPrice =
                Number(
                    school.subscription?.price ||
                    school.subscription?.amount ||
                    0
                );

            totalValue += customPrice;

        }

    });


    // Update UI

    document.getElementById(
        "totalSchools"
    ).innerText = list.length;


    document.getElementById(
        "basicSchools"
    ).innerText = basic;


    document.getElementById(
        "standardSchools"
    ).innerText = standard;


    document.getElementById(
        "premiumSchools"
    ).innerText = premium;


    document.getElementById(
        "enterpriseSchools"
    ).innerText = enterprise;


    document.getElementById(
        "customSchools"
    ).innerText = custom;


   const annualValueElement =
    document.getElementById(
        "annualSubscriptionValue"
    );


if (annualValueElement) {

    annualValueElement.innerText =
        "₹" +
        totalValue.toLocaleString(
            "en-IN"
        );

}

}

function displaySchools(list) {

    if (list.length === 0) {

        container.innerHTML = `
            <h2 style="text-align:center;">
                No School Found
            </h2>
        `;

        return;
    }

    container.innerHTML = "";

    list.forEach(school => {

        container.innerHTML += `

        <div class="school-card">

            <div class="school-logo">

                <img src="${
                    school.logo ||
                    'https://placehold.co/120x120?text=School'
                }">

            </div>

            <div class="school-name">

                ${school.schoolName}

            </div>
<div class="school-info">

    <p>
        <b>Board :</b>
        ${school.board}
    </p>

    <p>
        <b>Principal :</b>
        ${school.principal || "-"}
    </p>

    <p>
        <b>Phone :</b>
        ${school.phone || "-"}
    </p>

    <p>
        <b>City :</b>
        ${school.city || "-"}
    </p>

   <p class="package-info">

    <b>Package :</b>

    <span class="package-badge">

        ${
            school.subscription?.package
                ? school.subscription.package
                    .replace("-", " ")
                    .replace(/\b\w/g, c => c.toUpperCase())
                : "Basic"
        }

    </span>

</p>


<p class="package-price-info">

    <b>Annual Price :</b>

    <span class="package-price">

        ₹${
            PACKAGE_PRICES[
                String(
                    school.subscription?.package ||
                    "basic"
                ).toLowerCase()
            ]
            ? PACKAGE_PRICES[
                String(
                    school.subscription?.package ||
                    "basic"
                ).toLowerCase()
            ].toLocaleString("en-IN")

            : Number(
                school.subscription?.price ||
                school.subscription?.amount ||
                0
            ).toLocaleString("en-IN")
        }

        <small>/ year</small>

    </span>

</p>

</div>

            <div class="card-buttons">

                <button class="open-btn" onclick="openSchool('${school._id}')">

                  Open

                 </button>
                  <button
                 class="package-btn" onclick="managePackage('${school._id}')">
                 <i class="fa-solid fa-box"></i>
                 Package
                 </button>

                <button class="edit-btn" onclick="editSchool('${school._id}')">

                   Edit

                </button>

                <button class="delete-btn" onclick="deleteSchool('${school._id}')">

                   Delete

                 </button>

            </div>

        </div>

        `;

    });

}

function openSchool(id) {

    const school = schools.find(s => s._id === id);

    if (!school) return;

    localStorage.setItem("schoolId", school._id);

    localStorage.setItem("schoolName", school.schoolName);

    localStorage.setItem(
        "currentSchool",
        JSON.stringify(school)
    );

    window.location.href = "admin-school-overview.html";

}

async function deleteSchool(id) {

    const school = schools.find(s => s._id === id);

    if (!school) return;

    const confirmDelete = confirm(
        `Are you sure you want to delete "${school.schoolName}"?`
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch("/api/schools/" + id, {
            method: "DELETE"
        });

        const result = await response.json();

        if (result.success) {

            alert("School deleted successfully.");

            loadSchools();

        } else {

            alert(result.message);

        }

    } catch (err) {

        console.error(err);

        alert("Unable to delete school.");

    }
}

document.getElementById("searchSchool")
.addEventListener("input", function () {

    const text = this.value.toLowerCase();

    const filtered = schools.filter(s =>

        s.schoolName.toLowerCase().includes(text)

    );

    displaySchools(filtered);

});
// Modal

const modal = document.getElementById("schoolModal");

document.getElementById("addSchoolBtn").onclick = () => {

    modal.style.display = "flex";

};

document.getElementById("closeModal").onclick = () => {

    modal.style.display = "none";

};

document.getElementById("cancelBtn").onclick = () => {

    modal.style.display = "none";

    editMode = false;

    editingSchoolId = null;

    document.getElementById("modalTitle").innerHTML =
    `<i class="fa-solid fa-school"></i> Add New School`;

    document.getElementById("saveSchoolBtn").innerText =
    "Save School";

};

window.onclick = function(e){

    if(e.target===modal){

        modal.style.display="none";

    }

};
// ==============================
// Save School
// ==============================

document.getElementById("saveSchoolBtn").addEventListener("click", saveSchool);

async function saveSchool() {

   const school = {

    schoolName: document.getElementById("schoolName").value.trim(),

    principal: document.getElementById("principal").value.trim(),

    username: document.getElementById("principalUsername").value.trim(),

    password: document.getElementById("principalPassword").value,

    phone: document.getElementById("phone").value.trim(),

    email: document.getElementById("email").value.trim(),

    board: document.getElementById("board").value,

    package: document.getElementById("schoolPackage").value,

    city: document.getElementById("city").value.trim(),

    state: document.getElementById("state").value.trim(),

    address: document.getElementById("address").value.trim()

};

    // Validation
    if (!school.schoolName) {

        alert("Please enter School Name");

        return;

    }
    if (!school.username) {

    alert("Please enter Principal Username");

    return;

}

if (!school.password) {

    alert("Please enter Principal Password");

    return;

}

    try {

                const url = editMode ? "/api/schools/" + editingSchoolId: "/api/schools";

                const method = editMode? "PUT": "POST";

                const response = await fetch(url,{

                method,headers:
                {
                 "Content-Type":"application/json"
                },

                body:JSON.stringify(school)

                });

        const result = await response.json();

        if (result.success) {

            alert("School Added Successfully");

            modal.style.display = "none";
            editMode = false;

            editingSchoolId = null;

            document.getElementById("modalTitle").innerHTML =`<i class="fa-solid fa-school">
                                                               </i> Add New School`;

            document.getElementById("saveSchoolBtn").innerText ="Save School";

            // Clear form
            document.getElementById("schoolName").value = "";
            document.getElementById("principal").value = "";
            document.getElementById("principalUsername").value = "";
            document.getElementById("principalPassword").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("email").value = "";
            document.getElementById("city").value = "";
            document.getElementById("state").value = "";
            document.getElementById("address").value = "";
            document.getElementById("board").selectedIndex = 0;
            document.getElementById("schoolPackage").value = "basic";

            // Reload school list
            loadSchools();

        } else {

            alert(result.message);

        }

    } catch (err) {

        console.error(err);

        alert("Unable to save school.");

    }

}

// ==============================
// Edit School
// ==============================

function editSchool(id){

    const school = schools.find(s => s._id === id);

    if(!school) return;

    editMode = true;

    editingSchoolId = id;

    document.getElementById("modalTitle").innerHTML =
    `<i class="fa-solid fa-pen"></i> Edit School`;

    document.getElementById("saveSchoolBtn").innerText =
    "Update School";

    document.getElementById("schoolName").value = school.schoolName || "";

    document.getElementById("principal").value = school.principal || "";
    document.getElementById("principalUsername").value = "";

    document.getElementById("principalPassword").value = "";

    document.getElementById("phone").value = school.phone || "";

    document.getElementById("email").value = school.email || "";

    document.getElementById("board").value = school.board || "CBSE";

    document.getElementById("city").value = school.city || "";

    document.getElementById("state").value = school.state || "";

    document.getElementById("address").value = school.address || "";

    modal.style.display = "flex";

}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    if(confirm("Are you sure you want to logout?")){

        localStorage.removeItem("user");

        window.location.href = "start.html";

    }

});

// ==========================================
// PACKAGE MANAGEMENT
// ==========================================

const packageModal =
    document.getElementById("packageModal");

const packageSelect =
    document.getElementById("packageSelect");

const packageSchoolName =
    document.getElementById("packageSchoolName");

const featureList =
    document.getElementById("featureList");

let packageSchoolId = null;


// ==========================================
// FEATURE NAMES
// ==========================================

const FEATURE_NAMES = {

    principalDashboard: "Principal Dashboard",

    teacherDashboard: "Teacher Dashboard",

    studentDashboard: "Student Dashboard",

    attendance: "Attendance",

    fees: "Fee Collection",

    salary: "Teacher Salary",

    timetable: "Timetable",

    onlineTests: "Online Tests",

    questionBank: "Question Bank",

    aiPaperGenerator: "AI Paper Generator",

    aiEvaluation: "AI Evaluation",

    aiReports: "AI Reports",

    aiAssistant: "AI Assistant",

    busTracking: "Smart Bus Tracking",

    qrClassroom: "QR Classroom"
};


// ==========================================
// PACKAGE PREVIEW
// ==========================================

const PACKAGE_FEATURES_PREVIEW = {

    basic: {

        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,
        attendance: true,
        fees: true,
        salary: false,
        timetable: false,
        onlineTests: false,
        questionBank: false,
        aiPaperGenerator: false,
        aiEvaluation: false,
        aiReports: false,
        aiAssistant: true,
        busTracking: false,
        qrClassroom: false

    },


    standard: {

        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,
        attendance: true,
        fees: true,
        salary: true,
        timetable: true,
        onlineTests: false,
        questionBank: false,
        aiPaperGenerator: false,
        aiEvaluation: false,
        aiReports: false,
        aiAssistant: true,
        busTracking: false,
        qrClassroom: false

    },


    premium: {

        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,
        attendance: true,
        fees: true,
        salary: true,
        timetable: true,
        onlineTests: true,
        questionBank: true,
        aiPaperGenerator: false,
        aiEvaluation: false,
        aiReports: false,
        aiAssistant: true,
        busTracking: false,
        qrClassroom: true

    },


    "ai-enterprise": {

        principalDashboard: true,
        teacherDashboard: true,
        studentDashboard: true,
        attendance: true,
        fees: true,
        salary: true,
        timetable: true,
        onlineTests: true,
        questionBank: true,
        aiPaperGenerator: true,
        aiEvaluation: true,
        aiReports: true,
        aiAssistant: true,
        busTracking: true,
        qrClassroom: true

    }

};

// ==========================================
// OPEN PACKAGE MODAL
// ==========================================

function managePackage(id) {

    const school = schools.find(
        s => s._id === id
    );

    if (!school) return;

    packageSchoolId = id;

    packageSchoolName.innerHTML = `
        <i class="fa-solid fa-school"></i>
        ${school.schoolName}
    `;


    const currentPackage =
        school.subscription?.package || "basic";


    packageSelect.value = currentPackage;


    renderPackageFeatures(
        currentPackage,
        school.subscription?.features || {}
    );


    packageModal.style.display = "flex";
}

// ==========================================
// RENDER FEATURES
// ==========================================

function renderPackageFeatures(packageName, currentFeatures = {}) {

    let features = {};

    if (packageName === "custom") {

        features = currentFeatures;

    } else {

        features =
            PACKAGE_FEATURES_PREVIEW[packageName] || {};

    }


    featureList.innerHTML = "";


    Object.keys(FEATURE_NAMES).forEach(key => {

        const enabled =
            features[key] === true;


        const item = document.createElement("label");

item.className = "package-feature-row";

item.innerHTML = `
    <input
        type="checkbox"
        class="package-feature"
        data-feature="${key}"
        ${enabled ? "checked" : ""}
        ${packageName !== "custom" ? "disabled" : ""}
    >

    <span class="package-feature-name">
        ${FEATURE_NAMES[key]}
    </span>
`;


        featureList.appendChild(item);

    });

}
packageSelect.addEventListener(
    "change",
    function () {

        const selected =
            this.value;

        renderPackageFeatures(
            selected,
            {}
        );

    }
);

document
    .getElementById("savePackageBtn")
    .addEventListener("click", savePackage);


async function savePackage() {

    if (!packageSchoolId) return;


    const packageName =
        packageSelect.value;


    let features = {};


    if (packageName === "custom") {

        document
            .querySelectorAll(".package-feature")
            .forEach(input => {

                features[input.dataset.feature] =
                    input.checked;

            });

    }


    try {

        const response = await fetch(
            `/api/schools/${packageSchoolId}/package`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    packageName,

                    features

                })
            }
        );


        const result =
            await response.json();


        if (!result.success) {

            alert(result.message ||
                "Unable to update package");

            return;
        }


        alert(
            "School package updated successfully."
        );


        packageModal.style.display = "none";


        loadSchools();


    } catch (err) {

        console.error(err);

        alert(
            "Unable to update school package."
        );

    }

}

document
    .getElementById("closePackageModal")
    .onclick = () => {

        packageModal.style.display = "none";

    };


document
    .getElementById("cancelPackageBtn")
    .onclick = () => {

        packageModal.style.display = "none";

    };

    window.onclick = function(e) {

    if (e.target === modal) {

        modal.style.display = "none";

    }

    if (e.target === packageModal) {

        packageModal.style.display = "none";

    }

};

loadSchools();