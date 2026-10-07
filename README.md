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


## README Update — Feature 002: Gambian Flag Identity + Map Navigation Layer

**Date:** 2026-10-07

### Implemented
- Switched the primary visual accent system from a generic green identity to The Gambia flag palette: red, blue, green and white.
- Added a restrained three-color flag line to the header and reused the national blue for secondary/status accents.
- Replaced the crown-style mark with a custom map-pin / river emblem using the Gambian flag bands.
- Updated the favicon and browser theme color to match the new identity.
- Made the location popover actionable with a **Center** control that zooms the selected location into view.
- Made the Government, Coastal Plots and 400 homes chips navigate to representative Gambian locations instead of only showing a toast.
- Reworked the signup/login experience with name/email/password fields, clearer account-state handling, and a forgot-password action.
- Added error, focus and action styling for the revised auth flow.

### Architectural impact
The visual identity is now tokenized around `--flag-red`, `--flag-blue`, `--flag-green` and `--flag-white`, while the existing `--leaf` tokens remain as compatibility aliases for components already built around the original shell.

Map navigation now has a reusable `focusPlace()` camera path, so future cards, search results and directory entries can focus any place without adding a second map-navigation implementation.

### Deployment
- GitHub repository visibility changed from private to **public**.
- GitHub Pages was enabled with the existing GitHub Actions workflow.
- Primary site: https://squashberry.github.io/Senegambia-Way/
- The previous Render deployment is no longer the primary hosting target.

### Next build focus
Continue the missing product layer: richer place details, real navigation/search, persistent account integration, and full visual QA across desktop, tablet and narrow mobile breakpoints.


## README Update — Feature 003: Reference-Informed Auth + Local Session

**Date:** 2026-10-07

### Implemented
- Reworked the auth experience into a dedicated Senegambia Way account screen.
- Added username-or-email sign-in and account creation with a local demo session while the real backend is still pending.
- Temporarily accepts arbitrary credentials for sign-in testing; no server verification is performed yet.
- Added a persistent local session so the signed-in state survives a refresh on the same device.
- Added a place finder overlay with keyboard `/` shortcut, live filtering, and camera focus for matching locations.
- Added online/offline detection with a non-blocking offline banner.
- Added a short loading/splash layer that protects the first paint while the world initializes.
- Persisted the cookie-choice interaction locally instead of closing it only for the current render.
- Converted placeholder social actions into useful share/copy behaviors.
- Added a custom GitHub Pages `404.html` with a direct return link.

### Architectural impact
The account state now follows:
`world → discovery/navigation overlays → auth → signed-in session → onboarding → game world`.

A real account service can later replace local session storage without changing the world-map interaction API.

## README Update — Feature 004: Auth Flow Repair + GitHub Pages Base Path

**Date:** 2026-10-07

### Implemented
- Rebuilt the auth styling as a fully scoped component system instead of relying on generic panel styling.
- Added explicit field styling, button states, account tabs, brand header, flag stripe, recovery link and mobile bottom-sheet behavior.
- Removed the temporary guest-preview URL and state from the product flow.
- Changed the GitHub Pages Vite base to the explicit project path `/Senegambia-Way/` so generated asset URLs remain deterministic.

## README Update — Feature 005: Gambian Sim Onboarding

**Date:** 2026-10-07

### Implemented
- Added a real first-run onboarding experience immediately after a successful sign-in or sign-up.
- Added five steps: Meet your Sim, Tell your story, Choose a trait, Pick your start, Ready.
- Character setup includes shape, height, skin tone, hair and first-day style.
- Story setup includes nickname and a short public bio.
- Trait choices include Resourceful, Social, Driven, Chill, Bold and Creative.
- Starting neighbourhoods include Serrekunda, Bakau, Fajara and Brikama.
- Added progress indicators, Back/Continue controls, responsive mobile presentation and a completion state.
- Persisted the completed Sim profile locally with the signed-in session.
- Replaced signed-out buttons after login with an explicit signed-in identity chip and My Sim entry point, so the app no longer looks like the user is still behind authentication.

### Product alignment
The flow follows the current reference game's documented first-start sequence: design the character's shape, height and look; add a line or two about who they are; pick a trait; then choose a place to start. The sequence is localized into a Gambian setting for Senegambia Way.

### Next build focus
Continue the simulator layer after onboarding: needs, time, money, homes, careers, travel, shared places and profile settings.


## README Update — Feature 006: Sequential 12-step Account-to-Sim Flow

**Date:** 2026-10-07

### Implemented
- Fixed the temporary-session bug that allowed an old local demo session to skip authentication.
- Versioned the temporary local session so pre-existing demo storage is ignored and a fresh browser session begins with the account screen.
- Authentication now completes before onboarding opens.
- Rebuilt onboarding as a sequential **12-screen** flow instead of one large form.
- Step 1 uses the reference-style format: **1/12 — Your name** / **What is your full/public name?**
- The remaining screens break the character setup into single decisions: shape, height, skin tone, hair, outfit, fabric, two traits, lifetime dream, birth lottery, and home.
- Added a birth-lottery reveal rather than letting the player directly choose the starting background.
- Added Gambian starting homes: Serrekunda, Bakau, Fajara and Brikama.
- Added Back/Continue controls, progress bar, mobile bottom-sheet behavior and a final Enter Senegambia action.
- Saved Sim data is restored only from the current versioned session, not the previous demo storage.

### Reference alignment
The current Lagos Life flow is documented as account creation followed by Sim creation with **Look → Personality → Dream → Birth lottery → Home**; the sequential Gambian flow decomposes those categories into one decision per screen while preserving that order.

Reference: https://lagoslifeguide.com/beginner-guide/

### Next build focus
Continue with the actual simulation layer after the player enters Senegambia: needs, time, money, careers, homes, travel, relationships and profile/settings.


## README Update — Feature 007: Post-onboarding Game HUD

**Date:** 2026-10-07

### Implemented
- Added a dedicated gameplay layer that appears only after the 12-step Sim setup is completed.
- Matched the captured gameplay structure: compact top status bar, contextual world/action panel and a three-item **Home / Map / Phone** dock.
- Added simulated in-game status information: day/time, mood, online population and Gambian Dalasi balance.
- Added Home gameplay controls for energy, hunger and happiness, plus starter actions for work, food, rest and going outside.
- Added a Dream card tied to the player's onboarding choice.
- Added an Explore/Map context panel while preserving the existing interactive world map and place search.
- Added a Phone panel for messages, people and profile entry points.
- Added responsive mobile behavior with the HUD compressed into thumb-friendly floating cards and a bottom navigation dock.
- Kept the signed-out landing experience separate so the main marketing/map shell does not turn into the game HUD before onboarding is finished.

### Reference alignment
The captured gameplay structure uses a compact top bar with time, mood, online count and money, a world/activity area, and Home/Map/Phone navigation. The Senegambia version preserves that information architecture while replacing Lagos-specific content with Gambian locations, Dalasi and the player's selected neighbourhood.

### Next build focus
Replace the simulated starter actions with the real life-sim systems: jobs and shifts, money transactions, needs/time progression, homes, movement/travel, social interactions, messages and persistent multiplayer state.
