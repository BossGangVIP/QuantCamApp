// Settings keys
const BADGE_KEY = "badgeDuration";      // "1000" | "1500" | "15000" | "30000" | "sticky"
const PREVIEW_KEY = "previewEnabled";    // "on" | "off"

if (!localStorage.getItem(BADGE_KEY)) localStorage.setItem(BADGE_KEY, "1500");
if (!localStorage.getItem(PREVIEW_KEY)) localStorage.setItem(PREVIEW_KEY, "on");

const video = document.getElementById("video");
const canvas = document.getElementById("frame");
const statusEl = document.getElementById("status");
const flipBtn = document.getElementById("flipBtn");
const shutterBtn = document.getElementById("shutterBtn");
const galleryBtn = document.getElementById("galleryBtn");
const badge = document.getElementById("ingestBadge");
const preview = document.getElementById("preview");
const previewImg = document.getElementById("previewImg");
const closePreview = document.getElementById("closePreview");

let currentStream = null;
let usingBack = true;

async function startCamera() {
  try {
    await stopCamera();
    const constraints = {
      audio: false,
      video: {
        facingMode: usingBack ? { exact: "environment" } : "user",
        width: { ideal: 1280 }, height: { ideal: 720 }
      }
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    currentStream = stream;
    video.srcObject = stream;
    statusEl.textContent = "Camera ready";
  } catch (err) {
    if (usingBack && err.name === "OverconstrainedError") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        currentStream = stream;
        video.srcObject = stream;
        statusEl.textContent = "Camera ready";
        return;
      } catch (e2) {
        statusEl.textContent = "Camera failed: " + (e2.name || "TypeError");
        return;
      }
    }
    statusEl.textContent = "Camera failed: " + (err.name || "TypeError");
  }
}

async function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(t => t.stop());
    currentStream = null;
  }
}

flipBtn.addEventListener("click", async () => {
  usingBack = !usingBack;
  await startCamera();
});

shutterBtn.addEventListener("click", () => {
  if (!currentStream) return;
  const w = video.videoWidth, h = video.videoHeight;
  if (!w || !h) return;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, w, h);

  if (localStorage.getItem(PREVIEW_KEY) !== "off") {
    previewImg.src = canvas.toDataURL("image/jpeg", 0.9);
    preview.classList.remove("hide");
  }

  showBadge();
});

closePreview.addEventListener("click", () => {
  preview.classList.add("hide");
});

galleryBtn.addEventListener("click", () => {
  // placeholder
});

function showBadge() {
  badge.style.display = "inline-flex";
  const dur = localStorage.getItem(BADGE_KEY);
  if (dur === "sticky") return;
  const ms = parseInt(dur || "1500", 10);
  clearTimeout(showBadge._t);
  showBadge._t = setTimeout(()=>{ badge.style.display = "none"; }, ms);
}

startCamera();
window.addEventListener("visibilitychange", () => {
  if (!document.hidden && !currentStream) startCamera();
});
