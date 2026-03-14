import { Companion } from './Companion.js';
import { AudioManager } from '../audio/AudioManager.js';

export class Stegge extends Companion {
  constructor(scene, x, y, maxHearts) {
    super(scene, x, y, 'stegge', maxHearts, {
      attackRange: 260,
      fireRate: 2000,
      followDistance: 140,
      moveSpeed: 155,
      scale: 1.4,
      walkAnim: 'stegge_walk',
      idleAnim: 'stegge_idle',
      footstepSound: 'footstep_stegge',
      footstepInterval: 440
    });
    this.sprite.play('stegge_idle');
  }

  _onAttack() {
    AudioManager.play('stegge_attack');
  }
}
