// Settings helpers
function getSettings() {
  try {
    return JSON.parse(localStorage.getItem("quantcam-settings")) || {};
  } catch {
    return {};
  }
}

function saveSettings(s) {
  localStorage.setItem("quantcam-settings", JSON.stringify(s));
}

// Badge duration helper
function badgeMs() {
  const v = getSettings().badge;
  if (v === "1.5") return 1500;       // quick option
  if (v === "15") return 15000;       // medium
  if (v === "30") return 30000;       // long
  return null;                        // hold until dismissed
}

// Show ingest badge
function showBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;
  badge.classList.remove("hidden");

  const ms = badgeMs();
  if (ms) {
    setTimeout(() => badge.classList.add("hidden"), ms);
  }
}

// Init camera (unchanged)
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById("view");
    if (video) {
      video.srcObject = stream;
      await video.play();
    }
  } catch (err) {
    console.error("Camera failed:", err);
    document.getElementById("status").textContent =
      "Camera failed: " + err.name + " — " + err.message;
  }
}

// Handle settings form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settings-form");
  if (form) {
    const s = getSettings();
    if (s.theme) form.theme.value = s.theme;
    if (s.badge) form.badge.value = s.badge;
    if (s.preview === "on") form.preview.checked = true;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const settings = {
        theme: form.theme.value,
        badge: form.badge.value,
        preview: form.preview.checked ? "on" : "off",
      };
      saveSettings(settings);
      alert("Settings saved.");
    });
  }

  initCamera();
});
