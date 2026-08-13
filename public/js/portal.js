const API = "http://localhost:5000/api/portal/home";

async function loadPortal() {

    try {

        const res = await fetch(API);

        const data = await res.json();

        if (!data.success) {

            return;

        }

        renderTicker(data.ticker);
        renderStats(data.stats);
       renderSchools(data.schools);

        renderCards(
            "latestNoticeContainer",
            data.notices,
            "📢",
            "#0d47a1"
        );

        renderCards(
            "admissionContainer",
            data.admissions,
            "🎓",
            "#2e7d32"
        );

        renderCards(
            "tenderContainer",
            data.tenders,
            "📄",
            "#d84315"
        );
    
    }

    catch(err){

        console.log(err);

    }

}

function renderTicker(list){

    const ticker=document.getElementById("runningNotice");

    if(!list.length){

        ticker.innerHTML="No Latest Notice";

        return;

    }

    ticker.innerHTML=list.map(item=>{

        return `📢 ${item.title}`;

    }).join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

}

function renderCards(containerId,list,icon,color){

    const container=document.getElementById(containerId);

    if(!list.length){

        container.innerHTML=`
        <div class="col-12">

            <div class="alert alert-info">

                No Data Available

            </div>

        </div>`;

        return;

    }

    container.innerHTML=list.map(item=>`

<div class="col-xl-4 col-lg-6 col-md-6 mb-4">

<div class="news-card">

<div class="news-header">

<div class="school-info">

<img

src="${
item.schoolId.logo
?
'http://localhost:5000'+item.schoolId.logo
:
'images/default-school.png'
}"

class="news-logo">

<div>

<h5>

${item.schoolId.schoolName}

</h5>

<span>

📍 ${item.schoolId.city},
${item.schoolId.state}

</span>

</div>

</div>

<div class="board-badge">

${item.schoolId.board}

</div>

</div>

<div class="news-body">

<div class="priority ${item.priority}">

${item.priority.toUpperCase()}

</div>

<h4>

${icon}
${item.title}

</h4>

<p>

${item.description.substring(0,180)}...

</p>

<div class="news-date">

📅

${new Date(item.createdAt).toLocaleDateString()}

</div>

</div>

<div class="news-footer">

${
item.attachment

?

`<a

href="http://localhost:5000${item.attachment}"

target="_blank"

class="download-btn">

<i class="bi bi-file-earmark-pdf"></i>

View Attachment

</a>`

:

`<button
class="btn btn-secondary"

disabled>

No Attachment

</button>`

}

</div>

</div>

</div>

`).join("");

}

loadPortal();

function renderSchools(schools){

    const container=document.getElementById("schoolContainer");

   if(!schools || schools.length === 0){

    container.innerHTML = `

    <div class="col-12">

        <div class="alert alert-info">

            No Schools Available

        </div>

    </div>

    `;

    return;

}

   

    container.innerHTML=schools.map(school=>`

<div class="col-lg-4 col-md-6 mb-4">

<div class="school-card">

<div class="school-banner">

<img
src="${
school.logo
?
"http://localhost:5000"+school.logo
    : "images/logo.png"
}"

class="school-logo">

</div>

<div class="school-body">

<h4>

${school.schoolName}

</h4>

<div class="school-location">

<i class="bi bi-geo-alt-fill"></i>

${school.city},

${school.state}

</div>

<div class="school-board">

${school.board}

</div>

<p>

Modern digital learning,
experienced teachers and
excellent academic performance.

</p>

<div class="school-footer">

<a href="school-profile.html?id=${school._id}" class="btn btn-primary">
    Visit School →
</a>

</div>

</div>

</div>

</div>

`).join("");

}

function renderStats(stats){

    document.getElementById("schoolCount").textContent =
        stats.schools;

    document.getElementById("studentCount").textContent =
        stats.students;

    document.getElementById("teacherCount").textContent =
        stats.teachers;

    document.getElementById("noticeCount").textContent =
        stats.notices;

}