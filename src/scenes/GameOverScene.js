import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { GameState } from '../GameState.js';
import { AudioManager } from '../audio/AudioManager.js';
import { getRawPad, isButtonDown, getAxis } from '../input/GamepadInput.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
    this._padFocus   = 0; // 0=Try Again, 1=Main Menu
    this._padLeftPrev  = false;
    this._padRightPrev = false;
    this._padAPrev     = false;
  }

  create() {
    AudioManager.init(this);
    AudioManager.stopMusic();
    AudioManager.play('game_over');

    this._padFocus = 0;

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, '💔', {
      fontSize: '60px'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, 'Oh no!', {
      fontSize: '42px', color: '#ff6666', fontFamily: 'Arial Black, Arial',
      stroke: '#660000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 38, "Little Fox needs to try again!", {
      fontSize: '18px', color: '#dddddd', fontFamily: 'Arial'
    }).setOrigin(0.5);

    this._btn0 = this._makeButton(GAME_WIDTH / 2 - 90, GAME_HEIGHT / 2 + 90, 'Try Again', 0x226644, () => {
      AudioManager.play('button_click');
      GameState.resetForLevel();
      this.scene.start('GameScene', { level: GameState.state.currentLevel });
    });

    this._btn1 = this._makeButton(GAME_WIDTH / 2 + 90, GAME_HEIGHT / 2 + 90, 'Main Menu', 0x334466, () => {
      AudioManager.play('button_click');
      this.scene.start('StartScene');
    });

    this._updateFocusVisual();
  }

  update() {
    const pad = getRawPad();
    if (!pad) return;

    const leftNow  = isButtonDown(pad, 14) || getAxis(pad, 0) < -0.4;
    const rightNow = isButtonDown(pad, 15) || getAxis(pad, 0) >  0.4;
    const aNow     = isButtonDown(pad, 0);

    if ((leftNow && !this._padLeftPrev) || (rightNow && !this._padRightPrev)) {
      this._padFocus = this._padFocus === 0 ? 1 : 0;
      this._updateFocusVisual();
      AudioManager.play('button_click');
    }
    if (aNow && !this._padAPrev) {
      if (this._padFocus === 0) {
        AudioManager.play('button_click');
        GameState.resetForLevel();
        this.scene.start('GameScene', { level: GameState.state.currentLevel });
      } else {
        AudioManager.play('button_click');
        this.scene.start('StartScene');
      }
    }

    this._padLeftPrev  = leftNow;
    this._padRightPrev = rightNow;
    this._padAPrev     = aNow;
  }

  _updateFocusVisual() {
    if (this._btn0) this._btn0.setStrokeStyle(this._padFocus === 0 ? 3 : 2, this._padFocus === 0 ? 0xffff00 : 0xffffff);
    if (this._btn1) this._btn1.setStrokeStyle(this._padFocus === 1 ? 3 : 2, this._padFocus === 1 ? 0xffff00 : 0xffffff);
  }

  _makeButton(x, y, label, color, callback) {
    const bg = this.add.rectangle(x, y, 140, 40, color)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff);
    this.add.text(x, y, label, {
      fontSize: '17px', color: '#ffffff', fontFamily: 'Arial'
    }).setOrigin(0.5);
    bg.on('pointerdown', callback);
    bg.on('pointerover', () => bg.setAlpha(0.75));
    bg.on('pointerout',  () => bg.setAlpha(1));
    return bg;
  }
}
