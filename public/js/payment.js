/* =========================================================
   SCHOOL ERP PAYMENT PAGE
========================================================= */


/* =========================================================
   PLAN CONFIGURATION
========================================================= */

const PAYMENT_PLANS = {

    basic: {
        name: "Basic",
        price: 19999,
        icon: "fa-school",
        color: "blue"
    },

    standard: {
        name: "Standard",
        price: 39999,
        icon: "fa-building-columns",
        color: "green"
    },

    premium: {
        name: "Premium",
        price: 69999,
        icon: "fa-gem",
        color: "orange"
    },

    "ai-enterprise": {
        name: "AI Enterprise",
        price: 129999,
        icon: "fa-robot",
        color: "purple"
    },

    custom: {
        name: "Custom",
        price: 0,
        icon: "fa-sliders",
        color: "teal"
    }

};


/* =========================================================
   CUSTOM FEATURE PRICES
========================================================= */

const CUSTOM_FEATURE_PRICES = {

    attendance: 5000,

    fees: 8000,

    salary: 8000,

    timetable: 5000,

    onlineTests: 8000,

    questionBank: 10000,

    aiPaperGenerator: 15000,

    aiEvaluation: 20000,

    aiReports: 10000,

    aiAssistant: 8000,

    qrClassroom: 7000,

    busTracking: 20000

};


/* =========================================================
   FEATURE NAMES
========================================================= */

const PAYMENT_FEATURE_NAMES = {

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

    qrClassroom:
        "QR Classroom",

    busTracking:
        "Smart Bus Tracking"

};


/* =========================================================
   FIXED PLAN STUDENT LIMIT
========================================================= */

const INCLUDED_STUDENTS = 500;


/* =========================================================
   CURRENT SCHOOL
========================================================= */

let currentSchool = null;


/* =========================================================
   SELECTED PLAN
========================================================= */

let selectedPlan = "basic";


/* =========================================================
   CUSTOM FEATURES
========================================================= */

let customFeatures = {};


/* =========================================================
   CUSTOM BASE PRICE
========================================================= */

let customFeatureTotal = 0;


/* =========================================================
   GET URL PLAN
========================================================= */

function getPlanFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const plan =
        (
            params.get("plan")
            || ""
        ).toLowerCase();


    if (
        PAYMENT_PLANS[plan]
    ) {

        return plan;

    }


    return null;

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPaymentPrice(
    amount
) {

    return "₹" +
        Number(amount || 0)
            .toLocaleString("en-IN");

}


/* =========================================================
   LOAD SCHOOL
========================================================= */

function loadPaymentSchool() {

    currentSchool =
        JSON.parse(
            localStorage.getItem(
                "currentSchool"
            )
        );


    if (!currentSchool) {

        alert(
            "School information not found. Please select a school first."
        );


        window.location.href =
            "schools.html";

        return false;

    }


    return true;

}


/* =========================================================
   SCHOOL DETAILS
========================================================= */

function populateSchoolDetails() {

    const schoolName =
        document.getElementById(
            "schoolName"
        );

    const principalName =
        document.getElementById(
            "principalName"
        );

    const schoolEmail =
        document.getElementById(
            "schoolEmail"
        );

    const schoolMobile =
        document.getElementById(
            "schoolMobile"
        );

    const studentCount =
        document.getElementById(
            "studentCount"
        );


    if (schoolName) {

        schoolName.value =
            currentSchool.schoolName
            || currentSchool.name
            || "";

    }


    if (principalName) {

        principalName.value =
            currentSchool.principalName
            || currentSchool.principal
            || "";

    }


    if (schoolEmail) {

        schoolEmail.value =
            currentSchool.email
            || currentSchool.schoolEmail
            || "";

    }


    if (schoolMobile) {

        schoolMobile.value =
            currentSchool.mobile
            || currentSchool.phone
            || currentSchool.schoolPhone
            || "";

    }


    if (studentCount) {

        const existingCount =
            currentSchool.studentCount
            || currentSchool.studentsCount
            || currentSchool.totalStudents
            || "";


        if (existingCount) {

            studentCount.value =
                existingCount;

        }

    }

}


/* =========================================================
   LOAD CUSTOM FEATURES
========================================================= */

function loadCustomFeatures() {

    const storedCustomPlan =
        localStorage.getItem(
            "customSubscription"
        );


    if (storedCustomPlan) {

        try {

            const customData =
                JSON.parse(
                    storedCustomPlan
                );


            if (
                customData &&
                customData.features
            ) {

                customFeatures =
                    customData.features;

            }

        }

        catch (error) {

            console.error(
                "Unable to load custom subscription:",
                error
            );

        }

    }


    /*
       Also support currentSchool.subscription
       if a custom plan was previously saved.
    */

    if (
        Object.keys(customFeatures).length === 0 &&
        currentSchool?.subscription?.package === "custom"
    ) {

        customFeatures =
            currentSchool
                ?.subscription
                ?.features
            || {};

    }


    calculateCustomFeatureTotal();

}


/* =========================================================
   CALCULATE CUSTOM FEATURE TOTAL
========================================================= */

function calculateCustomFeatureTotal() {

    customFeatureTotal = 0;


    Object.keys(customFeatures)
        .forEach(feature => {

            if (
                customFeatures[feature] === true
            ) {

                customFeatureTotal +=
                    CUSTOM_FEATURE_PRICES[
                        feature
                    ] || 0;

            }

        });

}


/* =========================================================
   STUDENT STRENGTH
========================================================= */

function getStudentCount() {

    const input =
        document.getElementById(
            "studentCount"
        );


    if (!input) {
        return 0;
    }


    return Math.max(
        0,
        Number(input.value) || 0
    );

}


/* =========================================================
   STUDENT ADJUSTMENT
========================================================= */

function calculateStudentAdjustment() {

    const studentCount =
        getStudentCount();


    /*
       First 500 students are included
       in the fixed plans.
    */

    if (
        studentCount <=
        INCLUDED_STUDENTS
    ) {

        return 0;

    }


    /*
       Additional students:
       ₹40 per student per year.

       This is currently a UI pricing rule.
       We can change the amount later.
    */

    const additionalStudents =
        studentCount -
        INCLUDED_STUDENTS;


    return additionalStudents * 40;

}


/* =========================================================
   GET CUSTOM PRICE
========================================================= */

function calculateCustomPrice() {

    calculateCustomFeatureTotal();


    const studentAdjustment =
        calculateStudentAdjustment();


    return (
        customFeatureTotal +
        studentAdjustment
    );

}


/* =========================================================
   SHOW CUSTOM DETAILS
========================================================= */

function showCustomPlanDetails() {

    const customDetails =
        document.getElementById(
            "customPlanDetails"
        );


    if (!customDetails) {
        return;
    }


    if (
        selectedPlan !== "custom"
    ) {

        customDetails.style.display =
            "none";

        return;

    }


    customDetails.style.display =
        "block";


    const featureList =
        document.getElementById(
            "customFeaturesList"
        );


    if (!featureList) {
        return;
    }


    const selectedFeatures =
        Object.keys(customFeatures)
            .filter(
                feature =>
                    customFeatures[feature] === true
            );


    if (
        selectedFeatures.length === 0
    ) {

        featureList.innerHTML = `
            <div class="custom-payment-feature">
                <span class="custom-payment-feature-name">
                    No features selected
                </span>
            </div>
        `;

        return;

    }


    featureList.innerHTML =
        selectedFeatures
            .map(feature => {

                const name =
                    PAYMENT_FEATURE_NAMES[
                        feature
                    ] || feature;


                const price =
                    CUSTOM_FEATURE_PRICES[
                        feature
                    ] || 0;


                return `
                    <div class="custom-payment-feature">

                        <span class="custom-payment-feature-name">
                            ${name}
                        </span>

                        <span class="custom-payment-feature-price">
                            ${formatPaymentPrice(price)}
                        </span>

                    </div>
                `;

            })
            .join("");

}


/* =========================================================
   UPDATE ORDER SUMMARY
========================================================= */

function updateOrderSummary() {

    const plan =
        PAYMENT_PLANS[
            selectedPlan
        ];


    if (!plan) {
        return;
    }


    const planName =
        document.getElementById(
            "planName"
        );

    const planBadge =
        document.getElementById(
            "planBadge"
        );

    const planPrice =
        document.getElementById(
            "planPrice"
        );

    const totalPrice =
        document.getElementById(
            "totalPrice"
        );

    const planIcon =
        document.getElementById(
            "planIcon"
        );

    const customFeaturesRow =
        document.getElementById(
            "customFeaturesPriceRow"
        );

    const customFeaturesPrice =
        document.getElementById(
            "customFeaturesPrice"
        );

    const studentAdjustmentRow =
        document.getElementById(
            "studentAdjustmentRow"
        );

    const studentAdjustment =
        document.getElementById(
            "studentAdjustment"
        );


    /*
       Plan name
    */

    if (planName) {

        planName.textContent =
            plan.name;

    }


    /*
       Badge
    */

    if (planBadge) {

        planBadge.textContent =
            plan.name;

    }


    /*
       Icon
    */

    if (planIcon) {

        planIcon.innerHTML = `
            <i class="fa-solid ${plan.icon}"></i>
        `;

    }


    /*
       Fixed plan
    */

    if (
        selectedPlan !== "custom"
    ) {

        const basePrice =
            plan.price;


        if (planPrice) {

            planPrice.textContent =
                formatPaymentPrice(
                    basePrice
                );

        }


        if (customFeaturesRow) {

            customFeaturesRow.style.display =
                "none";

        }


        const adjustment =
            calculateStudentAdjustment();


        if (
            adjustment > 0
        ) {

            if (studentAdjustmentRow) {

                studentAdjustmentRow.style.display =
                    "flex";

            }

            if (studentAdjustment) {

                studentAdjustment.textContent =
                    formatPaymentPrice(
                        adjustment
                    );

            }

        }

        else {

            if (studentAdjustmentRow) {

                studentAdjustmentRow.style.display =
                    "none";

            }

        }


        const total =
            basePrice +
            adjustment;


        if (totalPrice) {

            totalPrice.textContent =
                formatPaymentPrice(
                    total
                );

        }


        showCustomPlanDetails();

        return;

    }


    /*
       Custom plan
    */

    const customPrice =
        calculateCustomPrice();


    if (planPrice) {

        planPrice.textContent =
            formatPaymentPrice(
                customFeatureTotal
            );

    }


    if (customFeaturesRow) {

        customFeaturesRow.style.display =
            "flex";

    }


    if (customFeaturesPrice) {

        customFeaturesPrice.textContent =
            formatPaymentPrice(
                customFeatureTotal
            );

    }


    const adjustment =
        calculateStudentAdjustment();


    if (
        adjustment > 0
    ) {

        if (studentAdjustmentRow) {

            studentAdjustmentRow.style.display =
                "flex";

        }

        if (studentAdjustment) {

            studentAdjustment.textContent =
                formatPaymentPrice(
                    adjustment
                );

        }

    }

    else {

        if (studentAdjustmentRow) {

            studentAdjustmentRow.style.display =
                "none";

        }

    }


    if (totalPrice) {

        totalPrice.textContent =
            formatPaymentPrice(
                customPrice
            );

    }


    showCustomPlanDetails();

}


/* =========================================================
   PAYMENT METHOD
========================================================= */

function setupPaymentMethods() {

    const methods =
        document.querySelectorAll(
            ".payment-method"
        );


    methods.forEach(method => {

        method.addEventListener(
            "click",
            function () {

                methods.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                method.classList.add(
                    "active"
                );


                const radio =
                    method.querySelector(
                        "input[type='radio']"
                    );


                if (radio) {

                    radio.checked =
                        true;

                }

            }
        );

    });

}


/* =========================================================
   TERMS CHECKBOX
========================================================= */

function setupTermsCheckbox() {

    const terms =
        document.getElementById(
            "acceptTerms"
        );


    const button =
        document.getElementById(
            "proceedPaymentButton"
        );


    if (
        !terms ||
        !button
    ) {

        return;

    }


    function updateButton() {

        button.disabled =
            !terms.checked;

    }


    terms.addEventListener(
        "change",
        updateButton
    );


    updateButton();

}


/* =========================================================
   STUDENT COUNT CHANGE
========================================================= */

function setupStudentCount() {

    const studentCount =
        document.getElementById(
            "studentCount"
        );


    if (!studentCount) {
        return;
    }


    studentCount.addEventListener(
        "input",
        function () {

            updateOrderSummary();

        }
    );

}


/* =========================================================
   PROCEED PAYMENT
========================================================= */

async function proceedToPayment() {

    const terms =
        document.getElementById("acceptTerms");

    if (!terms || !terms.checked) {

        alert(
            "Please accept the subscription terms before continuing."
        );

        return;
    }


    const studentCount =
        getStudentCount();

    if (studentCount <= 0) {

        alert(
            "Please enter the number of students in your school."
        );

        return;
    }


    if (
        selectedPlan === "custom" &&
        Object.keys(customFeatures)
            .filter(
                feature =>
                    customFeatures[feature] === true
            )
            .length === 0
    ) {

        alert(
            "Please select at least one feature for your custom plan."
        );

        return;
    }


    const paymentMethod =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    const method =
        paymentMethod
            ? paymentMethod.value
            : "online";


    const requestData = {

        schoolId:
            currentSchool._id ||
            currentSchool.id,

        schoolName:
            currentSchool.schoolName ||
            currentSchool.name ||
            "",

        plan:
            selectedPlan,

        planName:
            PAYMENT_PLANS[selectedPlan].name,

        studentCount:
            studentCount,

        customFeatures:
            selectedPlan === "custom"
                ? customFeatures
                : {},

        customFeatureTotal:
            selectedPlan === "custom"
                ? customFeatureTotal
                : 0,

        studentAdjustment:
            calculateStudentAdjustment(),

        /*
         * This amount is only sent for display/reference.
         * The backend calculates the final amount again.
         */
        amount:
            calculateTotalAmount(),

        paymentMethod:
            method

    };


    try {

        /*
         * STEP 1
         * Create Razorpay order on our server
         */

        const response =
            await fetch(
                "/api/subscription-payment/create-order",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            requestData
                        )
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            console.error(
                "Create order error:",
                data
            );

            alert(
                data.message ||
                "Unable to create payment order."
            );

            return;
        }


        /*
         * STEP 2
         * Make sure Razorpay Checkout loaded
         */

        if (
            typeof Razorpay ===
            "undefined"
        ) {

            alert(
                "Razorpay Checkout could not be loaded. Please check your internet connection and try again."
            );

            return;
        }


        /*
         * STEP 3
         * Open Razorpay Checkout
         */

        const options = {

            key:
                data.keyId,

            amount:
                data.order.amount,

            currency:
                data.order.currency,

            name:
                "AI School ERP",

            description:
                `${PAYMENT_PLANS[selectedPlan].name} Annual Subscription`,

            order_id:
                data.order.id,

            prefill: {

                name:
                    currentSchool.principalName ||
                    currentSchool.principal ||
                    "",

                email:
                    currentSchool.email ||
                    currentSchool.schoolEmail ||
                    "",

                contact:
                    currentSchool.mobile ||
                    currentSchool.phone ||
                    currentSchool.schoolPhone ||
                    ""

            },

            notes: {

                schoolId:
                    String(
                        currentSchool._id ||
                        currentSchool.id ||
                        ""
                    ),

                schoolName:
                    currentSchool.schoolName ||
                    currentSchool.name ||
                    "",

                plan:
                    selectedPlan

            },

            theme: {

                color:
                    "#2563eb"

            },


            /*
             * STEP 4
             * Razorpay returns these values
             * after successful payment.
             */

            handler:
                async function (
                    razorpayResponse
                ) {

                    await verifyRazorpayPayment(
                        razorpayResponse
                    );

                },


            modal: {

                ondismiss:
                    function () {

                        console.log(
                            "Razorpay checkout closed."
                        );

                    }

            }

        };


        const razorpay =
            new Razorpay(
                options
            );


        razorpay.on(
            "payment.failed",
            function (response) {

                console.error(
                    "Payment failed:",
                    response.error
                );


                alert(
                    response.error?.description ||
                    "Payment failed. Please try again."
                );

            }
        );


        razorpay.open();

    }

    catch (error) {

        console.error(
            "Payment Error:",
            error
        );


        alert(
            "Something went wrong while starting the payment."
        );

    }

}

async function verifyRazorpayPayment(
    razorpayResponse
) {

    try {

        const response =
            await fetch(
                "/api/subscription-payment/verify-payment",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            razorpay_order_id:
                                razorpayResponse
                                    .razorpay_order_id,

                            razorpay_payment_id:
                                razorpayResponse
                                    .razorpay_payment_id,

                            razorpay_signature:
                                razorpayResponse
                                    .razorpay_signature

                        })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            console.error(
                "Payment verification failed:",
                data
            );

            alert(
                data.message ||
                "Payment verification failed."
            );

            return;
        }


        /*
         * Payment has been verified
         * by our backend.
         */

        alert(
            "Payment successful!\n\n" +
            "Your " +
            PAYMENT_PLANS[selectedPlan].name +
            " subscription is now active."
        );


        /*
         * Go back to school dashboard
         */

        window.location.href =
            "school-dashboard.html";

    }

    catch (error) {

        console.error(
            "Verification Error:",
            error
        );


        alert(
            "Payment was completed, but verification could not be completed. Please contact support."
        );

    }

}

/* =========================================================
   TOTAL AMOUNT
========================================================= */

function calculateTotalAmount() {

    if (
        selectedPlan === "custom"
    ) {

        return calculateCustomPrice();

    }


    const plan =
        PAYMENT_PLANS[
            selectedPlan
        ];


    if (!plan) {
        return 0;
    }


    return (
        plan.price +
        calculateStudentAdjustment()
    );

}


/* =========================================================
   BACK TO PLANS
========================================================= */

function goBackToPlans() {

    window.location.href =
        "subscription.html";

}


/* =========================================================
   PROCEED BUTTON
========================================================= */

function setupProceedButton() {

    const button =
        document.getElementById(
            "proceedPaymentButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            proceedToPayment();

        }
    );

}


/* =========================================================
   INITIALIZE PAYMENT PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
           Get plan from URL
        */

        const urlPlan =
            getPlanFromURL();


        if (urlPlan) {

            selectedPlan =
                urlPlan;

        }

        else {

            /*
               If no plan is supplied,
               use the school's current package.
            */

            const school =
                JSON.parse(
                    localStorage.getItem(
                        "currentSchool"
                    )
                );


            const currentPackage =
                school
                    ?.subscription
                    ?.package;


            if (
                currentPackage &&
                PAYMENT_PLANS[
                    currentPackage
                ]
            ) {

                selectedPlan =
                    currentPackage;

            }

        }


        /*
           Load school
        */

        if (
            !loadPaymentSchool()
        ) {

            return;

        }


        /*
           Populate school information
        */

        populateSchoolDetails();


        /*
           Load custom selection
        */

        loadCustomFeatures();


        /*
           Update summary
        */

        updateOrderSummary();


        /*
           Payment methods
        */

        setupPaymentMethods();


        /*
           Terms
        */

        setupTermsCheckbox();


        /*
           Student count
        */

        setupStudentCount();


        /*
           Payment button
        */

        setupProceedButton();

    }
);