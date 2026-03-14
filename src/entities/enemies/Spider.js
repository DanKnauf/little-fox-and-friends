import { BaseEnemy } from './BaseEnemy.js';

export class Spider extends BaseEnemy {
  constructor(scene, x, y, levelSkin, speedMultiplier) {
    super(scene, x, y, `spider_${levelSkin}`, 2, speedMultiplier);
    this.sprite.setScale(1.3);
    this.sprite.play(`spider_${levelSkin}_walk`, true);
    this._levelSkin = levelSkin;
    this._speed = 70 * speedMultiplier;
    this._reverseTimer = 0;
  }

  _doUpdate(time, delta) {
    const body = this.sprite.body;

    // Reverse direction on hitting wall or ledge edge
    if (body.blocked.left || body.blocked.right) {
      this._direction *= -1;
    }
    // Reverse direction on patrol timer
    this._reverseTimer += delta;
    if (this._reverseTimer > 2500 + Math.random() * 1000) {
      this._direction *= -1;
      this._reverseTimer = 0;
    }

    body.setVelocityX(this._direction * this._speed);
    this.sprite.setFlipX(this._direction < 0);
  }
}
