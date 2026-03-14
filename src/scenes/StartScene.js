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
    this.add.text(GAME_WIDTH / 2, 90, 'Little Fox', {
      fontSize: '56px', color: '#E8722A', fontFamily: 'Arial Black, Arial',
      stroke: '#5a2000', strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 145, '& Friends', {
      fontSize: '40px', color: '#ffe066', fontFamily: 'Arial Black, Arial',
      stroke: '#8B5500', strokeThickness: 4
    }).setOrigin(0.5);

    // Fox sprite preview
    const foxPreview = this.add.sprite(GAME_WIDTH / 2, 210, 'fox').setScale(2.5);
    foxPreview.play('fox_idle');
    this.tweens.add({ targets: foxPreview, y: { from: 208, to: 214 }, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Story teaser
    this.add.text(GAME_WIDTH / 2, 255, 'Help Little Fox rescue his friend Mamoslav!', {
      fontSize: '14px', color: '#ccbbff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Difficulty label
    this.add.text(GAME_WIDTH / 2, 290, 'Choose Difficulty:', {
      fontSize: '18px', color: '#ffffff', fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Difficulty buttons
    this._diffButtons = {};
    const difficulties = [
      { key: 'easy',   label: 'Easy',   x: GAME_WIDTH / 2 - 130, color: 0x22aa44, hoverColor: 0x33cc55 },
      { key: 'medium', label: 'Medium', x: GAME_WIDTH / 2,        color: 0xddaa00, hoverColor: 0xffcc00 },
      { key: 'hard',   label: 'Hard',   x: GAME_WIDTH / 2 + 130,  color: 0xcc2222, hoverColor: 0xff3333 }
    ];

    for (const diff of difficulties) {
      const btn = this._makeDiffButton(diff.x, 330, diff.label, diff.key, diff.color, diff.hoverColor);
      this._diffButtons[diff.key] = btn;
    }

    // Highlight default
    this._highlightDiff('medium');

    // Start button
    const startBtn = this._makeButton(GAME_WIDTH / 2, 400, 'START GAME', 0x3355aa, 0x5577cc, 200, 44);
    startBtn.on('pointerdown', () => {
      AudioManager.resume();
      AudioManager.play('button_click');
      GameState.applyDifficulty(this._selectedDifficulty);
      this.scene.start('LevelIntroScene', { level: 1 });
    });

    // Controls hint
    this.add.text(GAME_WIDTH / 2, 448, 'WASD: Move  |  Space: Jump  |  Click: Shoot', {
      fontSize: '12px', color: '#8888aa', fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  _makeDiffButton(x, y, label, key, color, hoverColor) {
    const container = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 100, 36, color).setInteractive({ useHandCursor: true });
    const text = this.add.text(0, 0, label, { fontSize: '16px', color: '#ffffff', fontFamily: 'Arial Bold' }).setOrigin(0.5);
    container.add([bg, text]);

    bg.on('pointerover', () => { bg.setFillColor(hoverColor); });
    bg.on('pointerout',  () => { this._highlightDiff(this._selectedDifficulty); });
    bg.on('pointerdown', () => {
      this._selectedDifficulty = key;
      this._highlightDiff(key);
      AudioManager.play('button_click');
    });

    return { bg, text, color, hoverColor };
  }

  _highlightDiff(key) {
    const colors = { easy: 0x22aa44, medium: 0xddaa00, hard: 0xcc2222 };
    const selected = { easy: 0x44ff88, medium: 0xffdd44, hard: 0xff5555 };
    for (const [k, btn] of Object.entries(this._diffButtons)) {
      btn.bg.setFillColor(k === key ? selected[k] : colors[k]);
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
    bg.on('pointerover', () => bg.setFillColor(hoverColor));
    bg.on('pointerout',  () => bg.setFillColor(color));
    // Return the bg for event listeners
    bg._container = container;
    return bg;
  }
}
