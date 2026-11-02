// Web Audio API Synthesizer for Authentic Bangladeshi Arcade Sound Effects and Deshi Truck Beats

class SoundController {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('tempu_stand_muted') === 'true';
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;

    // Preloaded AudioBuffers for instant zero-latency SFX playback
    this._hornBuffer = null;
    this._escapedBuffer = null;
    this._preloading = false;

    // File-based BGM (looping song)
    this._bgmAudio = null;
    this._bgmFadeTimer = null;
    this._bgmTargetVol = 0.55;  // full volume
    this._bgmLowVol   = 0.08;  // low background volume during driving
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    // Preload SFX files into AudioBuffers the moment AudioContext is ready
    this._preloadSFX();
  }

  // Fetch & decode audio files into memory — called once, plays instantly afterwards
  async _preloadSFX() {
    if (this._preloading || (this._hornBuffer && this._escapedBuffer)) return;
    this._preloading = true;

    // Load horn SFX independently
    try {
      const res = await fetch('/sound%20effact/jaldi%20bohase%20hato.mp4');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      this._hornBuffer = await this.ctx.decodeAudioData(buf);
    } catch (e) {
      console.error('[Audio] Horn SFX load failed:', e.message);
      this._hornBuffer = null;
    }

    // Load escaped SFX independently
    try {
      const res = await fetch('/sound%20effact/pakarmadarchod%20update.mp4');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      this._escapedBuffer = await this.ctx.decodeAudioData(buf);
    } catch (e) {
      console.error('[Audio] Escaped SFX load failed:', e.message);
      this._escapedBuffer = null;
    }

    this._preloading = false;
  }

  // Internal: play a preloaded AudioBuffer instantly via AudioBufferSourceNode
  _playBuffer(buffer, volume = 1.0) {
    if (!this.ctx || !buffer) return false;
    try {
      const src = this.ctx.createBufferSource();
      const gainNode = this.ctx.createGain();
      src.buffer = buffer;
      gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
      src.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      src.start(this.ctx.currentTime);
      return true;
    } catch (e) {
      return false;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('tempu_stand_muted', this.muted);
    if (this.muted) {
      this.stopBGM();
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // --- Sound Effects ---

  // Coin 'Ting!'
  playCoin() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(2400, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  playHornSound() {
    this.playTruckHornSFX();
  }

  // Dual-tone iconic Bangladeshi truck air horn "পোঁওও-পোঁওও!"
  playTruckHorn() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    const playTone = (freq1, freq2, start, dur) => {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq1, start);
      osc2.frequency.setValueAtTime(freq2, start);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + dur);
      osc2.stop(start + dur);
    };

    // Burst 1
    playTone(320, 390, t, 0.22);
    // Burst 2
    playTone(340, 420, t + 0.25, 0.35);
  }

  // 🔊 Real SFX: ট্রাক হর্ন দিলে "জলদি বহাস হটো!" — AudioBuffer থেকে instant play
  playTruckHornSFX() {
    if (this.muted) return;
    this.init();
    // Try buffer first (zero latency), fallback to HTML5 Audio element
    if (!this._playBuffer(this._hornBuffer, 0.95)) {
      try {
        const audio = new Audio('/sound%20effact/jaldi%20bohase%20hato.mp4');
        audio.volume = 0.95;
        audio.play().catch(() => {
          this.playTruckHorn();
        });
      } catch (e) {
        this.playTruckHorn();
      }
    }
  }

  // 🔊 Real SFX: চাঁদা না দিয়ে পালালে "পাকার মাদারচোদ!" — AudioBuffer থেকে instant play
  playEscapedSFX() {
    if (this.muted) return;
    this.init();
    // Try buffer first (zero latency), fallback to HTML5 Audio element
    if (!this._playBuffer(this._escapedBuffer, 1.0)) {
      try {
        const audio = new Audio('/sound%20effact/pakarmadarchod%20update.mp4');
        audio.volume = 1.0;
        audio.play().catch(() => {
          this.playBuzzer();
        });
      } catch (e) {
        this.playBuzzer();
      }
    }
  }

  // Brake screech "কিইইচ!"
  playBrake() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.linearRampToValueAtTime(600, t + 0.3);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Warning / Leader Anger Buzzer
  playBuzzer() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.setValueAtTime(120, t + 0.12);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  // Button click
  playClick() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Success Fanfare
  playSuccess() {
    if (this.muted) return;
    this.init();
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      const t = this.ctx.currentTime + i * 0.1;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // Background Deshi Truck Loop (Catchy Deshi Rhythmic synth melody)
  startBGM() {
    if (this.muted || this.bgmPlaying) return;
    this.init();
    this.bgmPlaying = true;

    // Deshi folk scale in D: D, F, G, A, C
    const melody = [
      293.66, 0, 349.23, 392.00, 440.00, 392.00, 349.23, 293.66,
      349.23, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23, 293.66
    ];
    let step = 0;

    const playStep = () => {
      if (!this.bgmPlaying || this.muted) return;
      const t = this.ctx.currentTime;
      const freq = melody[step % melody.length];

      // Percussion beat (Dhol rhythm: Dum-Tak-Dum-Tak)
      if (step % 2 === 0) {
        // Dum (low kick)
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(110, t);
        kickOsc.frequency.exponentialRampToValueAtTime(40, t + 0.08);
        kickGain.gain.setValueAtTime(0.12, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        kickOsc.connect(kickGain);
        kickGain.connect(this.ctx.destination);
        kickOsc.start(t);
        kickOsc.stop(t + 0.08);
      } else {
        // Tak (snare click)
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(400, t);
        snareGain.gain.setValueAtTime(0.06, t);
        snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        snareOsc.connect(snareGain);
        snareGain.connect(this.ctx.destination);
        snareOsc.start(t);
        snareOsc.stop(t + 0.05);
      }

      // Melody note
      if (freq > 0) {
        const lead = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        lead.type = 'sine';
        lead.frequency.setValueAtTime(freq, t);
        leadGain.gain.setValueAtTime(0.08, t);
        leadGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        lead.connect(leadGain);
        leadGain.connect(this.ctx.destination);
        lead.start(t);
        lead.stop(t + 0.18);
      }

      step++;
      this.bgmTimer = setTimeout(playStep, 220); // ~136 BPM
    };

    playStep();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  vibrate(pattern = 50) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // ignore if not supported
      }
    }
  }

  // ========== File-based BGM ==========

  // Start the looping background song
  startFileBGM() {
    if (this._bgmAudio) return; // already playing
    const audio = new Audio('/sound%20effact/tumi%20tole%20tole%20tempu%20chalao.mp4');
    audio.loop = true;
    audio.volume = this.muted ? 0 : this._bgmTargetVol;
    audio.play().catch(() => {});
    this._bgmAudio = audio;
  }

  // Smoothly fade volume down to low level (e.g. when driving starts)
  fadeBGMToLow() {
    if (!this._bgmAudio) return;
    this._smoothFade(this._bgmLowVol, 3000); // 3 second fade
  }

  // Smoothly restore volume to full (e.g. back to menu)
  restoreBGMVolume() {
    if (!this._bgmAudio) return;
    this._smoothFade(this._bgmTargetVol, 2000); // 2 second restore
  }

  // Stop BGM completely
  stopFileBGM() {
    if (this._bgmFadeTimer) clearInterval(this._bgmFadeTimer);
    if (this._bgmAudio) {
      this._bgmAudio.pause();
      this._bgmAudio.currentTime = 0;
      this._bgmAudio = null;
    }
  }

  // Internal smooth volume fade helper
  _smoothFade(targetVol, durationMs) {
    if (this._bgmFadeTimer) clearInterval(this._bgmFadeTimer);
    if (!this._bgmAudio) return;
    const steps = 40;
    const interval = durationMs / steps;
    const startVol = this._bgmAudio.volume;
    const delta = (targetVol - startVol) / steps;
    let step = 0;
    this._bgmFadeTimer = setInterval(() => {
      step++;
      if (!this._bgmAudio) { clearInterval(this._bgmFadeTimer); return; }
      const newVol = Math.min(1, Math.max(0, startVol + delta * step));
      this._bgmAudio.volume = this.muted ? 0 : newVol;
      if (step >= steps) {
        clearInterval(this._bgmFadeTimer);
        this._bgmFadeTimer = null;
      }
    }, interval);
  }
}

export const sound = new SoundController();
