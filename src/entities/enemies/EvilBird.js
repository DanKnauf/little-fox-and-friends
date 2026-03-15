import { BaseEnemy } from './BaseEnemy.js';
import { GAME_HEIGHT } from '../../constants.js';

const STATE = { FLY: 'fly', DIVE: 'dive', RECOVER: 'recover' };

// Interval between poop drops (ms)
const POOP_INTERVAL = 3500;

export class EvilBird extends BaseEnemy {
  constructor(scene, x, y, levelSkin, speedMultiplier) {
    super(scene, x, y, `bird_${levelSkin}`, 2, speedMultiplier);
    this.sprite.setScale(1.3);
    this.sprite.setGravityY(-600); // Negate world gravity so bird floats
    this.sprite.play(`bird_${levelSkin}_fly`, true);
    this._levelSkin = levelSkin;
    this._originX = x;
    this._originY = y;
    this._state = STATE.FLY;
    this._flySpeed = 100 * speedMultiplier;
    this._diveSpeed = 300 * speedMultiplier;
    this._stateTimer = 0;
    this._poopTimer = Phaser.Math.Between(1000, POOP_INTERVAL);
    this._player = null;
    this._poopGroup = null;
  }

  setPlayer(player) {
    this._player = player;
  }

  /** Call from GameScene after creating the poop physics group */
  setPoopGroup(group) {
    this._poopGroup = group;
  }

  _dropPoop() {
    if (!this._poopGroup || !this.sprite.active) return;
    const p = this._poopGroup.get(this.sprite.x, this.sprite.y + 10);
    if (!p) return;
    p.setActive(true).setVisible(true);
    p.setTexture('bird_poop');
    p.body.reset(this.sprite.x, this.sprite.y + 10);
    p.body.setGravityY(0);   // physics group has its own gravity
    p.body.setVelocity(0, 220);
    p.body.setAllowGravity(false);
    // auto-destroy if it falls off screen
    this.scene.time.delayedCall(3000, () => {
      if (p.active) { p.setActive(false).setVisible(false); }
    });
  }

  _doUpdate(time, delta) {
    this._stateTimer += delta;
    this._poopTimer  -= delta;
    const body = this.sprite.body;

    // Poop drop — only when above a target (player present, bird higher than them)
    if (this._poopTimer <= 0) {
      this._poopTimer = POOP_INTERVAL + Phaser.Math.Between(-500, 500);
      if (this._player && this._player.sprite.active) {
        const dx = Math.abs(this.sprite.x - this._player.sprite.x);
        if (dx < 180 && this.sprite.y < this._player.sprite.y) {
          this._dropPoop();
        }
      }
    }

    switch (this._state) {
      case STATE.FLY:
        // Horizontal oscillation + sine wave vertical
        body.setVelocityX(this._direction * this._flySpeed);
        const sineY = Math.sin(time * 0.002 + this._originX) * 40;
        body.setVelocityY(sineY);
        this.sprite.setFlipX(this._direction < 0);

        if (body.blocked.left || body.blocked.right || this._stateTimer > 3000) {
          this._direction *= -1;
          this._stateTimer = 0;
        }

        // Detect player to dive
        if (this._player && this._player.sprite.active) {
          const dx = Math.abs(this.sprite.x - this._player.sprite.x);
          const dy = this.sprite.y - this._player.sprite.y;
          if (dx < 200 && dy > 0 && dy < 300) {
            this._state = STATE.DIVE;
            this._stateTimer = 0;
          }
        }
        break;

      case STATE.DIVE:
        body.setVelocityY(this._diveSpeed);
        body.setVelocityX(0);
        if (body.blocked.down || this._stateTimer > 800) {
          this._state = STATE.RECOVER;
          this._stateTimer = 0;
        }
        break;

      case STATE.RECOVER:
        body.setVelocityY(-this._flySpeed);
        body.setVelocityX(this._direction * this._flySpeed);
        if (Math.abs(this.sprite.y - this._originY) < 30 || this._stateTimer > 1200) {
          this._state = STATE.FLY;
          this._stateTimer = 0;
        }
        break;
    }
  }
}
