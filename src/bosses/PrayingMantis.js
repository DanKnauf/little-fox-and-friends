import { BaseBoss, BOSS_STATE } from './BaseBoss.js';
import { AudioManager } from '../audio/AudioManager.js';

export class PrayingMantis extends BaseBoss {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss_mantis', 10, 'Giant Mantis');
    this.sprite.play('boss_mantis_idle', true);
    this._attacks = ['strike', 'leap', 'strike', 'strike', 'leap'];
    this._attackIndex = 0;
    this._player = null;
    this._companions = [];
    this._leaping = false;

    this._arenaLeft  = x - 320;
    this._arenaRight = x + 320;

    this.transitionTo(BOSS_STATE.IDLE);
  }

  setPlayer(player, companions) {
    this._player = player;
    this._companions = companions || [];
  }

  _updateState(time, delta) {
    const currentAttack = this._attacks[this._attackIndex % this._attacks.length];

    switch (this.state) {
      case BOSS_STATE.IDLE:
        this.sprite.play('boss_mantis_idle', true);
        this._doWander(delta);
        if (this.stateTimer > 1600) {
          this._wanderTarget = null;
          this.sprite.body.setVelocityX(0);
          this.transitionTo(BOSS_STATE.TELEGRAPHING);
        }
        break;

      case BOSS_STATE.TELEGRAPHING:
        if (this.stateTimer < 16) {
          if (currentAttack === 'strike') {
            this.sprite.play('boss_mantis_strike', true);
            if (this._player) {
              this.sprite.setFlipX(this._player.sprite.x < this.sprite.x);
            }
          } else {
            this.sprite.play('boss_mantis_leap', true);
          }
        }
        if (this.stateTimer >= 500) {
          this.transitionTo(BOSS_STATE.ATTACKING);
        }
        break;

      case BOSS_STATE.ATTACKING:
        if (this.stateTimer < 16) {
          if (currentAttack === 'strike') {
            this._doStrike();
          } else {
            this._doLeap();
          }
        }
        // Leap manages its own transition via tween onComplete
        if (!this._leaping && this.stateTimer > 900) {
          this._attackIndex++;
          this.transitionTo(BOSS_STATE.RECOVERING);
        }
        break;

      case BOSS_STATE.RECOVERING:
        this.sprite.play('boss_mantis_idle', true);
        if (this.stateTimer < 50) this.sprite.body.setVelocityX(0);
        this._doWander(delta);
        if (this.stateTimer > 1200) {
          this._wanderTarget = null;
          this.sprite.body.setVelocityX(0);
          this.transitionTo(BOSS_STATE.IDLE);
        }
        break;
    }
  }

  // Fast lunge + raptorial arm swipe
  _doStrike() {
    if (!this._player) return;
    const dir = this._player.sprite.x > this.sprite.x ? 1 : -1;
    this.sprite.setFlipX(dir < 0);
    this.sprite.body.setVelocityX(dir * 300 * this._speedMult);

    this.scene.time.delayedCall(250, () => {
      if (!this.sprite?.active) return;
      this.sprite.body.setVelocityX(0);
      this._checkMeleeDamage(115);
    });
  }

  // Arcing leap toward player position
  _doLeap() {
    if (!this._player) return;
    this._leaping = true;

    const targetX = this._player.sprite.x;
    const dist    = Math.abs(targetX - this.sprite.x);
    const dur     = Phaser.Math.Clamp(dist / (380 * this._speedMult) * 1000, 320, 680);

    this.sprite.setFlipX(targetX < this.sprite.x);

    this.scene.tweens.add({
      targets: this.sprite,
      x: targetX,
      y: { from: this.sprite.y, to: this.sprite.y - 110 },
      duration: dur / 2,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => {
        if (!this.sprite?.active) return;
        this.scene.cameras.main.shake(220, 0.012);
        this._checkMeleeDamage(95);
        this._leaping = false;
        this._attackIndex++;
        this.transitionTo(BOSS_STATE.RECOVERING);
      }
    });
  }

  _checkMeleeDamage(range) {
    if (this._player?.isAlive()) {
      const d = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y,
        this._player.sprite.x, this._player.sprite.y
      );
      if (d < range) this._player.takeDamage(1);
    }
    for (const comp of this._companions) {
      if (!comp.isAlive()) continue;
      const d = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y, comp.sprite.x, comp.sprite.y
      );
      if (d < range) comp.takeDamage(1);
    }
  }

  destroy() {
    super.destroy();
  }
}
