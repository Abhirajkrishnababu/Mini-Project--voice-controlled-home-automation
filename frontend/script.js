let mediaRecorder;
let chunks = [];

const popup = document.getElementById("popup");
const mainUI = document.getElementById("mainUI");
const startBtn = document.getElementById("startRecordBtn");
const cancelBtn = document.getElementById("cancelPopup");
const timerElement = document.getElementById("timer");

// --- POPUP HANDLING ---
cancelBtn.onclick = () => {
    popup.classList.add("hidden");
};

// --- START RECORDING ---
startBtn.onclick = async () => {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    chunks = [];
    mediaRecorder.ondataavailable = e => chunks.push(e.data);

    mediaRecorder.onstop = uploadAdmin;

    mediaRecorder.start();

    startCountdown(10);
};

// --- COUNTDOWN ---
function startCountdown(seconds) {
    let time = seconds;

    let interval = setInterval(() => {
        timerElement.innerText = time;
        time--;

        if (time < 0) {
            clearInterval(interval);
            mediaRecorder.stop();
            popup.classList.add("hidden");
            mainUI.classList.remove("hidden");
        }
    }, 1000);
}

// --- UPLOAD AUDIO TO BACKEND ---
async function uploadAdmin() {
    const blob = new Blob(chunks, { type: "audio/webm" });

    let formData = new FormData();
    formData.append("file", blob, "admin.webm");

    await fetch("http://127.0.0.1:8000/reset", {
        method: "POST",
        body: formData
    });

    alert("Admin voice saved (demo only).");
}

// --- DEVICE COMMANDS ---
function toggleBulb() {
    let card = document.getElementById("bulbCard");
    card.style.border = card.style.border ? "" : "3px solid yellow";
}

function toggleFan() {
    let card = document.getElementById("fanCard");
    card.style.border = card.style.border ? "" : "3px solid cyan";
}

function startDiwali() {
    document.body.classList.add("diwaliGlow");
}

function stopDiwali() {
    document.body.classList.remove("diwaliGlow");
}

// --- RESET SYSTEM ---
document.getElementById("resetBtn").onclick = async () => {
    await fetch("http://127.0.0.1:8000/reset", { method: "POST" });
    location.reload();
};
