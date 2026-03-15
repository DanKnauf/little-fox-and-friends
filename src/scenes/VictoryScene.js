import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { AudioManager } from '../audio/AudioManager.js';
import { GameState } from '../GameState.js';
import { getRawPad, isButtonDown, getAxis } from '../input/GamepadInput.js';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
    this._fireworkTimer = null;
    this._btn0 = null;
    this._btn1 = null;
    this._btn2 = null;
    this._padFocus     = 0;
    this._padLeftPrev  = false;
    this._padRightPrev = false;
    this._padAPrev     = false;
  }

  create() {
    AudioManager.init(this);
    AudioManager.stopMusic();
    AudioManager.stopAllLoops();

    // Reset button / gamepad state for this run
    this._btn0 = null;
    this._btn1 = null;
    this._btn2 = null;
    this._padFocus     = 0;
    this._padLeftPrev  = this._padRightPrev = this._padAPrev = false;

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
    const titleText = this.add.text(GAME_WIDTH / 2, 50, 'You Rescued Mama Sloth!', {
      fontSize: '34px', color: '#ffe066', fontFamily: 'Arial Black, Arial',
      stroke: '#885500', strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: titleText, alpha: 1, duration: 800 });

    // Characters — arranged right-to-left in hug order so Mama walks left to each one:
    // Mama enters from right → Fox (closest) → Bear → Steggie (far left)
    const steggieSprite  = this.add.sprite(100,             GAME_HEIGHT - 80, 'steggie').setScale(2.2);
    const bearSprite     = this.add.sprite(270,             GAME_HEIGHT - 80, 'bear').setScale(2.2);
    const foxSprite      = this.add.sprite(450,             GAME_HEIGHT - 80, 'fox').setScale(2.2);
    const mamaSlothSprite= this.add.sprite(GAME_WIDTH + 60, GAME_HEIGHT - 80, 'mamasloth').setScale(2.0);

    foxSprite.play('fox_idle');
    bearSprite.play('bear_idle');
    steggieSprite.play('steggie_idle');
    mamaSlothSprite.play('mamasloth_idle');

    // Stars burst
    this.time.delayedCall(300, () => { this._burstStars(); });

    // Mama Sloth entrance
    this.time.delayedCall(1000, () => {
      AudioManager.play('victory');

      this.tweens.add({
        targets: mamaSlothSprite,
        x: foxSprite.x + 160,   // lands just right of Fox
        duration: 900,
        ease: 'Power2',
        onComplete: () => {
          mamaSlothSprite.play('mamasloth_celebrate', true);

          // Move to Fox first, then hug — heart fireworks launch here
          this.time.delayedCall(200, () => {
            this.tweens.add({
              targets: mamaSlothSprite,
              x: foxSprite.x + 10,
              duration: 900,
              ease: 'Power2',
              onComplete: () => {
                this._doHug(mamaSlothSprite, foxSprite, true, () => {

                  // Hug Bear
                  this.time.delayedCall(300, () => {
                    this.tweens.add({
                      targets: mamaSlothSprite,
                      x: bearSprite.x,
                      duration: 500,
                      ease: 'Power2',
                      onComplete: () => {
                        this._doHug(mamaSlothSprite, bearSprite, false, () => {

                          // Kiss Steggie — they're married!
                          this.time.delayedCall(300, () => {
                            this.tweens.add({
                              targets: mamaSlothSprite,
                              x: steggieSprite.x + 10,
                              duration: 500,
                              ease: 'Power2',
                              onComplete: () => {
                                this._doKiss(mamaSlothSprite, steggieSprite, () => {

                                  // All celebrate
                                  this.time.delayedCall(400, () => {
                                    this._allCelebrate([foxSprite, bearSprite, steggieSprite, mamaSlothSprite]);
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
              }
            });
          });
        }
      });
    });
  }

  update() {
    if (!this._btn0) return; // end-screen not visible yet

    const pad = getRawPad();
    if (!pad) return;

    const leftNow  = isButtonDown(pad, 14) || getAxis(pad, 0) < -0.4;
    const rightNow = isButtonDown(pad, 15) || getAxis(pad, 0) >  0.4;
    const aNow     = isButtonDown(pad, 0);

    const btnCount = this._btn2 ? 3 : 2;
    if (leftNow && !this._padLeftPrev) {
      this._padFocus = (this._padFocus - 1 + btnCount) % btnCount;
      this._updateFocusVisual();
      AudioManager.play('button_click');
    }
    if (rightNow && !this._padRightPrev) {
      this._padFocus = (this._padFocus + 1) % btnCount;
      this._updateFocusVisual();
      AudioManager.play('button_click');
    }

    if (aNow && !this._padAPrev) {
      if (this._padFocus === 0) this._playAgain();
      else if (this._padFocus === 1) this._mainMenu();
      else this._bonusLevel();
    }

    this._padLeftPrev  = leftNow;
    this._padRightPrev = rightNow;
    this._padAPrev     = aNow;
  }

  _playAgain() {
    AudioManager.play('button_click');
    GameState.reset(); // keeps difficulty, resets level to 1 + clears companions
    this.scene.start('LevelIntroScene', { level: 1 });
  }

  _mainMenu() {
    AudioManager.play('button_click');
    GameState.reset();
    this.scene.start('StartScene');
  }

  _bonusLevel() {
    AudioManager.play('button_click');
    // Keep score, companions already unlocked — just advance to level 4
    GameState.state.currentLevel = 4;
    GameState.resetForLevel();
    // Mama Sloth is always unlocked for the bonus level
    GameState.unlockCompanion('mamasloth');
    this.scene.start('LevelIntroScene', { level: 4 });
  }

  _updateFocusVisual() {
    if (this._btn0) this._btn0.setStrokeStyle(this._padFocus === 0 ? 3 : 2, this._padFocus === 0 ? 0xffff00 : 0xffffff);
    if (this._btn1) this._btn1.setStrokeStyle(this._padFocus === 1 ? 3 : 2, this._padFocus === 1 ? 0xffff00 : 0xffffff);
    if (this._btn2) this._btn2.setStrokeStyle(this._padFocus === 2 ? 3 : 2, this._padFocus === 2 ? 0xffee00 : 0xaaaaaa);
  }

  // Draws a heart shape using fillCircle + fillTriangle (Phaser 3 compatible)
  _drawHeart(graphics, cx, cy, size, color) {
    graphics.fillStyle(color, 1);
    const r = size * 0.34;
    graphics.fillCircle(cx - r, cy - r * 0.2, r);
    graphics.fillCircle(cx + r, cy - r * 0.2, r);
    graphics.fillTriangle(
      cx - r * 1.8, cy - r * 0.2,
      cx + r * 1.8, cy - r * 0.2,
      cx,           cy + r * 1.5
    );
  }

  _launchHeartFirework(x, y) {
    const colors = [0xff3366, 0xff66aa, 0xff99bb, 0xffccdd, 0xff0044, 0xff6699];
    const count = 16;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = Phaser.Math.Between(60, 140);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = Phaser.Math.Between(6, 14);
      const color = colors[i % colors.length];

      const g = this.add.graphics();
      g.setDepth(50);
      this._drawHeart(g, x, y, size, color);

      this.tweens.add({
        targets: g,
        x: vx * 0.8,
        y: vy * 0.8,
        alpha: 0,
        duration: Phaser.Math.Between(600, 1100),
        ease: 'Power2',
        onUpdate: (tween) => {
          const progress = tween.progress;
          g.clear();
          const px = x + vx * progress;
          const py = y + vy * progress - 60 * progress * progress;
          this._drawHeart(g, px, py, size * (1 - progress * 0.5), color);
        },
        onComplete: () => g.destroy()
      });
    }
  }

  _startHeartFireworksLoop() {
    this._fireworkTimer = this.time.addEvent({
      delay: 400,
      repeat: 18,
      callback: () => {
        const x = Phaser.Math.Between(80, GAME_WIDTH - 80);
        const y = Phaser.Math.Between(60, GAME_HEIGHT - 120);
        this._launchHeartFirework(x, y);
        AudioManager.play('potion_collect');
      }
    });
  }

  _doHug(mamaSloth, target, triggerFireworks, onComplete) {
    for (let i = 0; i < 6; i++) {
      const h = this.add.text(
        target.x + Phaser.Math.Between(-30, 30),
        target.y + Phaser.Math.Between(-20, 20),
        '❤️', { fontSize: '22px' }
      ).setDepth(30);
      this.tweens.add({
        targets: h,
        y: h.y - 70,
        alpha: 0,
        duration: 900,
        delay: i * 80,
        onComplete: () => h.destroy()
      });
    }

    this.tweens.add({
      targets: [mamaSloth, target],
      scaleX: { from: 2.2, to: 2.9 },
      scaleY: { from: 2.2, to: 2.9 },
      duration: 220,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        if (triggerFireworks) this._startHeartFireworksLoop();
        if (onComplete) onComplete();
      }
    });
  }

  // Mama Sloth gives Steggie a big kiss — they're married!
  _doKiss(mamaSloth, target, onComplete) {
    // Lipstick kiss emojis burst outward
    const kissEmojis = ['💋', '💋', '💋', '😘', '💋', '💕'];
    for (let i = 0; i < kissEmojis.length; i++) {
      const h = this.add.text(
        target.x + Phaser.Math.Between(-35, 35),
        target.y + Phaser.Math.Between(-30, 10),
        kissEmojis[i], { fontSize: '24px' }
      ).setDepth(30);
      this.tweens.add({
        targets: h,
        y: h.y - 90,
        x: h.x + Phaser.Math.Between(-20, 20),
        alpha: 0,
        duration: 1000,
        delay: i * 100,
        ease: 'Power2',
        onComplete: () => h.destroy()
      });
    }

    // "MWAH!" popup text
    const mwah = this.add.text(
      target.x, target.y - 65, 'MWAH! 💋', {
        fontSize: '28px', color: '#ff3366', fontFamily: 'Arial Black, Arial',
        stroke: '#880022', strokeThickness: 3
      }
    ).setDepth(35).setOrigin(0.5).setAlpha(0);
    this.tweens.add({
      targets: mwah, alpha: 1, y: mwah.y - 15,
      duration: 280,
      onComplete: () => {
        this.time.delayedCall(700, () => {
          this.tweens.add({ targets: mwah, alpha: 0, duration: 400, onComplete: () => mwah.destroy() });
        });
      }
    });

    // Big dramatic lean-in kiss pulse — more pulses than a hug
    this.tweens.add({
      targets: [mamaSloth, target],
      scaleX: { from: 2.2, to: 3.1 },
      scaleY: { from: 2.2, to: 3.1 },
      duration: 180,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        if (onComplete) onComplete();
      }
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
    if (this._fireworkTimer) {
      this._fireworkTimer.remove();
      this._fireworkTimer = null;
    }

    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0).setDepth(10);

    this.time.delayedCall(1500, () => {
      this.tweens.add({ targets: overlay, alpha: 0.6, duration: 800 });

      this.time.delayedCall(800, () => {
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, 'The End', {
          fontSize: '60px', color: '#ffe066', fontFamily: 'Arial Black, Arial',
          stroke: '#885500', strokeThickness: 6
        }).setOrigin(0.5).setDepth(11);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 12, 'Little Fox and Friends', {
          fontSize: '20px', color: '#ffffff', fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(11);

        // Final score
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 44, `Final Score: ${GameState.state.score}`, {
          fontSize: '26px', color: '#ffdd44', fontFamily: 'Arial Black, Arial',
          stroke: '#553300', strokeThickness: 3
        }).setOrigin(0.5).setDepth(11);

        // Play Again — restart from level 1 with the same difficulty
        this._btn0 = this._makeButton(GAME_WIDTH / 2 - 155, GAME_HEIGHT / 2 + 90, 'Play Again', 0x226644,
          () => this._playAgain());

        // Main Menu — go back to the difficulty selection screen
        this._btn1 = this._makeButton(GAME_WIDTH / 2 + 10, GAME_HEIGHT / 2 + 90, 'Main Menu', 0x334466,
          () => this._mainMenu());

        // Bonus Level — secret option, slightly dimmer styling
        this._btn2 = this._makeButton(GAME_WIDTH / 2 + 175, GAME_HEIGHT / 2 + 90, '🌋 Bonus!', 0x883300,
          () => this._bonusLevel());

        this._padFocus = 0;
        this._updateFocusVisual();
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
    return bg;
  }
}
