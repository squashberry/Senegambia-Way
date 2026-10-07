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


## README Update — Feature 001: Interactive World Map

**Date:** 2026-10-07

### Implemented
- Added a real interactive map interaction surface around the existing visual world.
- Added single-pointer drag/pan for mouse, touch and pen input.
- Added wheel zoom, double-click zoom, keyboard zoom/reset, and two-pointer pinch zoom.
- Added zoom anchoring so the point under the cursor/fingers stays visually stable while zooming.
- Added bounded panning with a small overscroll allowance.
- Kept location markers inside the same transformed map scene so markers move and scale with the world rather than floating independently.
- Prevented map gestures from hijacking marker buttons by stopping marker pointer-down propagation.
- Added a subtle interaction hint and contextual Reset control that only appears after zooming.
- Added accessibility semantics to the map application surface.

### Files
- `frontend/src/main.jsx` — map state, pointer handling, pinch/zoom math, keyboard controls, transformed scene and marker interaction.
- `frontend/src/styles.css` — touch-action, drag cursor states, transformed map scene and map interaction hint styles.

### Architectural impact
The world is now modeled as a single transformable scene:
`map interaction → map scene → world artwork + location markers`.
Fixed UI layers (header, status chips, bottom actions, cookies and dialogs) remain outside that scene so gameplay navigation can evolve without breaking the HUD layout.

### Deployment
- GitHub Actions build passed for the frontend artifact.
- GitHub Pages deployment is not enabled for this private repository, so the Pages deploy step returns HTTP 404.
- A Render Static Site was created from the same GitHub repository with auto-deploy enabled:
  `https://senegambia-way-frontend.onrender.com`

### Next visual QA
Validate the interactive world at 1440×1000, 1366×768, 1024×768, 768×1024, 430×932, 390×844 and 360×800, then tune camera framing, marker density and map artwork against the captured reference.
