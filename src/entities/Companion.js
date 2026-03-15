import { Entity } from './Entity.js';
import { ProjectileGroup } from './Projectile.js';
import { AudioManager } from '../audio/AudioManager.js';
import { GameState } from '../GameState.js';
import { DEPTH, GAME_HEIGHT } from '../constants.js';

const STATE = { FOLLOW: 'follow', ATTACK: 'attack', IDLE: 'idle' };

const WARP_DIST    = 520;  // px away from player before warp triggers
const WARP_TIMEOUT = 3200; // ms stuck far away before teleporting

export class Companion extends Entity {
  constructor(scene, x, y, textureKey, maxHearts, config) {
    super(scene, x, y, textureKey, maxHearts);
    this.sprite.setDepth(DEPTH.COMPANIONS);
    this.sprite.setScale(config.scale || 1.4);

    this._config = config;
    this._state = STATE.FOLLOW;
    this._player = null;
    this._enemies = null;
    this._projectiles = new ProjectileGroup(scene, 'projectile_companion', 10);
    this._lastFireTime = 0;
    this._lastFootstepTime = 0;
    this._moveSpeed = config.moveSpeed || 180;

    // Defeated-but-present state (companions never disappear — they stay for the victory scene)
    this._defeated = false;

    // Warp-when-stuck tracking
    this._lastNearPlayerTime = 0;
  }

  setPlayer(player) {
    this._player = player;
  }

  setEnemies(enemies) {
    this._enemies = enemies;
  }

  // Override so companions don't disappear when hearts run out
  onDefeated() {
    this._alive = true;       // stay alive (sprite must persist for victory scene)
    this._defeated = true;
    if (this.sprite?.active) {
      this.scene.tweens.killTweensOf(this.sprite);
      this.sprite.setAlpha(0.65);
      this.sprite.setTint(0xaaaaaa); // greyed out — shows they're "out of it"
    }
  }

  update(time, delta) {
    if (!this._alive || !this.sprite.active || !this._player) return;

    const px = this._player.sprite.x;
    const py = this._player.sprite.y;
    const cx = this.sprite.x;
    const cy = this.sprite.y;
    const body = this.sprite.body;
    const onGround = body.blocked.down;

    const distToPlayer = Math.abs(cx - px);

    // Track last time we were close to the player (for warp-stuck detection)
    if (distToPlayer < 250) {
      this._lastNearPlayerTime = time;
    }

    // Warp to player if stuck far away (only when not defeated)
    if (!this._defeated && distToPlayer > WARP_DIST) {
      if (time - this._lastNearPlayerTime > WARP_TIMEOUT) {
        const warpX = px + (cx > px ? -this._config.followDistance : this._config.followDistance);
        this.sprite.setPosition(warpX, py);
        body.setVelocity(0, 0);
        this._lastNearPlayerTime = time;
        return;
      }
    }

    // Fall protection — always warp back if fallen off the world
    if (this.sprite.y > GAME_HEIGHT + 60) {
      this.sprite.setPosition(
        this._player.sprite.x - this._config.followDistance,
        this._player.sprite.y
      );
      body.setVelocity(0, 0);
      this._lastNearPlayerTime = time;
      return;
    }

    // Defeated companions move slowly and don't attack
    if (this._defeated) {
      const halfSpeed = this._moveSpeed * 0.45;
      const followDist = this._config.followDistance;
      if (distToPlayer > followDist + 10) {
        const dir = px < cx ? -1 : 1;
        body.setVelocityX(dir * halfSpeed);
        this.sprite.setFlipX(dir < 0);
        this.sprite.play(this._config.walkAnim, true);
      } else {
        body.setVelocityX(0);
        this.sprite.play(this._config.idleAnim, true);
      }
      return;
    }

    // Find nearest enemy
    const target = this._findNearestEnemy();

    if (target && Phaser.Math.Distance.Between(cx, cy, target.sprite.x, target.sprite.y) <= this._config.attackRange) {
      this._state = STATE.ATTACK;
    } else {
      this._state = STATE.FOLLOW;
    }

    if (this._state === STATE.ATTACK && target) {
      // Stop and shoot
      body.setVelocityX(0);
      this.sprite.play(this._config.idleAnim, true);
      this.sprite.setFlipX(target.sprite.x < cx);

      if (time - this._lastFireTime > this._config.fireRate) {
        // Companions share the player's ammo pool on medium/hard
        const ammo = GameState.state.ammo;
        if (ammo === Infinity || ammo > 0) {
          this._lastFireTime = time;
          this._projectiles.fire(cx, cy - 8, target.sprite.x, target.sprite.y, 400);
          this._onAttack();
          if (ammo !== Infinity) {
            GameState.state.ammo = Math.max(0, ammo - 1);
            this.scene.events.emit('ammoChanged');
          }
        }
      }
    } else {
      // Follow player
      const followDist = this._config.followDistance;

      if (distToPlayer > followDist + 10) {
        const dir = px < cx ? -1 : 1;
        body.setVelocityX(dir * this._moveSpeed);
        this.sprite.setFlipX(dir < 0);
        this.sprite.play(this._config.walkAnim, true);

        if (onGround && time - this._lastFootstepTime > this._config.footstepInterval) {
          AudioManager.play(this._config.footstepSound);
          this._lastFootstepTime = time;
        }
      } else {
        body.setVelocityX(0);
        this.sprite.play(this._config.idleAnim, true);
      }

      // Jump if player is significantly above and companion is on ground
      if (onGround && py < cy - 60 && distToPlayer < 200) {
        body.setVelocityY(-480);
      }
    }
  }

  _findNearestEnemy() {
    if (!this._enemies) return null;
    let nearest = null;
    let minDist = this._config.attackRange;
    for (const enemy of this._enemies) {
      if (!enemy.isAlive || !enemy.isAlive() || !enemy.sprite?.active) continue;
      const d = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, enemy.sprite.x, enemy.sprite.y);
      if (d < minDist) {
        minDist = d;
        nearest = enemy;
      }
    }
    return nearest;
  }

  _onAttack() {
    // Override in subclasses for specific sounds/animations
  }

  takeDamage(amount = 1) {
    if (this._defeated) return false;  // already down, no more damage
    if (!super.takeDamage(amount)) return false;
    AudioManager.play('hurt');
    this.scene.events.emit('heartsChanged');
    return true;
  }

  getProjectileGroup() {
    return this._projectiles;
  }
}
