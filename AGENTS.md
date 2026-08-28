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
- **Scroll system**: Lenis smooth scroll + GSAP ScrollTrigger. Single RAF ticker in `main.js` (`gsap.ticker.add`) — do not add another `requestAnimationFrame` loop.
- **Cinematic scroll**: 240 WebP frames (`src/images/ezgif-frame-001.webp` through `ezgif-frame-240.webp`) rendered to a fixed `<canvas>`. URLs come from a static `import.meta.glob('../images/*.webp', { query: '?url', eager: true })` in `framePlayer.js` — the frames must stay `.webp` (bundle path resolution depends on it). Scroll position (0–1) maps to frame index. Scroll height is `800vh` (`#scroll-container { min-height: 800vh }` in `sections.css`). PNG originals still exist in `src/images/` but are not referenced and not bundled.
- **CSS**: Two files only — `src/styles/main.css` (tokens, nav, glass, cursor, buttons, hamburger, skip-link) and `src/styles/sections.css` (all section layouts). Imported from JS. No Tailwind at runtime.
- **Audio**: `src/audio/soundManager.js` — Web Audio API synthesizer. Ambient drone, SFX, wind/highway noise. Phase-aware via `updateAmbience(progress)`.
- **Preloader**: Fullscreen video (`src/logo/animate_this_logo_to_a_transpa.mp4`) with real-time WebGL chroma keying. 6s minimum display, 10s network-stall fallback. Solid white background.
- **Fonts**: Google Fonts loaded via `<link>` with `preconnect` in HTML `<head>` (not CSS `@import`). Weights: Bebas Neue, Manrope 400–800, Space Grotesk 400–700.
- **Security**: CSP meta in `<head>` — `script-src 'self'` (the JSON-LD block is `application/ld+json`, not executable, so no `'unsafe-inline'` needed). No inline event handlers.
- **Accessibility**: Skip-to-content link, `:focus-visible` styles, ARIA on sound toggle + hamburger (Escape closes the drawer), `aria-label` on star ratings, `prefers-reduced-motion` support (CSS + Lenis `smoothWheel: false`), `aria-hidden` on the duplicated marquee card.

## Critical constraints
- **Brand**: Logo is `src/logo/logo.png` (also copied to `public/logo.png` and used as the absolute OG/Twitter/apple-touch/JSON-LD image). Brand red token `--brand-red: #E52421`, brand green `--brand-green: #22A849`. Dark green forest backgrounds — never black.
- **Performance**: DPR capped at 2 in `framePlayer.js`. Canvas uses `desynchronized: true` context. Passive event listeners on resize/mousemove. `will-change: transform` on scroll container and canvas. `contain: layout style paint` on stage content. Frames are lossy WebP (≈13 MB total for all 240, vs 185 MB as PNG).
- **Scroll fragility**: The scroll timeline is tightly coupled to exact scroll heights and ScrollTrigger start/end percentages. Changing `min-height` in `sections.css` or phase boundaries in `main.js` will break narration timing and frame mapping.
- **No duplicate RAF**: Lenis is driven by GSAP's ticker (`gsap.ticker.add`). Do not call `lenis.raf()` separately or add independent animation loops.

## File map
```
src/
  main.js              — All scroll, cursor, sound, reveal logic
  sequence/framePlayer.js — 240-frame lazy-loading WebP canvas player (single class export)
  sequence/chromaKeyer.js — WebGL GPU video chroma keyer
  styles/main.css      — Design tokens, nav, glass, cursor, buttons, hamburger, skip-link
  styles/sections.css  — All section layouts, scroll height, phase triggers
  audio/               — Web Audio synthesizer
  images/              — 240 WebP frames (ezgif-frame-001..240.webp) + leftover PNGs
  logo/                — Brand assets (logo.png, preloader video)
public/
  logo.png             — OG/social/meta image (absolute URL https://extrahypermarket.in/logo.png)
  robots.txt, sitemap.xml
```