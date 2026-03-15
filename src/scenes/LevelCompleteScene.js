import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
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

    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    // Apply multiplier bonus — get breakdown for the animation
    const { bonus, levelScore, multiplier } = GameState.applyLevelBonus();
    const totalScore = GameState.state.score;

    this.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x001a00, 0.92);

    // Star + heading
    this.add.text(cx, cy - 145, '⭐', { fontSize: '52px' }).setOrigin(0.5);
    this.add.text(cx, cy - 95,
      `Level ${this._completedLevel} Complete!`, {
        fontSize: '36px', color: '#ffe066', fontFamily: 'Arial Black, Arial',
        stroke: '#885500', strokeThickness: 4
      }).setOrigin(0.5);

    // Score breakdown rows — staggered fade-in
    const rows = [
      { text: `Level Score:  ${levelScore}`,                color: '#ffffff', delay: 400  },
      { text: `× ${multiplier.toFixed(1)}  Difficulty Bonus`, color: '#ffdd44', delay: 1100 },
      { text: `+ ${bonus} pts`,                              color: '#44ff88', delay: 1800 },
      { text: `Total Score:  ${totalScore}`,                 color: '#ffaaff', delay: 2600 },
    ];

    rows.forEach(({ text, color, delay }, i) => {
      const t = this.add.text(cx, cy - 30 + i * 38, text, {
        fontSize: '22px', color, fontFamily: 'Arial Bold',
        stroke: '#000000', strokeThickness: 3
      }).setOrigin(0.5).setAlpha(0);

      this.time.delayedCall(delay, () => {
        this.tweens.add({ targets: t, alpha: 1, duration: 350 });
        if (i === 2) {
          // Bonus line lands — play a sparkle sound and scale pop
          AudioManager.play('potion_collect');
          this.tweens.add({ targets: t, scaleX: { from: 1.25, to: 1 }, scaleY: { from: 1.25, to: 1 }, duration: 280, ease: 'Back.easeOut' });
        }
        if (i === 3) {
          // Total line — bigger pop
          this.tweens.add({ targets: t, scaleX: { from: 1.4, to: 1 }, scaleY: { from: 1.4, to: 1 }, duration: 320, ease: 'Back.easeOut' });
        }
      });
    });

    // Companion unlock (shown after score sequence)
    if (this._companionUnlocked) {
      const names   = { babybear: 'Baby Bear', steggie: 'Steggie' };
      const sprites = { babybear: 'bear',       steggie: 'steggie'  };
      const name      = names[this._companionUnlocked]   || this._companionUnlocked;
      const spriteKey = sprites[this._companionUnlocked] || 'bear';

      const joinText = this.add.text(cx, cy + 120,
        `🎉 ${name} joins your team!`, {
          fontSize: '20px', color: '#aaffaa', fontFamily: 'Arial Bold'
        }).setOrigin(0.5).setAlpha(0);

      this.time.delayedCall(3200, () => {
        this.tweens.add({ targets: joinText, alpha: 1, duration: 300 });
        AudioManager.play('level_complete');
      });

      const companion = this.add.sprite(cx, cy + 162, spriteKey).setScale(2.5).setAlpha(0);
      companion.play(spriteKey + '_walk');
      this.time.delayedCall(3500, () => {
        this.tweens.add({ targets: companion, alpha: 1, duration: 300 });
        this.tweens.add({
          targets: companion,
          x: { from: cx - 60, to: cx + 60 },
          duration: 1000, yoyo: true, repeat: -1
        });
      });
    } else {
      // No companion: play complete sound once score sequence finishes
      this.time.delayedCall(2800, () => AudioManager.play('level_complete'));
    }

    // Auto-advance
    const advanceDelay = this._companionUnlocked ? 5800 : 4600;
    this.time.delayedCall(advanceDelay, () => {
      const nextLevel = this._completedLevel + 1;
      if (this._completedLevel === 4) {
        // Bonus level complete — go to bonus victory scene
        this.scene.start('BonusVictoryScene');
      } else if (nextLevel > 3) {
        // Finished main game — go to victory scene
        this.scene.start('VictoryScene');
      } else {
        GameState.state.currentLevel = nextLevel;
        GameState.resetForLevel();
        this.scene.start('LevelIntroScene', { level: nextLevel });
      }
    });
  }
}
