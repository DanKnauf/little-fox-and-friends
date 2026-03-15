import { BaseBoss, BOSS_STATE } from './BaseBoss.js';
import { AudioManager } from '../audio/AudioManager.js';
import { GAME_HEIGHT, DEPTH } from '../constants.js';

export class ForestGuardian extends BaseBoss {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss_forest', 10, 'Forest Guardian');
    this.sprite.play('boss_forest_idle', true);
    this._phase = 0;  // 0=charge, 1=web drop alternating
    this._chargeTarget = 1;
    this._arenaLeft = x - 320;
    this._arenaRight = x + 320;
    this._webHazards = [];
    this._player = null;
    this._companions = [];

    this.transitionTo(BOSS_STATE.IDLE);
  }

  setPlayer(player, companions) {
    this._player = player;
    this._companions = companions || [];
  }

  _updateState(time, delta) {
    switch (this.state) {
      case BOSS_STATE.IDLE:
        this.sprite.play('boss_forest_idle', true);
        this._doWander(delta);
        if (this.stateTimer > 1800) {
          this._wanderTarget = null;
          this.sprite.body.setVelocityX(0);
          this.transitionTo(BOSS_STATE.TELEGRAPHING);
        }
        break;

      case BOSS_STATE.TELEGRAPHING:
        if (!this._stateSetupDone) { this._stateSetupDone = true;
          if (this._phase % 2 === 0) {
            this.sprite.play('boss_forest_charge', true);
            if (this._player) {
              this._chargeTarget = this._player.sprite.x > this.sprite.x ? this._arenaRight : this._arenaLeft;
            } else {
              this._chargeTarget = this._chargeTarget === this._arenaRight ? this._arenaLeft : this._arenaRight;
            }
          } else {
            this.sprite.play('boss_forest_web', true);
          }
        }
        if (this.stateTimer >= 400) {
          this.transitionTo(BOSS_STATE.ATTACKING);
        }
        break;

      case BOSS_STATE.ATTACKING:
        if (this._phase % 2 === 0) {
          // Charge attack
          const dx = this._chargeTarget - this.sprite.x;
          if (Math.abs(dx) > 10) {
            this.sprite.body.setVelocityX(Math.sign(dx) * 340 * this._speedMult);
            this.sprite.setFlipX(dx < 0);
          } else {
            this.sprite.body.setVelocityX(0);
            this._phase++;
            this.transitionTo(BOSS_STATE.RECOVERING);
          }
          if (this.stateTimer > 3000) {
            this.sprite.body.setVelocityX(0);
            this._phase++;
            this.transitionTo(BOSS_STATE.RECOVERING);
          }
        } else {
          // Web drop
          if (this.stateTimer < 100) {
            const webX = this._player ? this._player.sprite.x : this.sprite.x;
            // Create web hazard
            const web = this.scene.add.image(webX, GAME_HEIGHT - 58, 'web_hazard')
              .setDepth(DEPTH.TERRAIN).setAlpha(0); // invisible — damage from proximity in _checkWebDamage
            this.scene.physics.add.existing(web, true);
            this._webHazards.push({ sprite: web, timer: 0 });
          }
          this._phase++;
          this.transitionTo(BOSS_STATE.RECOVERING);
        }
        // Check damage on player/companions
        this._checkChargeDamage();
        break;

      case BOSS_STATE.RECOVERING:
        if (this.stateTimer < 50) this.sprite.body.setVelocityX(0);
        this.sprite.play('boss_forest_idle', true);
        this._doWander(delta);

        // Age web hazards
        for (let i = this._webHazards.length - 1; i >= 0; i--) {
          this._webHazards[i].timer += delta;
          if (this._webHazards[i].timer > 2500) {
            this._webHazards[i].sprite.destroy();
            this._webHazards.splice(i, 1);
          }
        }

        if (this.stateTimer > 1000) {
          this._wanderTarget = null;
          this.sprite.body.setVelocityX(0);
          this.transitionTo(BOSS_STATE.IDLE);
        }
        break;
    }

    // Check web hazard damage
    this._checkWebDamage();
  }

  _checkChargeDamage() {
    if (!this._player || !this._player.isAlive()) return;
    if (this.state === BOSS_STATE.ATTACKING && this._phase % 2 === 0) {
      const dist = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y,
        this._player.sprite.x, this._player.sprite.y
      );
      if (dist < 70) {
        this._player.takeDamage(1);
      }
    }
    // Companions too
    for (const comp of this._companions) {
      if (!comp.isAlive()) continue;
      const dist = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y,
        comp.sprite.x, comp.sprite.y
      );
      if (dist < 70 && this.state === BOSS_STATE.ATTACKING) {
        comp.takeDamage(1);
      }
    }
  }

  _checkWebDamage() {
    if (!this._player || !this._player.isAlive()) return;
    for (const web of this._webHazards) {
      if (!web.sprite.active) continue;
      const dist = Phaser.Math.Distance.Between(
        web.sprite.x, web.sprite.y,
        this._player.sprite.x, this._player.sprite.y
      );
      if (dist < 50) {
        this._player.takeDamage(1);
      }
    }
  }

  destroy() {
    for (const w of this._webHazards) {
      if (w.sprite?.active) w.sprite.destroy();
    }
    super.destroy();
  }
}
