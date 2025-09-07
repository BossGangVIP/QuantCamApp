const video = document.getElementById('camera');
const captureBtn = document.getElementById('capture');
const flipBtn = document.getElementById('flip');
const settingsBtn = document.getElementById('settings');
const badge = document.getElementById('badge');

let stream;
let usingFrontCamera = true;

// Start camera
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: usingFrontCamera ? 'user' : 'environment' }
    });
    video.srcObject = stream;
  } catch (err) {
    console.error("Camera error: ", err);
  }
}

captureBtn.addEventListener('click', () => {
  badge.style.display = 'block';
  setTimeout(() => badge.style.display = 'none', 1500); // 1.5 seconds
});

flipBtn.addEventListener('click', () => {
  usingFrontCamera = !usingFrontCamera;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  startCamera();
});

settingsBtn.addEventListener('click', () => {
  window.location.href = 'settings.html';
});

startCamera();