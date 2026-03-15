import { Entity } from './Entity.js';
import { ProjectileGroup } from './Projectile.js';
import { AudioManager } from '../audio/AudioManager.js';
import { DEPTH, GAME_HEIGHT } from '../constants.js';
import { GameState } from '../GameState.js';

export class LittleFox extends Entity {
  constructor(scene, x, y, maxHearts) {
    super(scene, x, y, 'fox', maxHearts);
    this.sprite.setDepth(DEPTH.PLAYER);
    this.sprite.setScale(1.4);
    this.sprite.play('fox_idle');

    this._projectiles = new ProjectileGroup(scene, 'projectile', 20);
    this._keys = scene.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      shoot: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this._facingRight = true;
    this._isCrouching = false;
    this._isSizeUp = false;
    this._sizeUpTimer = null;
    this._lastFootstepTime = 0;
    this._shootCooldown = 0;
    this._moveSpeed = 220;

    // Mouse click to shoot toward cursor
    scene.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown()) this._shootAt(pointer.worldX, pointer.worldY);
    });
  }

  update(time, delta) {
    if (!this._alive || !this.sprite.active) return;

    const body = this.sprite.body;
    const keys = this._keys;
    const onGround = body.blocked.down;

    // Horizontal movement
    if (keys.left.isDown) {
      body.setVelocityX(-this._moveSpeed);
      this._facingRight = false;
      this.sprite.setFlipX(true);
      if (onGround && !this._isCrouching) {
        if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim?.key !== 'fox_walk') {
          this.sprite.play('fox_walk', true);
        }
        if (time - this._lastFootstepTime > 220) {
          AudioManager.play('footstep_fox');
          this._lastFootstepTime = time;
        }
      }
    } else if (keys.right.isDown) {
      body.setVelocityX(this._moveSpeed);
      this._facingRight = true;
      this.sprite.setFlipX(false);
      if (onGround && !this._isCrouching) {
        if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim?.key !== 'fox_walk') {
          this.sprite.play('fox_walk', true);
        }
        if (time - this._lastFootstepTime > 220) {
          AudioManager.play('footstep_fox');
          this._lastFootstepTime = time;
        }
      }
    } else {
      body.setVelocityX(0);
      if (onGround && !this._isCrouching) {
        this.sprite.play('fox_idle', true);
      }
    }

    // Jump (W key only)
    if (keys.up.isDown && onGround) {
      body.setVelocityY(-520);
      this.sprite.play('fox_jump', true);
      AudioManager.play('jump');
    }

    // Spacebar = shoot forward
    if (Phaser.Input.Keyboard.JustDown(keys.shoot)) {
      this._shootForward();
    }

    // Crouch
    if (keys.down.isDown && onGround) {
      if (!this._isCrouching) {
        this._isCrouching = true;
        this.sprite.setScale(this._isSizeUp ? 2.0 : 0.9, this._isSizeUp ? 1.4 : 0.7);
        body.setVelocityX(0);
      }
    } else {
      if (this._isCrouching) {
        this._isCrouching = false;
        this.sprite.setScale(this._isSizeUp ? 2.8 : 1.4);
      }
    }

    // Fall detection
    if (this.sprite.y > GAME_HEIGHT + 60) {
      this.takeDamage(1);
      this.sprite.setPosition(Math.max(80, this.sprite.x - 50), GAME_HEIGHT - 120);
      body.setVelocity(0, 0);
    }

    // Shoot cooldown
    if (this._shootCooldown > 0) {
      this._shootCooldown -= delta;
    }
  }

  _canShoot() {
    if (this._shootCooldown > 0 || !this._alive) return false;
    const ammo = GameState.state.ammo;
    if (ammo !== Infinity && ammo <= 0) return false;
    return true;
  }

  _fireProjectile(targetX, targetY) {
    this._shootCooldown = 300;
    this._projectiles.fire(this.sprite.x, this.sprite.y - 8, targetX, targetY, 600);
    this.sprite.play('fox_shoot', true);
    this.scene.time.delayedCall(200, () => {
      if (this.sprite?.active) this.sprite.play('fox_idle', true);
    });
    AudioManager.play('shoot');
    const ammo = GameState.state.ammo;
    if (ammo !== Infinity) {
      GameState.state.ammo -= 1;
      this.scene.events.emit('ammoChanged');
    }
  }

  _shootForward() {
    if (!this._canShoot()) return;
    const targetX = this.sprite.x + (this._facingRight ? 600 : -600);
    const targetY = this.sprite.y - 8;
    this._fireProjectile(targetX, targetY);
  }

  _shootAt(worldX, worldY) {
    if (!this._canShoot()) return;
    // If clicking in same direction as facing, shoot toward cursor.
    // Otherwise flip facing and shoot forward (avoids awkward backwards shots).
    const dx = worldX - this.sprite.x;
    if (dx > 0) { this._facingRight = true; this.sprite.setFlipX(false); }
    else if (dx < 0) { this._facingRight = false; this.sprite.setFlipX(true); }
    this._fireProjectile(worldX, worldY);
  }

  activateSizeUp() {
    if (!this._alive) return;
    this._isSizeUp = true;
    this.sprite.setScale(2.8);
    this.healFull();
    this.scene.events.emit('heartsChanged');
    AudioManager.play('potion_collect');
    AudioManager.playLoop('size_hum');

    if (this._sizeUpTimer) this._sizeUpTimer.remove();
    this._sizeUpTimer = this.scene.time.delayedCall(10000, () => {
      this._isSizeUp = false;
      if (this.sprite.active) this.sprite.setScale(1.4);
      AudioManager.stopLoop('size_hum');
    });
  }

  takeDamage(amount = 1) {
    if (!super.takeDamage(amount)) return false;
    AudioManager.play('hurt');
    this.scene.events.emit('heartsChanged');
    if (!this._alive) {
      AudioManager.play('defeat_player');
      this.scene.events.emit('playerDefeated');
    }
    return true;
  }

  getProjectileGroup() {
    return this._projectiles;
  }
}
