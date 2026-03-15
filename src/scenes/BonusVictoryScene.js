import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { AudioManager } from '../audio/AudioManager.js';
import { GameState } from '../GameState.js';
import { getRawPad, isButtonDown, getAxis } from '../input/GamepadInput.js';

export class BonusVictoryScene extends Phaser.Scene {
  constructor() {
    super('BonusVictoryScene');
    this._fireworkTimer = null;
    this._btn0 = null;
    this._btn1 = null;
    this._padFocus = 0;
    this._padLeftPrev  = false;
    this._padRightPrev = false;
    this._padAPrev     = false;
  }

  create() {
    AudioManager.init(this);
    AudioManager.stopMusic();
    AudioManager.stopAllLoops();

    this._btn0 = null;
    this._btn1 = null;
    this._padFocus = 0;
    this._padLeftPrev = this._padRightPrev = this._padAPrev = false;

    // ── Warm celebration sky — lava glow fading to pink/gold ─────────────────
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x3d0c10, 0x3d0c10, 0xcc6600, 0xcc6600, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Rocky ground
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 20, GAME_WIDTH, 40, 0x1e0e0e);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 42, GAME_WIDTH, 4, 0x3c1a10);

    // Ember sparkles
    for (let i = 0; i < 40; i++) {
      const ex = Phaser.Math.Between(0, GAME_WIDTH);
      const ey = Phaser.Math.Between(40, GAME_HEIGHT - 60);
      const star = this.add.circle(ex, ey,
        Math.random() < 0.25 ? 2.5 : 1,
        Math.random() < 0.5 ? 0xff8800 : 0xffcc00,
        0.3 + Math.random() * 0.7
      );
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha * 0.2, to: star.alpha },
        y: { from: ey, to: ey - Phaser.Math.Between(8, 20) },
        duration: 700 + Math.random() * 1400,
        yoyo: true, repeat: -1,
        delay: Math.random() * 1200
      });
    }

    // ── Title ─────────────────────────────────────────────────────────────────
    const title = this.add.text(GAME_WIDTH / 2, 48, 'Fluffy Bunny is Saved!', {
      fontSize: '36px', color: '#ffe066', fontFamily: 'Arial Black, Arial',
      stroke: '#cc5500', strokeThickness: 5
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: title, alpha: 1, duration: 900 });

    const subtitle = this.add.text(GAME_WIDTH / 2, 92, 'BONUS LEVEL COMPLETE!', {
      fontSize: '18px', color: '#ffaa44', fontFamily: 'Arial Black, Arial',
      stroke: '#663300', strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: subtitle, alpha: 1, duration: 900, delay: 300 });

    // ── Character sprites — Fluffy Bunny already on stage, team enters ────────
    const groundY = GAME_HEIGHT - 80;

    // Final resting positions — 5 characters spread evenly across screen
    const foxFinalX   = 110;
    const bearFinalX  = 240;
    const bunnyFinalX = GAME_WIDTH / 2;   // 400 — centre
    const stegFinalX  = 560;
    const slothFinalX = 690;

    // Fluffy Bunny — on stage, trembling with fear initially
    const bunny = this.add.sprite(bunnyFinalX, groundY, 'bunny').setScale(2.8);
    bunny.play('bunny_idle');

    // Heroes enter from the left, off-screen
    const fox   = this.add.sprite(-60,  groundY, 'fox').setScale(2.4).setFlipX(false);
    const bear  = this.add.sprite(-160, groundY, 'bear').setScale(2.2);
    const steg  = this.add.sprite(-300, groundY, 'steggie').setScale(2.2);
    const sloth = this.add.sprite(-440, groundY, 'mamasloth').setScale(2.2);

    fox.play('fox_walk', true);
    bear.play('bear_walk', true);
    steg.play('steggie_walk', true);
    sloth.play('mamasloth_idle', true);

    // Bunny fear shimmy
    this.tweens.add({
      targets: bunny,
      x: { from: bunny.x - 3, to: bunny.x + 3 },
      duration: 80,
      yoyo: true,
      repeat: 10,
    });

    // ── Entrance sequence ──────────────────────────────────────────────────────
    this.time.delayedCall(600, () => {
      AudioManager.play('victory');

      // Slide heroes in together to their final positions
      const targets = [
        { sprite: fox,   finalX: foxFinalX   },
        { sprite: bear,  finalX: bearFinalX  },
        { sprite: steg,  finalX: stegFinalX  },
        { sprite: sloth, finalX: slothFinalX },
      ];
      for (const t of targets) {
        this.tweens.add({
          targets: t.sprite,
          x: t.finalX,
          duration: 1100,
          ease: 'Power2',
          onComplete: () => {
            t.sprite.play(t.sprite === fox ? 'fox_idle'
              : t.sprite === bear ? 'bear_idle'
              : t.sprite === steg ? 'steggie_idle'
              : 'mamasloth_celebrate', true);
          }
        });
      }

      // Bunny reacts — sees the heroes and hops with joy
      this.time.delayedCall(900, () => {
        bunny.play('bunny_happy', true);
        this._burstStars(bunny.x, bunny.y);

        // All celebrate together
        this.time.delayedCall(700, () => {
          bunny.play('bunny_celebrate', true);
          this._launchFireworkLoop();
          this._allBounce([fox, bear, steg, sloth, bunny]);
          this._showEndScreen(fox, bear, steg, sloth, bunny);
        });
      });
    });
  }

  update() {
    if (!this._btn0) return;

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
      if (this._padFocus === 0) this._playAgain();
      else this._mainMenu();
    }

    this._padLeftPrev  = leftNow;
    this._padRightPrev = rightNow;
    this._padAPrev     = aNow;
  }

  _playAgain() {
    AudioManager.play('button_click');
    GameState.reset();
    this.scene.start('LevelIntroScene', { level: 1 });
  }

  _mainMenu() {
    AudioManager.play('button_click');
    GameState.reset();
    this.scene.start('StartScene');
  }

  _updateFocusVisual() {
    if (this._btn0) this._btn0.setStrokeStyle(this._padFocus === 0 ? 3 : 2, this._padFocus === 0 ? 0xffff00 : 0xffffff);
    if (this._btn1) this._btn1.setStrokeStyle(this._padFocus === 1 ? 3 : 2, this._padFocus === 1 ? 0xffff00 : 0xffffff);
  }

  _allBounce(sprites) {
    for (let i = 0; i < sprites.length; i++) {
      this.tweens.add({
        targets: sprites[i],
        y: { from: sprites[i].y, to: sprites[i].y - 28 },
        duration: 280,
        yoyo: true,
        repeat: -1,
        delay: i * 70,
        ease: 'Power2'
      });
    }
  }

  _burstStars(x, y) {
    for (let i = 0; i < 14; i++) {
      const star = this.add.text(
        x + Phaser.Math.Between(-40, 40),
        y + Phaser.Math.Between(-20, 20),
        '⭐', { fontSize: `${Phaser.Math.Between(16, 28)}px` }
      ).setAlpha(0).setDepth(20);
      this.tweens.add({
        targets: star, alpha: 1, duration: 200, delay: i * 50,
        onComplete: () => {
          this.tweens.add({ targets: star, alpha: 0, y: star.y - 50, duration: 500, delay: 400,
            onComplete: () => star.destroy() });
        }
      });
    }
  }

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
    const colors = [0xff3366, 0xff9900, 0xffcc00, 0xff6699, 0xffaa44, 0xff4488];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = Phaser.Math.Between(60, 130);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = Phaser.Math.Between(6, 13);
      const color = colors[i % colors.length];
      const g = this.add.graphics().setDepth(50);
      this._drawHeart(g, x, y, size, color);
      this.tweens.add({
        targets: g,
        x: vx * 0.8, y: vy * 0.8,
        alpha: 0,
        duration: Phaser.Math.Between(600, 1000),
        ease: 'Power2',
        onUpdate: (tween) => {
          const p = tween.progress;
          g.clear();
          this._drawHeart(g, x + vx * p, y + vy * p - 55 * p * p, size * (1 - p * 0.5), color);
        },
        onComplete: () => g.destroy()
      });
    }
  }

  _launchFireworkLoop() {
    this._fireworkTimer = this.time.addEvent({
      delay: 380,
      repeat: 22,
      callback: () => {
        this._launchHeartFirework(
          Phaser.Math.Between(80, GAME_WIDTH - 80),
          Phaser.Math.Between(60, GAME_HEIGHT - 100)
        );
        AudioManager.play('potion_collect');
      }
    });
  }

  _showEndScreen(fox, bear, steg, sloth, bunny) {
    this.time.delayedCall(2200, () => {
      if (this._fireworkTimer) { this._fireworkTimer.remove(); this._fireworkTimer = null; }

      const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0).setDepth(10);
      this.tweens.add({ targets: overlay, alpha: 0.65, duration: 700 });

      this.time.delayedCall(700, () => {
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70, 'BONUS COMPLETE!', {
          fontSize: '44px', color: '#ffcc00', fontFamily: 'Arial Black, Arial',
          stroke: '#663300', strokeThickness: 6
        }).setOrigin(0.5).setDepth(11);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 'You Saved Fluffy Bunny!', {
          fontSize: '20px', color: '#ffffff', fontFamily: 'Arial',
          stroke: '#440000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(11);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 18, `Final Score: ${GameState.state.score}`, {
          fontSize: '28px', color: '#ffdd44', fontFamily: 'Arial Black, Arial',
          stroke: '#553300', strokeThickness: 3
        }).setOrigin(0.5).setDepth(11);

        // Tiny bunny icon next to score
        this.add.sprite(GAME_WIDTH / 2 + 150, GAME_HEIGHT / 2 + 18, 'bunny')
          .setScale(1.6).setDepth(12).play('bunny_celebrate');

        // Buttons
        this._btn0 = this._makeButton(GAME_WIDTH / 2 - 90, GAME_HEIGHT / 2 + 80, 'Play Again', 0x226644,
          () => this._playAgain());
        this._btn1 = this._makeButton(GAME_WIDTH / 2 + 90, GAME_HEIGHT / 2 + 80, 'Main Menu', 0x334466,
          () => this._mainMenu());

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
