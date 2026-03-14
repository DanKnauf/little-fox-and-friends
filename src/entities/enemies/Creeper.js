import { BaseEnemy } from './BaseEnemy.js';

const STATE = { PATROL: 'patrol', CHARGE: 'charge', COOLDOWN: 'cooldown' };

export class Creeper extends BaseEnemy {
  constructor(scene, x, y, levelSkin, speedMultiplier) {
    super(scene, x, y, `creeper_${levelSkin}`, 3, speedMultiplier);
    this.sprite.setScale(1.3);
    this.sprite.play(`creeper_${levelSkin}_walk`, true);
    this._levelSkin = levelSkin;
    this._patrolSpeed = 50 * speedMultiplier;
    this._chargeSpeed = 160 * speedMultiplier;
    this._state = STATE.PATROL;
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
      case STATE.PATROL:
        body.setVelocityX(this._direction * this._patrolSpeed);
        this.sprite.setFlipX(this._direction < 0);
        this.sprite.play(`creeper_${this._levelSkin}_walk`, true);

        if (body.blocked.left || body.blocked.right) {
          this._direction *= -1;
        }
        if (this._stateTimer > 2000 + Math.random() * 1500) {
          this._direction *= -1;
          this._stateTimer = 0;
        }

        // Check for player proximity
        if (this._player && this._player.sprite.active) {
          const dist = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            this._player.sprite.x, this._player.sprite.y
          );
          if (dist < 160) {
            this._state = STATE.CHARGE;
            this._stateTimer = 0;
            const dir = this._player.sprite.x < this.sprite.x ? -1 : 1;
            this._direction = dir;
          }
        }
        break;

      case STATE.CHARGE:
        body.setVelocityX(this._direction * this._chargeSpeed);
        this.sprite.setFlipX(this._direction < 0);
        this.sprite.play(`creeper_${this._levelSkin}_charge`, true);

        if (this._stateTimer > 1200 || body.blocked.left || body.blocked.right) {
          this._state = STATE.COOLDOWN;
          this._stateTimer = 0;
        }
        break;

      case STATE.COOLDOWN:
        body.setVelocityX(0);
        this.sprite.play(`creeper_${this._levelSkin}_walk`, true);
        if (this._stateTimer > 800) {
          this._state = STATE.PATROL;
          this._stateTimer = 0;
        }
        break;
    }
  }
}
