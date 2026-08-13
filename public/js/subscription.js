/* =========================================================
   SCHOOL ERP SUBSCRIPTION
========================================================= */


/* =========================================================
   CURRENT SCHOOL
========================================================= */

const currentSchool =
    JSON.parse(
        localStorage.getItem("currentSchool")
    );


/* =========================================================
   PACKAGE ORDER
========================================================= */

const PACKAGE_ORDER = [
    "basic",
    "standard",
    "premium",
    "ai-enterprise",
    "custom"
];


/* =========================================================
   PACKAGE NAMES
========================================================= */

const PACKAGE_NAMES = {

    basic: "Basic",
    standard: "Standard",
    premium: "Premium",
    "ai-enterprise": "AI Enterprise",
    custom: "Custom"

};


/* =========================================================
   PACKAGE PRICES
========================================================= */

const PACKAGE_PRICES = {

    basic: 19999,

    standard: 39999,

    premium: 69999,

    "ai-enterprise": 129999

};


/* =========================================================
   PACKAGE FEATURES
========================================================= */

const PACKAGE_FEATURES = {

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


/* =========================================================
   FEATURE NAMES
========================================================= */

const FEATURE_NAMES = {

    principalDashboard:
        "Principal Dashboard",

    teacherDashboard:
        "Teacher Dashboard",

    studentDashboard:
        "Student Dashboard",

    attendance:
        "Attendance",

    fees:
        "Fee Management",

    salary:
        "Teacher Salary",

    timetable:
        "Timetable",

    onlineTests:
        "Online Tests",

    questionBank:
        "Question Bank",

    aiPaperGenerator:
        "AI Paper Generator",

    aiEvaluation:
        "AI Evaluation",

    aiReports:
        "AI Reports",

    aiAssistant:
        "AI Assistant",

    busTracking:
        "Smart Bus Tracking",

    qrClassroom:
        "QR Classroom"

};


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    return "₹" +
        Number(price).toLocaleString("en-IN");

}


/* =========================================================
   GET CURRENT PACKAGE
========================================================= */

function getCurrentPackage() {

    return (
        currentSchool?.subscription?.package
        || "basic"
    ).toLowerCase();

}


/* =========================================================
   GET PACKAGE FEATURE STATUS
========================================================= */

function getFeatureStatus(
    packageName,
    featureName
) {

    /*
       Custom package
    */

    if (packageName === "custom") {

        return (
            currentSchool
                ?.subscription
                ?.features
                ?. [featureName] === true
        );

    }


    return (
        PACKAGE_FEATURES
            [packageName]
            ?.
            [featureName] === true
    );

}


/* =========================================================
   UPDATE SCHOOL INFORMATION
========================================================= */

function loadSchoolInformation() {

    const schoolName =
        document.getElementById(
            "schoolName"
        );

    const currentPackage =
        document.getElementById(
            "currentPackage"
        );


    if (schoolName) {

        schoolName.textContent =
            currentSchool?.schoolName
            || "School";

    }


    if (currentPackage) {

        const packageName =
            getCurrentPackage();

        currentPackage.textContent =
            PACKAGE_NAMES[packageName]
            || packageName;

    }

}


/* =========================================================
   UPDATE PLAN BUTTONS
========================================================= */

function updatePlanButtons() {

    const currentPackage =
        getCurrentPackage();


    const currentIndex =
        PACKAGE_ORDER.indexOf(
            currentPackage
        );


    const buttons =
        document.querySelectorAll(
            ".plan-button"
        );


    buttons.forEach(button => {

        const selectedPackage =
            button.dataset.package;


        if (!selectedPackage) {
            return;
        }


        const selectedIndex =
            PACKAGE_ORDER.indexOf(
                selectedPackage
            );


            // Custom plan has its own feature selector
if (selectedPackage === "custom") {

    button.textContent =
        "Customize Your Plan";

    button.disabled = false;

    button.classList.remove(
        "current-plan-button"
    );

    return;

}

        /* =========================================
           CURRENT PLAN
        ========================================= */

        if (
            selectedPackage ===
            currentPackage
        ) {

            button.textContent =
                "Current Plan";

            button.classList.add(
                "current-plan-button"
            );

            button.disabled = true;

            return;

        }


        /* =========================================
           UPGRADE
        ========================================= */

        button.disabled = false;

        button.classList.remove(
            "current-plan-button"
        );


        if (
            selectedIndex >
            currentIndex
        ) {

            button.textContent =
                `Upgrade to ${
                    PACKAGE_NAMES[
                        selectedPackage
                    ]
                }`;

        }

        else {

            button.textContent =
                `Select ${
                    PACKAGE_NAMES[
                        selectedPackage
                    ]
                }`;

        }

    });

}


/* =========================================================
   PLAN SELECTION
========================================================= */

function selectPlan(packageName) {

    if (!packageName) {
        return;
    }


    const currentPackage =
        getCurrentPackage();


    if (
        packageName ===
        currentPackage
    ) {

        return;

    }


    /*
       For now we do NOT activate the package.

       Payment will be connected later.
    */

    const packageNameText =
        PACKAGE_NAMES[packageName]
        || packageName;


    const price =
        PACKAGE_PRICES[packageName];


    const confirmed =
        confirm(

            `You selected ${packageNameText}.\n\n` +

            `Price: ${formatPrice(price)} / year\n\n` +

            `The subscription payment system will be connected next.\n\n` +

            `Continue to upgrade?`

        );


    if (!confirmed) {
        return;
    }


   if (packageName !== "custom") {

    window.location.href =
        `payment.html?plan=${encodeURIComponent(
            packageName
        )}`;

    return;
}

    alert(
        `${packageNameText} selected.\n\n` +
        `Payment integration will be added next.`
    );

}


/* =========================================================
   PLAN BUTTON EVENTS
========================================================= */

function setupPlanButtons() {

    const buttons =
        document.querySelectorAll(
            ".plan-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const packageName =
                    button.dataset.package;

                selectPlan(
                    packageName
                );

            }
        );

    });

}


/* =========================================================
   FEATURE COMPARISON
========================================================= */

function buildFeatureComparison() {

    const tableBody =
        document.querySelector(
            ".comparison-table tbody"
        );


    if (!tableBody) {
        return;
    }


    const features =
        Object.keys(
            FEATURE_NAMES
        );


    tableBody.innerHTML = "";


    features.forEach(featureName => {

        const row =
            document.createElement(
                "tr"
            );


        let html = `
            <td>
                ${FEATURE_NAMES[featureName]}
            </td>
        `;


        PACKAGE_ORDER.forEach(
            packageName => {

                const enabled =
                    getFeatureStatus(
                        packageName,
                        featureName
                    );


                html += `
                    <td class="${
                        enabled
                            ? "feature-enabled"
                            : "feature-disabled"
                    }">
                        ${
                            enabled
                                ? "✓"
                                : "—"
                        }
                    </td>
                `;

            }
        );


        row.innerHTML = html;


        tableBody.appendChild(
            row
        );

    });

}


/* =========================================================
   CURRENT PLAN HIGHLIGHT
========================================================= */

function highlightCurrentPlan() {

    const currentPackage =
        getCurrentPackage();


    const cards =
        document.querySelectorAll(
            ".plan-card"
        );


    cards.forEach(card => {

        const button =
            card.querySelector(
                ".plan-button"
            );


        if (!button) {
            return;
        }


        const packageName =
            button.dataset.package;


        if (
            packageName ===
            currentPackage
        ) {

            card.classList.add(
                "current-plan-card"
            );

        }

        else {

            card.classList.remove(
                "current-plan-card"
            );

        }

    });

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
           Make sure a school is selected.
        */

        if (!currentSchool) {

            alert(
                "School information not found. Please select a school first."
            );

            window.location.href =
                "schools.html";

            return;

        }


        loadSchoolInformation();

        updatePlanButtons();

        highlightCurrentPlan();

        buildFeatureComparison();

        setupPlanButtons();
        setupCustomPlan();

    }
);

/* =========================================================
   CUSTOM PLAN
========================================================= */

const CUSTOM_BASE_PRICE = 0;

let customSelectedFeatures = {};


/* =========================================================
   OPEN CUSTOM PLAN
========================================================= */

function openCustomPlanModal() {

    const modal =
        document.getElementById(
            "customPlanModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.add("show");

    updateCustomPlanSummary();
}


/* =========================================================
   CLOSE CUSTOM PLAN
========================================================= */

function closeCustomPlanModal() {

    const modal =
        document.getElementById(
            "customPlanModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove("show");
}


/* =========================================================
   UPDATE CUSTOM PLAN
========================================================= */

function updateCustomPlanSummary() {

    const checkboxes =
        document.querySelectorAll(
            ".custom-feature-checkbox"
        );


    const selectedList =
        document.getElementById(
            "customSelectedList"
        );

    const featureCount =
        document.getElementById(
            "customFeatureCount"
        );

    const totalPrice =
        document.getElementById(
            "customTotalPrice"
        );


    if (!selectedList ||
        !featureCount ||
        !totalPrice) {

        return;
    }


    let total = CUSTOM_BASE_PRICE;

    let count = 0;

    let selectedHTML = "";


    customSelectedFeatures = {};


    checkboxes.forEach(
        checkbox => {

            if (!checkbox.checked) {
                return;
            }


            const feature =
                checkbox.dataset.feature;

            const price =
                Number(
                    checkbox.dataset.price
                ) || 0;


            const featureName =
                FEATURE_NAMES[feature]
                || feature;


            total += price;

            count++;


            customSelectedFeatures[
                feature
            ] = true;


            selectedHTML += `

                <div class="selected-feature-row">

                    <span>
                        ${featureName}
                    </span>

                    <span class="selected-feature-price">
                        ${formatPrice(price)}
                    </span>

                </div>

            `;

        }
    );


    featureCount.textContent =
        count;


    totalPrice.textContent =
        `${formatPrice(total)}`;


    if (count === 0) {

        selectedList.innerHTML = `
            <p>
                No additional features selected.
            </p>
        `;

    }

    else {

        selectedList.innerHTML =
            selectedHTML;

    }

}


/* =========================================================
   CUSTOM PLAN BUTTON EVENTS
========================================================= */

function setupCustomPlan() {

    /*
       Open popup
    */

    const customButton =
        document.querySelector(
            '.plan-button[data-package="custom"]'
        );


    if (customButton) {

        customButton.addEventListener(
            "click",
            function () {

                openCustomPlanModal();

            }
        );

    }


    /*
       Close popup
    */

    const closeButton =
        document.getElementById(
            "closeCustomModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                closeCustomPlanModal();

            }
        );

    }


    /*
       Close when clicking outside popup
    */

    const modal =
        document.getElementById(
            "customPlanModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeCustomPlanModal();

                }

            }
        );

    }


    /*
       Feature checkbox changes
    */

    const checkboxes =
        document.querySelectorAll(
            ".custom-feature-checkbox"
        );


    checkboxes.forEach(
        checkbox => {

            checkbox.addEventListener(
                "change",
                function () {

                    updateCustomPlanSummary();

                }
            );

        }
    );


    /*
       Continue button
    */

    const continueButton =
        document.getElementById(
            "continueCustomPlan"
        );


    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function () {

                continueCustomPlan();

            }
        );

    }

}


/* =========================================================
   CONTINUE CUSTOM PLAN
========================================================= */

function continueCustomPlan() {

    const selectedFeatures =
        Object.keys(
            customSelectedFeatures
        );


    if (
        selectedFeatures.length === 0
    ) {

        alert(
            "Please select at least one feature for your custom plan."
        );

        return;

    }


    const totalElement =
        document.getElementById(
            "customTotalPrice"
        );


    const totalPrice =
        totalElement
            ? totalElement.textContent
            : "₹0";


    const featureNames =
        selectedFeatures.map(
            feature => {

                return (
                    FEATURE_NAMES[feature]
                    || feature
                );

            }
        );


    const message =
        `Custom Plan Selected\n\n` +

        `Features:\n` +

        featureNames
            .map(
                name => `• ${name}`
            )
            .join("\n") +

        `\n\nEstimated Price: ${totalPrice}/year\n\n` +

        `The payment and approval system will be connected next.`;


    alert(message);

}