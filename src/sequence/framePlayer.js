// Progressive Multi-Tier Lazy-Loaded 240-Frame Canvas Player
// Features: Keyframe Striding, Priority Concurrency Queue, Off-Thread Async Decoding, Direction-Aware Windowing

// Statically collected WebP frame URLs (Vite emits hashed assets for each)
const frameAssets = import.meta.glob('../images/*.webp', {
  query: '?url',
  import: 'default',
  eager: true,
});

class FramePriorityQueue {
  constructor(maxConcurrency = 6) {
    this.maxConcurrency = maxConcurrency;
    this.activeCount = 0;
    this.queue = [];
    this.inFlight = new Set();
  }

  enqueue(index, priority, loadFn) {
    if (this.inFlight.has(index)) return;

    // If already in queue, update priority
    const existing = this.queue.find(item => item.index === index);
    if (existing) {
      existing.priority = priority;
      this._sort();
      return;
    }

    this.queue.push({ index, priority, loadFn });
    this._sort();
    this._processNext();
  }

  _sort() {
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  _processNext() {
    if (this.activeCount >= this.maxConcurrency || this.queue.length === 0) return;

    const item = this.queue.shift();
    if (!item) return;

    this.activeCount++;
    this.inFlight.add(item.index);

    item.loadFn()
      .catch(() => {})
      .finally(() => {
        this.activeCount--;
        this.inFlight.delete(item.index);
        this._processNext();
      });

    // Check if more slots open
    if (this.activeCount < this.maxConcurrency && this.queue.length > 0) {
      this._processNext();
    }
  }

  isQueuedOrLoading(index) {
    return this.inFlight.has(index) || this.queue.some(item => item.index === index);
  }

  clear() {
    this.queue = [];
  }
}

export class FrameSequencePlayer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
    this.totalFrames = 240;
    this.images = new Array(this.totalFrames).fill(null);
    this.loadedFrames = 0;
    this.currentFrame = 0;
    this.targetFrame = 0;
    this.renderedFrame = -1;
    this.isReady = false;

    // Keyframe Striding (Progressive Skeleton)
    this.strideStep = 12; // Keyframes at 0, 12, 24, 36 ... 239
    this._keyframes = new Set();
    for (let i = 0; i < this.totalFrames; i += this.strideStep) {
      this._keyframes.add(i);
    }
    if (!this._keyframes.has(this.totalFrames - 1)) {
      this._keyframes.add(this.totalFrames - 1);
    }

    // Lazy-load tuning
    this._windowRadius = 65; // Sliding window retention radius
    this._queue = new FramePriorityQueue(6);

    // Cached draw dimensions
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
    this.preloadInitialSequence();
  }

  getFrameUrl(index) {
    const frameNum = String(index + 1).padStart(3, '0');
    return frameAssets[`../images/ezgif-frame-${frameNum}.webp`];
  }

  /**
   * Tier 1: Load frame 0 immediately, eager window (0–15), and background keyframe striding
   */
  preloadInitialSequence() {
    const preloader = document.getElementById('sequence-preloader');
    const MIN_DISPLAY_MS = 6000;
    const startTime = Date.now();
    let firstFrameReady = false;

    const dismissPreloader = () => {
      if (!preloader) return;
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        preloader.style.opacity = '0';
        window.dispatchEvent(new CustomEvent('preloader-dismiss'));
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 800);
      }, remaining);
    };

    // 1. Load initial frame 0 with immediate decode
    const firstImg = new Image();
    firstImg.src = this.getFrameUrl(0);
    firstImg.onload = async () => {
      try {
        await firstImg.decode();
      } catch (e) {}
      this.images[0] = firstImg;
      this.loadedFrames++;
      this.drawFrame(0);
      this.isReady = true;
      firstFrameReady = true;
      dismissPreloader();

      // 2. Load immediate entrance window (frames 1–15) with high priority
      for (let i = 1; i <= 15; i++) {
        this._requestFrame(i, 200 - i);
      }

      // 3. Stride keyframes in background (idle/low priority)
      this._preloadKeyframes();
    };

    // Fallback dismiss after 10s if network stalls
    setTimeout(() => {
      if (!firstFrameReady) dismissPreloader();
    }, 10000);
  }

  /**
   * Background Keyframe Striding (Progressive Skeleton)
   */
  _preloadKeyframes() {
    const keyframeList = Array.from(this._keyframes).sort((a, b) => a - b);
    
    const loadNextKeyframe = (idx) => {
      if (idx >= keyframeList.length) return;
      const frameIndex = keyframeList[idx];
      if (!this.images[frameIndex]) {
        this._requestFrame(frameIndex, 50 - Math.floor(frameIndex / 10));
      }
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => loadNextKeyframe(idx + 1), { timeout: 1000 });
      } else {
        setTimeout(() => loadNextKeyframe(idx + 1), 30);
      }
    };

    loadNextKeyframe(0);
  }

  /**
   * Asynchronously load and decode a single frame off the main thread
   */
  _requestFrame(index, priority) {
    if (index < 0 || index >= this.totalFrames || this.images[index]) return;

    this._queue.enqueue(index, priority, () => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = this.getFrameUrl(index);
        
        img.onload = async () => {
          try {
            await img.decode();
          } catch (e) {
            // Ignore decode failures and proceed
          }
          this.images[index] = img;
          this.loadedFrames++;
          resolve(img);
        };
        img.onerror = reject;
      });
    });
  }

  /**
   * Direction & Velocity-Aware Sliding Window Prefetching
   */
  _ensureNearbyFrames() {
    const center = Math.round(this.targetFrame);
    const velocity = this.targetFrame - this.currentFrame;

    let loadStart, loadEnd;
    if (velocity >= 0) {
      // Scrolling down (forward) — bias prefetch ahead
      loadStart = Math.max(0, center - 12);
      loadEnd = Math.min(this.totalFrames, center + 48);
    } else {
      // Scrolling up (backward) — bias prefetch behind
      loadStart = Math.max(0, center - 42);
      loadEnd = Math.min(this.totalFrames, center + 14);
    }

    // Enqueue frames with distance-based priority
    for (let i = loadStart; i < loadEnd; i++) {
      if (!this.images[i] && !this._queue.isQueuedOrLoading(i)) {
        const distance = Math.abs(i - center);
        const priority = 1000 - distance;
        this._requestFrame(i, priority);
      }
    }

    // Memory Eviction: release distant non-keyframe images outside the sliding window
    for (let i = 0; i < this.totalFrames; i++) {
      if (this.images[i] && Math.abs(i - center) > this._windowRadius) {
        // Never evict keyframes or frame 0
        if (i === 0 || this._keyframes.has(i)) continue;
        this.images[i] = null;
        this.loadedFrames--;
      }
    }
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

    // Fallback: 1. Search immediate neighbors (offset 1..15)
    if (!img || !img.complete) {
      for (let offset = 1; offset <= 15; offset++) {
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
    }

    // Fallback: 2. If immediate neighbors not ready, find closest loaded keyframe
    if (!img || !img.complete) {
      let minKeyDist = Infinity;
      let closestKeyImg = null;
      for (const kf of this._keyframes) {
        if (this.images[kf]?.complete) {
          const dist = Math.abs(kf - clampedIndex);
          if (dist < minKeyDist) {
            minKeyDist = dist;
            closestKeyImg = this.images[kf];
          }
        }
      }
      if (closestKeyImg) {
        img = closestKeyImg;
      }
    }

    if (!img || !img.complete) return;

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

  // Called on every GSAP ticker update — drives lerping + directional lazy loading
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
      // Trigger directional lazy-load check when frame updates
      this._ensureNearbyFrames();
    }
  }

  destroy() {
    window.removeEventListener('resize', this._boundResize);
    this._queue.clear();
    this.images = [];
  }
}
