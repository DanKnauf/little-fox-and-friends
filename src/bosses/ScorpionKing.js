import { BaseBoss, BOSS_STATE } from './BaseBoss.js';
import { AudioManager } from '../audio/AudioManager.js';
import { ProjectileGroup } from '../entities/Projectile.js';
import { GAME_HEIGHT, DEPTH } from '../constants.js';

export class ScorpionKing extends BaseBoss {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss_desert', 10, 'Scorpion King');
    this.sprite.play('boss_desert_idle', true);
    this._attacks = ['claw', 'tail', 'claw', 'tail']; // cycle
    this._attackIndex = 0;
    this._player = null;
    this._companions = [];
    this._tailProjectiles = new ProjectileGroup(scene, 'projectile_boss', 5);
    this._clawHitbox = null;

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
        this.sprite.play('boss_desert_idle', true);
        if (this.stateTimer > 1600) {
          this.transitionTo(BOSS_STATE.TELEGRAPHING);
        }
        break;

      case BOSS_STATE.TELEGRAPHING:
        if (this.stateTimer < 16) {
          AudioManager.play('boss_telegraph');
          if (currentAttack === 'claw') {
            this.sprite.play('boss_desert_claw', true);
            this.sprite.setTint(0xff8800);
          } else {
            this.sprite.play('boss_desert_tail', true);
            this.sprite.setTint(0xffee00);
          }
        }
        if (this.stateTimer >= this._telegraphMs) {
          this.sprite.clearTint();
          this.transitionTo(BOSS_STATE.ATTACKING);
        }
        break;

      case BOSS_STATE.ATTACKING:
        if (this.stateTimer < 16) {
          if (currentAttack === 'claw') {
            this._doClawSwipe();
          } else {
            this._doTailArc();
          }
        }
        if (this.stateTimer > 800) {
          this._attackIndex++;
          this.transitionTo(BOSS_STATE.RECOVERING);
        }
        break;

      case BOSS_STATE.RECOVERING:
        this.sprite.play('boss_desert_idle', true);
        this.sprite.body.setVelocityX(0);
        if (this.stateTimer > 1200) {
          this.transitionTo(BOSS_STATE.IDLE);
        }
        break;
    }
  }

  _doClawSwipe() {
    // Horizontal sweep hitbox
    const sweepX = this._player ? this._player.sprite.x : this.sprite.x + 100;
    const dir = sweepX > this.sprite.x ? 1 : -1;
    this.sprite.setFlipX(dir < 0);
    this.sprite.body.setVelocityX(dir * 200 * this._speedMult);

    // Damage on proximity
    this.scene.time.delayedCall(300, () => {
      this.sprite.body.setVelocityX(0);
      this._checkMeleeDamage(120);
    });
  }

  _doTailArc() {
    if (!this._player) return;
    const targetX = this._player.sprite.x;
    const targetY = this._player.sprite.y;

    const proj = this._tailProjectiles.fire(
      this.sprite.x, this.sprite.y - 30,
      targetX, targetY,
      200 * this._speedMult
    );

    if (proj) {
      // Arc trajectory - add upward velocity for arc
      proj.body.setVelocityY(-200);
    }
  }

  _checkMeleeDamage(range) {
    if (!this._player || !this._player.isAlive()) return;
    const dist = Phaser.Math.Distance.Between(
      this.sprite.x, this.sprite.y,
      this._player.sprite.x, this._player.sprite.y
    );
    if (dist < range) this._player.takeDamage(1);

    for (const comp of this._companions) {
      if (!comp.isAlive()) continue;
      const cd = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, comp.sprite.x, comp.sprite.y);
      if (cd < range) comp.takeDamage(1);
    }
  }

  // Allow boss projectiles to hit player
  getTailProjectileGroup() {
    return this._tailProjectiles.getGroup();
  }

  destroy() {
    super.destroy();
  }
}
