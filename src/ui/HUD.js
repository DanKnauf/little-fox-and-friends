import { DEPTH, GAME_WIDTH } from '../constants.js';
import { GameState } from '../GameState.js';

const HEART_SIZE = 24;
const HEART_GAP = 6;
const SMALL_HEART = 18;
const SMALL_GAP = 4;
const HUD_X = 12;
const HUD_Y = 10;

export class HUD {
  constructor(scene, maxPlayerHearts, companionConfig) {
    this._scene = scene;
    this._maxPlayerHearts = maxPlayerHearts;
    this._companionConfig = companionConfig;
    this._playerHeartImages = [];
    this._companionRows = {};
    this._ammoText = null;
    this._scoreText = null;
    this._scoreDisplayed = GameState.state.score;

    this._build();

    this._onHeartsChanged = () => this.refresh();
    this._onAmmoChanged   = () => this._refreshAmmo();
    this._onScoreChanged  = (amount) => this._animateScoreGain(amount);

    scene.events.on('heartsChanged', this._onHeartsChanged);
    scene.events.on('ammoChanged',   this._onAmmoChanged);
    scene.events.on('scoreChanged',  this._onScoreChanged);
    scene.events.once('shutdown', () => {
      scene.events.off('heartsChanged', this._onHeartsChanged);
      scene.events.off('ammoChanged',   this._onAmmoChanged);
      scene.events.off('scoreChanged',  this._onScoreChanged);
    });
  }

  _build() {
    const scene = this._scene;

    // Player label
    this._playerLabel = scene.add.text(HUD_X, HUD_Y, '🦊', {
      fontSize: '16px'
    }).setScrollFactor(0).setDepth(DEPTH.HUD);

    // Player hearts
    for (let i = 0; i < this._maxPlayerHearts; i++) {
      const img = scene.add.image(
        HUD_X + 22 + i * (HEART_SIZE + HEART_GAP),
        HUD_Y + 10,
        'heart_full'
      ).setScrollFactor(0).setDepth(DEPTH.HUD).setScale(0.9);
      this._playerHeartImages.push(img);
    }

    // Ammo counter (bottom-right)
    this._ammoText = scene.add.text(
      scene.cameras.main.width - 12,
      scene.cameras.main.height - 12,
      this._ammoLabel(),
      { fontSize: '16px', color: '#ffe066', fontFamily: 'Arial Bold', stroke: '#4a3000', strokeThickness: 3 }
    ).setScrollFactor(0).setDepth(DEPTH.HUD).setOrigin(1, 1);

    // Score — top right
    scene.add.text(GAME_WIDTH - 12, HUD_Y - 2, 'SCORE', {
      fontSize: '9px', color: '#aaaaff', fontFamily: 'Arial Bold'
    }).setScrollFactor(0).setDepth(DEPTH.HUD).setOrigin(1, 0);

    this._scoreText = scene.add.text(GAME_WIDTH - 12, HUD_Y + 8, String(GameState.state.score), {
      fontSize: '20px', color: '#ffffff', fontFamily: 'Arial Black, Arial',
      stroke: '#000033', strokeThickness: 3
    }).setScrollFactor(0).setDepth(DEPTH.HUD).setOrigin(1, 0);

    // Companion rows
    let rowY = HUD_Y + HEART_SIZE + 10;
    for (const [key, cfg] of Object.entries(this._companionConfig)) {
      const label = cfg.iconKey
        ? scene.add.image(HUD_X + 10, rowY + 7, cfg.iconKey)
            .setScrollFactor(0).setDepth(DEPTH.HUD).setScale(0.85)
        : scene.add.text(HUD_X, rowY, cfg.emoji || '●', {
            fontSize: '14px', color: cfg.color
          }).setScrollFactor(0).setDepth(DEPTH.HUD);

      const hearts = [];
      for (let i = 0; i < cfg.maxHearts; i++) {
        const img = scene.add.image(
          HUD_X + 20 + i * (SMALL_HEART + SMALL_GAP),
          rowY + 8,
          'heart_small'
        ).setScrollFactor(0).setDepth(DEPTH.HUD).setScale(0.8);
        hearts.push(img);
      }
      this._companionRows[key] = { label, hearts };
      rowY += SMALL_HEART + 8;
    }
  }

  refresh() {
    const scene = this._scene;

    const player = scene._littleFox;
    if (player) {
      const playerHearts = player.hearts;
      for (let i = 0; i < this._playerHeartImages.length; i++) {
        const filled = i < playerHearts;
        this._playerHeartImages[i].setTexture(filled ? 'heart_full' : 'heart_empty');
        this._playerHeartImages[i].setAlpha(filled ? 1 : 0.4);
      }
    }

    for (const [key, row] of Object.entries(this._companionRows)) {
      const companion = scene._companions?.[key];
      if (!companion) {
        row.label.setAlpha(0.3);
        row.hearts.forEach(h => h.setAlpha(0.2));
        continue;
      }
      row.label.setAlpha(1);
      const compHearts = companion.hearts;
      for (let i = 0; i < row.hearts.length; i++) {
        const filled = i < compHearts;
        row.hearts[i].setTexture(filled ? 'heart_small' : 'heart_empty');
        row.hearts[i].setAlpha(filled ? 1 : 0.3);
      }
    }
  }

  // Instantly sync displayed score without animation (e.g. after death penalty applied)
  refreshScore() {
    this._scoreDisplayed = GameState.state.score;
    if (this._scoreText?.active) this._scoreText.setText(String(this._scoreDisplayed));
  }

  _animateScoreGain(amount) {
    if (!this._scoreText?.active) return;
    const newScore = GameState.state.score;
    const oldScore = this._scoreDisplayed;
    this._scoreDisplayed = newScore;

    // Floating "+N" popup near the score text
    const popup = this._scene.add.text(
      GAME_WIDTH - 14,
      HUD_Y + 30,
      `+${amount}`,
      { fontSize: '13px', color: '#ffff44', fontFamily: 'Arial Black, Arial',
        stroke: '#332200', strokeThickness: 2 }
    ).setScrollFactor(0).setDepth(DEPTH.HUD + 1).setOrigin(1, 0);

    this._scene.tweens.add({
      targets: popup,
      y: popup.y - 28,
      alpha: 0,
      duration: 900,
      ease: 'Power2',
      onComplete: () => { if (popup.active) popup.destroy(); }
    });

    // Count-up animation on the score number
    const counter = { val: oldScore };
    this._scene.tweens.add({
      targets: counter,
      val: newScore,
      duration: 450,
      ease: 'Linear',
      onUpdate: () => { if (this._scoreText?.active) this._scoreText.setText(String(Math.floor(counter.val))); },
      onComplete: () => { if (this._scoreText?.active) this._scoreText.setText(String(newScore)); }
    });

    // Brief scale pop on the score text
    this._scene.tweens.add({
      targets: this._scoreText,
      scaleX: { from: 1.3, to: 1 },
      scaleY: { from: 1.3, to: 1 },
      duration: 300,
      ease: 'Back.easeOut'
    });
  }

  _ammoLabel() {
    const ammo = GameState.state.ammo;
    return `★ ${ammo === Infinity ? '∞' : ammo}`;
  }

  _refreshAmmo() {
    if (this._ammoText) {
      this._ammoText.setText(this._ammoLabel());
      const ammo = GameState.state.ammo;
      const color = ammo <= 5 ? '#ff4444' : ammo <= 10 ? '#ffaa22' : '#ffe066';
      this._ammoText.setColor(color);
    }
  }
}
