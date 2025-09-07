
const v = document.getElementById('v');
const c = document.getElementById('c');
const statusEl = document.getElementById('status');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
const LS = localStorage;

let stream;
let facing = LS.getItem('qc_facing') || 'environment';

function ok(msg){ statusEl.textContent = msg; }
function err(e){ statusEl.textContent = 'Error: ' + (e.name||'') + ' ' + (e.message||''); }

async function openCam(){
  try{
    stream && stream.getTracks().forEach(t=>t.stop());
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing } });
    v.srcObject = stream;
    ok('Camera opened ('+facing+').');
  }catch(e){ err(e); }
}

function showToast(text){
  toastMsg.textContent = text || 'Captured';
  toast.classList.add('ok');
  toast.style.display = 'flex';
  const mode = LS.getItem('qc_toast') || '1500';
  if(mode !== 'sticky'){
    setTimeout(()=> toast.style.display='none', parseInt(mode,10));
  } else {
    toast.addEventListener('click', ()=> toast.style.display='none', { once:true });
  }
}

async function shutter(){
  try{
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    const w = settings.width || v.videoWidth;
    const h = settings.height || v.videoHeight;
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.drawImage(v, 0, 0, w, h);
    await new Promise(r=>setTimeout(r, 300)); // simulate processing
    showToast('Captured ✓');
    if((LS.getItem('qc_preview')||'1')==='1'){
      let img = document.getElementById('preview');
      if(!img){
        img = document.createElement('img');
        img.id='preview';
        img.style.cssText='width:100%;max-height:40vh;margin:8px;border:1px solid #334;border-radius:12px';
        v.parentNode.appendChild(img);
      }
      img.src = c.toDataURL('image/jpeg', 0.9);
    }
  }catch(e){ err(e); }
}

document.getElementById('flip').addEventListener('click', async()=>{
  facing = (facing==='user') ? 'environment' : 'user';
  LS.setItem('qc_facing', facing);
  await openCam();
});
document.getElementById('shutter').addEventListener('click', shutter);

document.getElementById('upload').addEventListener('click', ()=>{
  const input = document.createElement('input');
  input.type='file'; input.accept='image/*';
  input.onchange = async (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const img = new Image();
    img.onload = async ()=>{
      c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img,0,0);
      await new Promise(r=>setTimeout(r, 300));
      showToast('Uploaded ✓');
      if((LS.getItem('qc_preview')||'1')==='1'){
        let p = document.getElementById('preview');
        if(!p){
          p = document.createElement('img'); p.id='preview';
          p.style.cssText='width:100%;max-height:40vh;margin:8px;border:1px solid #334;border-radius:12px';
          v.parentNode.appendChild(p);
        }
        p.src = c.toDataURL('image/jpeg', 0.9);
      }
    };
    img.src = URL.createObjectURL(file);
  };
  input.click();
});

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js').catch(console.warn);
}

openCam();
