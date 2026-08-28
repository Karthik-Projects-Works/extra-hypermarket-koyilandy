// Flowing & Ultra-Smooth 240-Frame Canvas Player with Silky Lerp Inertia

export class FrameSequencePlayer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true
    });
    this.totalFrames = 240;
    this.images = [];
    this.loadedFrames = 0;
    this.currentFrame = 0;
    this.targetFrame = 0;
    this.renderedFrame = -1;
    this.isReady = false;

    // Cached draw dimensions — recomputed only on resize()
    this._drawW = 0;
    this._drawH = 0;
    this._drawX = 0;
    this._drawY = 0;
    this._lastAspectKey = '';

    this._boundResize = this.resize.bind(this);
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', this._boundResize, { passive: true });
    this.preloadFrames();
  }

  getFrameUrl(index) {
    const frameNum = String(index + 1).padStart(3, '0');
    return new URL(`../images/ezgif-frame-${frameNum}.png`, import.meta.url).href;
  }

  preloadFrames() {
    const preloader = document.getElementById('sequence-preloader');
    const MIN_DISPLAY_MS = 9500;
    const startTime = Date.now();
    let firstFrameReady = false;

    const dismissPreloader = () => {
      if (!preloader) return;
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 800);
      }, remaining);
    };

    // 1. Load initial frame immediately
    const firstImg = new Image();
    firstImg.src = this.getFrameUrl(0);
    firstImg.onload = () => {
      this.images[0] = firstImg;
      this.loadedFrames++;
      this.drawFrame(0);
      this.isReady = true;
      firstFrameReady = true;
      dismissPreloader();

      // 2. High-speed asynchronous preload for all 240 frames
      for (let i = 1; i < this.totalFrames; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.src = this.getFrameUrl(i);
        img.onload = () => {
          this.images[i] = img;
          this.loadedFrames++;
        };
      }
    };

    // Fallback: dismiss after 8s even if first frame fails
    setTimeout(() => {
      if (!firstFrameReady) dismissPreloader();
    }, 15000);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this._lastAspectKey = '';
    this.renderedFrame = -1;
    if (this.isReady) {
      this.drawFrame(Math.round(this.currentFrame));
    }
  }

  drawFrame(frameIndex) {
    const clampedIndex = Math.min(Math.max(frameIndex, 0), this.totalFrames - 1);
    let img = this.images[clampedIndex];

    // Fallback search to nearest loaded neighbor if frame is decoding
    if (!img || !img.complete) {
      for (let offset = 1; offset < 10; offset++) {
        const back = clampedIndex - offset;
        const fwd = clampedIndex + offset;
        if (back >= 0 && this.images[back]?.complete) {
          img = this.images[back];
          break;
        }
        if (fwd < this.totalFrames && this.images[fwd]?.complete) {
          img = this.images[fwd];
          break;
        }
      }
      if (!img?.complete) return;
    }

    const ctx = this.ctx;
    const cw = this.width;
    const ch = this.height;

    const aspectKey = `${img.naturalWidth || 1920}x${img.naturalHeight || 1080}_${cw}x${ch}`;
    if (aspectKey !== this._lastAspectKey) {
      const imgRatio = (img.naturalWidth && img.naturalHeight) ? (img.naturalWidth / img.naturalHeight) : (16 / 9);
      const screenRatio = cw / ch;

      if (screenRatio > imgRatio) {
        this._drawW = cw;
        this._drawH = cw / imgRatio;
        this._drawX = 0;
        this._drawY = (ch - this._drawH) / 2;
      } else {
        this._drawH = ch;
        this._drawW = ch * imgRatio;
        this._drawX = (cw - this._drawW) / 2;
        this._drawY = 0;
      }
      this._lastAspectKey = aspectKey;
    }

    ctx.drawImage(img, this._drawX, this._drawY, this._drawW, this._drawH);
  }

  setProgress(progress) {
    const p = Math.min(Math.max(progress, 0), 1);
    this.targetFrame = p * (this.totalFrames - 1);
  }

  // Called synchronously on every GSAP ticker update for buttery smooth lerping
  update() {
    if (!this.isReady) return;

    const diff = this.targetFrame - this.currentFrame;
    if (Math.abs(diff) > 0.005) {
      this.currentFrame += diff * 0.24;
    } else {
      this.currentFrame = this.targetFrame;
    }

    const frameToDraw = Math.round(this.currentFrame);
    if (frameToDraw !== this.renderedFrame) {
      this.drawFrame(frameToDraw);
      this.renderedFrame = frameToDraw;
    }
  }

  destroy() {
    window.removeEventListener('resize', this._boundResize);
  }
}
