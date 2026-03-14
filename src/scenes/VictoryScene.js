import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { AudioManager } from '../audio/AudioManager.js';
import { GameState } from '../GameState.js';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create() {
    AudioManager.init(this);
    AudioManager.stopMusic();
    AudioManager.stopAllLoops();

    // Sky background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xd0f0c0, 0xd0f0c0, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Ground
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 20, GAME_WIDTH, 40, 0x3d7020);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 42, GAME_WIDTH, 4, 0x4a8020);

    // Flowers
    for (let x = 20; x < GAME_WIDTH; x += 40) {
      const fc = [0xff6699, 0xffcc00, 0xff99cc, 0xffeeaa][Math.floor(x / 40) % 4];
      this.add.circle(x, GAME_HEIGHT - 44, 5, fc);
    }

    // Title
    const titleText = this.add.text(GAME_WIDTH / 2, 50, 'You Rescued Mamoslav!', {
      fontSize: '34px', color: '#ffe066', fontFamily: 'Arial Black, Arial',
      stroke: '#885500', strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: titleText, alpha: 1, duration: 800 });

    // Characters start positions
    const foxSprite   = this.add.sprite(100, GAME_HEIGHT - 80, 'fox').setScale(2.2);
    const bearSprite  = this.add.sprite(200, GAME_HEIGHT - 80, 'bear').setScale(2.2);
    const steggeSprite= this.add.sprite(320, GAME_HEIGHT - 80, 'stegge').setScale(2.2);
    const mamoslavSprite = this.add.sprite(GAME_WIDTH + 60, GAME_HEIGHT - 80, 'mamoslav').setScale(2.2);

    foxSprite.play('fox_idle');
    bearSprite.play('bear_idle');
    steggeSprite.play('stegge_idle');
    mamoslavSprite.play('mamoslav_idle');

    // Stars burst
    this.time.delayedCall(300, () => { this._burstStars(); });

    // Mamoslav entrance
    this.time.delayedCall(1000, () => {
      AudioManager.play('victory');

      // Mamoslav runs in
      this.tweens.add({
        targets: mamoslavSprite,
        x: GAME_WIDTH / 2 + 120,
        duration: 900,
        ease: 'Power2',
        onComplete: () => {
          mamoslavSprite.play('mamoslav_celebrate', true);

          // Hug Fox
          this.time.delayedCall(200, () => {
            this._doHug(mamoslavSprite, foxSprite, () => {

              // Hug Bear
              this.time.delayedCall(300, () => {
                this.tweens.add({
                  targets: mamoslavSprite,
                  x: bearSprite.x,
                  duration: 500,
                  ease: 'Power2',
                  onComplete: () => {
                    this._doHug(mamoslavSprite, bearSprite, () => {

                      // Hug Stegge
                      this.time.delayedCall(300, () => {
                        this.tweens.add({
                          targets: mamoslavSprite,
                          x: steggeSprite.x,
                          duration: 500,
                          ease: 'Power2',
                          onComplete: () => {
                            this._doHug(mamoslavSprite, steggeSprite, () => {

                              // All celebrate
                              this.time.delayedCall(400, () => {
                                this._allCelebrate([foxSprite, bearSprite, steggeSprite, mamoslavSprite]);
                                this._showEndScreen();
                              });
                            });
                          }
                        });
                      });
                    });
                  }
                });
              });
            });
          });
        }
      });
    });
  }

  _doHug(mamoslav, target, onComplete) {
    AudioManager.play('potion_collect');
    const hearts = [];

    // Spawn heart particles
    for (let i = 0; i < 5; i++) {
      const h = this.add.text(
        target.x + Phaser.Math.Between(-30, 30),
        target.y + Phaser.Math.Between(-20, 20),
        '❤️', { fontSize: '20px' }
      );
      hearts.push(h);
      this.tweens.add({
        targets: h,
        y: h.y - 60,
        alpha: 0,
        duration: 800,
        delay: i * 80,
        onComplete: () => h.destroy()
      });
    }

    // Scale pulse for hug
    this.tweens.add({
      targets: [mamoslav, target],
      scaleX: { from: 2.2, to: 2.8 },
      scaleY: { from: 2.2, to: 2.8 },
      duration: 200,
      yoyo: true,
      repeat: 1,
      onComplete
    });
  }

  _allCelebrate(sprites) {
    for (let i = 0; i < sprites.length; i++) {
      this.tweens.add({
        targets: sprites[i],
        y: { from: sprites[i].y, to: sprites[i].y - 30 },
        duration: 300,
        yoyo: true,
        repeat: -1,
        delay: i * 80,
        ease: 'Power2'
      });
    }
  }

  _burstStars() {
    for (let i = 0; i < 20; i++) {
      const star = this.add.text(
        Phaser.Math.Between(100, GAME_WIDTH - 100),
        Phaser.Math.Between(80, GAME_HEIGHT - 100),
        '⭐', { fontSize: `${Phaser.Math.Between(16, 32)}px` }
      ).setAlpha(0);
      this.tweens.add({
        targets: star, alpha: 1,
        duration: 300,
        delay: i * 60,
        onComplete: () => {
          this.tweens.add({ targets: star, alpha: 0, y: star.y - 40, duration: 600, delay: 600 });
        }
      });
    }
  }

  _showEndScreen() {
    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0).setDepth(10);

    this.time.delayedCall(1500, () => {
      this.tweens.add({ targets: overlay, alpha: 0.6, duration: 800 });

      this.time.delayedCall(800, () => {
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 'The End', {
          fontSize: '60px', color: '#ffe066', fontFamily: 'Arial Black, Arial',
          stroke: '#885500', strokeThickness: 6
        }).setOrigin(0.5).setDepth(11).setAlpha(0)
          .setAlpha(1);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 'Little Fox and Friends', {
          fontSize: '20px', color: '#ffffff', fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(11);

        // Buttons
        this._makeButton(GAME_WIDTH / 2 - 90, GAME_HEIGHT / 2 + 80, 'Play Again', 0x226644, () => {
          GameState.reset();
          this.scene.start('StartScene');
        });
        this._makeButton(GAME_WIDTH / 2 + 90, GAME_HEIGHT / 2 + 80, 'Main Menu', 0x334466, () => {
          GameState.reset();
          this.scene.start('StartScene');
        });
      });
    });
  }

  _makeButton(x, y, label, color, callback) {
    const bg = this.add.rectangle(x, y, 140, 40, color)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff).setDepth(12);
    this.add.text(x, y, label, { fontSize: '17px', color: '#ffffff', fontFamily: 'Arial' })
      .setOrigin(0.5).setDepth(12);
    bg.on('pointerdown', callback);
    bg.on('pointerover', () => bg.setAlpha(0.75));
    bg.on('pointerout',  () => bg.setAlpha(1));
  }
}
