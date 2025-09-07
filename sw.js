// Minimal service worker for PWA installability and fast first-load
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  // passthrough; can add caching later
});
