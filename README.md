# QuantCam — PWA Package

## What’s included
- Camera-first UI with bottom toolbar (Flip / Shutter / Upload / Settings)
- Front/rear switching
- Screenshot upload from gallery
- Green **Ingested ✓** badge (duration set in Settings)
- Optional last-capture preview
- Light/Dark/Auto theme
- PWA installability (manifest + service worker + real icons + favicon)

## Deploy (GitHub Pages)
1. Upload all files to repo **root** (overwrite old files).
2. Settings → Pages → Build from **main / root**.
3. Visit site. Interact once. Chrome menu → **Add to Home screen**.

## Troubleshooting
- No install option: ensure `icons/icon-192.png` and `icons/icon-512.png` exist, and you visited via **HTTPS**.
- Stale UI: hard refresh, or uninstall PWA then reinstall to clear old service worker.

## Next hooks
- Replace the TODO in `app.js` (captureFromVideo) to POST the image blob to your ingest endpoint when ready.