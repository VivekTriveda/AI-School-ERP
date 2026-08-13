const API = "http://localhost:5000/api/notices";

const school = JSON.parse(localStorage.getItem("currentSchool"));

const principal = JSON.parse(localStorage.getItem("principal"));

const schoolId = school?._id || school?.id;

const principalId = principal?._id || principal?.id;
let editingNoticeId = null;
let isEditing = false;


document
.getElementById("websiteForm")
.addEventListener("submit", publishNotice);



async function publishNotice(e){

    e.preventDefault();

    try{

        const formData = new FormData();

formData.append("schoolId", schoolId);
formData.append("principalId", principalId);

formData.append(
    "category",
    document.getElementById("category").value
);

formData.append(
    "priority",
    document.getElementById("priority").value
);

formData.append(
    "title",
    document.getElementById("title").value
);

formData.append(
    "description",
    document.getElementById("description").value
);

formData.append(
    "expiryDate",
    document.getElementById("expiryDate").value
);

formData.append(
    "isTicker",
    document.getElementById("isTicker").checked
);

const file = document.getElementById("attachment").files[0];

if (file) {

    formData.append("attachment", file);

}

const url = isEditing
    ? `${API}/${editingNoticeId}`
    : API;

const method = isEditing
    ? "PUT"
    : "POST";

const res = await fetch(url,{
    method,
    body: formData
});

        const data=await res.json();

        if(data.success){

            alert("Published Successfully");

            document.getElementById("websiteForm").reset();
            isEditing = false;
            editingNoticeId = null;

           document.querySelector(".publish-btn").innerHTML ='<i class="fa-solid fa-paper-plane"></i> Publish';

            loadPosts();

        }

        else{

            alert(data.message);

        }

    }

    catch(err){

        console.log(err);

        alert("Server Error");

    }

}
async function loadPosts(){

    try{

        const res=await fetch(

            `${API}/school/${schoolId}`

        );

        const data=await res.json();
        

        if(data.success){

            renderTable(data.notices);

        }

    }

    catch(err){

        console.log(err);

    }

}

loadPosts();


function renderTable(list){
    window.noticeList = list;

const table=document.getElementById("postTable");

table.innerHTML="";

  

list.forEach(item=>{

table.innerHTML+=`

<tr>

<td>

${item.category}

</td>

<td>

${item.title}

</td>

<td>

${item.priority}

</td>

<td>

${new Date(item.createdAt).toLocaleDateString()}

</td>
<td>

${item.attachment
    ? `<a href="http://localhost:5000${item.attachment}"
          target="_blank">
          View
       </a>`
    : "—"}

</td>

<td>

<span class="status published">

${item.status}

</span>

</td>

<td>

<button

class="action-btn edit-btn"

onclick="editNotice('${item._id}')">

Edit

</button>

<button

class="action-btn delete-btn"

onclick="deleteNotice('${item._id}')">

Delete

</button>

</td>

</tr>

`;

});


}

function editNotice(id) {
    
     console.log("Clicked ID:", id);
    console.log("Notice List:", window.noticeList);

    const notice = window.noticeList.find(n => n._id === id);

    console.log("Found Notice:", notice);

    if (!notice) {
        return alert("Notice not found");
    }

    editingNoticeId = id;
    isEditing = true;

    document.getElementById("category").value = notice.category;
    document.getElementById("priority").value = notice.priority;
    document.getElementById("title").value = notice.title;
    document.getElementById("description").value = notice.description;

    if (notice.expiryDate) {
        document.getElementById("expiryDate").value =
            notice.expiryDate.substring(0, 10);
    }

    document.getElementById("isTicker").checked = notice.isTicker;

    document.querySelector(".publish-btn").innerHTML =
        '<i class="fa-solid fa-pen"></i> Update Notice';

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

async function deleteNotice(id){

    const ok = confirm("Are you sure you want to delete this notice?");

    if(!ok) return;

    try{

        const res = await fetch(`${API}/${id}`,{

            method:"DELETE"

        });

        const data = await res.json();

        if(data.success){

            alert("Notice Deleted Successfully");

            loadPosts();

        }else{

            alert(data.message);

        }

    }catch(err){

        console.log(err);

        alert("Server Error");

    }

}