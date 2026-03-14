import { GAME_WIDTH, GAME_HEIGHT, LEVEL_CONFIG } from '../constants.js';
import { GameState } from '../GameState.js';
import { AudioManager } from '../audio/AudioManager.js';

export class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super('LevelCompleteScene');
  }

  init(data) {
    this._completedLevel = data.level || 1;
    this._companionUnlocked = data.companionUnlocked || null;
  }

  create() {
    AudioManager.init(this);
    AudioManager.play('level_complete');

    const bg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x001a00, 0.9);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100, '⭐', { fontSize: '52px' }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40,
      `Level ${this._completedLevel} Complete!`, {
        fontSize: '38px', color: '#ffe066', fontFamily: 'Arial Black, Arial',
        stroke: '#885500', strokeThickness: 4
      }).setOrigin(0.5);

    if (this._companionUnlocked) {
      const names = { babybear: 'Baby Bear', stegge: 'Stegge' };
      const sprites = { babybear: 'bear', stegge: 'stegge' };
      const name = names[this._companionUnlocked] || this._companionUnlocked;
      const spriteKey = sprites[this._companionUnlocked] || 'bear';

      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10,
        `${name} joins your team!`, {
          fontSize: '22px', color: '#aaffaa', fontFamily: 'Arial'
        }).setOrigin(0.5);

      const companion = this.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, spriteKey).setScale(2.5);
      companion.play(spriteKey + '_walk');
      this.tweens.add({ targets: companion, x: { from: GAME_WIDTH / 2 - 60, to: GAME_WIDTH / 2 + 60 }, duration: 1000, yoyo: true, repeat: -1 });
    }

    // Auto-advance after 3 seconds
    this.time.delayedCall(3000, () => {
      const nextLevel = this._completedLevel + 1;
      if (nextLevel > 3) {
        this.scene.start('VictoryScene');
      } else {
        GameState.state.currentLevel = nextLevel;
        GameState.resetForLevel();
        this.scene.start('LevelIntroScene', { level: nextLevel });
      }
    });
  }
}
