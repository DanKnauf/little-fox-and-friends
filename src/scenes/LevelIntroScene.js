import { GAME_WIDTH, GAME_HEIGHT, LEVEL_CONFIG } from '../constants.js';
import { AudioManager } from '../audio/AudioManager.js';

export class LevelIntroScene extends Phaser.Scene {
  constructor() {
    super('LevelIntroScene');
  }

  init(data) {
    this._level = data.level || 1;
  }

  create() {
    AudioManager.init(this);
    const cfg = LEVEL_CONFIG[this._level];

    // Dark overlay
    const bg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000);
    bg.setAlpha(0);

    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20,
      `Level ${this._level}`, {
        fontSize: '52px', color: '#ffe066', fontFamily: 'Arial Black, Arial',
        stroke: '#885500', strokeThickness: 5
      }).setOrigin(0.5).setAlpha(0);

    const subtitle = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40,
      `— ${cfg.name} —`, {
        fontSize: '28px', color: '#ffffff', fontFamily: 'Arial',
        stroke: '#333333', strokeThickness: 3
      }).setOrigin(0.5).setAlpha(0);

    AudioManager.play('level_start');

    this.tweens.chain({
      tweens: [
        {
          targets: [bg, title, subtitle],
          alpha: { from: 0, to: 1 },
          duration: 600,
          ease: 'Power2'
        },
        { targets: {}, duration: 1400 }, // hold
        {
          targets: [bg, title, subtitle],
          alpha: { from: 1, to: 0 },
          duration: 500,
          ease: 'Power2',
          onComplete: () => {
            this.scene.start('GameScene', { level: this._level });
          }
        }
      ]
    });
  }
}
