import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { AudioManager } from '../audio/AudioManager.js';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene', active: false });
    this._padAPrev      = false;
    this._padStartPrev  = false;
    this._padFocus      = 0; // 0=Resume, 1=Quit
    this._padLeftPrev   = false;
    this._padRightPrev  = false;
  }

  create() {
    this._padFocus = 0;
    // Assume buttons are held on first launch (Start was just pressed to get here)
    this._padStartPrev = true;
    this._padAPrev     = true;

    // When woken from sleep, assume Start (and A) are still physically held
    // so the rising-edge check in update() doesn't fire on the very first frame.
    this.events.on('wake', () => {
      this._padFocus     = 0;
      this._padStartPrev = true;
      this._padAPrev     = true;
      this._padLeftPrev  = false;
      this._padRightPrev = false;
      this._updateFocus();
    });

    // Dark overlay
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.72)
      .setScrollFactor(0);

    // Title
    this.add.text(GAME_WIDTH / 2, 60, 'PAUSED', {
      fontSize: '44px', color: '#ffffff', fontFamily: 'Arial Black, Arial',
      stroke: '#000000', strokeThickness: 5
    }).setOrigin(0.5).setScrollFactor(0);

    // Controls reference
    const controls = [
      ['A / D  or  ←→',      'Move left / right'],
      ['W  or  A button',    'Jump'],
      ['S  or  D-pad down',  'Crouch'],
      ['SPACE / X / RB / RT','Shoot forward'],
      ['Left Click',         'Shoot toward cursor'],
      ['Potions',            'Giant + Invincible (10s)'],
      ['★ Crates',           'Refill ammo (+10)'],
      ['ESC / Start',        'Pause / Unpause'],
    ];

    const colLeft = 80, colRight = 310;
    const rowStart = 120;
    this.add.text(GAME_WIDTH / 2, rowStart - 16, 'CONTROLS', {
      fontSize: '13px', color: '#aabbff', fontFamily: 'Arial Bold'
    }).setOrigin(0.5).setScrollFactor(0);

    controls.forEach(([key, desc], i) => {
      const y = rowStart + 4 + i * 22;
      this.add.text(colLeft, y, key,  { fontSize: '11px', color: '#ffe066', fontFamily: 'Arial Bold' }).setScrollFactor(0);
      this.add.text(colRight, y, desc, { fontSize: '11px', color: '#ddddff', fontFamily: 'Arial' }).setScrollFactor(0);
    });

    // Buttons
    const btnY = GAME_HEIGHT / 2 + 110;
    this._btnResume = this._makeButton(GAME_WIDTH / 2 - 100, btnY, 'Resume',      0x226644, () => this._resume());
    this._btnQuit   = this._makeButton(GAME_WIDTH / 2 + 100, btnY, 'Quit to Menu', 0x334466, () => this._quit());

    // ESC key to resume
    this._escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this._updateFocus();
  }

  update() {
    // ESC key
    if (Phaser.Input.Keyboard.JustDown(this._escKey)) {
      this._resume();
      return;
    }

    const pad = this.input.gamepad?.getPad(0) ?? null;
    if (pad) {
      const aNow     = pad.isButtonDown(0);
      const startNow = pad.isButtonDown(9);
      const leftNow  = pad.isButtonDown(14) || (pad.axes[0]?.getValue() ?? 0) < -0.4;
      const rightNow = pad.isButtonDown(15) || (pad.axes[0]?.getValue() ?? 0) >  0.4;

      if (startNow && !this._padStartPrev) { this._resume(); return; }

      if ((leftNow && !this._padLeftPrev) || (rightNow && !this._padRightPrev)) {
        this._padFocus = this._padFocus === 0 ? 1 : 0;
        this._updateFocus();
      }
      if (aNow && !this._padAPrev) {
        if (this._padFocus === 0) this._resume();
        else this._quit();
      }

      this._padAPrev     = aNow;
      this._padStartPrev = startNow;
      this._padLeftPrev  = leftNow;
      this._padRightPrev = rightNow;
    }
  }

  _resume() {
    AudioManager.play('button_click');
    this.scene.sleep('PauseScene');   // keep objects alive to avoid texture cache issues
    this.scene.resume('GameScene');
  }

  _quit() {
    AudioManager.play('button_click');
    this.scene.stop('PauseScene');    // full stop only when actually quitting
    this.scene.stop('BossScene');
    this.scene.stop('GameScene');
    this.scene.start('StartScene');
  }

  _updateFocus() {
    if (this._btnResume) this._btnResume.setStrokeStyle(this._padFocus === 0 ? 3 : 2, this._padFocus === 0 ? 0xffff00 : 0xffffff);
    if (this._btnQuit)   this._btnQuit.setStrokeStyle(this._padFocus === 1 ? 3 : 2, this._padFocus === 1 ? 0xffff00 : 0xffffff);
  }

  _makeButton(x, y, label, color, callback) {
    const bg = this.add.rectangle(x, y, 150, 40, color)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff)
      .setScrollFactor(0);
    this.add.text(x, y, label, {
      fontSize: '16px', color: '#ffffff', fontFamily: 'Arial Bold'
    }).setOrigin(0.5).setScrollFactor(0);
    bg.on('pointerdown', callback);
    bg.on('pointerover', () => bg.setAlpha(0.75));
    bg.on('pointerout',  () => bg.setAlpha(1));
    return bg;
  }
}
