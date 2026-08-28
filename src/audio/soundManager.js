// Modern Web Audio API Sound Synthesizer for Extra Hypermarket
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientGain = null;
    this.droneOsc = null;
    this.padOsc1 = null;
    this.padOsc2 = null;
    this.cartNoise = null;
    this.cartGain = null;
    this.filter = null;
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

      this.padOsc1.connect(padGain);
      this.padOsc2.connect(padGain);
      padGain.connect(this.ambientGain);

      this.padOsc1.start();
      this.padOsc2.start();

      // Cart Rolling Rumble simulation
      this.initCartRumble();

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
}

export const soundManager = new SoundManager();
