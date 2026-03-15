import { BaseBoss, BOSS_STATE } from './BaseBoss.js';
import { AudioManager } from '../audio/AudioManager.js';
import { ProjectileGroup } from '../entities/Projectile.js';
import { GAME_HEIGHT, GAME_WIDTH, DEPTH } from '../constants.js';

export class Kraken extends BaseBoss {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss_ocean', 21, 'The Kraken');
    this.sprite.play('boss_ocean_idle', true);
    this._attacks = ['tentacle', 'ink', 'tentacle', 'roar', 'tentacle', 'ink', 'tentacle', 'ink'];
    this._attackIndex = 0;
    this._player = null;
    this._companions = [];
    this._tentacleObj = null;
    this._inkProjectiles = new ProjectileGroup(scene, 'projectile_boss', 8);

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
        this._doWander(delta);
        if (this.stateTimer > 600) {
          this._wanderTarget = null;
          this.sprite.body.setVelocityX(0);
          this.transitionTo(BOSS_STATE.TELEGRAPHING);
        }
        break;

      case BOSS_STATE.TELEGRAPHING:
        if (this.stateTimer < 16) {
          if (currentAttack === 'tentacle') {
            this.sprite.play('boss_ocean_tentacle', true);
            this.sprite.setTint(0x44ffcc);
          } else if (currentAttack === 'ink') {
            this.sprite.play('boss_ocean_ink', true);
            this.sprite.setTint(0x440066);
          } else {
            this.sprite.play('boss_ocean_idle', true);
            this.sprite.setTint(0xff8800);
          }
        }
        if (this.stateTimer >= 200) {
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

        if (this.stateTimer > 950) {
          this._attackIndex++;
          this.transitionTo(BOSS_STATE.RECOVERING);
        }
        break;

      case BOSS_STATE.RECOVERING:
        this.sprite.play('boss_ocean_idle', true);
        this.sprite.clearTint();
        if (this._tentacleObj?.active) { this._tentacleObj.destroy(); this._tentacleObj = null; }
        this._doWander(delta);
        if (this.stateTimer > 400) {
          this._wanderTarget = null;
          this.sprite.body.setVelocityX(0);
          this.transitionTo(BOSS_STATE.IDLE);
        }
        break;
    }
  }

  _doTentacleSlam() {
    const slamX = this._player
      ? this._player.sprite.x + Phaser.Math.Between(-50, 50)
      : this.sprite.x;

    // Draw a tentacle using Graphics — tapered dark teal bar with a sucker tip
    const g = this.scene.add.graphics().setDepth(DEPTH.BOSS + 1);
    g.fillStyle(0x0a3344, 1);
    g.fillRect(-18, 0, 36, 110);
    g.fillStyle(0x1a7788, 1);
    g.fillRect(-12, 0, 24, 110);
    // Sucker rows
    g.fillStyle(0xaaddee, 0.9);
    for (let sy = 15; sy < 110; sy += 22) {
      g.fillCircle(-8, sy, 5);
      g.fillCircle(8, sy, 5);
    }
    // Tip glow
    g.fillStyle(0x00ffdd, 0.85);
    g.fillCircle(0, 112, 12);

    g.x = slamX;
    g.y = -130;
    this._tentacleObj = g;

    this.scene.tweens.add({
      targets: g,
      y: GAME_HEIGHT - 80,
      duration: 200,
      ease: 'Power3',
      onComplete: () => {
        this._checkTentacleDamage(slamX);
        this.scene.cameras.main.shake(200, 0.015);
        this.scene.time.delayedCall(280, () => {
          if (g.active) { g.destroy(); }
          if (this._tentacleObj === g) this._tentacleObj = null;
        });
        // Second slam at a nearby offset
        this.scene.time.delayedCall(180, () => {
          if (!this._alive) return;
          const sx2 = slamX + Phaser.Math.Between(-120, 120);
          const g2 = this.scene.add.graphics().setDepth(DEPTH.BOSS + 1);
          g2.fillStyle(0x0a3344, 1); g2.fillRect(-14, 0, 28, 90);
          g2.fillStyle(0x1a7788, 1); g2.fillRect(-9, 0, 18, 90);
          g2.fillStyle(0x00ffdd, 0.85); g2.fillCircle(0, 92, 9);
          g2.x = sx2; g2.y = -100;
          this.scene.tweens.add({
            targets: g2,
            y: GAME_HEIGHT - 80,
            duration: 200,
            ease: 'Power3',
            onComplete: () => {
              this._checkTentacleDamage(sx2);
              this.scene.time.delayedCall(250, () => { if (g2.active) g2.destroy(); });
            }
          });
        });
      }
    });
  }

  _doInkSpray() {
    // Fire ink blobs at the player and each companion
    const targets = [this._player, ...this._companions].filter(c => c?.isAlive?.() || c?.hearts > 0);

    for (const t of targets) {
      if (!t?.sprite?.active) continue;
      const p = this._inkProjectiles.fire(
        this.sprite.x, this.sprite.y - 20,
        t.sprite.x, t.sprite.y,
        200 * this._speedMult
      );
      if (p) p.setTint(0x220033);
    }

    // Three follow-up bursts aimed at player
    for (let i = 1; i <= 3; i++) {
      this.scene.time.delayedCall(i * 260, () => {
        if (!this._alive || !this._player?.isAlive()) return;
        const p = this._inkProjectiles.fire(
          this.sprite.x, this.sprite.y - 20,
          this._player.sprite.x, this._player.sprite.y,
          220 * this._speedMult
        );
        if (p) p.setTint(0x220033);
      });
    }
  }

  _doRoar() {
    this.scene.cameras.main.shake(500, 0.018);
    const targets = [this._player, ...this._companions].filter(c => c?.isAlive?.() || c?.hearts > 0);
    for (const t of targets) {
      if (!t?.sprite?.active) continue;
      const dir = t.sprite.x < this.sprite.x ? -1 : 1;
      t.sprite.body.setVelocityX(dir * 480);
      this.scene.time.delayedCall(400, () => {
        if (t.sprite?.active) t.sprite.body.setVelocityX(0);
      });
    }
  }

  _checkTentacleDamage(slamX) {
    if (!this._player || !this._player.isAlive()) return;
    if (Math.abs(this._player.sprite.x - slamX) < 50) {
      this._player.takeDamage(1);
    }
    for (const comp of this._companions) {
      if (!comp.isAlive()) continue;
      if (Math.abs(comp.sprite.x - slamX) < 50) comp.takeDamage(1);
    }
  }

  getInkProjectileGroup() {
    return this._inkProjectiles.getGroup();
  }

  destroy() {
    if (this._tentacleObj?.active) this._tentacleObj.destroy();
    super.destroy();
  }
}
