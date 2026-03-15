import { DEPTH } from '../constants.js';
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
    this._companionConfig = companionConfig; // { key: { hearts, maxHearts, label, color } }
    this._playerHeartImages = [];
    this._companionRows = {};
    this._ammoText = null;

    this._build();

    scene.events.on('heartsChanged', () => this.refresh());
    scene.events.on('ammoChanged', () => this._refreshAmmo());
    scene.events.on('shutdown', () => this._cleanup());
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

    // Ammo counter (bottom-right, always visible; shows ∞ on easy)
    this._ammoText = scene.add.text(
      scene.cameras.main.width - 12,
      scene.cameras.main.height - 12,
      this._ammoLabel(),
      { fontSize: '16px', color: '#ffe066', fontFamily: 'Arial Bold', stroke: '#4a3000', strokeThickness: 3 }
    ).setScrollFactor(0).setDepth(DEPTH.HUD).setOrigin(1, 1);

    // Companion rows
    let rowY = HUD_Y + HEART_SIZE + 10;
    for (const [key, cfg] of Object.entries(this._companionConfig)) {
      const label = scene.add.text(HUD_X, rowY, cfg.emoji || '●', {
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
    const gs = scene.registry.get?.('gameState') || null;

    // Use scene's live player/companion references
    const player = scene._littleFox;
    if (player) {
      const playerHearts = player.hearts;
      const maxHearts = player.maxHearts;
      for (let i = 0; i < this._playerHeartImages.length; i++) {
        const filled = i < playerHearts;
        this._playerHeartImages[i].setTexture(filled ? 'heart_full' : 'heart_empty');
        this._playerHeartImages[i].setAlpha(filled ? 1 : 0.4);
      }
    }

    // Companion hearts
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

  _cleanup() {
    // Images clean up with scene
  }
}
