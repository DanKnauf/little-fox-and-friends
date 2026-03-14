import { Entity } from '../Entity.js';
import { AudioManager } from '../../audio/AudioManager.js';
import { DEPTH } from '../../constants.js';

export class BaseEnemy extends Entity {
  constructor(scene, x, y, textureKey, maxHearts, speedMultiplier) {
    super(scene, x, y, textureKey, maxHearts);
    this.sprite.setDepth(DEPTH.ENEMIES);
    this._speedMultiplier = speedMultiplier;
    this._baseSpeed = 80;
    this._direction = 1;
    this._patrolTimer = 0;
    this._hitCooldown = 0;
  }

  update(time, delta) {
    if (!this._alive || !this.sprite.active) return;
    this._patrolTimer += delta;
    this._doUpdate(time, delta);
  }

  _doUpdate(time, delta) {
    // Override in subclasses
  }

  takeDamage(amount = 1) {
    if (!super.takeDamage(amount)) {
      AudioManager.play('enemy_hit');
      return false;
    }
    AudioManager.play('enemy_defeat');
    return true;
  }

  onDefeated() {
    this._alive = false;
    // Pop effect
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 2, scaleY: 2,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        if (this.sprite && this.sprite.active) this.sprite.destroy();
      }
    });
  }

  canDamagePlayer() {
    // Returns true if enemy should deal damage on contact
    return this._alive && this.sprite.active;
  }
}
