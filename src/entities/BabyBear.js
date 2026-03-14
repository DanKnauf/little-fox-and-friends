import { Companion } from './Companion.js';
import { AudioManager } from '../audio/AudioManager.js';

export class BabyBear extends Companion {
  constructor(scene, x, y, maxHearts) {
    super(scene, x, y, 'bear', maxHearts, {
      attackRange: 220,
      fireRate: 1500,
      followDistance: 80,
      moveSpeed: 190,
      scale: 1.4,
      walkAnim: 'bear_walk',
      idleAnim: 'bear_idle',
      footstepSound: 'footstep_bear',
      footstepInterval: 300
    });
    this.sprite.play('bear_idle');
  }

  _onAttack() {
    this.sprite.play('bear_attack', true);
    AudioManager.play('bear_attack');
    this.scene.time.delayedCall(300, () => {
      if (this.sprite.active) this.sprite.play('bear_idle', true);
    });
  }
}
