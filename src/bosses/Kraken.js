import { BaseBoss, BOSS_STATE } from './BaseBoss.js';
import { AudioManager } from '../audio/AudioManager.js';
import { GAME_HEIGHT, GAME_WIDTH, DEPTH } from '../constants.js';

export class Kraken extends BaseBoss {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss_ocean', 14, 'The Kraken');
    this.sprite.play('boss_ocean_idle', true);
    this._attacks = ['tentacle', 'ink', 'roar', 'tentacle', 'ink'];
    this._attackIndex = 0;
    this._player = null;
    this._companions = [];
    this._inkCloud = null;
    this._tentacleSlam = null;
    this._tentacleShadow = null;

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
        this.sprite.play('boss_ocean_idle', true);
        this.sprite.clearTint();
        if (this.stateTimer > 1500) {
          this.transitionTo(BOSS_STATE.TELEGRAPHING);
        }
        break;

      case BOSS_STATE.TELEGRAPHING:
        if (this.stateTimer < 16) {
          if (currentAttack === 'tentacle') {
            this.sprite.play('boss_ocean_tentacle', true);
          } else if (currentAttack === 'ink') {
            this.sprite.play('boss_ocean_ink', true);
          } else {
            this.sprite.play('boss_ocean_idle', true);
          }
        }
        if (this.stateTimer >= 400) {
          this.sprite.clearTint();
          this.transitionTo(BOSS_STATE.ATTACKING);
        }
        break;

      case BOSS_STATE.ATTACKING:
        if (this.stateTimer < 16) {
          if (currentAttack === 'tentacle') {
            this._doTentacleSlam();
          } else if (currentAttack === 'ink') {
            this._doInkSpray();
          } else {
            this._doRoar();
          }
        }

        // Ink cloud damage check
        if (this._inkCloud?.active) {
          this._inkCloud.x += 120 * this._speedMult * (delta / 1000);
          this._checkInkDamage();
          if (this._inkCloud.x > this.scene.cameras.main.scrollX + GAME_WIDTH + 100) {
            this._inkCloud.destroy();
            this._inkCloud = null;
          }
        }

        if (this.stateTimer > 1500) {
          this._attackIndex++;
          this.transitionTo(BOSS_STATE.RECOVERING);
        }
        break;

      case BOSS_STATE.RECOVERING:
        this.sprite.play('boss_ocean_idle', true);
        this.sprite.clearTint();
        if (this._tentacleSlam?.active) { this._tentacleSlam.destroy(); this._tentacleSlam = null; }
        if (this._inkCloud?.active) { this._inkCloud.destroy(); this._inkCloud = null; }
        if (this.stateTimer > 1200) {
          this.transitionTo(BOSS_STATE.IDLE);
        }
        break;
    }
  }

  _doTentacleSlam() {
    this.sprite.clearTint();
    const slamX = this._player
      ? this._player.sprite.x + Phaser.Math.Between(-40, 40)
      : this.sprite.x;

    // Tentacle drops from above
    this._tentacleSlam = this.scene.add.rectangle(slamX, 0, 30, 120, 0x1a5566)
      .setDepth(DEPTH.BOSS + 1);
    this.scene.tweens.add({
      targets: this._tentacleSlam,
      y: GAME_HEIGHT - 80,
      duration: 300,
      ease: 'Power3',
      onComplete: () => {
        this._checkTentacleDamage(slamX);
        this.scene.time.delayedCall(400, () => {
          if (this._tentacleSlam?.active) { this._tentacleSlam.destroy(); this._tentacleSlam = null; }
        });
      }
    });
  }

  _doInkSpray() {
    const camLeft = this.scene.cameras.main.scrollX;
    this._inkCloud = this.scene.add.rectangle(camLeft - 20, GAME_HEIGHT / 2, 200, GAME_HEIGHT, 0x000020, 0.65)
      .setDepth(DEPTH.FOREGROUND - 1);
  }

  _doRoar() {
    this.scene.cameras.main.shake(500, 0.015);
    // Push all characters away from boss
    const targets = [this._player, ...this._companions].filter(c => c?.isAlive?.() || c?.hearts > 0);
    for (const t of targets) {
      if (!t?.sprite?.active) continue;
      const dir = t.sprite.x < this.sprite.x ? -1 : 1;
      t.sprite.body.setVelocityX(dir * 400);
      this.scene.time.delayedCall(400, () => {
        if (t.sprite?.active) t.sprite.body.setVelocityX(0);
      });
    }
  }

  _checkTentacleDamage(slamX) {
    if (!this._player || !this._player.isAlive()) return;
    if (Math.abs(this._player.sprite.x - slamX) < 40) {
      this._player.takeDamage(1);
    }
    for (const comp of this._companions) {
      if (!comp.isAlive()) continue;
      if (Math.abs(comp.sprite.x - slamX) < 40) comp.takeDamage(1);
    }
  }

  _checkInkDamage() {
    if (!this._inkCloud?.active || !this._player?.isAlive()) return;
    const inkX = this._inkCloud.x;
    if (Math.abs(this._player.sprite.x - inkX) < 110) {
      this._player.takeDamage(1);
    }
    for (const comp of this._companions) {
      if (!comp.isAlive()) continue;
      if (Math.abs(comp.sprite.x - inkX) < 110) comp.takeDamage(1);
    }
  }

  destroy() {
    if (this._inkCloud?.active) this._inkCloud.destroy();
    if (this._tentacleSlam?.active) this._tentacleSlam.destroy();
    super.destroy();
  }
}
