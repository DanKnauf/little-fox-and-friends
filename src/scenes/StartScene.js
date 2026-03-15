import { GameState } from '../GameState.js';
import { AudioManager } from '../audio/AudioManager.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';

export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
    this._selectedDifficulty = 'medium';
  }

  create() {
    AudioManager.init(this);
    GameState.reset();
    this._selectedDifficulty = 'medium';

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0a2e, 0x1a0a2e, 0x2a1a4e, 0x2a1a4e, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Stars
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT * 0.6);
      const r = Math.random() < 0.2 ? 2 : 1;
      const star = this.add.circle(x, y, r, 0xffffff, 0.6 + Math.random() * 0.4);
      this.tweens.add({ targets: star, alpha: { from: 0.3, to: 1 }, duration: 800 + Math.random() * 1200, yoyo: true, repeat: -1 });
    }

    // Title
    this.add.text(GAME_WIDTH / 2, 52, 'Little Fox', {
      fontSize: '48px', color: '#E8722A', fontFamily: 'Arial Black, Arial',
      stroke: '#5a2000', strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 98, '& Friends', {
      fontSize: '32px', color: '#ffe066', fontFamily: 'Arial Black, Arial',
      stroke: '#8B5500', strokeThickness: 4
    }).setOrigin(0.5);

    // Fox sprite preview
    const foxPreview = this.add.sprite(GAME_WIDTH / 2, 148, 'fox').setScale(2.2);
    foxPreview.play('fox_idle');
    this.tweens.add({ targets: foxPreview, y: { from: 146, to: 152 }, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Story teaser
    this.add.text(GAME_WIDTH / 2, 180, 'Help Little Fox rescue his Mama Sloth!', {
      fontSize: '13px', color: '#ccbbff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    // ── Instructions Panel ───────────────────────────────────────────────────
    const panelLeft  = 30;
    const panelRight = GAME_WIDTH / 2 - 10;
    const panelTop   = 198;

    this.add.rectangle(
      (panelLeft + panelRight) / 2, panelTop + 82,
      panelRight - panelLeft, 160,
      0x000000, 0.45
    ).setStrokeStyle(1, 0x5566aa);

    this.add.text(panelLeft + 8, panelTop + 6, 'HOW TO PLAY', {
      fontSize: '11px', color: '#aabbff', fontFamily: 'Arial Bold'
    });

    const controls = [
      ['A / D',        'Move left / right'],
      ['W or SPACE',   'Jump'],
      ['S',            'Crouch (while grounded)'],
      ['Left Click',   'Shoot at cursor position'],
      ['Potions',      'Giant-up! Full health restore'],
      ['Ammo Crates',  'Refill your ammo supply'],
    ];

    controls.forEach(([key, desc], i) => {
      const cy = panelTop + 24 + i * 22;
      this.add.text(panelLeft + 8, cy, key, {
        fontSize: '11px', color: '#ffe066', fontFamily: 'Arial Bold'
      });
      this.add.text(panelLeft + 90, cy, desc, {
        fontSize: '11px', color: '#ddddff', fontFamily: 'Arial'
      });
    });

    // ── Difficulty Panel ─────────────────────────────────────────────────────
    const diffPanelLeft  = GAME_WIDTH / 2 + 10;
    const diffPanelRight = GAME_WIDTH - 30;

    this.add.rectangle(
      (diffPanelLeft + diffPanelRight) / 2, panelTop + 82,
      diffPanelRight - diffPanelLeft, 160,
      0x000000, 0.45
    ).setStrokeStyle(1, 0x5566aa);

    this.add.text(diffPanelLeft + 8, panelTop + 6, 'DIFFICULTY', {
      fontSize: '11px', color: '#aabbff', fontFamily: 'Arial Bold'
    });

    const diffInfo = [
      { key: 'easy',   label: '⭐ Easy',   color: '#44ff88', ammo: '∞ Unlimited ammo',    hearts: '5 hearts' },
      { key: 'medium', label: '⭐⭐ Medium', color: '#ffdd44', ammo: '40 ammo + pickups',   hearts: '4 hearts' },
      { key: 'hard',   label: '⭐⭐⭐ Hard',  color: '#ff5555', ammo: '20 ammo + pickups',   hearts: '3 hearts' },
    ];

    diffInfo.forEach((d, i) => {
      const dy = panelTop + 26 + i * 42;
      this.add.text(diffPanelLeft + 8, dy, d.label, {
        fontSize: '11px', color: d.color, fontFamily: 'Arial Bold'
      });
      this.add.text(diffPanelLeft + 8, dy + 14, d.hearts + '  |  ' + d.ammo, {
        fontSize: '10px', color: '#bbbbcc', fontFamily: 'Arial'
      });
    });

    // ── Difficulty Buttons ───────────────────────────────────────────────────
    this.add.text(GAME_WIDTH / 2, 374, 'Choose Difficulty:', {
      fontSize: '15px', color: '#ffffff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    this._diffButtons = {};
    const difficulties = [
      { key: 'easy',   label: 'Easy',   x: GAME_WIDTH / 2 - 130, color: 0x22aa44, hoverColor: 0x33cc55 },
      { key: 'medium', label: 'Medium', x: GAME_WIDTH / 2,        color: 0xddaa00, hoverColor: 0xffcc00 },
      { key: 'hard',   label: 'Hard',   x: GAME_WIDTH / 2 + 130,  color: 0xcc2222, hoverColor: 0xff3333 }
    ];

    for (const diff of difficulties) {
      const btn = this._makeDiffButton(diff.x, 400, diff.label, diff.key, diff.color, diff.hoverColor);
      this._diffButtons[diff.key] = btn;
    }

    this._highlightDiff('medium');

    // Start button
    const startBtn = this._makeButton(GAME_WIDTH / 2, 444, 'START GAME', 0x3355aa, 0x5577cc, 200, 44);
    startBtn.on('pointerdown', () => {
      AudioManager.resume();
      AudioManager.play('button_click');
      GameState.applyDifficulty(this._selectedDifficulty);
      this.scene.start('LevelIntroScene', { level: 1 });
    });
  }

  _makeDiffButton(x, y, label, key, color, hoverColor) {
    const container = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 100, 34, color).setInteractive({ useHandCursor: true });
    const text = this.add.text(0, 0, label, { fontSize: '15px', color: '#ffffff', fontFamily: 'Arial Bold' }).setOrigin(0.5);
    container.add([bg, text]);

    bg.on('pointerover', () => { bg.setFillStyle(hoverColor); });
    bg.on('pointerout',  () => { this._highlightDiff(this._selectedDifficulty); });
    bg.on('pointerdown', () => {
      this._selectedDifficulty = key;
      this._highlightDiff(key);
      AudioManager.play('button_click');
    });

    return { bg, text, color, hoverColor };
  }

  _highlightDiff(key) {
    const colors   = { easy: 0x22aa44, medium: 0xddaa00, hard: 0xcc2222 };
    const selected = { easy: 0x44ff88, medium: 0xffdd44, hard: 0xff5555 };
    for (const [k, btn] of Object.entries(this._diffButtons)) {
      btn.bg.setFillStyle(k === key ? selected[k] : colors[k]);
      btn.bg.setStrokeStyle(k === key ? 3 : 0, 0xffffff);
    }
  }

  _makeButton(x, y, label, color, hoverColor, w = 160, h = 40) {
    const container = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, w, h, color)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff);
    const text = this.add.text(0, 0, label, { fontSize: '20px', color: '#ffffff', fontFamily: 'Arial Black, Arial' }).setOrigin(0.5);
    container.add([bg, text]);
    bg.on('pointerover', () => bg.setFillStyle(hoverColor));
    bg.on('pointerout',  () => bg.setFillStyle(color));
    bg._container = container;
    return bg;
  }
}
