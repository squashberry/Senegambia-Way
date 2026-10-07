# Senegambia Way

Gambian clean-room frontend reconstruction of the captured Lagos Life visual/game shell.

## Current repository state

The repository contains the original browser-capture/reference material and a new editable frontend under `frontend/`.

The frontend uses:
- React
- Vite
- responsive CSS
- an original SVG map recreation
- Gambian localization data

## Local/Codespaces preview

```bash
cd frontend
npm install
npm run dev
```

Vite listens on all interfaces so GitHub Codespaces can forward the development port to a live browser preview.

## Production preview

GitHub Actions builds `frontend/` and deploys `frontend/dist` to GitHub Pages.

## Important

The original rendered capture is retained under `lagoslife_snapshot/` as reference evidence. The new `frontend/` is new implementation code and does not depend on the original site's JavaScript chunks.
