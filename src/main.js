import Phaser from 'phaser';

// Workaround for Phaser 3.90.x GamepadPlugin bug: stopListeners() iterates
// this.gamepads calling removeAllListeners() with no null guard, but
// navigator.getGamepads() can return sparse arrays with null slots that end
// up in this.gamepads, causing "Cannot read properties of undefined
// (reading 'removeAllListeners')" on every scene transition.
// Patch stopListeners() (the actual crash site) to filter nulls first.
try {
  const _proto = Phaser.Input.Gamepad.GamepadPlugin.prototype;
  const _origStop = _proto.stopListeners;
  _proto.stopListeners = function () {
    if (Array.isArray(this.gamepads)) {
      this.gamepads = this.gamepads.filter(Boolean);
    }
    _origStop.call(this);
  };
} catch (_) { /* Phaser build without gamepad support — nothing to patch */ }

import { BootScene } from './scenes/BootScene.js';
import { StartScene } from './scenes/StartScene.js';
import { LevelIntroScene } from './scenes/LevelIntroScene.js';
import { GameScene } from './scenes/GameScene.js';
import { BossScene } from './scenes/BossScene.js';
import { LevelCompleteScene } from './scenes/LevelCompleteScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';

// Polyfill CanvasRenderingContext2D.roundRect for older browsers
// (Firefox < 112, Safari < 15.4). Must run before BootScene generates textures.
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    const R = Math.min(Array.isArray(r) ? r[0] : (r || 0), w / 2, h / 2);
    this.moveTo(x + R, y);
    this.lineTo(x + w - R, y);
    this.arcTo(x + w, y,     x + w, y + R,     R);
    this.lineTo(x + w, y + h - R);
    this.arcTo(x + w, y + h, x + w - R, y + h, R);
    this.lineTo(x + R, y + h);
    this.arcTo(x,     y + h, x,     y + h - R, R);
    this.lineTo(x, y + R);
    this.arcTo(x,     y,     x + R, y,         R);
    this.closePath();
  };
}

function removeLoadingScreen() {
  const el = document.getElementById('loading-screen');
  if (el) el.remove();
}

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#1a0a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    antialias: true,
    resolution: window.devicePixelRatio || 1
  },
  input: {
    gamepad: true
  },
  callbacks: {
    postBoot: (game) => { removeLoadingScreen(); }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  },
  scene: [
    BootScene,
    StartScene,
    LevelIntroScene,
    GameScene,
    BossScene,
    LevelCompleteScene,
    GameOverScene,
    VictoryScene,
    PauseScene
  ]
};

new Phaser.Game(config);
