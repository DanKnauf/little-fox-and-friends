import { GameState } from '../GameState.js';
import { AudioManager } from '../audio/AudioManager.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { getRawPad, isButtonDown, getAxis } from '../input/GamepadInput.js';

const DIFF_ORDER = ['easy', 'medium', 'hard'];

export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
    this._selectedDifficulty = 'medium';
    this._padLeftPrev  = false;
    this._padRightPrev = false;
    this._padAPrev     = false;
  }

  create() {
    AudioManager.init(this);
    GameState.reset();
    this._selectedDifficulty = 'medium';

    // ── Background ─────────────────────────────────────────────────────────
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0c0420, 0x0c0420, 0x1c0a42, 0x1c0a42, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Stars — more density, varied sizes
    for (let i = 0; i < 90; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT);
      const r = Math.random() < 0.12 ? 2.5 : Math.random() < 0.35 ? 1.5 : 0.8;
      const a = 0.4 + Math.random() * 0.6;
      const star = this.add.circle(x, y, r, 0xffffff, a);
      this.tweens.add({
        targets: star,
        alpha: { from: a * 0.3, to: a },
        duration: 900 + Math.random() * 1800,
        yoyo: true, repeat: -1,
        delay: Math.random() * 1500
      });
    }

    // ── Title ───────────────────────────────────────────────────────────────
    this.add.text(GAME_WIDTH / 2, 40, 'Little Fox', {
      fontSize: '44px', color: '#FF7722', fontFamily: 'Arial Black, Arial',
      stroke: '#4a1800', strokeThickness: 7
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 80, '& Friends', {
      fontSize: '28px', color: '#ffe066', fontFamily: 'Arial Black, Arial',
      stroke: '#7a4400', strokeThickness: 4
    }).setOrigin(0.5);

    // Fox sprite
    const foxPreview = this.add.sprite(GAME_WIDTH / 2, 122, 'fox').setScale(2.0);
    foxPreview.play('fox_idle');
    this.tweens.add({
      targets: foxPreview,
      y: { from: 119, to: 127 },
      duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    // Tagline
    this.add.text(GAME_WIDTH / 2, 150, 'Help Little Fox rescue his Mama Sloth!', {
      fontSize: '12px', color: '#b8a8ff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    // ── Panel layout constants ───────────────────────────────────────────────
    const PANEL_TOP = 162;
    const PANEL_H   = 175;
    const P_LEFT    = 16;
    const P_MID_R   = GAME_WIDTH / 2 - 8;   // right edge of left panel
    const P_RIGHT_L = GAME_WIDTH / 2 + 8;   // left edge of right panel
    const P_RIGHT   = GAME_WIDTH - 16;
    const LEFT_W    = P_MID_R - P_LEFT;
    const RIGHT_W   = P_RIGHT - P_RIGHT_L;

    // ── How To Play panel ────────────────────────────────────────────────────
    this._drawPanel(P_LEFT, PANEL_TOP, LEFT_W, PANEL_H);

    this.add.text(P_LEFT + 10, PANEL_TOP + 8, 'HOW TO PLAY', {
      fontSize: '12px', color: '#99aaff', fontFamily: 'Arial Bold'
    });
    // Separator
    const sepG = this.add.graphics();
    sepG.lineStyle(1, 0x4455cc, 0.6);
    sepG.lineBetween(P_LEFT + 10, PANEL_TOP + 24, P_MID_R - 10, PANEL_TOP + 24);

    const KEY_X  = P_LEFT + 10;
    const DESC_X = P_LEFT + 112;
    const controls = [
      ['A / D  or  ←→',  'Move left / right'],
      ['W  or  A btn',   'Jump'],
      ['S  or  ↓',       'Crouch (grounded)'],
      ['SPACE / X / RB', 'Shoot forward'],
      ['Left Click',     'Shoot toward cursor'],
      ['Potions',        'Giant-up! Full health'],
      ['★ Crates',       'Refill ammo (+10)'],
    ];
    controls.forEach(([key, desc], i) => {
      const cy = PANEL_TOP + 32 + i * 18;
      this.add.text(KEY_X,  cy, key,  { fontSize: '11px', color: '#ffe066', fontFamily: 'Arial Bold' });
      this.add.text(DESC_X, cy, desc, { fontSize: '11px', color: '#dde0ff', fontFamily: 'Arial' });
    });

    // ── Difficulty Info panel ────────────────────────────────────────────────
    this._drawPanel(P_RIGHT_L, PANEL_TOP, RIGHT_W, PANEL_H);

    this.add.text(P_RIGHT_L + 10, PANEL_TOP + 8, 'DIFFICULTY', {
      fontSize: '12px', color: '#99aaff', fontFamily: 'Arial Bold'
    });
    const sepG2 = this.add.graphics();
    sepG2.lineStyle(1, 0x4455cc, 0.6);
    sepG2.lineBetween(P_RIGHT_L + 10, PANEL_TOP + 24, P_RIGHT - 10, PANEL_TOP + 24);

    const diffInfo = [
      { label: '★  Easy',    color: '#44ff88', heartsText: '♥ ♥ ♥ ♥ ♥', ammo: '∞  Unlimited ammo' },
      { label: '★★  Medium', color: '#ffdd44', heartsText: '♥ ♥ ♥ ♥',   ammo: '40 ammo + pickups' },
      { label: '★★★  Hard',  color: '#ff6655', heartsText: '♥ ♥ ♥',     ammo: '20 ammo + pickups' },
    ];
    diffInfo.forEach((d, i) => {
      const dy = PANEL_TOP + 32 + i * 47;
      this.add.text(P_RIGHT_L + 10, dy, d.label, {
        fontSize: '13px', color: d.color, fontFamily: 'Arial Bold'
      });
      this.add.text(P_RIGHT_L + 10, dy + 18, d.heartsText, {
        fontSize: '11px', color: '#ff6677', fontFamily: 'Arial'
      });
      this.add.text(P_RIGHT_L + 10, dy + 32, d.ammo, {
        fontSize: '11px', color: '#aabbcc', fontFamily: 'Arial'
      });
    });

    // ── Difficulty selector buttons ──────────────────────────────────────────
    this.add.text(GAME_WIDTH / 2, 350, 'Choose Difficulty:', {
      fontSize: '13px', color: '#ddddff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    this._diffButtons = {};
    const diffs = [
      { key: 'easy',   label: 'Easy',   x: GAME_WIDTH / 2 - 134, color: 0x1a8836, hover: 0x22aa44 },
      { key: 'medium', label: 'Medium', x: GAME_WIDTH / 2,        color: 0xcc9900, hover: 0xeecc00 },
      { key: 'hard',   label: 'Hard',   x: GAME_WIDTH / 2 + 134,  color: 0xbb1c1c, hover: 0xdd2222 }
    ];
    for (const d of diffs) {
      const btn = this._makeDiffButton(d.x, 376, d.label, d.key, d.color, d.hover);
      this._diffButtons[d.key] = btn;
    }
    this._highlightDiff('medium');

    // ── Touch Controls toggle ────────────────────────────────────────────────
    this._makeTouchToggle(GAME_WIDTH / 2, 418);

    // ── START GAME button ────────────────────────────────────────────────────
    const startBg = this._makeStartButton(GAME_WIDTH / 2, 454);
    startBg.on('pointerdown', () => {
      AudioManager.resume();
      AudioManager.play('button_click');
      GameState.applyDifficulty(this._selectedDifficulty);
      this.scene.start('LevelIntroScene', { level: 1 });
    });
  }

  update() {
    const pad = getRawPad();
    if (!pad) return;

    const leftNow  = isButtonDown(pad, 14) || getAxis(pad, 0) < -0.4;
    const rightNow = isButtonDown(pad, 15) || getAxis(pad, 0) >  0.4;
    const aNow     = isButtonDown(pad, 0);

    if (leftNow && !this._padLeftPrev) {
      const idx = DIFF_ORDER.indexOf(this._selectedDifficulty);
      if (idx > 0) {
        this._selectedDifficulty = DIFF_ORDER[idx - 1];
        this._highlightDiff(this._selectedDifficulty);
        AudioManager.play('button_click');
      }
    }
    if (rightNow && !this._padRightPrev) {
      const idx = DIFF_ORDER.indexOf(this._selectedDifficulty);
      if (idx < DIFF_ORDER.length - 1) {
        this._selectedDifficulty = DIFF_ORDER[idx + 1];
        this._highlightDiff(this._selectedDifficulty);
        AudioManager.play('button_click');
      }
    }
    if (aNow && !this._padAPrev) {
      AudioManager.resume();
      AudioManager.play('button_click');
      GameState.applyDifficulty(this._selectedDifficulty);
      this.scene.start('LevelIntroScene', { level: 1 });
    }

    this._padLeftPrev  = leftNow;
    this._padRightPrev = rightNow;
    this._padAPrev     = aNow;
  }

  // Draws a dark panel with a two-tone border
  _drawPanel(x, y, w, h) {
    const g = this.add.graphics();
    // Outer glow (1px larger)
    g.lineStyle(3, 0x2233aa, 0.3);
    g.strokeRect(x - 1, y - 1, w + 2, h + 2);
    // Fill
    g.fillStyle(0x000000, 0.52);
    g.fillRect(x, y, w, h);
    // Border
    g.lineStyle(1, 0x4a5dcc, 0.9);
    g.strokeRect(x, y, w, h);
    // Inner highlight (top + left edges)
    g.lineStyle(1, 0x6677ee, 0.25);
    g.lineBetween(x + 1, y + 1, x + w - 1, y + 1);
    g.lineBetween(x + 1, y + 1, x + 1, y + h - 1);
  }

  _makeTouchToggle(x, y) {
    const W = 200, H = 24;
    const on = () => GameState.state.touchControlsEnabled;

    const bg = this.add.rectangle(x, y, W, H, on() ? 0x226644 : 0x444466)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(1, 0x888888);

    const label = this.add.text(x, y, `Touch Controls: ${on() ? 'ON' : 'OFF'}`, {
      fontSize: '12px', color: '#ffffff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    bg.on('pointerdown', () => {
      GameState.state.touchControlsEnabled = !GameState.state.touchControlsEnabled;
      bg.setFillStyle(on() ? 0x226644 : 0x444466);
      label.setText(`Touch Controls: ${on() ? 'ON' : 'OFF'}`);
      AudioManager.play('button_click');
    });
    bg.on('pointerover', () => bg.setAlpha(0.75));
    bg.on('pointerout',  () => bg.setAlpha(1));
  }

  _makeDiffButton(x, y, label, key, color, hoverColor) {
    const container = this.add.container(x, y);
    const bg   = this.add.rectangle(0, 0, 108, 32, color).setInteractive({ useHandCursor: true });
    const text = this.add.text(0, 0, label, {
      fontSize: '16px', color: '#ffffff', fontFamily: 'Arial Black, Arial'
    }).setOrigin(0.5);
    container.add([bg, text]);

    bg.on('pointerover', () => bg.setFillStyle(hoverColor));
    bg.on('pointerout',  () => this._highlightDiff(this._selectedDifficulty));
    bg.on('pointerdown', () => {
      this._selectedDifficulty = key;
      this._highlightDiff(key);
      AudioManager.play('button_click');
    });

    return { bg, text, color, hoverColor };
  }

  _highlightDiff(key) {
    const base     = { easy: 0x1a8836, medium: 0xcc9900, hard: 0xbb1c1c };
    const bright   = { easy: 0x33dd66, medium: 0xffdd44, hard: 0xff4444 };
    for (const [k, btn] of Object.entries(this._diffButtons)) {
      btn.bg.setFillStyle(k === key ? bright[k] : base[k]);
      btn.bg.setStrokeStyle(k === key ? 3 : 0, 0xffffff);
    }
  }

  _makeStartButton(x, y) {
    const W = 224, H = 40;
    const g = this.add.graphics();

    // Shadow / glow
    g.lineStyle(4, 0x1144dd, 0.4);
    g.strokeRect(x - W / 2 - 2, y - H / 2 - 2, W + 4, H + 4);
    // Button fill
    g.fillStyle(0x2244cc, 1);
    g.fillRect(x - W / 2, y - H / 2, W, H);
    // Top highlight
    g.fillStyle(0xffffff, 0.12);
    g.fillRect(x - W / 2, y - H / 2, W, H / 2);
    // Border
    g.lineStyle(2, 0xffffff, 0.9);
    g.strokeRect(x - W / 2, y - H / 2, W, H);

    this.add.text(x, y, 'START GAME', {
      fontSize: '22px', color: '#ffffff', fontFamily: 'Arial Black, Arial'
    }).setOrigin(0.5);

    // Make interactive via a transparent rectangle on top
    const hitArea = this.add.rectangle(x, y, W, H, 0x000000, 0)
      .setInteractive({ useHandCursor: true });
    hitArea.on('pointerover', () => {
      g.clear();
      g.lineStyle(4, 0x4488ff, 0.5);
      g.strokeRect(x - W / 2 - 2, y - H / 2 - 2, W + 4, H + 4);
      g.fillStyle(0x3366ee, 1);
      g.fillRect(x - W / 2, y - H / 2, W, H);
      g.fillStyle(0xffffff, 0.15);
      g.fillRect(x - W / 2, y - H / 2, W, H / 2);
      g.lineStyle(2, 0xffffff, 1);
      g.strokeRect(x - W / 2, y - H / 2, W, H);
    });
    hitArea.on('pointerout', () => {
      g.clear();
      g.lineStyle(4, 0x1144dd, 0.4);
      g.strokeRect(x - W / 2 - 2, y - H / 2 - 2, W + 4, H + 4);
      g.fillStyle(0x2244cc, 1);
      g.fillRect(x - W / 2, y - H / 2, W, H);
      g.fillStyle(0xffffff, 0.12);
      g.fillRect(x - W / 2, y - H / 2, W, H / 2);
      g.lineStyle(2, 0xffffff, 0.9);
      g.strokeRect(x - W / 2, y - H / 2, W, H);
    });

    return hitArea;
  }
}
