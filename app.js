// Elements
const v = document.getElementById('v');
const badge = document.getElementById('badge');
const statusEl = document.getElementById('status');
const flipBtn = document.getElementById('flip');
const shutterBtn = document.getElementById('shutter');
const picker = document.getElementById('picker');
const previewEl = document.getElementById('preview');

// State
let facing = 'environment';
let stream = null;
let badgeTimer = null;

// ---- Settings storage (single object)
function getSettings() {
  try { return JSON.parse(localStorage.getItem('quantcam-settings')) || {}; }
  catch { return {}; }
}
function saveSettings(s) {
  localStorage.setItem('quantcam-settings', JSON.stringify(s));
}

// Badge duration helper
function badgeMs() {
  const v = getSettings().badge;
  if (v === '1.5') return 1500;     // quick
  if (v === '15')  return 15000;    // medium
  if (v === '30')  return 30000;    // long
  return null;                      // hold
}

// ---- Camera
async function openCamera() {
  statusEl.textContent = 'Requesting camera…';
  try {
    if (stream) stopCamera(); // prevent NotReadableError on flip
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facing } },
      audio: false
    });
    v.srcObject = stream;
    statusEl.textContent = 'Camera ready';
  } catch (err) {
    statusEl.textContent = `Camera failed: ${err.name} — ${err.message || 'Could not start video source'}`;
    console.error(err);
  }
}
function stopCamera(){ try{ stream?.getTracks().forEach(t=>t.stop()); }catch{} stream=null; v.srcObject=null; }

// ---- UI actions
flipBtn.addEventListener('click', async () => {
  facing = (facing === 'environment') ? 'user' : 'environment';
  await openCamera();
});

shutterBtn.addEventListener('click', () => captureFromVideo());

picker.addEventListener('change', async () => {
  if (picker.files && picker.files[0]) {
    const url = URL.createObjectURL(picker.files[0]);
    await showPreview(url);
    URL.revokeObjectURL(url);
    showBadge();
    picker.value = '';
  }
});

// ---- Capture + preview
function captureFromVideo() {
  const w = v.videoWidth || 1280;
  const h = v.videoHeight || 720;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(v, 0, 0, w, h);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  showPreview(dataUrl);
  showBadge();
}

async function showPreview(src) {
  const s = getSettings();
  const on = (s.preview ?? 'on') === 'on';
  if (!on) { hidePreview(); return; }
  previewEl.src = src;
  previewEl.classList.remove('hidden');
}
function hidePreview(){ previewEl.classList.add('hidden'); }
previewEl?.addEventListener('click', hidePreview);

// ---- Badge control
function showBadge() {
  badge.classList.remove('hidden');
  clearTimeout(badgeTimer);
  const ms = badgeMs();
  if (ms) badgeTimer = setTimeout(() => badge.classList.add('hidden'), ms);
}
badge.addEventListener('click', () => { clearTimeout(badgeTimer); badge.classList.add('hidden'); });

// ---- Boot
openCamera();
