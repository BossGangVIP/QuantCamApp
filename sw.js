const CACHE='qc-v1';
const ASSETS=['./','./index.html','./settings.html','./styles.css','./app.js','./manifest.json',
'./icons/quantcam-192.png','./icons/quantcam-512.png','./icons/capture.png','./icons/flip.png','./icons/folder.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)))});
