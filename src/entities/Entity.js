export class Entity {
  constructor(scene, x, y, textureKey, maxHearts, frame = 0) {
    this.scene = scene;
    this.maxHearts = maxHearts;
    this.hearts = maxHearts;
    this._iFrames = false;
    this._iFrameTimer = null;
    this._invincible = false;
    this._alive = true;

    this.sprite = scene.physics.add.sprite(x, y, textureKey, frame);
    this.sprite.setCollideWorldBounds(true);
  }

  takeDamage(amount = 1) {
    if (!this._alive || this._iFrames || this._invincible) return false;

    this.hearts = Math.max(0, this.hearts - amount);
    this._startIFrames();
    this._flashDamage();

    if (this.hearts <= 0) {
      this._alive = false;
      this.onDefeated();
    }
    return true; // damage was dealt (regardless of whether it killed)
  }

  heal(amount) {
    this.hearts = Math.min(this.maxHearts, this.hearts + amount);
  }

  healFull() {
    this.hearts = this.maxHearts;
  }

  isAlive() {
    return this._alive;
  }

  _startIFrames(duration = 1000) {
    this._iFrames = true;
    if (this._iFrameTimer) this._iFrameTimer.remove();
    this._iFrameTimer = this.scene.time.delayedCall(duration, () => {
      this._iFrames = false;
    });
  }

  _flashDamage() {
    if (!this.sprite || !this.sprite.active) return;
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: { from: 0.3, to: 1 },
      duration: 120,
      yoyo: true,
      repeat: 3,
      ease: 'Linear',
      onComplete: () => {
        if (this.sprite && this.sprite.active) {
          this.sprite.setAlpha(1);
        }
      }
    });
    this.sprite.setTint(0xff4444);
    this.scene.time.delayedCall(500, () => {
      if (this.sprite && this.sprite.active) {
        this.sprite.clearTint();
      }
    });
  }

  onDefeated() {
    // Subclasses override this
    if (this.sprite && this.sprite.active) {
      this.scene.tweens.add({
        targets: this.sprite,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 300,
        onComplete: () => {
          if (this.sprite && this.sprite.active) this.sprite.destroy();
        }
      });
    }
  }

  destroy() {
    this._alive = false;
    if (this._iFrameTimer) this._iFrameTimer.remove();
    if (this.sprite && this.sprite.active) this.sprite.destroy();
  }
}
