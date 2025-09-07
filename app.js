/* QuantCam minimal app logic – unchanged behavior, plus:
   - Ingest badge shows at top for 1.5s (or until user setting overrides)
   - Preview tile respects "Show last capture" setting
*/

const els = {
  view: document.getElementById('view'),
  canvas: document.getElementById('canvas'),
  status: document.getElementById('status'),
  flip: document.getElementById('flip'),
  shutter: document.getElementById('shutter'),
  picker: document.getElementById('picker'),
  badge: document.getElementById('badge'),
};

let stream = null;
let useBack = true;
let lastBlobUrl = null;

const settings = {
  // read persisted settings if your settings.html saves them; fallback defaults:
  showPreview: JSON.parse(localStorage.getItem('qc_showPreview') ?? 'true'),
  badgeMode: localStorage.getItem('qc_badgeMode') ?? '1.5s', // '1.5s' | '15s' | '30s' | 'hold'
};

function setStatus(msg){ els.status.textContent = msg; }

async function startCamera() {
  stopCamera();
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: useBack ? 'environment' : 'user' },
      audio: false
    });
    els.view.srcObject = stream;
    setStatus('Camera ready');
  } catch (e) {
    setStatus(`Camera failed: ${e.name} — ${e.message || 'Could not start video source'}`);
  }
}

function stopCamera(){
  if(stream){
    stream.getTracks().forEach(t=>t.stop());
    stream = null;
  }
}

function flipCamera(){
  useBack = !useBack;
  startCamera();
}

function showBadge(){
  els.badge.classList.remove('hidden');
  let ms = 1500;
  if (settings.badgeMode === '15s') ms = 15000;
  else if (settings.badgeMode === '30s') ms = 30000;
  else if (settings.badgeMode === 'hold') return; // user will dismiss via settings page UI if you add it
  setTimeout(()=> els.badge.classList.add('hidden'), ms);
}

function capture(){
  if(!stream){ return; }
  const track = stream.getVideoTracks()[0];
  const settingsV = track.getSettings();
  const w = settingsV.width || 1280;
  const h = settingsV.height || 720;
  els.canvas.width = w; els.canvas.height = h;
  const ctx = els.canvas.getContext('2d');
  ctx.drawImage(els.view, 0, 0, w, h);
  els.canvas.toBlob(async (blob)=>{
    // optional: show or hide last capture preview
    if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);
    lastBlobUrl = URL.createObjectURL(blob);
    if (settings.showPreview) {
      els.view.srcObject = null;
      els.view.src = lastBlobUrl;
      els.view.play && els.view.play();
      // return to live view after short moment so UI stays camera-first
      setTimeout(()=> {
        els.view.srcObject = stream;
      }, 1200);
    }
    // “ingest” placeholder (do your processing here)
    showBadge();
  }, 'image/jpeg', 0.92);
}

function handlePick(e){
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  const url = URL.createObjectURL(file);
  if (settings.showPreview) {
    els.view.srcObject = null;
    els.view.src = url;
    els.view.play && els.view.play();
    setTimeout(()=> { els.view.srcObject = stream; }, 1200);
  }
  showBadge();
}

els.flip.addEventListener('click', flipCamera);
els.shutter.addEventListener('click', capture);
els.picker.addEventListener('change', handlePick);

window.addEventListener('pageshow', startCamera);
window.addEventListener('pagehide', stopCamera);
