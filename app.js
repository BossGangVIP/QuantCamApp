let video = null;
let stream = null;
let previewContainer = null;
let previewImage = null;

async function initCamera() {
  video = document.getElementById("camera");
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error("Camera failed:", err);
    document.getElementById("status").textContent = "Camera failed: " + err.name;
  }
}

function takePhoto() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const dataUrl = canvas.toDataURL("image/png");

  // show preview
  showPreview(dataUrl);

  // flash badge
  showBadge("Ingested ✔");

  return dataUrl;
}

function showPreview(dataUrl) {
  if (!previewContainer) {
    previewContainer = document.createElement("div");
    previewContainer.id = "photo-preview";
    previewImage = document.createElement("img");
    previewImage.id = "preview-img";
    previewContainer.appendChild(previewImage);
    document.body.appendChild(previewContainer);

    previewContainer.addEventListener("click", () => {
      previewContainer.style.display = "none";
    });
  }

  previewImage.src = dataUrl;
  previewContainer.style.display = "flex";
}

function flipCamera() {
  if (!stream) return;
  const track = stream.getVideoTracks()[0];
  const current = track.getSettings().facingMode;
  const newMode = current === "user" ? { facingMode: "environment" } : { facingMode: "user" };

  track.stop();
  navigator.mediaDevices.getUserMedia({ video: newMode }).then(newStream => {
    video.srcObject = newStream;
    stream = newStream;
  });
}

function showBadge(text) {
  const badge = document.getElementById("ingest-badge");
  badge.textContent = text;
  badge.style.display = "inline-block";

  // default duration from settings
  let duration = localStorage.getItem("badgeDuration") || "1500";
  if (duration === "dismiss") return;

  setTimeout(() => {
    badge.style.display = "none";
  }, parseInt(duration));
}

function openGallery() {
  alert("Gallery feature not implemented yet.");
}

window.onload = initCamera;
