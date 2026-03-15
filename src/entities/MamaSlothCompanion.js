import { Companion } from './Companion.js';
import { AudioManager } from '../audio/AudioManager.js';

export class MamaSlothCompanion extends Companion {
  constructor(scene, x, y, maxHearts) {
    super(scene, x, y, 'mamasloth_comp', maxHearts, {
      attackRange: 260,
      fireRate: 2200,
      followDistance: 120,
      moveSpeed: 160,
      scale: 1.5,
      walkAnim: 'mamasloth_comp_walk',
      idleAnim: 'mamasloth_comp_idle',
      footstepSound: 'footstep_sloth',
      footstepInterval: 400
    });
    this.sprite.play('mamasloth_comp_idle');
  }

  _onAttack() {
    AudioManager.play('shoot');
  }
}
