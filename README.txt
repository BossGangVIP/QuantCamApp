QuantCam — Icon & Manifest Update

Files included:
- manifest.json  (points to /icons/quantcam-192.png and /icons/quantcam-512.png)
- favicon.ico     (fallback favicon for desktop/tab/install surfaces)
- index_head_example.html (reference: copy the <head> tags into your index.html if missing)

How to apply:
1) Upload manifest.json to your repo root, replacing the old file.
2) Upload favicon.ico to repo root.
3) Ensure these already exist (you said they do):
   /icons/quantcam-192.png
   /icons/quantcam-512.png
4) In index.html, in the <head>, confirm these lines exist:
   <link rel="manifest" href="/manifest.json">
   <link rel="icon" type="image/png" sizes="192x192" href="/icons/quantcam-192.png">
   <link rel="icon" type="image/png" sizes="512x512" href="/icons/quantcam-512.png">
   <link rel="shortcut icon" href="/favicon.ico">
   <link rel="apple-touch-icon" sizes="180x180" href="/icons/quantcam-192.png">
5) Commit to main, wait ~30 seconds, then hard-refresh on phone:
   • Chrome menu → Clear browsing data → Cached images/files (last hour).
   • Or open chrome://app-service-internals, find QuantCam → Uninstall + Clear data.
6) Visit your site, tap “Install app” / “Add to Home screen”.

Notes:
- Android Chrome accepts PNG favicons; the ICO here is just a universal fallback.
- If the A2HS prompt still doesn’t appear, make sure you access the site at least twice
  with a short delay between visits, and that service worker (sw.js) registers without errors.
