self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open('qc-v1').then(cache=>cache.addAll([
    './','./index.html','./styles.css','./app.js','./settings.html','./manifest.webmanifest'
  ])));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
