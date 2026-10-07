# Senegambia Way Frontend Audit — 2026-10-07

## Reference sources audited

1. The captured rendered frontend at `lagoslife_snapshot/rendered.html`.
2. The captured visible-text list at `lagoslife_snapshot/visible-text.txt`.
3. The current public Lagos Life landing/game shell at https://lagoslife.app/ .
4. The network capture, especially the map/game endpoints recorded in `game-network-important.json`.

## Critical finding

The repository did **not** contain editable frontend source code. It contained a rendered HTML capture plus network/reference artifacts. Therefore there was no existing React/Next.js component tree, stylesheet source, or game-world source code available to patch.

The frontend implementation below is consequently a clean-room reconstruction of the observed visual shell, not a source-code extraction.

## Visual reference measurements

| Area | Reference |
|---|---|
| Viewport | Full viewport / 100dvh |
| World background | `#5fb6e6` |
| Header | Centered pill, max-width 48rem, 48px high on mobile / 52-ish desktop |
| Header radius | Fully rounded |
| Header horizontal padding | 12px left, 4px right |
| Brand font | Fredoka |
| UI/body font | Plus Jakarta Sans |
| Main green | `#22b573` |
| Deep green | `#0f8a4f` |
| Ink | `#16203c` |
| Header stats | 13px, semibold, tabular numerals |
| Map tags | 34px circular/pill icon surface, 11px semibold labels on hover/focus |
| Bottom card | max-width 28rem, 26px radius, 12px padding |
| Primary action | 56px high, 16px radius |
| Cookie dialog | left anchored on desktop, near-bottom overlay; 22px radius |
| Mobile header stats | Separate pills below header |
| Mobile chips | Horizontal overflow row |
| Safe areas | Top/bottom inset-aware positioning |

## Discrepancies / missing source material

- No source-level frontend existed to audit against the reference.
- The original Three.js map art was not present as editable source/assets.
- Original fonts were loaded as Next.js generated font files and were not present in the repository.
- Original backend/auth/game API was captured but not implemented locally.
- Original player avatar SVGs were rendered inline in the capture but not available as a reusable component library.
- Original responsive behavior beyond captured DOM/class rules cannot be guaranteed without the original source or a visual regression harness.

## Implementation decisions

- Rebuild the frontend as React + Vite for a portable GitHub/Codespaces workflow.
- Keep the visual shell structurally equivalent: full-screen world, floating place tags, safe-area header, chip row, weekly status pill, lower action card and cookie dialog.
- Keep map marker geometry from the captured 1440x1000 coordinate space, converted to percentages for responsive scaling.
- Replace Nigerian labels with Gambian-localized equivalents from `senegambia-world-localization.json`.
- Recreate the map artwork as original SVG rather than copying proprietary raster/3D assets.
- Keep backend calls out of this first visual pass so the UI can be locked before API integration.

## Verification target

The next QA pass should compare desktop and mobile screenshots from the live preview at:
- 1440x1000
- 1366x768
- 1024x768
- 768x1024
- 430x932
- 390x844
- 360x800

The visual lock should happen before implementing the game systems behind the shell.
