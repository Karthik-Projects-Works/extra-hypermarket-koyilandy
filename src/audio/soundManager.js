// Modern Web Audio API Sound Synthesizer for Extra Hypermarket
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientGain = null;
    this.droneOsc = null;
    this.droneFilter = null;
    this.padOsc1 = null;
    this.padOsc2 = null;
    this.padGain = null;
    this.cartNoise = null;
    this.cartGain = null;
    this.filter = null;
    this.windGain = null;
    this.highwayGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      // Master master volume gain node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Supermarket Ambient Synthesizer (Lush warm ambient pad)
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      // Low warm drone (C3 ~ 130.81Hz)
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = 'sine';
      this.droneOsc.frequency.setValueAtTime(130.81, this.ctx.currentTime);

      const droneFilter = this.ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(220, this.ctx.currentTime);
      this.droneFilter = droneFilter;

      this.droneOsc.connect(droneFilter);
      droneFilter.connect(this.ambientGain);
      this.droneOsc.start();

      // E-Major warm airy harmonics
      this.padOsc1 = this.ctx.createOscillator();
      this.padOsc1.type = 'triangle';
      this.padOsc1.frequency.setValueAtTime(329.63, this.ctx.currentTime); // E4

      this.padOsc2 = this.ctx.createOscillator();
      this.padOsc2.type = 'sine';
      this.padOsc2.frequency.setValueAtTime(493.88, this.ctx.currentTime); // B4

      const padGain = this.ctx.createGain();
      padGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.padGain = padGain;

      this.padOsc1.connect(padGain);
      this.padOsc2.connect(padGain);
      padGain.connect(this.ambientGain);

      this.padOsc1.start();
      this.padOsc2.start();

      // Cart Rolling Rumble simulation
      this.initCartRumble();

      // Wind noise layer (outdoor ambience for approach phase)
      this.initWindNoise();

      // Highway noise layer (location phase)
      this.initHighwayNoise();

      this.initialized = true;
    } catch (e) {
      console.warn('AudioContext initialization deferred or unavailable', e);
    }
  }

  initCartRumble() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(80, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    this.cartGain = this.ctx.createGain();
    this.cartGain.gain.setValueAtTime(0, this.ctx.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(this.cartGain);
    this.cartGain.connect(this.masterGain);

    whiteNoise.start();
  }

  initWindNoise() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0, this.ctx.currentTime);

    whiteNoise.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    whiteNoise.start();
  }

  initHighwayNoise() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const hwFilter = this.ctx.createBiquadFilter();
    hwFilter.type = 'bandpass';
    hwFilter.frequency.setValueAtTime(200, this.ctx.currentTime);
    hwFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.highwayGain = this.ctx.createGain();
    this.highwayGain.gain.setValueAtTime(0, this.ctx.currentTime);

    whiteNoise.connect(hwFilter);
    hwFilter.connect(this.highwayGain);
    this.highwayGain.connect(this.masterGain);

    whiteNoise.start();
  }

  toggleMute() {
    if (!this.initialized) {
      this.init();
      this.isMuted = false;
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(0.28, this.ctx.currentTime, 0.1);
      }
      return !this.isMuted;
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : 0.28;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
    }
    return !this.isMuted;
  }

  // Play Barcode Scanner Beep
  playScannerBeep() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2489, this.ctx.currentTime); // D#7 high laser chirp
      osc.frequency.exponentialRampToValueAtTime(2637, this.ctx.currentTime + 0.08); // E7

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  // Play Item Dropping / Whoosh into Shopping Cart
  playCartDrop() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch (e) {}
  }

  // Play Celebration / Mega Sale chime
  playCelebration() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + index * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch (e) {}
  }

  // Modulate Cart Rumble intensity according to scroll velocity
  updateScrollSpeed(velocity) {
    if (this.isMuted || !this.cartGain || !this.ctx) return;
    const clampedVelocity = Math.min(Math.abs(velocity) * 0.0008, 0.15);
    this.cartGain.gain.setTargetAtTime(clampedVelocity, this.ctx.currentTime, 0.1);
  }

  // Phase-specific ambient morphing driven by scroll progress (0–1)
  updateAmbience(progress) {
    if (this.isMuted || !this.initialized || !this.ctx) return;
    const t = this.ctx.currentTime;
    const p = Math.max(0, Math.min(1, progress));

    // Ambient filter cutoff: 800 → 400 → 220 → 350 → 100 Hz
    let filterFreq;
    if (p < 0.20) {
      filterFreq = 800 - (p / 0.20) * 400;       // 800 → 400
    } else if (p < 0.40) {
      filterFreq = 400 - ((p - 0.20) / 0.20) * 180; // 400 → 220
    } else if (p < 0.70) {
      filterFreq = 220 + ((p - 0.40) / 0.30) * 130; // 220 → 350
    } else {
      filterFreq = 350 - ((p - 0.70) / 0.30) * 250; // 350 → 100
    }
    if (this.droneFilter) {
      this.droneFilter.frequency.setTargetAtTime(filterFreq, t, 0.3);
    }

    // Ambient gain: 0.12 → 0.15 → 0.22 → 0.16 → 0
    let ambGain;
    if (p < 0.20) {
      ambGain = 0.12 + (p / 0.20) * 0.03;          // 0.12 → 0.15
    } else if (p < 0.40) {
      ambGain = 0.15 + ((p - 0.20) / 0.20) * 0.07; // 0.15 → 0.22
    } else if (p < 0.70) {
      ambGain = 0.22 - ((p - 0.40) / 0.30) * 0.06; // 0.22 → 0.16
    } else {
      ambGain = 0.16 * (1 - (p - 0.70) / 0.30);    // 0.16 → 0
    }
    if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(ambGain, t, 0.3);
    }

    // Drone frequency: 130 → 110 → 100 → 120 → 80 Hz
    let droneFreq;
    if (p < 0.20) {
      droneFreq = 130 - (p / 0.20) * 20;            // 130 → 110
    } else if (p < 0.40) {
      droneFreq = 110 - ((p - 0.20) / 0.20) * 10;   // 110 → 100
    } else if (p < 0.70) {
      droneFreq = 100 + ((p - 0.40) / 0.30) * 20;   // 100 → 120
    } else {
      droneFreq = 120 - ((p - 0.70) / 0.30) * 40;   // 120 → 80
    }
    if (this.droneOsc) {
      this.droneOsc.frequency.setTargetAtTime(droneFreq, t, 0.3);
    }

    // Wind noise: full in phase 1, fades to 0 by end of phase 2
    if (this.windGain) {
      let windLevel;
      if (p < 0.20) {
        windLevel = 0.08;                            // steady outdoor wind
      } else if (p < 0.40) {
        windLevel = 0.08 * (1 - (p - 0.20) / 0.20); // fade out
      } else {
        windLevel = 0;
      }
      this.windGain.gain.setTargetAtTime(windLevel, t, 0.3);
    }

    // Highway noise: fades in at phase 4, fades out at phase 5
    if (this.highwayGain) {
      let hwLevel;
      if (p < 0.70) {
        hwLevel = 0;
      } else if (p < 0.80) {
        hwLevel = 0.06 * ((p - 0.70) / 0.10);       // fade in
      } else if (p < 0.90) {
        hwLevel = 0.06;                               // steady
      } else {
        hwLevel = 0.06 * (1 - (p - 0.90) / 0.10);   // fade out
      }
      this.highwayGain.gain.setTargetAtTime(hwLevel, t, 0.3);
    }
  }
}

export const soundManager = new SoundManager();
