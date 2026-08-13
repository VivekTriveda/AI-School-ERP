/* ==========================================
   AI SCHOOL ERP CHATBOT
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadChatbot();

    initializeChatbot();

});

/* ==========================================
   LOAD CHATBOT HTML
========================================== */

async function loadChatbot() {

    try {

        const res = await fetch("/chatbot.html");

        if (!res.ok) {
            throw new Error("Unable to load chatbot.html");
        }

        const html = await res.text();

        const container = document.getElementById("chatbot-container");

        if (!container) {
            console.error("chatbot-container not found.");
            return;
        }

        container.innerHTML = html;

    } catch (err) {

        console.error("Chatbot Load Error:", err);

    }

}

/* ==========================================
   INITIALIZE CHATBOT
========================================== */

function initializeChatbot() {

    const chatWindow = document.getElementById("chatWindow");
    const toggleBtn = document.getElementById("chatToggleBtn");
    const closeBtn = document.getElementById("closeChat");
    const minimizeBtn = document.getElementById("minimizeChat");

    const sendBtn = document.getElementById("sendBtn");
    const input = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const typingIndicator = document.getElementById("typingIndicator");

    const quickButtons = document.querySelectorAll(".quick-btn");

    /* ---------- Safety Check ---------- */

    if (
        !chatWindow ||
        !toggleBtn ||
        !closeBtn ||
        !minimizeBtn ||
        !sendBtn ||
        !input ||
        !chatMessages ||
        !typingIndicator
    ) {

        console.error("Chatbot elements not found.");

        return;

    }

    /* ---------- Open ---------- */

    toggleBtn.addEventListener("click", () => {

        chatWindow.classList.add("active");

    });

    /* ---------- Close ---------- */

    closeBtn.addEventListener("click", () => {

        chatWindow.classList.remove("active");

    });

    /* ---------- Minimize ---------- */

    minimizeBtn.addEventListener("click", () => {

        chatWindow.classList.remove("active");

    });

    /* ---------- Quick Buttons ---------- */

    quickButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            input.value = btn.innerText;

            sendMessage();

        });

    });

    /* ---------- Enter ---------- */

    input.addEventListener("keypress", e => {

        if (e.key === "Enter") {

            sendMessage();

        }

    });

    /* ---------- Send ---------- */

    sendBtn.addEventListener("click", sendMessage);

    /* =====================================
       SEND MESSAGE
    ===================================== */

    async function sendMessage() {

        const message = input.value.trim();

        if (!message) return;

        addUserMessage(message);

        input.value = "";

        showTyping();

        try {

            const currentUser =
                JSON.parse(localStorage.getItem("currentUser")) ||
                JSON.parse(localStorage.getItem("currentSchool")) ||
                {};

            const response = await fetch("/api/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    message,

                    user: {

                        role: currentUser.role || localStorage.getItem("role"),

                        schoolId: currentUser.schoolId || localStorage.getItem("schoolId"),

                        userId: currentUser._id || currentUser.id || localStorage.getItem("userId"),

                        className: currentUser.className,

                        section: currentUser.section,

                        studentId: currentUser.studentId,

                        teacherId: currentUser.teacherId

                    }

                })

            });

            const data = await response.json();

            hideTyping();

            if (data.success) {

                addBotMessage(data.reply);

            } else {

                addBotMessage(data.message || "Something went wrong.");

            }

        } catch (err) {

            console.error(err);

            hideTyping();

            addBotMessage("Unable to connect to server.");

        }

    }

    /* =====================================
       USER MESSAGE
    ===================================== */

    function addUserMessage(text) {

        const div = document.createElement("div");

        div.className = "message user";

        div.innerHTML = `
            <div class="message-content">
                ${text}
            </div>
        `;

        chatMessages.appendChild(div);

        scrollBottom();

    }

    /* =====================================
       BOT MESSAGE
    ===================================== */

    function addBotMessage(text) {

    const div = document.createElement("div");

    div.className = "message bot";

    const safeText = (text || "Sorry, an unexpected error occurred.")
        .replace(/\n/g, "<br>");

    div.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">${safeText}</div>
    `;

    chatMessages.appendChild(div);

    scrollBottom();

}

    /* =====================================
       TYPING
    ===================================== */

    function showTyping() {

        typingIndicator.style.display = "block";

        scrollBottom();

    }

    function hideTyping() {

        typingIndicator.style.display = "none";

    }

    /* =====================================
       SCROLL
    ===================================== */

    function scrollBottom() {

        chatMessages.scrollTop = chatMessages.scrollHeight;

    }

}