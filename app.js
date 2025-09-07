/* QuantCam minimal controller */
let stream = null;
let currentFacing = "environment"; // or "user"

const v = document.getElementById("v");
const flipBtn = document.getElementById("flip");
const shutterBtn = document.getElementById("shutter");
const picker = document.getElementById("picker");
const badge = document.getElementById("badge");
const statusEl = document.getElementById("status");
const canvas = document.getElementById("canvas");

function setStatus(t){ if(statusEl) statusEl.textContent = t; }

function stopStream() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
}

async function openCam(facing = currentFacing) {
  try {
    setStatus("Requesting camera…");
    stopStream();                              // <-- critical fix
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facing }, audio: false
    });
    if (!v) throw new Error("video element missing");
    v.srcObject = stream;
    currentFacing = facing;
    setStatus("Camera ready.");
  } catch (err) {
    stopStream();
    setStatus(`Camera failed: ${err.name} — ${err.message || "Could not start video source"}`);
  }
}

flipBtn?.addEventListener("click", () => {
  openCam(currentFacing === "user" ? "environment" : "user");
});

shutterBtn?.addEventListener("click", () => {
  if (!v) return;
  const w = v.videoWidth || 1280, h = v.videoHeight || 720;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(v, 0, 0, w, h);
  // ingest simulation
  badge?.classList.remove("hidden");
  setTimeout(() => badge?.classList.add("hidden"), 1500);
});

picker?.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width; canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);
    badge?.classList.remove("hidden");
    setTimeout(() => badge?.classList.add("hidden"), 1500);
  };
  img.src = URL.createObjectURL(file);
});

window.addEventListener("pageshow", () => openCam(currentFacing));
window.addEventListener("pagehide", stopStream);
