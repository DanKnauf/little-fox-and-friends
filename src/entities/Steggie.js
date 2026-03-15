import { Companion } from './Companion.js';
import { AudioManager } from '../audio/AudioManager.js';

export class Steggie extends Companion {
  constructor(scene, x, y, maxHearts) {
    super(scene, x, y, 'steggie', maxHearts, {
      attackRange: 260,
      fireRate: 2000,
      followDistance: 140,
      moveSpeed: 155,
      scale: 1.4,
      walkAnim: 'steggie_walk',
      idleAnim: 'steggie_idle',
      footstepSound: 'footstep_steggie',
      footstepInterval: 440
    });
    this.sprite.play('steggie_idle');
  }

  _onAttack() {
    AudioManager.play('steggie_attack');
  }
}
