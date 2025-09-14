const els = {
  video: document.getElementById('camera'),
  status: document.getElementById('status'),
  badge: document.getElementById('badge'),
  flip: document.getElementById('flip-btn'),
  cap: document.getElementById('capture-btn'),
  gal: document.getElementById('gallery-btn'),
  preview: document.getElementById('preview'),
  previewImg: document.getElementById('preview-img'),
  previewClose: document.getElementById('preview-close')
};
let stream=null, usingBack=true;
let settings = { badgeMs:1500, previewOn:true };
function loadSettings(){
  try{
    const s = JSON.parse(localStorage.getItem('qc_settings')||'{}');
    settings = { badgeMs: s.badgeMs ?? 1500, previewOn: s.previewOn ?? true };
  }catch(e){}
}
loadSettings();
async function startCamera(){
  try{
    if(stream){ stream.getTracks().forEach(t=>t.stop()); }
    const constraints = { video: { facingMode: usingBack ? {ideal:'environment'} : 'user' }, audio: false };
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    els.video.srcObject = stream;
    setStatus('Camera ready');
  }catch(err){
    console.error(err);
    setStatus('Camera failed: '+ (err.name||'Error'));
  }
}
function setStatus(text){ if(els.status) els.status.textContent = text; }
function showBadge(){
  els.badge.style.display='block';
  if(settings.badgeMs >= 0){
    setTimeout(()=>{ els.badge.style.display='none'; }, settings.badgeMs);
  }else{
    els.badge.onclick = ()=> els.badge.style.display='none';
  }
}
els.flip?.addEventListener('click', ()=>{ usingBack=!usingBack; startCamera(); });
els.cap?.addEventListener('click', async ()=>{
  if(!stream) return;
  const track = stream.getVideoTracks()[0];
  const img = new ImageCapture(track);
  try{
    const blob = await img.takePhoto();
    if(settings.previewOn){
      els.previewImg.src = URL.createObjectURL(blob);
      els.preview.hidden = false;
    }
    showBadge();
  }catch(e){ console.error(e); }
});
els.previewClose?.addEventListener('click', ()=>{
  els.preview.hidden = true;
  if(els.previewImg.src) URL.revokeObjectURL(els.previewImg.src);
});
if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js'); }
startCamera();
