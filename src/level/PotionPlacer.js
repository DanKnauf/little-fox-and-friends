import { DIFFICULTY, DEPTH } from '../constants.js';

export class PotionPlacer {
  constructor(scene, layout, difficulty) {
    this._scene = scene;
    this._layout = layout;
    this._difficulty = difficulty;
  }

  place() {
    const scene = this._scene;
    const cfg = DIFFICULTY[this._difficulty] || DIFFICULTY.medium;
    const count = cfg.potions;
    const spots = (this._layout.potions || []).slice(0, count);

    const group = scene.physics.add.staticGroup();

    for (const spot of spots) {
      const potion = scene.add.sprite(spot.x, spot.y, 'potion');
      potion.setDepth(DEPTH.TERRAIN + 1);
      scene.physics.add.existing(potion, true);
      // Bobbing animation
      scene.tweens.add({
        targets: potion,
        y: spot.y - 8,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      group.add(potion);
    }

    return group;
  }
}
