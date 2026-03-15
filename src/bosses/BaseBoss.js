import { AudioManager } from '../audio/AudioManager.js';
import { DEPTH, DIFFICULTY } from '../constants.js';
import { GameState } from '../GameState.js';

export const BOSS_STATE = {
  IDLE:         'idle',
  TELEGRAPHING: 'telegraphing',
  ATTACKING:    'attacking',
  RECOVERING:   'recovering',
  DEFEATED:     'defeated'
};

export class BaseBoss {
  constructor(scene, x, y, textureKey, hp, name) {
    this.scene = scene;
    this.name = name;
    this.maxHp = hp;
    this.hp = hp;
    this.state = BOSS_STATE.IDLE;
    this.stateTimer = 0;
    this._alive = true;
    this._attackIndex = 0;

    this.sprite = scene.physics.add.sprite(x, y, textureKey, 0);
    this.sprite.setDepth(DEPTH.BOSS);
    this.sprite.setScale(1.6);
    this.sprite.setGravityY(0);
    this.sprite.body.setAllowGravity(false);

    const diff = DIFFICULTY[GameState.state.difficulty] || DIFFICULTY.medium;
    this._speedMult = diff.bossSpeed;
    this._telegraphMs = diff.telegraphMs;

    // Safety timeout: force RECOVERING if stuck in any state > 10s
    this._safetyTimer = null;

    // Random wander (set arena bounds in subclass to override defaults)
    this._arenaLeft  = x - 300;
    this._arenaRight = x + 300;
    this._wanderTimer  = 0;
    this._wanderDelay  = Phaser.Math.Between(400, 900);
    this._wanderTarget = null;
    this._wanderSpeed  = 200;
  }

  update(time, delta) {
    if (!this._alive || !this.sprite.active) return;
    this.stateTimer += delta;
    this._updateState(time, delta);
  }

  _updateState(time, delta) {
    // Override in subclasses
  }

  // Lateral drift during idle/recovering — call from subclass IDLE and RECOVERING cases
  _doWander(delta) {
    this._wanderTimer += delta;
    if (this._wanderTimer >= this._wanderDelay && this._wanderTarget === null) {
      const spread = (this._arenaRight - this._arenaLeft) * 0.35;
      this._wanderTarget = Phaser.Math.Clamp(
        this.sprite.x + Phaser.Math.Between(-spread, spread),
        this._arenaLeft + 40,
        this._arenaRight - 40
      );
      this._wanderTimer  = 0;
      this._wanderDelay  = Phaser.Math.Between(400, 900);
    }
    if (this._wanderTarget !== null) {
      const dx = this._wanderTarget - this.sprite.x;
      if (Math.abs(dx) > 8) {
        this.sprite.body.setVelocityX(Math.sign(dx) * this._wanderSpeed * this._speedMult);
        this.sprite.setFlipX(dx < 0);
      } else {
        this.sprite.body.setVelocityX(0);
        this._wanderTarget = null;
      }
    }
  }

  transitionTo(newState) {
    this.state = newState;
    this.stateTimer  = 0;
    this._wanderTimer  = 0;
    this._wanderTarget = null;
    if (this._safetyTimer) this._safetyTimer.remove();
    if (newState !== BOSS_STATE.DEFEATED) {
      this._safetyTimer = this.scene.time.delayedCall(10000, () => {
        if (this.state !== BOSS_STATE.DEFEATED) {
          this.transitionTo(BOSS_STATE.RECOVERING);
        }
      });
    }
  }

  takeDamage(amount = 1) {
    if (!this._alive || this.state === BOSS_STATE.DEFEATED) return;
    this.hp = Math.max(0, this.hp - amount);
    AudioManager.play('boss_damage');

    // Red flash so the player can see shots are landing
    if (this.sprite?.active) {
      this.sprite.setTint(0xff2200);
      this.scene.time.delayedCall(120, () => {
        if (this.sprite?.active) this.sprite.clearTint();
      });
    }

    this.scene.events.emit('bossHpChanged', this.hp, this.maxHp);

    if (this.hp <= 0) {
      this._defeat();
    }
  }

  _defeat() {
    this._alive = false;
    this.state = BOSS_STATE.DEFEATED;
    if (this._safetyTimer) this._safetyTimer.remove();

    AudioManager.play('boss_defeat');
    this.scene.cameras.main.shake(400, 0.02);

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      scaleX: 2.5,
      scaleY: 2.5,
      duration: 600,
      onComplete: () => {
        if (this.sprite?.active) this.sprite.destroy();
        this.scene.events.emit('bossDefeated');
      }
    });
  }

  isAlive() {
    return this._alive;
  }

  destroy() {
    this._alive = false;
    if (this._safetyTimer) this._safetyTimer.remove();
    if (this.sprite?.active) this.sprite.destroy();
  }
}
