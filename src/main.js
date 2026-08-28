import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FrameSequencePlayer } from './sequence/framePlayer.js';
import { ChromaKeyer } from './sequence/chromaKeyer.js';
import { soundManager } from './audio/soundManager.js';

import './styles/main.css';
import './styles/sections.css';

gsap.registerPlugin(ScrollTrigger);

// 0. GPU-accelerated Video Chroma Keyer for Preloader Video
const preloaderVideo = document.getElementById('preloader-video');
const preloaderCanvas = document.getElementById('preloader-canvas');
let chromaKeyer = null;
let preloaderDismissed = false;

if (preloaderVideo && preloaderCanvas) {
  chromaKeyer = new ChromaKeyer(preloaderCanvas);
  preloaderVideo.play().catch(() => {});
  // Stop chroma key rendering once preloader is dismissed
  window.addEventListener('preloader-dismiss', () => { preloaderDismissed = true; });
}

// 1. Initialize Smooth Scroll with Lenis — flowing momentum & zero-stuck inertia
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: !prefersReducedMotion,
  wheelMultiplier: 1.15,
  touchMultiplier: 2.0,
  infinite: false,
  syncTouch: true,
  syncTouchLerp: 0.12
});

// 2. Initialize 240-Frame Image Sequence Player
const canvas = document.getElementById('sequence-canvas');
const player = new FrameSequencePlayer(canvas);

// Single unified ticker — drives Lenis, frame lerping, and preloader chroma key
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
  player.update();
  // GPU chroma key for preloader video (runs until preloader is dismissed)
  if (chromaKeyer && !preloaderDismissed) {
    chromaKeyer.render(preloaderVideo);
  }
});
gsap.ticker.lagSmoothing(0);

// Synchronize Lenis with GSAP ScrollTrigger & sound speed
lenis.on('scroll', (e) => {
  ScrollTrigger.update();
  soundManager.updateScrollSpeed(e.velocity);
});

// 3. Cursor — passive listener with smooth positioning
const cursor = document.getElementById('custom-cursor');
const cursorDot = document.getElementById('custom-cursor-dot');
let cursorX = 0, cursorY = 0, cursorScheduled = false;

function updateCursor() {
  if (cursor) {
    cursor.style.transform = `translate(${cursorX - 14}px, ${cursorY - 14}px)`;
  }
  if (cursorDot) {
    cursorDot.style.transform = `translate(${cursorX - 3}px, ${cursorY - 3}px)`;
  }
  cursorScheduled = false;
}

window.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  if (!cursorScheduled) {
    cursorScheduled = true;
    requestAnimationFrame(updateCursor);
  }
}, { passive: true });

// Radial glow coordinates calculation for all .glow-card elements
const initRadialGlow = () => {
  const glowCards = document.querySelectorAll('.glow-card');
  glowCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
};
initRadialGlow();

// Magnetic Button Physics
const initMagneticPhysics = () => {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.28,
        y: y * 0.28,
        duration: 0.35,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
};
initMagneticPhysics();

// Hover bindings for cursor scaling
const bindHoverTargets = () => {
  const hoverables = document.querySelectorAll('a, button, .glow-card, .review-item-card, .social-film-card, .highlight-pill-item');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor?.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor?.classList.remove('hovered');
    });
  });
};
bindHoverTargets();

// 4. Sound Ambience Toggle Controller
const soundBtn = document.getElementById('sound-btn');
const soundText = document.getElementById('sound-text');

if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    const isPlaying = soundManager.toggleMute();
    soundBtn.setAttribute('aria-pressed', String(isPlaying));
    if (isPlaying) {
      soundBtn.classList.add('playing');
      if (soundText) soundText.innerText = 'SOUND ON';
    } else {
      soundBtn.classList.remove('playing');
      if (soundText) soundText.innerText = 'SOUND MUTED';
    }
  });
}

// 4b. Mobile Navigation Hamburger Toggle
const hamburger = document.getElementById('nav-hamburger');
const navMenu = document.getElementById('nav-menu');
if (hamburger && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) {
      const firstLink = navMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });
}

// 5. Scroll-Driven 240-Frame Sequence
const hudLocText = document.getElementById('hud-location-text');
let lastHudText = '';
let lastPhase = 0;

ScrollTrigger.create({
  trigger: '#scroll-container',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    const p = self.progress;
    player.setProgress(p);
    soundManager.updateAmbience(p);

    // Determine current phase and trigger SFX on transitions
    let currentPhase = 0;
    if (p >= 0.90) currentPhase = 5;
    else if (p >= 0.70) currentPhase = 4;
    else if (p >= 0.40) currentPhase = 3;
    else if (p >= 0.20) currentPhase = 2;
    else currentPhase = 1;

    if (currentPhase !== lastPhase) {
      if (currentPhase === 2) soundManager.playScannerBeep();    // Entering store
      if (currentPhase === 3) soundManager.playCartDrop();       // Inside aisles
      if (currentPhase === 5) soundManager.playCelebration();    // Finale
      lastPhase = currentPhase;
    }

    let newText = '';
    if (p < 0.20) newText = 'APPROACHING EXTRA • KOYILANDY';
    else if (p < 0.40) newText = 'ENTERING 22,000 SQ FT STORE';
    else if (p < 0.70) newText = '5 AM FRESH PRODUCE & AISLES';
    else if (p < 0.90) newText = 'KOYILANDY HIGHWAY LOCATION';
    else newText = 'EVERYTHING EXTRA';

    if (newText !== lastHudText && hudLocText) {
      hudLocText.innerText = newText;
      lastHudText = newText;
    }
  }
});

// 6. Cinematic Narration Subtitle Blocks
const narrations = [
  { id: 'narration-1', start: 0.00, end: 0.16 },
  { id: 'narration-2', start: 0.20, end: 0.36 },
  { id: 'narration-3', start: 0.40, end: 0.66 },
  { id: 'narration-4', start: 0.70, end: 0.86 },
];

narrations.forEach(({ id, start, end }) => {
  const el = document.getElementById(id);
  if (!el) return;
  ScrollTrigger.create({
    trigger: '#scroll-container',
    start: `top+=${start * 100}% top`,
    end: `top+=${end * 100}% top`,
    onToggle: (self) => {
      el.classList.toggle('active', self.isActive);
    }
  });
});

// Kinetic Horizontal Typography translation
const kineticRow = document.getElementById('kinetic-row');
if (kineticRow) {
  gsap.to(kineticRow, {
    x: -350,
    ease: 'none',
    scrollTrigger: {
      trigger: '#phase-3-variety',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5
    }
  });
}

// Section Stage Active Reveals
const phases = [
  'phase-1-approach',
  'phase-2-entrance', 'phase-2-scale',
  'phase-3-variety', 'phase-3-departments', 'phase-3-amenities',
  'phase-4-location', 'phase-4-offers', 'phase-4-social',
  'phase-5-resolve'
];

phases.forEach((phaseId) => {
  const el = document.getElementById(phaseId);
  const content = el?.querySelector('.cinema-stage-content');
  if (el && content) {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 65%',
      end: 'bottom 35%',
      onToggle: (self) => {
        if (self.isActive) {
          content.classList.add('active');
        } else if (phaseId !== 'phase-1-approach') {
          content.classList.remove('active');
        }
      }
    });
  }
});
