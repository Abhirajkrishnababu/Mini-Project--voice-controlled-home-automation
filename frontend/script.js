/* GLOBAL SETUP */

let mediaRecorder;
let chunks = [];

const popup = document.getElementById("popup");
const mainUI = document.getElementById("mainUI");
const timerElement = document.getElementById("timer");

const BACKEND_URL = "https://voice-demo-backend.onrender.com";

/* START RECORDING */

document.getElementById("startRecordBtn").onclick = async () => {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    chunks = [];
    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = uploadAudio;

    mediaRecorder.start();
    startCountdown(10);
};

document.getElementById("cancelPopup").onclick = () => {
    popup.classList.add("hidden");
};

function startCountdown(sec) {
    let time = sec;

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

/* UPLOAD RECORDED AUDIO */

async function uploadAudio() {
    const blob = new Blob(chunks, { type: "audio/webm" });

    let formData = new FormData();
    formData.append("file", blob);

    await fetch(`${BACKEND_URL}/upload-admin`, {
        method: "POST",
        body: formData
    });

    alert("Admin audio saved!");
}

/* DEVICE CONTROL */

function toggleBulb() {
    let card = document.getElementById("bulbCard");
    card.style.border = card.style.border ? "" : "3px solid yellow";
}

function toggleFan() {
    let card = document.getElementById("fanCard");
    card.style.border = card.style.border ? "" : "3px solid cyan";
}

/* DIWALI MODE */

function startDiwali() {
    document.body.classList.add("diwaliGlow");
}

function stopDiwali() {
    document.body.classList.remove("diwaliGlow");
}

/* RESET */

document.getElementById("resetBtn").onclick = async () => {
    await fetch(`${BACKEND_URL}/reset`, { method: "POST" });
    location.reload();
};

/* ========================================
       VOICE COMMAND ENGINE
======================================== */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognizer = new SpeechRecognition();

recognizer.lang = "en-IN";
recognizer.continuous = false;

document.getElementById("voiceCommandBtn").onclick = () => {
    recognizedText.innerText = "Listening...";
    recognizer.start();
};

recognizer.onresult = (event) => {
    let text = event.results[0][0].transcript.toLowerCase();
    recognizedText.innerText = "You said: " + text;
    runCommand(text);
};

function runCommand(cmd) {

    if (cmd.includes("turn on light")) return toggleBulbOn();
    if (cmd.includes("turn off light")) return toggleBulbOff();

    if (cmd.includes("turn on fan")) return toggleFanOn();
    if (cmd.includes("turn off fan")) return toggleFanOff();

    if (cmd.includes("happy diwali")) return startDiwali();
    if (cmd.includes("stop diwali")) return stopDiwali();

    if (cmd.includes("reset")) return document.getElementById("resetBtn").click();

    recognizedText.innerText = "Command not recognized.";
}

/* Shortcuts */

function toggleBulbOn() {
    document.getElementById("bulbCard").style.border = "3px solid yellow";
}
function toggleBulbOff() {
    document.getElementById("bulbCard").style.border = "";
}

function toggleFanOn() {
    document.getElementById("fanCard").style.border = "3px solid cyan";
}
function toggleFanOff() {
    document.getElementById("fanCard").style.border = "";
}
