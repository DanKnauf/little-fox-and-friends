import { BaseBoss, BOSS_STATE } from './BaseBoss.js';
import { AudioManager } from '../audio/AudioManager.js';
import { GAME_HEIGHT, DEPTH } from '../constants.js';

// T-Rex has two attacks alternating:
//   CHOMP  — lunges toward player, snapping jaw (close-range melee)
//   STOMP  — walks forward, creates ground shockwave that travels along the floor

const ATTACK = { CHOMP: 0, STOMP: 1 };

export class TRex extends BaseBoss {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss_volcano', 14, 'T-Rex');
    this.sprite.setScale(1.8);
    this.sprite.play('boss_volcano_idle', true);
    this._phase = ATTACK.CHOMP;
    this._arenaLeft  = x - 360;
    this._arenaRight = x + 360;
    this._chargeTarget = null;
    this._player = null;
    this._companions = [];
    this._shockwaves = [];

    // Used to rate-limit contact damage (once per 900ms)
    this._lastContactDmg = 0;

    this.transitionTo(BOSS_STATE.IDLE);
  }

  setPlayer(player, companions) {
    this._player = player;
    this._companions = companions || [];
  }

  _updateState(time, delta) {
    switch (this.state) {
      case BOSS_STATE.IDLE:
        this.sprite.play('boss_volcano_idle', true);
        this._doWander(delta);
        if (this.stateTimer > 1600) {
          this._wanderTarget = null;
          this.sprite.body.setVelocityX(0);
          this.transitionTo(BOSS_STATE.TELEGRAPHING);
        }
        break;

      case BOSS_STATE.TELEGRAPHING:
        if (!this._stateSetupDone) { this._stateSetupDone = true;
          if (this._phase === ATTACK.CHOMP) {
            // T-Rex lowers head and growls
            this.sprite.play('boss_volcano_chomp', true);
            // Lock onto player position for the charge
            if (this._player) {
              this._chargeTarget = this._player.sprite.x;
              this.sprite.setFlipX(this._chargeTarget < this.sprite.x);
            }
            // Show a danger zone indicator in front of the T-Rex
            this._showChompWarning();
          } else {
            // Stomp telegraph — T-Rex raises its foot, screen rumbles
            this.sprite.play('boss_volcano_stomp', true);
            this.scene.cameras.main.shake(this._telegraphMs * 0.5, 0.006);
          }
        }
        if (this.stateTimer >= this._telegraphMs) {
          this.transitionTo(BOSS_STATE.ATTACKING);
        }
        break;

      case BOSS_STATE.ATTACKING:
        if (this._phase === ATTACK.CHOMP) {
          this._doChomp(time, delta);
        } else {
          this._doStomp(time, delta);
        }
        break;

      case BOSS_STATE.RECOVERING:
        if (this.stateTimer < 50) this.sprite.body.setVelocityX(0);
        this.sprite.play('boss_volcano_idle', true);
        this._doWander(delta);
        // Update shockwaves
        this._updateShockwaves(delta);
        if (this.stateTimer > 900) {
          this._wanderTarget = null;
          this.sprite.body.setVelocityX(0);
          this.transitionTo(BOSS_STATE.IDLE);
        }
        break;
    }

    this._updateShockwaves(delta);
    this._checkContactDamage(time);
  }

  // ── Chomp ──────────────────────────────────────────────────────────────────
  _showChompWarning() {
    if (!this._chompWarnG) {
      const warnX = this._chargeTarget ?? this.sprite.x;
      const g = this.scene.add.graphics().setDepth(DEPTH.TERRAIN - 1);
      g.fillStyle(0xff3300, 0.35);
      g.fillRect(warnX - 80, GAME_HEIGHT - 100, 160, 60);
      this._chompWarnG = g;
      // Destroy warning when attack begins
      this.scene.time.delayedCall(this._telegraphMs, () => {
        if (this._chompWarnG?.active) {
          this._chompWarnG.destroy();
          this._chompWarnG = null;
        }
      });
    }
  }

  _doChomp(time, delta) {
    const target = this._chargeTarget ?? this.sprite.x;
    const dx = target - this.sprite.x;
    if (Math.abs(dx) > 12) {
      this.sprite.body.setVelocityX(Math.sign(dx) * 360 * this._speedMult);
      this.sprite.setFlipX(dx < 0);
      this.sprite.play('boss_volcano_chomp', true);
    } else {
      this.sprite.body.setVelocityX(0);
      // Chomp reached — big bite damage if player near
      if (this._player && this._player.isAlive()) {
        const dist = Phaser.Math.Distance.Between(
          this.sprite.x, this.sprite.y,
          this._player.sprite.x, this._player.sprite.y
        );
        if (dist < 90) {
          this._player.takeDamage(2);   // chomp hurts more than normal contact
          this.scene.cameras.main.shake(200, 0.012);
        }
      }
      for (const comp of this._companions) {
        if (!comp.isAlive()) continue;
        const dist = Phaser.Math.Distance.Between(
          this.sprite.x, this.sprite.y, comp.sprite.x, comp.sprite.y
        );
        if (dist < 90) comp.takeDamage(2);
      }
      this._phase = ATTACK.STOMP;
      this.transitionTo(BOSS_STATE.RECOVERING);
    }

    if (this.stateTimer > 3000) {
      this.sprite.body.setVelocityX(0);
      this._phase = ATTACK.STOMP;
      this.transitionTo(BOSS_STATE.RECOVERING);
    }
  }

  // ── Stomp ──────────────────────────────────────────────────────────────────
  _doStomp(time, delta) {
    if (this.stateTimer < 80) {
      // Create the shockwave at T-Rex feet
      this._spawnShockwave(this.sprite.x, this.sprite.flipX ? -1 : 1);
      this.scene.cameras.main.shake(300, 0.015);
    }
    this.sprite.body.setVelocityX(0);
    this._phase = ATTACK.CHOMP;
    // Wait for shockwave to finish
    this.scene.time.delayedCall(600, () => {
      if (this.state !== BOSS_STATE.DEFEATED) {
        this.transitionTo(BOSS_STATE.RECOVERING);
      }
    });
    // Prevent re-entry
    this._phase = ATTACK.CHOMP;
    this.state = 'waiting_stomp';
  }

  _spawnShockwave(originX, dir) {
    // Shockwave is a glowing ground-level rectangle that travels sideways
    const sw = this.scene.add.graphics().setDepth(DEPTH.TERRAIN);
    sw.fillStyle(0xff6600, 0.7);
    sw.fillRect(-40, -20, 80, 20);
    sw.x = originX;
    sw.y = GAME_HEIGHT - 30;
    this._shockwaves.push({
      gfx: sw,
      dir: dir,
      speed: 380 * this._speedMult,
      timer: 0,
      lifetime: 800,
      lastDmgTime: 0
    });
  }

  _updateShockwaves(delta) {
    const time = this.scene.time.now;
    for (let i = this._shockwaves.length - 1; i >= 0; i--) {
      const sw = this._shockwaves[i];
      sw.timer += delta;
      if (sw.timer >= sw.lifetime) {
        sw.gfx.destroy();
        this._shockwaves.splice(i, 1);
        continue;
      }
      sw.gfx.x += sw.dir * sw.speed * (delta / 1000);
      // Scale pulsing
      const alpha = 1 - sw.timer / sw.lifetime;
      sw.gfx.setAlpha(alpha * 0.8);

      // Damage check
      if (time - sw.lastDmgTime > 600) {
        const checkDmg = (target) => {
          if (!target || !target.isAlive()) return;
          const dx = Math.abs(target.sprite.x - sw.gfx.x);
          const dy = Math.abs(target.sprite.y - sw.gfx.y);
          if (dx < 50 && dy < 50) {
            target.takeDamage(1);
            sw.lastDmgTime = time;
          }
        };
        checkDmg(this._player);
        for (const comp of this._companions) checkDmg(comp);
      }
    }
  }

  // Passive contact damage (being too close to T-Rex) — rate limited
  _checkContactDamage(time) {
    if (time - this._lastContactDmg < 900) return;
    if (!this._player || !this._player.isAlive()) return;
    const dist = Phaser.Math.Distance.Between(
      this.sprite.x, this.sprite.y,
      this._player.sprite.x, this._player.sprite.y
    );
    if (dist < 65) {
      this._player.takeDamage(1);
      this._lastContactDmg = time;
    }
    for (const comp of this._companions) {
      if (!comp.isAlive()) continue;
      const d = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y, comp.sprite.x, comp.sprite.y
      );
      if (d < 65) {
        comp.takeDamage(1);
        this._lastContactDmg = time;
      }
    }
  }

  destroy() {
    for (const sw of this._shockwaves) {
      if (sw.gfx?.active) sw.gfx.destroy();
    }
    if (this._chompWarnG?.active) this._chompWarnG.destroy();
    super.destroy();
  }
}
