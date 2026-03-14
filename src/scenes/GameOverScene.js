import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { GameState } from '../GameState.js';
import { AudioManager } from '../audio/AudioManager.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    AudioManager.init(this);
    AudioManager.stopMusic();
    AudioManager.play('game_over');

    const bg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85);

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

    // Try again button
    this._makeButton(GAME_WIDTH / 2 - 90, GAME_HEIGHT / 2 + 90, 'Try Again', 0x226644, () => {
      AudioManager.play('button_click');
      GameState.resetForLevel();
      this.scene.start('GameScene', { level: GameState.state.currentLevel });
    });

    // Main menu button
    this._makeButton(GAME_WIDTH / 2 + 90, GAME_HEIGHT / 2 + 90, 'Main Menu', 0x334466, () => {
      AudioManager.play('button_click');
      this.scene.start('StartScene');
    });
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
  }
}
