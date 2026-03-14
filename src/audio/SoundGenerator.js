// Procedural sound synthesis using Web Audio API
// All sounds are generated as AudioBuffers and stored in Phaser's cache
// No playback occurs here — AudioManager handles playback after user gesture

export const SoundGenerator = {
  _ctx: null,
  _buffers: {},

  registerAll(scene) {
    try {
      // Get or create AudioContext from Phaser's sound manager
      if (scene.sound && scene.sound.context) {
        this._ctx = scene.sound.context;
      } else {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = this._ctx;

      this._buffers['footstep_fox']     = this._noise(ctx, 0.08, 0.8, 0.06);
      this._buffers['footstep_bear']    = this._tone(ctx, 80,  0.12, 'sine',   0.4);
      this._buffers['footstep_stegge']  = this._tone(ctx, 50,  0.20, 'sine',   0.6);
      this._buffers['jump']             = this._sweep(ctx, 200, 600, 0.15,  0.3);
      this._buffers['shoot']            = this._sweep(ctx, 800, 1200, 0.06, 0.4);
      this._buffers['hurt']             = this._sweep(ctx, 400, 200,  0.10, 0.5, 'square');
      this._buffers['defeat_player']    = this._melody(ctx, [440,392,349,330], 0.15, 0.5);
      this._buffers['potion_collect']   = this._shimmer(ctx, [523,659,784,1047,1319], 0.08, 0.5);
      this._buffers['enemy_hit']        = this._noise(ctx, 0.04, 0.95, 0.02);
      this._buffers['enemy_defeat']     = this._sweep(ctx, 300, 80, 0.15, 0.7);
      this._buffers['boss_telegraph']   = this._tone(ctx, 60, 0.5, 'sawtooth', 0.3);
      this._buffers['boss_damage']      = this._sweep(ctx, 200, 100, 0.20, 0.6, 'sawtooth');
      this._buffers['level_complete']   = this._melody(ctx, [523,659,784,1047], 0.12, 0.3);
      this._buffers['game_over']        = this._melody(ctx, [440,392,330,262], 0.18, 0.4);
      this._buffers['victory']          = this._victory(ctx);
      this._buffers['button_click']     = this._noise(ctx, 0.06, 0.95, 0.03);
      this._buffers['level_start']      = this._melody(ctx, [523,659,784], 0.1, 0.15);
      this._buffers['boss_defeat']      = this._victory(ctx, 0.7);
      this._buffers['bear_attack']      = this._tone(ctx, 120, 0.1, 'sawtooth', 0.4);
      this._buffers['stegge_attack']    = this._tone(ctx, 80,  0.15, 'sawtooth', 0.5);

      // Store buffers in scene's registry for AudioManager to access
      scene.registry.set('soundBuffers', this._buffers);
    } catch (e) {
      console.warn('SoundGenerator: Web Audio not available', e);
    }
  },

  _noise(ctx, duration, decay, volume) {
    const sampleRate = ctx.sampleRate;
    const length = Math.ceil(sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * volume * Math.pow(1 - i / length, decay * 10);
    }
    return buffer;
  },

  _tone(ctx, freq, duration, type, volume) {
    const sampleRate = ctx.sampleRate;
    const length = Math.ceil(sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    const twoPi = Math.PI * 2;
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-t * 6);
      let sample = 0;
      if (type === 'sine') {
        sample = Math.sin(twoPi * freq * t);
      } else if (type === 'square') {
        sample = Math.sin(twoPi * freq * t) > 0 ? 1 : -1;
      } else if (type === 'sawtooth') {
        sample = 2 * ((freq * t) % 1) - 1;
      }
      data[i] = sample * env * volume;
    }
    return buffer;
  },

  _sweep(ctx, startFreq, endFreq, duration, volume, type = 'sine') {
    const sampleRate = ctx.sampleRate;
    const length = Math.ceil(sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    const twoPi = Math.PI * 2;
    let phase = 0;
    for (let i = 0; i < length; i++) {
      const t = i / length;
      const env = Math.exp(-t * 5);
      const freq = startFreq + (endFreq - startFreq) * t;
      phase += twoPi * freq / sampleRate;
      let sample = 0;
      if (type === 'sine') {
        sample = Math.sin(phase);
      } else if (type === 'square') {
        sample = Math.sin(phase) > 0 ? 1 : -1;
      } else if (type === 'sawtooth') {
        sample = 2 * (phase / twoPi % 1) - 1;
      }
      data[i] = sample * env * volume;
    }
    return buffer;
  },

  _melody(ctx, notes, noteDur, volume) {
    const sampleRate = ctx.sampleRate;
    const noteLen = Math.ceil(sampleRate * noteDur);
    const buffer = ctx.createBuffer(1, noteLen * notes.length, sampleRate);
    const data = buffer.getChannelData(0);
    const twoPi = Math.PI * 2;
    for (let ni = 0; ni < notes.length; ni++) {
      const freq = notes[ni];
      const offset = ni * noteLen;
      for (let i = 0; i < noteLen; i++) {
        const t = i / sampleRate;
        const env = Math.exp(-t * 8);
        data[offset + i] = Math.sin(twoPi * freq * t) * env * volume;
      }
    }
    return buffer;
  },

  _shimmer(ctx, notes, noteDur, volume) {
    const sampleRate = ctx.sampleRate;
    const totalLen = Math.ceil(sampleRate * (noteDur * notes.length + 0.2));
    const buffer = ctx.createBuffer(1, totalLen, sampleRate);
    const data = buffer.getChannelData(0);
    const twoPi = Math.PI * 2;
    for (let ni = 0; ni < notes.length; ni++) {
      const freq = notes[ni];
      const startSample = Math.floor(ni * noteDur * sampleRate * 0.6);
      const len = Math.ceil(sampleRate * 0.3);
      for (let i = 0; i < len && startSample + i < totalLen; i++) {
        const t = i / sampleRate;
        const env = Math.exp(-t * 6);
        data[startSample + i] += Math.sin(twoPi * freq * t) * env * volume;
      }
    }
    return buffer;
  },

  _victory(ctx, vol = 1.0) {
    const notes = [523,523,523,523,659,523,659,784,1047];
    const dur = 0.12;
    const sampleRate = ctx.sampleRate;
    const noteLen = Math.ceil(sampleRate * dur);
    const buffer = ctx.createBuffer(1, noteLen * notes.length, sampleRate);
    const data = buffer.getChannelData(0);
    const twoPi = Math.PI * 2;
    for (let ni = 0; ni < notes.length; ni++) {
      const freq = notes[ni];
      const offset = ni * noteLen;
      for (let i = 0; i < noteLen; i++) {
        const t = i / sampleRate;
        const env = Math.exp(-t * 5);
        data[offset + i] = (Math.sin(twoPi * freq * t) + 0.3 * Math.sin(twoPi * freq * 2 * t)) * env * vol * 0.4;
      }
    }
    return buffer;
  }
};
