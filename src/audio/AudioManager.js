// AudioManager — wraps Web Audio API playback
// Call resume() once after first user gesture, then play/playLoop freely

export const AudioManager = {
  _scene: null,
  _ctx: null,
  _buffers: {},
  _loopSources: {},
  _musicSource: null,
  _musicVolume: 0.38,
  _sfxVolume: 0.7,
  _ready: false,

  init(scene) {
    this._scene = scene;
    this._buffers = scene.registry.get('soundBuffers') || {};
    if (scene.sound && scene.sound.context) {
      this._ctx = scene.sound.context;
    }
  },

  resume() {
    if (this._ctx && this._ctx.state === 'suspended') {
      this._ctx.resume().catch(() => {});
    }
    this._ready = true;
  },

  play(key) {
    if (!this._ready || !this._ctx || !this._buffers[key]) return;
    try {
      const source = this._ctx.createBufferSource();
      source.buffer = this._buffers[key];
      const gain = this._ctx.createGain();
      gain.gain.value = this._sfxVolume;
      source.connect(gain);
      gain.connect(this._ctx.destination);
      source.start();
    } catch (e) { /* ignore */ }
  },

  playLoop(key) {
    if (!this._ready || !this._ctx || !this._buffers[key]) return;
    if (this._loopSources[key]) return;
    try {
      const source = this._ctx.createBufferSource();
      source.buffer = this._buffers[key];
      source.loop = true;
      const gain = this._ctx.createGain();
      gain.gain.value = this._sfxVolume * 0.5;
      source.connect(gain);
      gain.connect(this._ctx.destination);
      source.start();
      this._loopSources[key] = { source, gain };
    } catch (e) { /* ignore */ }
  },

  stopLoop(key) {
    if (this._loopSources[key]) {
      try { this._loopSources[key].source.stop(); } catch (e) { /* ignore */ }
      delete this._loopSources[key];
    }
  },

  stopAllLoops() {
    for (const key of Object.keys(this._loopSources)) {
      this.stopLoop(key);
    }
  },

  playMusic(level) {
    if (!this._ready || !this._ctx) return;
    this.stopMusic();
    this._startMusicBuffer(this._buildLevelMusicBuffer(level));
  },

  playBossMusic(level) {
    if (!this._ready || !this._ctx) return;
    this.stopMusic();
    this._startMusicBuffer(this._buildBossMusicBuffer(level));
  },

  _startMusicBuffer(buffer) {
    if (!buffer) return;
    try {
      const source = this._ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const gain = this._ctx.createGain();
      gain.gain.value = this._musicVolume;
      source.connect(gain);
      gain.connect(this._ctx.destination);
      source.start();
      this._musicSource = { source, gain };
    } catch (e) { /* ignore */ }
  },

  stopMusic() {
    if (this._musicSource) {
      try { this._musicSource.source.stop(); } catch (e) { /* ignore */ }
      this._musicSource = null;
    }
  },

  setMusicVolume(v) {
    this._musicVolume = v;
    if (this._musicSource) this._musicSource.gain.gain.value = v;
  },

  setSfxVolume(v) {
    this._sfxVolume = v;
  },

  // ── Level music: bright, fun, unique per level ────────────────────────────
  _buildLevelMusicBuffer(level) {
    if (!this._ctx) return null;
    const sr = this._ctx.sampleRate;
    const twoPi = Math.PI * 2;

    // Each level: BPM, root freq, scale semitones (pentatonic variants), bass pattern
    const configs = {
      1: { // Forest — playful, bouncy, C major pentatonic
        bpm: 120, root: 261.63,
        melody: [0,4,7,12, 7,4,2,0, 4,7,9,7, 4,2,4,0],
        bass:   [0,-1,0,-1, 7,-1,0,-1, 0,-1,5,-1, 7,-1,0,-1],
        chords: [[0,4,7],[5,9,12],[7,11,14],[5,9,12]]
      },
      2: { // Desert — mysterious, Middle-Eastern feel, A minor Hijaz-like
        bpm: 100, root: 220.00,
        melody: [0,1,5,7, 8,7,5,1, 0,3,5,7, 5,3,1,0],
        bass:   [0,-1,0,-1, 5,-1,0,-1, 0,-1,3,-1, 5,-1,0,-1],
        chords: [[0,3,7],[5,8,12],[3,7,10],[5,8,12]]
      },
      3: { // Ocean — sweeping, open, D Dorian feel
        bpm: 108, root: 293.66,
        melody: [0,2,5,7, 9,7,5,2, 0,3,5,7, 5,3,2,0],
        bass:   [0,-1,7,-1, 0,-1,5,-1, 0,-1,3,-1, 7,-1,0,-1],
        chords: [[0,3,7],[5,9,12],[7,10,14],[3,7,10]]
      }
    };

    const cfg = configs[level] || configs[1];
    const beatLen = 60 / cfg.bpm;
    const totalBeats = cfg.melody.length;
    const totalSamples = Math.ceil(sr * beatLen * totalBeats);

    const buffer = this._ctx.createBuffer(2, totalSamples, sr);
    const L = buffer.getChannelData(0);
    const R = buffer.getChannelData(1);

    const freq = (root, semi) => semi === -1 ? 0 : root * Math.pow(2, semi / 12);

    // Helper: add a tone to L/R
    const addTone = (ch, startSample, lenSamples, f, amp, waveType) => {
      for (let i = 0; i < lenSamples && startSample + i < totalSamples; i++) {
        const t = i / sr;
        const env = Math.min(1, t * 30) * Math.exp(-t * (waveType === 'bass' ? 3 : 5));
        let val;
        if (waveType === 'bass') {
          // Sine + slight second harmonic for warmth
          val = (Math.sin(twoPi * f * t) * 0.8 + Math.sin(twoPi * f * 2 * t) * 0.2) * env * amp;
        } else if (waveType === 'lead') {
          // Triangle-ish: sin + odd harmonics
          val = (Math.sin(twoPi * f * t) * 0.6
               + Math.sin(twoPi * f * 3 * t) * 0.15
               + Math.sin(twoPi * f * 5 * t) * 0.05) * env * amp;
        } else {
          // Soft pad: pure sine
          val = Math.sin(twoPi * f * t) * env * amp;
        }
        ch[startSample + i] = (ch[startSample + i] || 0) + val;
      }
    };

    // Melody (lead) — panned slightly right
    cfg.melody.forEach((semi, bi) => {
      if (semi === -1) return;
      const f = freq(cfg.root * 2, semi); // octave up
      const start = Math.floor(bi * beatLen * sr);
      const len   = Math.floor(beatLen * sr * 0.75);
      addTone(L, start, len, f, 0.14, 'lead');
      addTone(R, start, len, f, 0.18, 'lead');
    });

    // Bass — low octave, panned slightly left
    cfg.bass.forEach((semi, bi) => {
      if (semi === -1) return;
      const f = freq(cfg.root / 2, semi); // octave down
      const start = Math.floor(bi * beatLen * sr);
      const len   = Math.floor(beatLen * sr * 0.9);
      addTone(L, start, len, f, 0.16, 'bass');
      addTone(R, start, len, f, 0.10, 'bass');
    });

    // Chord pads — quarter-note chords (every 4 melody beats)
    cfg.chords.forEach((chord, ci) => {
      const start = Math.floor(ci * 4 * beatLen * sr);
      const len   = Math.floor(4 * beatLen * sr * 0.85);
      chord.forEach(semi => {
        const f = freq(cfg.root, semi);
        addTone(L, start, len, f, 0.05, 'pad');
        addTone(R, start, len, f, 0.05, 'pad');
      });
    });

    // Light percussion (hi-hat noise bursts on every beat)
    for (let bi = 0; bi < totalBeats; bi++) {
      const start = Math.floor(bi * beatLen * sr);
      const len   = Math.floor(sr * 0.04);
      for (let i = 0; i < len && start + i < totalSamples; i++) {
        const t = i / sr;
        const env = Math.exp(-t * 80);
        const noise = (Math.random() * 2 - 1) * env * 0.04;
        L[start + i] = (L[start + i] || 0) + noise;
        R[start + i] = (R[start + i] || 0) + noise;
      }
    }

    // Kick on beats 1 and 3 (bi 0 and totalBeats/2)
    [0, Math.floor(totalBeats / 2)].forEach(bi => {
      const start = Math.floor(bi * beatLen * sr);
      const len   = Math.floor(sr * 0.18);
      for (let i = 0; i < len && start + i < totalSamples; i++) {
        const t = i / sr;
        const env = Math.exp(-t * 20);
        const f   = 80 * Math.exp(-t * 30); // pitch drop
        const val = Math.sin(twoPi * f * t) * env * 0.18;
        L[start + i] = (L[start + i] || 0) + val;
        R[start + i] = (R[start + i] || 0) + val;
      }
    });

    return buffer;
  },

  // ── Boss music: dark, urgent, driving ────────────────────────────────────
  _buildBossMusicBuffer(level) {
    if (!this._ctx) return null;
    const sr = this._ctx.sampleRate;
    const twoPi = Math.PI * 2;

    // Boss music: minor key, faster, more dissonant, driving rhythm
    const bossConfigs = {
      1: { bpm: 140, root: 146.83, // D2 — dark forest
           melody: [0,3,5,7, 6,5,3,1, 0,3,7,10, 8,6,3,0] },
      2: { bpm: 150, root: 138.59, // C#2 — scorpion urgency
           melody: [0,1,5,6, 7,6,5,3, 0,3,5,8, 7,5,3,0] },
      3: { bpm: 145, root: 130.81, // C2 — ocean dread
           melody: [0,3,5,8, 7,5,3,1, 0,3,8,10, 8,5,3,0] }
    };

    const cfg = bossConfigs[level] || bossConfigs[1];
    const beatLen = 60 / cfg.bpm;
    const totalBeats = cfg.melody.length;
    const totalSamples = Math.ceil(sr * beatLen * totalBeats);

    const buffer = this._ctx.createBuffer(2, totalSamples, sr);
    const L = buffer.getChannelData(0);
    const R = buffer.getChannelData(1);

    const freq = (root, semi) => semi === -1 ? 0 : root * Math.pow(2, semi / 12);

    // Ominous bass drone (root + 5th)
    const droneFreqs = [cfg.root, cfg.root * Math.pow(2, 7 / 12)];
    droneFreqs.forEach(f => {
      for (let i = 0; i < totalSamples; i++) {
        const t = i / sr;
        const val = Math.sin(twoPi * f * t) * 0.08;
        L[i] = (L[i] || 0) + val;
        R[i] = (R[i] || 0) + val;
      }
    });

    // Urgent melody (square-ish wave — harsh, tense)
    cfg.melody.forEach((semi, bi) => {
      if (semi === -1) return;
      const f = freq(cfg.root * 4, semi); // two octaves up
      const start = Math.floor(bi * beatLen * sr);
      const len   = Math.floor(beatLen * sr * 0.6);
      for (let i = 0; i < len && start + i < totalSamples; i++) {
        const t = i / sr;
        const env = Math.min(1, t * 40) * Math.exp(-t * 8);
        // Square-like: sum odd harmonics
        const val = (Math.sin(twoPi * f * t)
                   + Math.sin(twoPi * f * 3 * t) * 0.33
                   + Math.sin(twoPi * f * 5 * t) * 0.2) * env * 0.13;
        L[start + i] = (L[start + i] || 0) + val;
        R[start + i] = (R[start + i] || 0) + val;
      }
    });

    // Driving kick on every beat
    for (let bi = 0; bi < totalBeats; bi++) {
      const start = Math.floor(bi * beatLen * sr);
      const len   = Math.floor(sr * 0.14);
      for (let i = 0; i < len && start + i < totalSamples; i++) {
        const t = i / sr;
        const env = Math.exp(-t * 25);
        const f   = 100 * Math.exp(-t * 40);
        const val = Math.sin(twoPi * f * t) * env * 0.22;
        L[start + i] = (L[start + i] || 0) + val;
        R[start + i] = (R[start + i] || 0) + val;
      }
    }

    // Snare on every other beat (off-beat)
    for (let bi = 1; bi < totalBeats; bi += 2) {
      const start = Math.floor(bi * beatLen * sr);
      const len   = Math.floor(sr * 0.1);
      for (let i = 0; i < len && start + i < totalSamples; i++) {
        const t = i / sr;
        const env = Math.exp(-t * 40);
        const noise = (Math.random() * 2 - 1) * env * 0.12;
        L[start + i] = (L[start + i] || 0) + noise;
        R[start + i] = (R[start + i] || 0) + noise;
      }
    }

    // Tremolo-like string stabs on beats 1 and 3 — dissonant minor chord
    [0, Math.floor(totalBeats / 2)].forEach(bi => {
      const stab = [0, 3, 6]; // diminished chord
      stab.forEach(semi => {
        const f = freq(cfg.root * 2, semi);
        const start = Math.floor(bi * beatLen * sr);
        const len   = Math.floor(beatLen * 2 * sr * 0.8);
        for (let i = 0; i < len && start + i < totalSamples; i++) {
          const t = i / sr;
          const trem = 0.5 + 0.5 * Math.sin(twoPi * 8 * t); // 8Hz tremolo
          const env  = Math.min(1, t * 20) * Math.exp(-t * 3);
          const val  = Math.sin(twoPi * f * t) * env * trem * 0.06;
          L[start + i] = (L[start + i] || 0) + val;
          R[start + i] = (R[start + i] || 0) + val;
        }
      });
    });

    return buffer;
  }
};
