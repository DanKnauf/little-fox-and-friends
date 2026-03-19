import { Entity } from './Entity.js';
import { ProjectileGroup } from './Projectile.js';
import { AudioManager } from '../audio/AudioManager.js';
import { DEPTH, GAME_HEIGHT } from '../constants.js';
import { GameState } from '../GameState.js';
import { getRawPad, isButtonDown, getAxis } from '../input/GamepadInput.js';
import { getTouchLeft, getTouchRight, getTouchJump, getTouchShoot, touchHitZone } from '../input/TouchInput.js';

export class LittleFox extends Entity {
  constructor(scene, x, y, maxHearts) {
    super(scene, x, y, 'fox', maxHearts);
    this.sprite.setDepth(DEPTH.PLAYER);
    this.sprite.setScale(1.4);
    this.sprite.play('fox_idle');

    // Frame is 32×40 but we want the same collision footprint as the old 32×32 frame.
    // offsetY=4 shifts the body down so its bottom aligns with the old 32px frame bottom.
    this.sprite.body.setSize(28, 32);
    this.sprite.body.setOffset(2, 4);

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

    // Gamepad "just pressed" edge-detection state
    this._padShootPrev   = false;
    this._padJumpPrev    = false;

    // Touch "just pressed" edge-detection state
    this._touchJumpPrev  = false;
    this._touchShootPrev = false;

    // Mouse/tap to shoot toward cursor.
    // Suppress when the tap lands on a touch-control button zone so
    // pressing Left/Right/Jump/Pause doesn't also fire a shot.
    scene.input.on('pointerdown', (pointer) => {
      const blocked = GameState.state.touchControlsEnabled && touchHitZone(pointer.x, pointer.y);
      if (pointer.leftButtonDown() && !blocked) this._shootAt(pointer.worldX, pointer.worldY);
    });
  }

  update(time, delta) {
    if (!this._alive || !this.sprite.active) return;

    const body    = this.sprite.body;
    const keys    = this._keys;
    const onGround = body.blocked.down;

    // ── Gamepad — read directly from browser API to bypass Phaser timestamp bug
    const pad   = getRawPad();
    const axisX = getAxis(pad, 0);
    const axisY = getAxis(pad, 1);

    const padLeft   = pad && (isButtonDown(pad, 14) || axisX < -0.25);
    const padRight  = pad && (isButtonDown(pad, 15) || axisX >  0.25);
    const padCrouch = pad && (isButtonDown(pad, 13) || axisY >  0.5);
    const padJumpNow  = !!(pad && (isButtonDown(pad, 0) || isButtonDown(pad, 12)));
    const padShootNow = !!(pad && (
      isButtonDown(pad, 2) ||                          // X
      isButtonDown(pad, 5) ||                          // RB
      (pad.buttons[7]?.value ?? 0) > 0.3              // RT (analog trigger)
    ));

    // Edge-detect "just pressed" for jump and shoot (gamepad)
    const padJumpJust  = padJumpNow  && !this._padJumpPrev;
    const padShootJust = padShootNow && !this._padShootPrev;
    this._padJumpPrev  = padJumpNow;
    this._padShootPrev = padShootNow;

    // ── Touch — on-screen virtual buttons ───────────────────────────────────
    const tcOn         = GameState.state.touchControlsEnabled;
    const touchLeft    = tcOn && getTouchLeft();
    const touchRight   = tcOn && getTouchRight();
    const touchJumpNow = tcOn && getTouchJump();
    const touchShootNow = tcOn && getTouchShoot();

    // Edge-detect "just pressed" for jump and shoot (touch)
    const touchJumpJust  = touchJumpNow  && !this._touchJumpPrev;
    const touchShootJust = touchShootNow && !this._touchShootPrev;
    this._touchJumpPrev  = touchJumpNow;
    this._touchShootPrev = touchShootNow;

    // ── Horizontal movement ──────────────────────────────────────────────────
    if (keys.left.isDown || padLeft || touchLeft) {
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
    } else if (keys.right.isDown || padRight || touchRight) {
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

    // ── Jump: W key, gamepad A / D-pad up, or touch ▲ button ───────────────
    if ((keys.up.isDown || padJumpJust || touchJumpJust) && onGround) {
      body.setVelocityY(-520);
      this.sprite.play('fox_jump', true);
      AudioManager.play('jump');
    }

    // ── Shoot: SPACE, gamepad X / RB / RT, or touch ● button ───────────────
    if (Phaser.Input.Keyboard.JustDown(keys.shoot) || padShootJust || touchShootJust) {
      this._shootForward();
    }

    // ── Crouch: S key or gamepad left-stick down / D-pad down ───────────────
    if ((keys.down.isDown || padCrouch) && onGround) {
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

    // ── Fall detection ───────────────────────────────────────────────────────
    if (this.sprite.y > GAME_HEIGHT + 60) {
      this.takeDamage(1);
      this.sprite.setPosition(Math.max(80, this.sprite.x - 50), GAME_HEIGHT - 120);
      body.setVelocity(0, 0);
    }

    // ── Shoot cooldown ───────────────────────────────────────────────────────
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
    // Fire from ground-enemy height rather than fox visual centre.
    // In big mode the fox is 2x taller so the centre rises — compensate.
    const fireY = this.sprite.y + (this._isSizeUp ? 20 : 0);
    this._shootCooldown = 300;
    this._projectiles.fire(this.sprite.x, fireY, targetX, targetY, 600);
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
    const fireY = this.sprite.y + (this._isSizeUp ? 20 : 0);
    const targetX = this.sprite.x + (this._facingRight ? 600 : -600);
    this._fireProjectile(targetX, fireY);
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
    this._invincible = true;
    this.sprite.setScale(2.8);
    this.healFull();
    this.scene.events.emit('heartsChanged');
    AudioManager.play('potion_collect');
    AudioManager.playLoop('size_hum');

    // Rainbow cycling tint to show invincibility (star-power effect)
    this._stopRainbow();
    const COLORS = [0xff0000, 0xff8800, 0xffff00, 0x00ff44, 0x00ccff, 0xaa44ff, 0xff44aa];
    let ci = 0;
    this._rainbowTween = this.scene.time.addEvent({
      delay: 100,
      repeat: 99,  // 100 × 100ms = 10 s
      callback: () => {
        if (!this.sprite?.active) return;
        this.sprite.setTint(COLORS[ci % COLORS.length]);
        ci++;
      }
    });

    if (this._sizeUpTimer) this._sizeUpTimer.remove();
    this._sizeUpTimer = this.scene.time.delayedCall(10000, () => {
      this._endSizeUp();
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

  _stopRainbow() {
    if (this._rainbowTween) { this._rainbowTween.remove(); this._rainbowTween = null; }
  }

  _endSizeUp() {
    this._isSizeUp = false;
    this._invincible = false;
    this._stopRainbow();
    if (this.sprite?.active) {
      this.sprite.setScale(1.4);
      this.sprite.clearTint();
      this.sprite.setAlpha(1); // ensure fully visible after any flash effects
    }
    AudioManager.stopLoop('size_hum');
  }

  getProjectileGroup() {
    return this._projectiles;
  }
}
