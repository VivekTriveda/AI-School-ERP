// ============================================================
// MANAGE SCHOOL TIMETABLE
// ============================================================

const API = "/api/timetable";


// ============================================================
// DAYS / CLASSES / SECTIONS
// ============================================================

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const CLASSES = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"
];

const SECTIONS = [
    "ALL",
    "A",
    "B",
    "C",
    "D"
];


// ============================================================
// FIXED SCHOOL TIMING
// ============================================================

const SCHOOL_START_HOUR = 8;
const SCHOOL_START_MINUTE = 0;

const PRAYER_MINUTES = 20;

const PERIOD_MINUTES = 40;

const BREAK_MINUTES = 20;


// ============================================================
// CURRENT SCHOOL
// ============================================================

const currentSchool =
    JSON.parse(
        localStorage.getItem("currentSchool") || "null"
    );


if (!currentSchool || !currentSchool._id) {

    alert(
        "School information not found. Please login again."
    );

    throw new Error(
        "currentSchool missing"
    );
}


const schoolId =
    currentSchool._id;


// ============================================================
// GLOBAL DATA
// ============================================================

let timetable = [];

let teachers = [];

let books = [];

let selectedClass = "1";

let selectedSection = "ALL";

let selectedDay = "Monday";


// ============================================================
// ELEMENTS
// ============================================================

const teacherSelect =
    document.getElementById("teacher");

const classSelect =
    document.getElementById("className");

const sectionSelect =
    document.getElementById("section");

const subjectSelect =
    document.getElementById("subject");

const daySelect =
    document.getElementById("day");

const periodSelect =
    document.getElementById("period");

const roomNoInput =
    document.getElementById("roomNo");

const classPills =
    document.getElementById("classPills");

const sectionPills =
    document.getElementById("sectionPills");

const dayPills =
    document.getElementById("dayPills");

const timetableView =
    document.getElementById("timetableView");

const formCard =
    document.getElementById("formCard");

const showAddBtn =
    document.getElementById("showAddBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const saveBtn =
    document.getElementById("saveBtn");

const periodSummary =
    document.getElementById("periodSummary");


// ============================================================
// TIME FUNCTIONS
// ============================================================

function minutesToTime(totalMinutes) {

    const hours =
        Math.floor(totalMinutes / 60);

    const minutes =
        totalMinutes % 60;

    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0")
    );
}


function formatTime(time) {

    if (!time) {
        return "";
    }

    const parts =
        String(time).split(":");

    let hour =
        Number(parts[0]);

    const minute =
        parts[1] || "00";

    const suffix =
        hour >= 12
            ? "PM"
            : "AM";

    hour =
        hour % 12 || 12;

    return `${hour}:${minute} ${suffix}`;
}


// ============================================================
// BUILD FIXED DAILY SCHEDULE
// ============================================================

function buildFixedSchedule() {

    const schoolStart =
        SCHOOL_START_HOUR * 60 +
        SCHOOL_START_MINUTE;


    let current =
        schoolStart;


    // ========================================================
    // PRAYER
    // ========================================================

    const prayerStart =
        current;

    const prayerEnd =
        prayerStart +
        PRAYER_MINUTES;

    current =
        prayerEnd;


    // ========================================================
    // PERIODS
    // ========================================================

    const periods = [];


    // --------------------------------------------------------
    // PERIOD 1 - 4
    // --------------------------------------------------------

    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const start =
            current;

        const end =
            start +
            PERIOD_MINUTES;


        periods.push({

            period:
                String(i),

            startTime:
                minutesToTime(start),

            endTime:
                minutesToTime(end)

        });


        current =
            end;
    }


    // ========================================================
    // BREAK
    // ========================================================

    const breakStart =
        current;

    const breakEnd =
        breakStart +
        BREAK_MINUTES;

    current =
        breakEnd;


    // --------------------------------------------------------
    // PERIOD 5 - 8
    // --------------------------------------------------------

    for (
        let i = 5;
        i <= 8;
        i++
    ) {

        const start =
            current;

        const end =
            start +
            PERIOD_MINUTES;


        periods.push({

            period:
                String(i),

            startTime:
                minutesToTime(start),

            endTime:
                minutesToTime(end)

        });


        current =
            end;
    }


    // ========================================================
    // AFTER PERIOD 8
    // ========================================================

    // 40 minute school closing buffer
    const calledOffMinutes =
        current + 40;


    return {

        prayer: {

            startTime:
                minutesToTime(
                    prayerStart
                ),

            endTime:
                minutesToTime(
                    prayerEnd
                )

        },


        periods,


        break: {

            startTime:
                minutesToTime(
                    breakStart
                ),

            endTime:
                minutesToTime(
                    breakEnd
                )

        },


        calledOff:
            minutesToTime(
                calledOffMinutes
            )

    };
}


const fixedSchedule =
    buildFixedSchedule();


// ============================================================
// NORMALIZE VALUES
// ============================================================

function normalizeClass(value) {

    return String(
        value ?? ""
    )
        .trim()
        .replace(
            /^class\s*/i,
            ""
        );
}


function normalizeSection(value) {

    return String(
        value ?? ""
    )
        .trim()
        .toUpperCase()
        .replace(
            /^SECTION\s*/i,
            ""
        );
}


function normalizeDay(value) {

    return String(
        value ?? ""
    )
        .trim()
        .toLowerCase();
}


// ============================================================
// GET CURRENT ENTRIES
// ============================================================

function getCurrentEntries() {

    return timetable.filter(
        item => {

            const classMatch =
                normalizeClass(
                    item.className
                ) ===
                selectedClass;


            const dayMatch =
                normalizeDay(
                    item.day
                ) ===
                selectedDay.toLowerCase();


            const sectionMatch =
                selectedSection === "ALL"
                    ? true
                    : normalizeSection(
                        item.section
                    ) ===
                    selectedSection;


            return (
                classMatch &&
                dayMatch &&
                sectionMatch
            );
        }
    );
}


// ============================================================
// GET PERIOD ENTRIES
// ============================================================

function getPeriodEntries(
    periodNumber
) {

    return getCurrentEntries().filter(
        item =>
            String(
                item.period
            ) ===
            String(periodNumber)
    );
}


// ============================================================
// CLASS PILLS
// ============================================================

function renderClassPills() {

    if (!classPills) {
        return;
    }


    classPills.innerHTML = "";


    CLASSES.forEach(
        className => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "pill" +
                (
                    selectedClass ===
                    className
                        ? " active"
                        : ""
                );


            button.textContent =
                className;


            button.onclick = () => {

                selectedClass =
                    className;


                if (classSelect) {

                    classSelect.value =
                        selectedClass;

                }


                loadSubjectsForClass(
                    selectedClass
                );


                renderAll();

            };


            classPills.appendChild(
                button
            );

        }
    );
}


// ============================================================
// SECTION PILLS
// ============================================================

function renderSectionPills() {

    if (!sectionPills) {
        return;
    }


    sectionPills.innerHTML = "";


    SECTIONS.forEach(
        section => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "pill section-pill" +
                (
                    selectedSection ===
                    section
                        ? " active"
                        : ""
                );


            button.textContent =
                section === "ALL"
                    ? "All Sections"
                    : section;


            button.onclick = () => {

                selectedSection =
                    section;


                if (
                    sectionSelect &&
                    section !== "ALL"
                ) {

                    sectionSelect.value =
                        section;

                }


                renderAll();

            };


            sectionPills.appendChild(
                button
            );

        }
    );
}


// ============================================================
// DAY COUNT
// ============================================================

function getDayCount(day) {

    return timetable.filter(
        item => {

            const classMatch =
                normalizeClass(
                    item.className
                ) ===
                selectedClass;


            const dayMatch =
                normalizeDay(
                    item.day
                ) ===
                day.toLowerCase();


            const sectionMatch =
                selectedSection === "ALL"
                    ? true
                    : normalizeSection(
                        item.section
                    ) ===
                    selectedSection;


            return (
                classMatch &&
                dayMatch &&
                sectionMatch
            );

        }
    ).length;
}


// ============================================================
// DAY PILLS
// ============================================================

function renderDayPills() {

    if (!dayPills) {
        return;
    }


    dayPills.innerHTML = "";


    DAYS.forEach(
        day => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "pill day-pill" +
                (
                    selectedDay === day
                        ? " active"
                        : ""
                );


            button.innerHTML = `

                ${day.substring(0, 3)}

                <span class="day-count">

                    ${getDayCount(day)}/8

                </span>

            `;


            button.onclick = () => {

                selectedDay =
                    day;


                if (daySelect) {

                    daySelect.value =
                        selectedDay;

                }


                renderAll();

            };


            dayPills.appendChild(
                button
            );

        }
    );
}


// ============================================================
// SELECTED CLASS HEADER
// ============================================================

function renderSelectedClass() {

    const selectedClassTitle =
        document.getElementById(
            "selectedClassTitle"
        );


    const selectedDayTitle =
        document.getElementById(
            "selectedDayTitle"
        );


    const selectedDaySubtitle =
        document.getElementById(
            "selectedDaySubtitle"
        );


    const periodCountBadge =
        document.getElementById(
            "periodCountBadge"
        );


    if (selectedClassTitle) {

        selectedClassTitle.textContent =
            `Class ${selectedClass} • ${
                selectedSection === "ALL"
                    ? "All Sections"
                    : `Section ${selectedSection}`
            }`;

    }


    if (selectedDayTitle) {

        selectedDayTitle.textContent =
            selectedDay;

    }


    if (selectedDaySubtitle) {

        selectedDaySubtitle.textContent =
            `Class ${selectedClass} • ${
                selectedSection === "ALL"
                    ? "All Sections"
                    : `Section ${selectedSection}`
            }`;

    }


    if (periodCountBadge) {

        periodCountBadge.textContent =
            `${getCurrentEntries().length}/8 Periods`;

    }
}


// ============================================================
// RENDER TIMETABLE
// ============================================================

function renderTimetable() {

    if (!timetableView) {
        return;
    }


    timetableView.innerHTML = "";


    // ========================================================
    // PRAYER
    // ========================================================

    timetableView.insertAdjacentHTML(
        "beforeend",
        `

        <div class="special-card prayer-card">

            <div class="special-icon">
                🙏
            </div>


            <div class="special-info">

                <div class="special-title">
                    Prayer
                </div>


                <div class="special-time">

                    ${formatTime(
                        fixedSchedule.prayer.startTime
                    )}

                    -

                    ${formatTime(
                        fixedSchedule.prayer.endTime
                    )}

                </div>

            </div>


            <div class="fixed-badge">
                FIXED
            </div>

        </div>

        `
    );


    // ========================================================
    // PERIODS 1 - 8
    // ========================================================

    fixedSchedule.periods.forEach(
        periodItem => {

            const entries =
                getPeriodEntries(
                    periodItem.period
                );


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "period-wrapper";


            // =================================================
            // PERIOD HEADER
            // =================================================

            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "period-header";


            header.innerHTML = `

                <div class="period-circle">

                    ${periodItem.period}

                </div>


                <div>

                    <div class="period-title">

                        Period ${periodItem.period}

                    </div>


                    <div class="period-time">

                        ${formatTime(
                            periodItem.startTime
                        )}

                        -

                        ${formatTime(
                            periodItem.endTime
                        )}

                    </div>

                </div>


                <div class="period-duration">

                    40 min

                </div>

            `;


            wrapper.appendChild(
                header
            );


            // =================================================
            // EMPTY PERIOD
            // =================================================

            if (
                entries.length === 0
            ) {

                const empty =
                    document.createElement(
                        "div"
                    );


                empty.className =
                    "empty-period";


                empty.innerHTML = `

                    <div class="empty-title">

                        No class assigned

                    </div>


                    <div class="empty-hint">

                        Use + Add Timetable
                        to assign a class

                    </div>

                `;


                wrapper.appendChild(
                    empty
                );

            }


            // =================================================
            // ENTRIES
            // =================================================

            else {

                entries.forEach(
                    entry => {

                        const card =
                            document.createElement(
                                "div"
                            );


                        card.className =
                            "entry-card";


                        const section =
                            normalizeSection(
                                entry.section
                            );


                        const room =
                            entry.roomNo
                                ? `

                                    <div class="entry-line">

                                        🚪 Room
                                        ${escapeHtml(
                                            entry.roomNo
                                        )}

                                    </div>

                                  `
                                : "";


                        card.innerHTML = `

                            <div class="entry-subject">

                                📚
                                ${escapeHtml(
                                    entry.subject ||
                                    "Subject"
                                )}

                            </div>


                            <div class="entry-line">

                                👨‍🏫
                                ${escapeHtml(
                                    entry.teacherName ||
                                    "Teacher not assigned"
                                )}

                            </div>


                            <div class="entry-line">

                                🏫 Class
                                ${escapeHtml(
                                    entry.className ||
                                    selectedClass
                                )}

                                ${
                                    section
                                        ? ` • Section ${escapeHtml(section)}`
                                        : ""
                                }

                            </div>


                            ${room}


                            <div class="entry-time">

                                🕐
                                ${formatTime(
                                    entry.startTime ||
                                    periodItem.startTime
                                )}

                                -

                                ${formatTime(
                                    entry.endTime ||
                                    periodItem.endTime
                                )}

                            </div>


                            <div class="entry-actions">

                                <button
                                    class="delete-btn"
                                    onclick="deleteTimeTable('${entry._id}')"
                                >
                                    Delete
                                </button>

                            </div>

                        `;


                        wrapper.appendChild(
                            card
                        );

                    }
                );

            }


            timetableView.appendChild(
                wrapper
            );


            // =================================================
            // BREAK AFTER PERIOD 4
            // =================================================

            if (
                String(
                    periodItem.period
                ) === "4"
            ) {

                timetableView.insertAdjacentHTML(
                    "beforeend",
                    `

                    <div class="special-card break-card">

                        <div class="special-icon">

                            🍱

                        </div>


                        <div class="special-info">

                            <div class="special-title">

                                Break

                            </div>


                            <div class="special-time">

                                ${formatTime(
                                    fixedSchedule.break.startTime
                                )}

                                -

                                ${formatTime(
                                    fixedSchedule.break.endTime
                                )}

                            </div>

                        </div>


                        <div class="fixed-badge">

                            20 MIN

                        </div>

                    </div>

                    `
                );

            }

        }
    );


    // ========================================================
    // SCHOOL CALLED OFF
    // ========================================================

    timetableView.insertAdjacentHTML(
        "beforeend",
        `

        <div class="special-card called-card">

            <div class="special-icon">

                🏠

            </div>


            <div class="special-info">

                <div class="special-title">

                    School Called Off

                </div>


                <div class="special-time">

                    After
                    ${formatTime(
                        fixedSchedule.calledOff
                    )}

                </div>

            </div>


            <div class="fixed-badge">

                FIXED

            </div>

        </div>

        `
    );
}


// ============================================================
// RENDER EVERYTHING
// ============================================================

function renderAll() {

    renderClassPills();

    renderSectionPills();

    renderDayPills();

    renderSelectedClass();

    renderTimetable();


    if (classSelect) {

        classSelect.value =
            selectedClass;

    }


    if (
        sectionSelect &&
        selectedSection !== "ALL"
    ) {

        sectionSelect.value =
            selectedSection;

    }


    if (daySelect) {

        daySelect.value =
            selectedDay;

    }
}


// ============================================================
// LOAD TEACHERS
// ============================================================

async function loadTeachers() {

    try {

        const response =
            await fetch(
                `/api/teachers/${schoolId}`
            );


        if (!response.ok) {

            throw new Error(
                `Teacher API failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        teachers =
            data.teachers || [];


        if (!teacherSelect) {
            return;
        }


        teacherSelect.innerHTML = `

            <option value="">

                Select Teacher

            </option>

        `;


        teachers.forEach(
            teacher => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    teacher._id;


                option.dataset.name =
                    teacher.teacherName;


                option.textContent =
                    teacher.teacherName;


                teacherSelect.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Load teachers error:",
            error
        );


        if (teacherSelect) {

            teacherSelect.innerHTML = `

                <option value="">

                    Unable to load teachers

                </option>

            `;

        }

    }
}


// ============================================================
// LOAD BOOKS
// ============================================================

async function loadBooks() {

    try {

        const response =
            await fetch(
                `/api/books/${schoolId}`
            );


        if (!response.ok) {

            throw new Error(
                `Books API failed: ${response.status}`
            );

        }


        books =
            await response.json();


        if (
            !Array.isArray(books)
        ) {

            books = [];

        }


    } catch (error) {

        console.error(
            "Load books error:",
            error
        );


        books = [];

    }
}


// ============================================================
// LOAD CLASSES INTO FORM
// ============================================================

function loadClassesIntoForm() {

    if (!classSelect) {
        return;
    }


    classSelect.innerHTML = "";


    CLASSES.forEach(
        className => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                className;


            option.textContent =
                `Class ${className}`;


            classSelect.appendChild(
                option
            );

        }
    );


    classSelect.value =
        selectedClass;
}


// ============================================================
// LOAD SECTIONS INTO FORM
// ============================================================

function loadSectionsIntoForm() {

    if (!sectionSelect) {
        return;
    }


    sectionSelect.innerHTML = "";


    ["A", "B", "C", "D"]
        .forEach(
            section => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    section;


                option.textContent =
                    `Section ${section}`;


                sectionSelect.appendChild(
                    option
                );

            }
        );


    sectionSelect.value =
        selectedSection === "ALL"
            ? "A"
            : selectedSection;
}


// ============================================================
// LOAD DAYS INTO FORM
// ============================================================

function loadDaysIntoForm() {

    if (!daySelect) {
        return;
    }


    daySelect.innerHTML = "";


    DAYS.forEach(
        day => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                day;


            option.textContent =
                day;


            daySelect.appendChild(
                option
            );

        }
    );


    daySelect.value =
        selectedDay;
}


// ============================================================
// LOAD 8 PERIODS INTO FORM
// ============================================================

function loadPeriodsIntoForm() {

    if (!periodSelect) {
        return;
    }


    periodSelect.innerHTML = `

        <option value="">

            Select Period

        </option>

    `;


    fixedSchedule.periods.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.period;


            option.textContent =
                `Period ${item.period} — ${
                    formatTime(
                        item.startTime
                    )
                } - ${
                    formatTime(
                        item.endTime
                    )
                }`;


            periodSelect.appendChild(
                option
            );

        }
    );
}


// ============================================================
// LOAD SUBJECTS
// ============================================================

function loadSubjectsForClass(
    className
) {

    if (!subjectSelect) {
        return;
    }


    subjectSelect.innerHTML = `

        <option value="">

            Select Subject

        </option>

    `;


    const subjects = [
        ...new Set(

            books

                .filter(
                    book =>
                        normalizeClass(
                            book.className
                        ) ===
                        String(className)
                )

                .map(
                    book =>
                        book.subject
                )

                .filter(Boolean)

        )
    ];


    subjects.forEach(
        subject => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                subject;


            option.textContent =
                subject;


            subjectSelect.appendChild(
                option
            );

        }
    );
}


// ============================================================
// PERIOD SUMMARY
// ============================================================

function updatePeriodSummary() {

    if (!periodSummary) {
        return;
    }


    const selected =
        fixedSchedule.periods.find(
            item =>
                item.period ===
                String(
                    periodSelect.value
                )
        );


    if (!selected) {

        periodSummary.textContent =
            "Select a period to see its fixed time.";

        return;

    }


    periodSummary.textContent =
        `Period ${selected.period} • ${
            formatTime(
                selected.startTime
            )
        } - ${
            formatTime(
                selected.endTime
            )
        } • 40 minutes`;
}


// ============================================================
// FORM EVENTS
// ============================================================

if (classSelect) {

    classSelect.addEventListener(
        "change",
        () => {

            selectedClass =
                classSelect.value;


            loadSubjectsForClass(
                selectedClass
            );


            renderAll();

        }
    );

}


if (sectionSelect) {

    sectionSelect.addEventListener(
        "change",
        () => {

            selectedSection =
                sectionSelect.value;


            renderAll();

        }
    );

}


if (daySelect) {

    daySelect.addEventListener(
        "change",
        () => {

            selectedDay =
                daySelect.value;


            renderAll();

        }
    );

}


if (periodSelect) {

    periodSelect.addEventListener(
        "change",
        updatePeriodSummary
    );

}


// ============================================================
// SHOW ADD FORM
// ============================================================

if (showAddBtn) {

    showAddBtn.addEventListener(
        "click",
        () => {

            formCard.classList.add(
                "show"
            );


            formCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}


// ============================================================
// CANCEL
// ============================================================

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        () => {

            formCard.classList.remove(
                "show"
            );

        }
    );

}


// ============================================================
// SAVE
// ============================================================

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        saveTimeTable
    );

}


// ============================================================
// SAVE TIMETABLE
// ============================================================

async function saveTimeTable() {

    if (
        !teacherSelect ||
        !teacherSelect.value
    ) {

        alert(
            "Please select a teacher."
        );

        return;
    }


    if (
        !classSelect ||
        !classSelect.value
    ) {

        alert(
            "Please select a class."
        );

        return;
    }


    if (
        !sectionSelect ||
        !sectionSelect.value
    ) {

        alert(
            "Please select a section."
        );

        return;
    }


    if (
        !subjectSelect ||
        !subjectSelect.value
    ) {

        alert(
            "Please select a subject."
        );

        return;
    }


    if (
        !daySelect ||
        !daySelect.value
    ) {

        alert(
            "Please select a day."
        );

        return;
    }


    if (
        !periodSelect ||
        !periodSelect.value
    ) {

        alert(
            "Please select a period."
        );

        return;
    }


    const selectedPeriod =
        fixedSchedule.periods.find(
            item =>
                item.period ===
                String(
                    periodSelect.value
                )
        );


    if (!selectedPeriod) {

        alert(
            "Invalid period selected."
        );

        return;
    }


    const selectedTeacher =
        teacherSelect.options[
            teacherSelect.selectedIndex
        ];


    const payload = {

        schoolId:
            currentSchool._id,

        schoolName:
            currentSchool.schoolName,

        board:
            currentSchool.board,

        teacherId:
            teacherSelect.value,

        teacherName:
            selectedTeacher.dataset.name,

        className:
            classSelect.value,

        section:
            sectionSelect.value,

        subject:
            subjectSelect.value,

        day:
            daySelect.value,

        period:
            Number(
                periodSelect.value
            ),

        startTime:
            selectedPeriod.startTime,

        endTime:
            selectedPeriod.endTime,

        roomNo:
            roomNoInput
                ? roomNoInput.value.trim()
                : ""

    };


    try {

        saveBtn.disabled =
            true;


        saveBtn.textContent =
            "Saving...";


        const response =
            await fetch(
                API,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to save timetable."
            );

        }


        alert(
            "✅ Timetable saved successfully."
        );


        formCard.classList.remove(
            "show"
        );


        if (roomNoInput) {

            roomNoInput.value =
                "";

        }


        periodSelect.value =
            "";


        subjectSelect.value =
            "";


        teacherSelect.value =
            "";


        await loadTimeTable();


    } catch (error) {

        console.error(
            "Save timetable error:",
            error
        );


        alert(
            `❌ ${error.message}`
        );


    } finally {

        saveBtn.disabled =
            false;


        saveBtn.textContent =
            "💾 Save Timetable";

    }
}


// ============================================================
// LOAD TIMETABLE
// ============================================================

async function loadTimeTable() {

    try {

        const response =
            await fetch(
                `${API}?schoolId=${
                    encodeURIComponent(
                        schoolId
                    )
                }`
            );


        if (!response.ok) {

            throw new Error(
                `Timetable API failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        timetable =
            data.timetable || [];


        renderAll();


    } catch (error) {

        console.error(
            "Load timetable error:",
            error
        );


        if (timetableView) {

            timetableView.innerHTML = `

                <div class="empty-period">

                    <div class="empty-title">

                        Unable to load timetable

                    </div>


                    <div class="empty-hint">

                        Please check that the server
                        is running.

                    </div>

                </div>

            `;

        }

    }
}


// ============================================================
// DELETE TIMETABLE
// ============================================================

async function deleteTimeTable(id) {

    if (!id) {
        return;
    }


    if (
        !confirm(
            "Delete this timetable entry?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/${id}`,
                {
                    method:
                        "DELETE"
                }
            );


        const data =
            await response
                .json()
                .catch(
                    () => ({})
                );


        if (
            !response.ok ||
            data.success === false
        ) {

            throw new Error(
                data.message ||
                "Unable to delete timetable."
            );

        }


        await loadTimeTable();


    } catch (error) {

        console.error(
            "Delete timetable error:",
            error
        );


        alert(
            `❌ ${error.message}`
        );

    }
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

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


// ============================================================
// GLOBAL DELETE FUNCTION
// ============================================================

window.deleteTimeTable =
    deleteTimeTable;


// ============================================================
// SCHOOL HEADER
// ============================================================

const schoolNameElement =
    document.getElementById(
        "schoolName"
    );


if (schoolNameElement) {

    schoolNameElement.textContent =
        currentSchool.schoolName ||
        "School";

}


const principalNameElement =
    document.getElementById("principalName");

if (principalNameElement) {

    const principalName =
        currentSchool.principalName ||
        currentSchool.principal ||
        currentSchool.principalNameText ||
        localStorage.getItem("principalName") ||
        "";

    if (principalName) {

        principalNameElement.textContent =
            `Principal : ${principalName}`;

    } else {

        principalNameElement.textContent =
            "Principal";

    }
}


// ============================================================
// INITIAL FORM SETUP
// ============================================================

loadClassesIntoForm();

loadSectionsIntoForm();

loadDaysIntoForm();

loadPeriodsIntoForm();


// ============================================================
// INITIAL LOAD
// ============================================================

(async function initialize() {

    await loadBooks();

    await loadTeachers();

    loadSubjectsForClass(
        selectedClass
    );

    await loadTimeTable();

})();