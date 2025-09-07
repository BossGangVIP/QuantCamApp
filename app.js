let stream;
let facingMode = 'environment';

const statusEl = document.getElementById('status');
const videoEl = document.getElementById('view');
const canvasEl = document.getElementById('canvas');
const flipBtn = document.getElementById('flip');
const shutterBtn = document.getElementById('shutter');
const picker = document.getElementById('picker');
const badge = document.getElementById('badge');
const LS = localStorage;

function applyTheme(){
  const pref = LS.getItem('theme') || 'auto';
  if (pref === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme = pref;
}
applyTheme();

function showBadge(txt){
  const ms = Number(LS.getItem('badgeDuration') || '1500');
  badge.textContent = txt || 'Ingested ✓';
  badge.classList.remove('hidden');
  if(ms > 0){ setTimeout(()=>badge.classList.add('hidden'), ms); }
  else { badge.onclick = ()=> badge.classList.add('hidden'); }
}

async function openCamera(){
  try{
    if (stream) stream.getTracks().forEach(t=>t.stop());
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false });
    videoEl.srcObject = stream;
    statusEl.textContent = 'Camera ready.';
  }catch(e){
    statusEl.textContent = 'Camera failed: ' + (e.name || '') + (e.message ? ' – ' + e.message : '');
  }
}

async function captureFromVideo(){
  if(!videoEl.videoWidth){ showBadge('Not ready'); return; }
  canvasEl.width = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;
  const ctx = canvasEl.getContext('2d');
  ctx.drawImage(videoEl, 0, 0);
  const blob = await new Promise(res => canvasEl.toBlob(res, 'image/jpeg', 0.9));
  // TODO: hook your ingest pipeline here; current version does local-only simulate
  await new Promise(r => setTimeout(r, 250));
  if((LS.getItem('showPreview')||'1')==='1'){
    let prev = document.getElementById('preview');
    if(!prev){
      prev = document.createElement('img'); prev.id='preview';
      prev.style.cssText='width:100%;max-height:40vh;margin:8px;border:1px solid #22314d;border-radius:12px';
      videoEl.parentNode.appendChild(prev);
    }
    prev.src = URL.createObjectURL(blob);
    setTimeout(()=> URL.revokeObjectURL(prev.src), 4000);
  }
  showBadge('Ingested ✓');
}

picker?.addEventListener('change', async (e)=>{
  const file = e.target.files?.[0];
  if(!file) return;
  // Simulate ingest for uploaded screenshot/photo
  if((LS.getItem('showPreview')||'1')==='1'){
    const reader = new FileReader();
    reader.onload = ()=>{
      let prev = document.getElementById('preview');
      if(!prev){
        prev = document.createElement('img'); prev.id='preview';
        prev.style.cssText='width:100%;max-height:40vh;margin:8px;border:1px solid #22314d;border-radius:12px';
        videoEl.parentNode.appendChild(prev);
      }
      prev.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  await new Promise(r=>setTimeout(r, 250));
  showBadge('Ingested ✓');
  e.target.value='';
});

flipBtn?.addEventListener('click', async ()=>{
  facingMode = (facingMode === 'environment') ? 'user' : 'environment';
  await openCamera();
});

shutterBtn?.addEventListener('click', captureFromVideo);

if (navigator.mediaDevices?.getUserMedia) openCamera();
else statusEl.textContent = 'getUserMedia not supported.';