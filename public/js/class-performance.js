// =========================================================
// CLASS PERFORMANCE
// =========================================================

console.log("CLASS PERFORMANCE FILE LOADED");

// =========================================================
// TEACHER AUTHENTICATION
// =========================================================

const teacher = JSON.parse(
    localStorage.getItem("teacher") || "null"
);

console.log("TEACHER DATA:", teacher);

if (!teacher) {
    window.location.href = "teacher-login.html";
}

// =========================================================
// SCHOOL INFORMATION
// =========================================================

const schoolId =
    teacher?.schoolId ||
    JSON.parse(
        localStorage.getItem("currentSchool") || "null"
    )?._id ||
    localStorage.getItem("schoolId");


// =========================================================
// TEACHER CLASSES / SUBJECTS
// =========================================================

const teacherClasses =
    Array.isArray(teacher?.classes)
        ? teacher.classes
        : [];

const teacherSubjects =
    Array.isArray(teacher?.subjects)
        ? teacher.subjects
        : [];


// =========================================================
// GLOBAL DATA
// =========================================================

let allPerformanceData = [];
let allStudents = [];
let availableExams = [];


// =========================================================
// PAGE INFORMATION
// =========================================================

function loadPageInformation() {

    const schoolName =
        document.getElementById("schoolName");

    const teacherName =
        document.getElementById("teacherName");

    const teacherSubject =
        document.getElementById("teacherSubject");

    const teacherClass =
        document.getElementById("teacherClass");

    const className =
        document.getElementById("className");

    const subjectName =
        document.getElementById("subjectName");

    const academicYear =
        document.getElementById("academicYear");


    // School
    if (schoolName) {
        schoolName.textContent =
            teacher?.schoolName || "-";
    }


    // Teacher
    if (teacherName) {
        teacherName.textContent =
            teacher?.teacherName || "-";
    }


    // Header Subject
    if (teacherSubject) {
        teacherSubject.textContent =
            teacherSubjects.join(", ") || "-";
    }


    // Header Class
    if (teacherClass) {
        teacherClass.textContent =
            teacherClasses.join(", ") || "-";
    }


    // Main Class
    if (className) {
        className.textContent =
            teacherClasses.join(", ") || "-";
    }


    // Main Subject
    if (subjectName) {
        subjectName.textContent =
            teacherSubjects.join(", ") || "-";
    }


    // Academic Year
    if (academicYear) {

        const year =
            new Date().getFullYear();

        academicYear.textContent =
            year +
            "-" +
            String(year + 1).slice(-2);
    }
}



// =========================================================
// LOAD EXAMS FROM EVALUATION API
// =========================================================

async function loadExams() {

    const examSelect =
        document.getElementById("examSelect");

    if (!examSelect) {
        console.error(
            "examSelect dropdown not found in HTML"
        );
        return;
    }

    try {

        examSelect.innerHTML = `
            <option value="">
                Loading exams...
            </option>
        `;

        const className =
            teacherClasses[0] || "";

        const subject =
            teacherSubjects[0] || "";

        let section =
            teacher?.classTeacherOf?.section ||
            teacher?.section ||
            "";

        // Same fallback as mobile
        if (!section) {

            section =
                allStudents.find(
                    student =>
                        student?.section
                )?.section || "";
        }

        if (!section) {
            section = "A";
        }

        console.log(
            "========== LOAD EXAMS FROM EVALUATION =========="
        );

        console.log(
            "schoolId:",
            schoolId
        );

        console.log(
            "className:",
            className
        );

        console.log(
            "section:",
            section
        );

        console.log(
            "subject:",
            subject
        );

        if (
            !schoolId ||
            !className ||
            !subject
        ) {

            throw new Error(
                "School, class or subject information is missing."
            );
        }

        const params =
            new URLSearchParams({

                schoolId:
                    String(schoolId),

                className:
                    String(className),

                section:
                    String(section),

                subject:
                    String(subject)

            });

        const url =
            "/api/evaluation/exam-names?" +
            params.toString();

        console.log(
            "EVALUATION EXAM API:",
            url
        );

        const response =
            await fetch(url);

        console.log(
            "EVALUATION EXAM STATUS:",
            response.status
        );

        if (!response.ok) {

            throw new Error(
                "Exam API failed. HTTP " +
                response.status
            );
        }

        const data =
            await response.json();

        console.log(
            "EVALUATION EXAM RESPONSE:",
            data
        );

        examSelect.innerHTML = `
            <option value="">
                Select Exam
            </option>
        `;

        if (
            !data.success ||
            !Array.isArray(data.exams) ||
            data.exams.length === 0
        ) {

            examSelect.innerHTML = `
                <option value="">
                    No exams available
                </option>
            `;

            console.log(
                "NO EXAMS FOUND"
            );

            return;
        }

        // Remove duplicate exam names
        const uniqueExams =
            [
                ...new Set(
                    data.exams
                        .filter(Boolean)
                        .map(
                            exam =>
                                String(exam).trim()
                        )
                )
            ];

        uniqueExams.forEach(
            exam => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    exam;

                option.textContent =
                    exam;

                examSelect.appendChild(
                    option
                );
            }
        );

        console.log(
            "EXAMS LOADED:",
            uniqueExams
        );

        // -------------------------------------------------
        // CHECK URL EXAM
        // -------------------------------------------------

        const urlParams =
            new URLSearchParams(
                window.location.search
            );

        const urlExam =
            urlParams.get("exam");

        if (
            urlExam &&
            uniqueExams.includes(urlExam)
        ) {

            examSelect.value =
                urlExam;

            await loadMarks(
                allStudents,
                urlExam
            );
        }

    } catch (error) {

        console.error(
            "Load exams error:",
            error
        );

        examSelect.innerHTML = `
            <option value="">
                Unable to load exams
            </option>
        `;
    }
}

// =========================================================
// LOAD STUDENTS
// =========================================================

async function loadStudents() {

    try {

        if (!schoolId) {

            throw new Error(
                "School information is missing."
            );
        }


        let url =
            "/api/students?schoolId=" +
            encodeURIComponent(
                schoolId
            );


        // Teacher class
        if (
            teacherClasses.length > 0
        ) {

            url +=
                "&className=" +
                encodeURIComponent(
                    teacherClasses[0]
                );
        }


        console.log(
            "STUDENT API:",
            url
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Unable to load students. HTTP " +
                response.status
            );
        }


        const data =
            await response.json();


        console.log(
            "STUDENT API RESPONSE:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load students."
            );
        }


        let students =
            data.students || [];
            window.classPerformanceStudents =
    students;


        // Safety filter by teacher class
        if (
            teacherClasses.length > 0
        ) {

            students =
                students.filter(
                    student => {

                        return teacherClasses.some(
                            cls =>
                                String(
                                    student.className
                                )
                                    .trim()
                                    .toLowerCase()
                                ===
                                String(cls)
                                    .trim()
                                    .toLowerCase()
                        );
                    }
                );
        }


        allStudents =
            students;


        // Total students
        const totalStudents =
            document.getElementById(
                "totalStudents"
            );


        if (totalStudents) {

            totalStudents.textContent =
                students.length;
        }
         hidePageLoader();

        console.log(
            "FILTERED STUDENTS:",
            students
        );


       


        // =================================================
// CHECK URL EXAM
// =================================================

const examSelect =
    document.getElementById("examSelect");

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const urlExam =
    urlParams.get("exam");


if (urlExam) {

    if (examSelect) {

        examSelect.value =
            urlExam;
    }

    await loadMarks(
        students,
        urlExam
    );

    return;
}


        // Otherwise show empty state
        renderEmptyState(
            "Select an exam to view performance."
        );

        updateSummary([]);

        renderTopStudents([]);

        renderImprovementStudents([]);


    } catch (error) {

        console.error(
            "Student loading error:",
            error
        );
              hidePageLoader();
        showError(
            error.message ||
            "Unable to load student data."
        );
    }
}


// =========================================================
// SET EXAM SELECTOR VALUE
// =========================================================

function setExamSelectorValue(
    exam
) {

    const selector =
        document.getElementById(
            "examSelector"
        );

    if (!selector) {
        return;
    }


    let optionExists =
        Array.from(
            selector.options
        ).some(
            option =>
                option.value === exam
        );


    if (!optionExists) {

        const option =
            document.createElement(
                "option"
            );

        option.value = exam;

        option.textContent = exam;

        selector.appendChild(
            option
        );
    }


    selector.value = exam;
}


// =========================================================
// LOAD MARKS
// =========================================================

async function loadMarks(
    students,
    selectedExam
) {      
 hidePageLoader();
    try {

        if (!schoolId) {

            throw new Error(
                "School information is missing."
            );
        }


        const className =
            teacherClasses[0] || "";


        const subject =
            teacherSubjects[0] || "";


        if (!className) {

            throw new Error(
                "Teacher class information is missing."
            );
        }


        if (!subject) {

            throw new Error(
                "Teacher subject information is missing."
            );
        }


        // -------------------------------------------------
        // SECTION
        // -------------------------------------------------

        let section =
            teacher?.classTeacherOf?.section ||
            teacher?.section ||
            "";


        // If teacher doesn't have section,
        // use first student's section
        if (!section) {

            section =
                students.find(
                    student =>
                        student.section
                )?.section || "";
        }


        if (!section) {

            throw new Error(
                "Section information is missing."
            );
        }


        // -------------------------------------------------
        // BUILD API PARAMETERS
        // -------------------------------------------------

        const params =
            new URLSearchParams();


        params.set(
            "schoolId",
            schoolId
        );


        params.set(
            "className",
            className
        );


        params.set(
            "section",
            section
        );


        params.set(
            "exam",
            selectedExam
        );


        params.set(
            "subject",
            subject
        );


        const url =
            "/api/evaluation/exam-names?" +
            params.toString();


        console.log(
            "MARKS API:",
            url
        );


        // -------------------------------------------------
        // LOADING STATE
        // -------------------------------------------------

        showLoadingState(
            "Loading performance..."
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Marks API unavailable. HTTP " +
                response.status
            );
        }


        const data =
            await response.json();


        console.log(
            "MARKS API RESPONSE:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load marks."
            );
        }


        const marksRecord =
            data.marks;


        if (!marksRecord) {

            allPerformanceData = [];

            renderEmptyState(
                "No marks available for this exam."
            );

            updateSummary([]);

            renderTopStudents([]);

            renderImprovementStudents([]);

            return;
        }


        // -------------------------------------------------
        // GET MARKS ARRAY
        // -------------------------------------------------

        const marks =
            Array.isArray(
                marksRecord
            )
                ? marksRecord
                : Array.isArray(
                    marksRecord.marks
                )
                    ? marksRecord.marks
                    : [];


        console.log(
            "MARKS ARRAY:",
            marks
        );


        if (!marks.length) {

            allPerformanceData = [];

            renderEmptyState(
                "No marks available for this exam."
            );

            updateSummary([]);

            renderTopStudents([]);

            renderImprovementStudents([]);

            return;
        }


        // -------------------------------------------------
        // PREPARE PERFORMANCE DATA
        // -------------------------------------------------

        const performanceData =
            preparePerformanceData(
                students,
                marks,
                marksRecord,
                selectedExam
            );


        allPerformanceData =
            performanceData;


        // -------------------------------------------------
        // UPDATE UI
        // -------------------------------------------------

        updateSummary(
            performanceData
        );


        renderPerformanceTable(
            performanceData
        );


        renderTopStudents(
            performanceData
        );


        renderImprovementStudents(
            performanceData
        );


        hideLoadingState();


    } catch (error) {

        console.error(
            "Marks loading error:",
            error
        );


        allPerformanceData = [];


        hideLoadingState();


        renderEmptyState(
            error.message ||
            "No published marks available yet."
        );


        updateSummary([]);

        renderTopStudents([]);

        renderImprovementStudents([]);
    }
}


// =========================================================
// PREPARE PERFORMANCE DATA
// =========================================================

function preparePerformanceData(
    students,
    marks,
    marksRecord = null,
    selectedExam = ""
) {

    const result = [];


    students.forEach(
        student => {

            const studentMarks =
                marks.filter(
                    mark => {

                        const markStudentId =
                            mark.studentId?._id ||
                            mark.studentId ||
                            mark.student?._id ||
                            mark._id;


                        return String(
                            markStudentId
                        ) === String(
                            student._id
                        );
                    }
                );


            if (!studentMarks.length) {
                return;
            }


            studentMarks.forEach(
                mark => {

                    const obtained =
                        Number(
                            mark.marksObtained ??
                            mark.obtainedMarks ??
                            mark.score ??
                            mark.marks ??
                            0
                        );


                    const total =
                        Number(
                            mark.totalMarks ??
                            mark.maxMarks ??
                            mark.maximumMarks ??
                            mark.total ??
                            marksRecord?.totalMarks ??
                            100
                        );


                    const percentage =
                        total > 0
                            ? (
                                obtained /
                                total
                            ) * 100
                            : 0;


                    result.push({

                        studentId:
                            student._id,

                        studentName:
                            student.studentName ||
                            student.name ||
                            student.fullName ||
                            "Student",

                        rollNo:
                            student.rollNo ||
                            student.rollNumber ||
                            "-",

                        className:
                            student.className ||
                            "-",

                        section:
                            student.section ||
                            "-",

                        exam:
                            marksRecord?.exam ||
                            mark.examName ||
                            mark.exam ||
                            mark.testName ||
                            selectedExam ||
                            "Exam",

                        subject:
                            marksRecord?.subject ||
                            mark.subject ||
                            teacherSubjects[0] ||
                            "-",

                        marksObtained:
                            obtained,

                        totalMarks:
                            total,

                        percentage:
                            Number(
                                percentage.toFixed(
                                    2
                                )
                            ),

                        grade:
                            getGrade(
                                percentage
                            ),

                        performance:
                            getPerformanceLabel(
                                percentage
                            )
                    });
                }
            );
        }
    );


    return result;
}


// =========================================================
// UPDATE SUMMARY
// =========================================================

function updateSummary(
    data
) {

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    const classAverage =
        document.getElementById(
            "classAverage"
        );


    const passPercentage =
        document.getElementById(
            "passPercentage"
        );


    const highestScore =
        document.getElementById(
            "highestScore"
        );


    const topStudentsCount =
        document.getElementById(
            "topStudentsCount"
        );


    if (totalStudents) {

        // Keep actual class student count
        totalStudents.textContent =
            allStudents.length;
    }


    if (!data.length) {

        if (classAverage) {
            classAverage.textContent =
                "0%";
        }


        if (passPercentage) {
            passPercentage.textContent =
                "0%";
        }


        if (highestScore) {
            highestScore.textContent =
                "0";
        }


        if (topStudentsCount) {
            topStudentsCount.textContent =
                "0";
        }


        return;
    }


    const percentages =
        data.map(
            student =>
                Number(
                    student.percentage
                ) || 0
        );


    const total =
        percentages.reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const average =
        total /
        percentages.length;


    const highest =
        Math.max(
            ...percentages
        );


    const passed =
        percentages.filter(
            value =>
                value >= 33
        ).length;


    const passPercent =
        (
            passed /
            percentages.length
        ) * 100;


    const topCount =
        data.filter(
            student =>
                student.percentage >= 75
        ).length;


    if (classAverage) {

        classAverage.textContent =
            average.toFixed(1) +
            "%";
    }


    if (passPercentage) {

        passPercentage.textContent =
            passPercent.toFixed(1) +
            "%";
    }


    if (highestScore) {

        highestScore.textContent =
            highest.toFixed(1) +
            "%";
    }


    if (topStudentsCount) {

        topStudentsCount.textContent =
            topCount;
    }
}


// =========================================================
// RENDER PERFORMANCE TABLE
// =========================================================

function renderPerformanceTable(
    data
) {

    const tbody =
        document.getElementById(
            "performanceTableBody"
        );


    if (!tbody) {
        return;
    }


    if (!data.length) {

        renderEmptyState(
            "No performance data available."
        );

        return;
    }


    const sorted =
        [...data].sort(
            (a, b) =>
                b.percentage -
                a.percentage
        );


    tbody.innerHTML = "";


    sorted.forEach(
        (student, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHtml(
                        student.studentName
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        String(
                            student.rollNo
                        )
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        String(
                            student.exam
                        )
                    )}
                </td>

                <td>
                    ${student.marksObtained}
                    /
                    ${student.totalMarks}
                </td>

                <td>
                    ${student.percentage}%
                </td>

                <td>
                    ${student.grade}
                </td>

                <td>
                    <span class="${student.performance.className}">
                        ${student.performance.label}
                    </span>
                </td>

            `;


            tbody.appendChild(
                row
            );
        }
    );
}


// =========================================================
// TOP STUDENTS
// =========================================================

function renderTopStudents(
    data
) {

    const container =
        document.getElementById(
            "topStudentsList"
        );


    if (!container) {
        return;
    }


    if (!data.length) {

        container.innerHTML = `
            <div class="empty-state">
                No top students available.
            </div>
        `;

        return;
    }


    const students =
        [...data]
            .sort(
                (a, b) =>
                    b.percentage -
                    a.percentage
            )
            .slice(0, 5);


    container.innerHTML = "";


    students.forEach(
        (student, index) => {

            let medal;


            if (index === 0) {

                medal = "🥇";

            } else if (index === 1) {

                medal = "🥈";

            } else if (index === 2) {

                medal = "🥉";

            } else {

                medal =
                    index + 1;
            }


            container.innerHTML += `

                <div class="student-row">

                    <div>

                        <strong>
                            ${medal}
                            ${escapeHtml(
                                student.studentName
                            )}
                        </strong>

                        <br>

                        <small>
                            Roll No:
                            ${escapeHtml(
                                String(
                                    student.rollNo
                                )
                            )}
                        </small>

                    </div>


                    <div class="student-score">
                        ${student.percentage}%
                    </div>

                </div>

            `;
        }
    );
}


// =========================================================
// STUDENTS NEEDING IMPROVEMENT
// =========================================================

function renderImprovementStudents(
    data
) {

    const container =
        document.getElementById(
            "improvementList"
        );


    if (!container) {
        return;
    }


    const students =
        data.filter(
            student =>
                student.percentage < 50
        );


    if (!students.length) {

        container.innerHTML = `
            <div class="empty-state">
                No students currently need improvement.
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    students
        .sort(
            (a, b) =>
                a.percentage -
                b.percentage
        )
        .slice(0, 6)
        .forEach(
            student => {

                container.innerHTML += `

                    <div class="improvement-card">

                        <div class="improvement-icon">
                            <i class="fa-solid fa-arrow-trend-down"></i>
                        </div>


                        <div class="improvement-info">

                            <strong>
                                ${escapeHtml(
                                    student.studentName
                                )}
                            </strong>

                            <span>
                                Roll No:
                                ${escapeHtml(
                                    String(
                                        student.rollNo
                                    )
                                )}
                            </span>

                        </div>


                        <div class="improvement-score">
                            ${student.percentage}%
                        </div>

                    </div>

                `;
            }
        );
}


// =========================================================
// SEARCH STUDENTS
// =========================================================

function filterStudents() {

    const input =
        document.getElementById(
            "studentSearch"
        );


    if (!input) {
        return;
    }


    const search =
        input.value
            .trim()
            .toLowerCase();


    const filtered =
        allPerformanceData.filter(
            student => {

                return (

                    String(
                        student.studentName
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        student.rollNo
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        student.exam
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        student.subject
                    )
                        .toLowerCase()
                        .includes(search)

                );
            }
        );


    renderPerformanceTable(
        filtered
    );
}


// =========================================================
// GRADE
// =========================================================

function getGrade(
    percentage
) {

    if (percentage >= 90)
        return "A+";

    if (percentage >= 80)
        return "A";

    if (percentage >= 70)
        return "B+";

    if (percentage >= 60)
        return "B";

    if (percentage >= 50)
        return "C";

    if (percentage >= 33)
        return "D";

    return "F";
}


// =========================================================
// PERFORMANCE LABEL
// =========================================================

function getPerformanceLabel(
    percentage
) {

    if (percentage >= 75) {

        return {
            label: "Good",
            className:
                "performance-good"
        };
    }


    if (percentage >= 50) {

        return {
            label: "Average",
            className:
                "performance-average"
        };
    }


    return {

        label:
            "Needs Improvement",

        className:
            "performance-poor"
    };
}


// =========================================================
// EMPTY STATE
// =========================================================

function renderEmptyState(
    message
) {

    const tbody =
        document.getElementById(
            "performanceTableBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="loading"
            >

                ${escapeHtml(
                    message
                )}

            </td>

        </tr>

    `;
}


// =========================================================
// LOADING STATE
// =========================================================

function showLoadingState(
    message
) {

    const tbody =
        document.getElementById(
            "performanceTableBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="loading"
            >

                ${escapeHtml(
                    message
                )}

            </td>

        </tr>

    `;
}


function hideLoadingState() {
    // Nothing required.
    // Kept for compatibility.
}


// =========================================================
// ERROR
// =========================================================

function showError(
    message
) {

    console.error(
        message
    );


    renderEmptyState(
        message
    );
}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


// =========================================================
// PAGE READY
// =========================================================

window.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "CLASS PERFORMANCE PAGE READY"
        );


        loadPageInformation();


      


        // Load students
        await loadStudents();

          await loadExams();
        // Search
        const searchInput =
            document.getElementById(
                "studentSearch"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                filterStudents
            );
        }

    }
);

// =========================================================
// LOAD PERFORMANCE MARKS
// =========================================================

async function loadMarks(
    students,
    selectedExam
) {

    try {

        if (!selectedExam) {

            allPerformanceData = [];

            renderEmptyState(
                "Select an exam to view performance."
            );

            updateSummary([]);

            renderTopStudents([]);

            renderImprovementStudents([]);

            return;
        }

        console.log(
            "========== LOAD PERFORMANCE =========="
        );

        const className =
            teacher?.classes?.[0] ||
            teacher?.className ||
            teacher?.class ||
            "";

        const subject =
            teacher?.subjects?.[0] ||
            teacher?.subject ||
            "";

        if (!schoolId) {

            throw new Error(
                "School information is missing."
            );
        }

        if (!className) {

            throw new Error(
                "Teacher class information is missing."
            );
        }

        if (!subject) {

            throw new Error(
                "Teacher subject information is missing."
            );
        }

        // -------------------------------------------------
        // SECTION
        // -------------------------------------------------

        let section =
            teacher?.classTeacherOf?.section ||
            teacher?.section ||
            "";

        // If teacher does not have section,
        // use first student's section
        if (!section && Array.isArray(students)) {

            section =
                students.find(
                    student =>
                        student?.section
                )?.section || "";
        }

        // Mobile app uses A as default
        if (!section) {
            section = "A";
        }

        console.log(
            "schoolId:",
            schoolId
        );

        console.log(
            "className:",
            className
        );

        console.log(
            "section:",
            section
        );

        console.log(
            "examName:",
            selectedExam
        );

        console.log(
            "subject:",
            subject
        );

        // -------------------------------------------------
        // API PARAMETERS
        // -------------------------------------------------

        const params =
            new URLSearchParams({
                schoolId: String(schoolId),
                className: String(className),
                section: String(section),
                examName: String(selectedExam),
                subject: String(subject)
            });

        // IMPORTANT:
        // Use Evaluation API like mobile app
        const url =
            "/api/evaluation/teacher-results?" +
            params.toString();

        console.log(
            "EVALUATION PERFORMANCE API:",
            url
        );

        showLoadingState(
            "Loading performance..."
        );

        const response =
            await fetch(url);

        console.log(
            "EVALUATION PERFORMANCE STATUS:",
            response.status
        );

        if (!response.ok) {

            throw new Error(
                "Evaluation API unavailable. HTTP " +
                response.status
            );
        }

        const data =
            await response.json();

        console.log(
            "EVALUATION PERFORMANCE RESPONSE:",
            data
        );

        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load evaluation results."
            );
        }

        const evaluations =
            data.results || [];

        console.log(
            "EVALUATIONS FOUND:",
            evaluations
        );

        // -------------------------------------------------
        // PREPARE DATA
        // -------------------------------------------------

        const performanceData =
            evaluations.map(
                item => {

                    const obtained =
                        Number(
                            item.finalMarks ??
                            item.obtainedMarks ??
                            item.marksObtained ??
                            item.score ??
                            0
                        );

                    const total =
                        Number(
                            item.totalMarks ??
                            item.maxMarks ??
                            100
                        );

                    const percentage =
                        total > 0
                            ? (
                                obtained /
                                total
                            ) * 100
                            : 0;

                    return {

                        studentId:
                            item.studentId?._id ||
                            item.studentId ||
                            "",

                        studentName:
                            item.studentName ||
                            item.student?.studentName ||
                            item.student?.name ||
                            "Student",

                        rollNo:
                            item.rollNo ||
                            item.rollNumber ||
                            item.student?.rollNo ||
                            "-",

                        className:
                            item.className ||
                            className,

                        section:
                            item.section ||
                            section,

                        exam:
                            item.examName ||
                            item.exam ||
                            selectedExam,

                        subject:
                            item.subject ||
                            subject,

                        marksObtained:
                            obtained,

                        totalMarks:
                            total,

                        percentage:
                            Number(
                                percentage.toFixed(2)
                            ),

                        grade:
                            item.grade ||
                            getGrade(
                                percentage
                            ),

                        performance:
                            getPerformanceLabel(
                                percentage
                            )
                    };
                }
            );

        allPerformanceData =
            performanceData;

        console.log(
            "PREPARED PERFORMANCE:",
            performanceData
        );

        // -------------------------------------------------
        // UPDATE UI
        // -------------------------------------------------

        updateSummary(
            performanceData
        );

        renderPerformanceTable(
            performanceData
        );

        renderTopStudents(
            performanceData
        );

        renderImprovementStudents(
            performanceData
        );

        hideLoadingState();

    } catch (error) {

        console.error(
            "Evaluation loading error:",
            error
        );

        allPerformanceData = [];

        hideLoadingState();

        renderEmptyState(
            error.message ||
            "No evaluation data available yet."
        );

        updateSummary([]);

        renderTopStudents([]);

        renderImprovementStudents([]);
    }
}

// =========================================================
// EXAM CHANGE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const examSelect =
            document.getElementById(
                "examSelect"
            );

        if (!examSelect) {

            console.error(
                "Exam dropdown not found"
            );

            return;
        }

        examSelect.addEventListener(
            "change",
            async () => {

                const exam =
                    examSelect.value;

                console.log(
                    "SELECTED EXAM:",
                    exam
                );

                if (!exam) {

                    allPerformanceData = [];

                    renderEmptyState(
                        "Select an exam to view performance."
                    );

                    updateSummary([]);

                    renderTopStudents([]);

                    renderImprovementStudents([]);

                    return;
                }

                // Save selected exam in URL
                const url =
                    new URL(
                        window.location.href
                    );

                url.searchParams.set(
                    "exam",
                    exam
                );

                window.history.replaceState(
                    {},
                    "",
                    url
                );

                await loadMarks(
                    allStudents,
                    exam
                );
            }
        );

    }
);

// =========================================================
// HIDE PAGE LOADING OVERLAY
// =========================================================

function hidePageLoader() {

    const overlay =
        document.getElementById("loadingOverlay");

    if (overlay) {

        overlay.classList.add("hidden");

        overlay.style.display = "none";
    }
}
// =========================================================
// GO BACK
// =========================================================

function goBack() {

    if (
        document.referrer &&
        document.referrer.includes(
            window.location.hostname
        )
    ) {

        window.history.back();

    } else {

        window.location.href =
            "teacher-dashboard.html";
    }
}