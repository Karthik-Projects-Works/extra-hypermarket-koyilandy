# Extra Hypermarket — Agent Guide

## What this is
Vanilla JS single-page site for Extra Hypermarket (Koyilandy, Kerala). No framework — plain HTML + CSS + JS with Vite bundler.

## Quick commands
```
npm run dev      # Vite dev server on :5173
npm run build    # Production build to dist/
npm run preview  # Preview production build
```
No linter, formatter, typecheck, or test suite configured.

## Architecture
- **Entry**: `index.html` → `src/main.js` (ES module, `type: "module"`)
- **Scroll system**: Lenis smooth scroll + GSAP ScrollTrigger. Single RAF ticker in `main.js` — do not add another `requestAnimationFrame` loop.
- **Cinematic scroll**: 240 PNG frames (`src/images/ezgif-frame-001.png` through `ezgif-frame-240.png`) rendered to a fixed `<canvas>`. Scroll position (0–1) maps to frame index. Scroll height is `2400vh` (10vh per frame).
- **CSS**: Two files only — `src/styles/main.css` (tokens, nav, glass, cursor, buttons, hamburger, skip-link) and `src/styles/sections.css` (all section layouts). Loaded via `<link>` in HTML. No Tailwind at runtime.
- **Audio**: `src/audio/soundManager.js` — Web Audio API synthesizer. Ambient drone, SFX, wind/highway noise. Phase-aware via `updateAmbience(progress)`.
- **Preloader**: Fullscreen video (`src/logo/Extra_HYPER_MARKET_logo_loading.mp4`) with real-time chroma keying. 9.5s minimum display. Solid white background.
- **Fonts**: Google Fonts loaded via `<link>` with `preconnect` in HTML `<head>` (not CSS `@import`).
- **Accessibility**: Skip-to-content link, `:focus-visible` styles, ARIA on sound toggle, `aria-label` on star ratings, `sandbox` on Google Maps iframe.

## Critical constraints
- **Brand**: Logo is `src/logo/logoextra.png`. Colors: red primary (`#D32F2F`), green accent (`#4CAF50`), black text. Dark green forest backgrounds — never black.
- **Performance**: DPR capped at 2 in `framePlayer.js`. Canvas uses `desynchronized: true` context. Passive event listeners on resize/mousemove. `will-change: transform` on scroll container and canvas. `contain: layout style paint` on stage content.
- **Scroll fragility**: The scroll timeline is tightly coupled to exact scroll heights and ScrollTrigger start/end percentages. Changing `min-height` in `sections.css` or phase boundaries in `main.js` will break narration timing and frame mapping.
- **No duplicate RAF**: Lenis is driven by GSAP's ticker (`gsap.ticker.add`). Do not call `lenis.raf()` separately or add independent animation loops.

## File map
```
src/
  main.js              — All scroll, cursor, sound, reveal logic
  sequence/framePlayer.js — 240-frame canvas player (single class export)
  styles/main.css      — Design tokens, nav, glass, cursor, buttons, hamburger, skip-link
  styles/sections.css  — All section layouts, scroll height, phase triggers
  audio/               — Web Audio synthesizer
  images/              — 240 PNG frames (ezgif-frame-001..240.png)
  logo/                — Brand assets (logoextra.png, loading video)
```
