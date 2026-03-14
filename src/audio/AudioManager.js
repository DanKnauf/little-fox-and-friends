// AudioManager — wraps Web Audio API playback
// Call resume() once after first user gesture, then play/playLoop freely

export const AudioManager = {
  _scene: null,
  _ctx: null,
  _buffers: {},
  _loopSources: {},
  _musicSource: null,
  _musicVolume: 0.4,
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
    if (this._loopSources[key]) return; // already looping
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
    const buffer = this._buildMusicBuffer(level);
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

  _buildMusicBuffer(level) {
    if (!this._ctx) return null;
    const sampleRate = this._ctx.sampleRate;
    const bpm = level === 2 ? 90 : level === 3 ? 100 : 110;
    const beatLen = 60 / bpm;
    const twoPi = Math.PI * 2;

    // Simple 8-bar motif patterns per level
    const patterns = {
      1: [0,4,7,12, 7,4,0,4, 2,4,9,7, 4,2,0,-1],   // forest: C major pentatonic
      2: [0,3,7,10, 7,3,0,3, 5,3,8,7, 3,5,0,-1],   // desert: minor feel
      3: [0,5,7,12, 7,5,0,5, 2,4,9,7, 5,2,0,-1]    // ocean: open fifths
    };

    const rootFreqs = { 1: 262, 2: 220, 3: 294 };
    const root = rootFreqs[level] || 262;
    const pattern = patterns[level] || patterns[1];

    const totalBeats = pattern.length;
    const totalLen = Math.ceil(sampleRate * beatLen * totalBeats);
    const buffer = this._ctx.createBuffer(1, totalLen, sampleRate);
    const data = buffer.getChannelData(0);

    for (let bi = 0; bi < pattern.length; bi++) {
      const semitone = pattern[bi];
      if (semitone === -1) continue;
      const freq = root * Math.pow(2, semitone / 12);
      const start = Math.floor(bi * beatLen * sampleRate);
      const len = Math.floor(beatLen * sampleRate * 0.8);
      for (let i = 0; i < len; i++) {
        const t = i / sampleRate;
        const env = Math.min(1, t * 20) * Math.exp(-t * 2);
        data[start + i] += Math.sin(twoPi * freq * t) * env * 0.2;
        data[start + i] += Math.sin(twoPi * freq * 2 * t) * env * 0.05;
      }
    }

    return buffer;
  }
};
