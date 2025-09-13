const els={
  video:document.getElementById('view'),
  status:document.getElementById('status'),
  flip:document.getElementById('flip'),
  capture:document.getElementById('capture'),
  picker:document.getElementById('picker'),
  badge:document.getElementById('badge'),
  previewWrap:document.getElementById('preview'),
  previewImg:document.getElementById('previewImg'),
  previewClose:document.getElementById('previewClose'),
};

let stream=null;
let facing='environment';

const get=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch{return d}};
const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};

function say(m){ if(els.status) els.status.textContent=m; }

async function startCamera(){
  stopCamera();
  try{
    stream=await navigator.mediaDevices.getUserMedia({
      video:{ facingMode:facing, width:{ideal:1280}, height:{ideal:720} },
      audio:false
    });
    if(els.video){ els.video.srcObject=stream; await els.video.play(); }
    say('Camera ready');
  }catch(e){
    console.warn(e);
    say(`Camera failed: ${e.name||'TypeError'}`);
  }
}

function stopCamera(){
  if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; }
}

async function flipCamera(){ facing = (facing==='environment') ? 'user' : 'environment'; await startCamera(); }

function captureFrame(){
  if(!stream||!els.video||!els.video.videoWidth) return;
  const c=document.createElement('canvas');
  c.width=els.video.videoWidth; c.height=els.video.videoHeight;
  const x=c.getContext('2d');
  x.drawImage(els.video,0,0,c.width,c.height);
  const data=c.toDataURL('image/jpeg',0.92);

  if(get('photoPreviewOn',true)){
    els.previewImg.src=data;
    els.previewWrap.classList.remove('hidden');
  }
  showBadge('Ingested ✓');
}

function showBadge(t){
  if(!els.badge) return;
  els.badge.textContent=t;
  const ms=get('badgeDurationMs',1500);
  els.badge.style.display='block';
  els.badge.style.opacity='1';
  clearTimeout(showBadge._t);
  showBadge._t=setTimeout(()=>{
    els.badge.style.opacity='0';
    setTimeout(()=>{els.badge.style.display='none'},250);
  }, ms);
}

els.picker?.addEventListener('change',e=>{
  const f=e.target.files?.[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{
    els.previewImg.src=r.result;
    els.previewWrap.classList.remove('hidden');
    showBadge('Ingested ✓');
  };
  r.readAsDataURL(f);
});

els.previewClose?.addEventListener('click',()=>els.previewWrap.classList.add('hidden'));
els.flip?.addEventListener('click',flipCamera);
els.capture?.addEventListener('click',captureFrame);

if(navigator.mediaDevices?.getUserMedia){ startCamera(); }
else { say('Camera not supported on this device/browser.'); }
