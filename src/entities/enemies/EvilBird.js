import { BaseEnemy } from './BaseEnemy.js';
import { GAME_HEIGHT } from '../../constants.js';

const STATE = { FLY: 'fly', DIVE: 'dive', RECOVER: 'recover' };

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
    this._player = null;
  }

  setPlayer(player) {
    this._player = player;
  }

  _doUpdate(time, delta) {
    this._stateTimer += delta;
    const body = this.sprite.body;

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
