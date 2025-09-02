# QuantCamApp

QuantCam — Point • Shoot • Quant.  
Private PWA (Progressive Web App) test launcher built with Google Apps Script + GitHub Pages.

---

## 🚀 Live App
- **Installable PWA URL:** [https://bossgangvip.github.io/QuantCamApp/](https://bossgangvip.github.io/QuantCamApp/)  
- Works on **desktop and mobile**.  
- Install by opening the link in Chrome (or Edge), then using "Add to Home Screen" / "Install App."

---

## 📦 Files in This Repo
- `index.html` → App entry point (includes meta tags for mobile, links to manifest & service worker).
- `manifest.json` → PWA metadata (name, icons, theme color, start URL).
- `service-worker.js` → Offline caching & install logic.
- `/icons/` → App icons (192px + 512px for install screen).

---

## 🛠️ Development
- This repo is connected to **GitHub Pages** → builds automatically from the `main` branch.  
- Any changes pushed to `main` will re-deploy within 1–2 minutes.  

---

## 🔄 Backup & Restore
1. **Local Backup:**  
   - The full source (all files) is saved in `QuantCam_App/` on Google Drive.  
   - A `.zip` archive (`QuantCamApp-main.zip`) is included for quick restores.  

2. **GitHub Release:**  
   - [First PWA Installable Build (v0.1)](https://github.com/BossGangVIP/QuantCamApp/releases/tag/v0.1)  
   - Contains frozen snapshot of source code (`.zip` and `.tar.gz`).  

If needed, re-upload these files into a fresh repo and re-enable GitHub Pages.  

---

## 📲 Usage Notes
- **First run on mobile:** Chrome/Samsung Internet may ask "Add to Home Screen." Accept to install.  
- If Google Drive/Docs tries to hijack links on Android, disable "Open supported links" in Android settings.  
- Best performance in **Chrome** (desktop/mobile) and **Edge**.  

---

## 📌 Next Steps
- Hook into your **Google Apps Script backend** (replace `PLACEHOLDER_EXEC_URL` inside `index.html`).  
- Future versions: add authentication, API calls, database logging.  

---

👤 Owner: **BossGangVIP**  
📦 Repo: [QuantCamApp](https://github.com/BossGangVIP/QuantCamApp)
