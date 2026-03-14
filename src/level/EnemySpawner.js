import { Spider } from '../entities/enemies/Spider.js';
import { EvilBird } from '../entities/enemies/EvilBird.js';
import { Creeper } from '../entities/enemies/Creeper.js';
import { DIFFICULTY } from '../constants.js';

export class EnemySpawner {
  constructor(scene, layout, difficulty) {
    this._scene = scene;
    this._layout = layout;
    this._difficulty = difficulty;
  }

  spawn(platforms, ground) {
    const scene = this._scene;
    const skin = this._layout.skin;
    const cfg = DIFFICULTY[this._difficulty] || DIFFICULTY.medium;
    const densityMultiplier = { low: 0.5, medium: 1.0, high: 1.4 }[cfg.density] || 1.0;
    const speedMultiplier = cfg.enemySpeed;

    const allPlatforms = [
      ...platforms.getChildren(),
      ...ground.getChildren()
    ];

    const enemies = [];
    const rawEnemies = this._layout.enemies || [];

    for (let i = 0; i < rawEnemies.length; i++) {
      // Density culling
      if (Math.random() > densityMultiplier && cfg.density !== 'high') continue;

      const spec = rawEnemies[i];
      let enemy;

      if (spec.type === 'spider') {
        enemy = new Spider(scene, spec.x, spec.y, skin, speedMultiplier);
      } else if (spec.type === 'bird') {
        enemy = new EvilBird(scene, spec.x, spec.y, skin, speedMultiplier);
      } else if (spec.type === 'creeper') {
        enemy = new Creeper(scene, spec.x, spec.y, skin, speedMultiplier);
      }

      if (enemy) {
        if (spec.type !== 'bird') {
          // Land enemies collide with platforms
          scene.physics.add.collider(enemy.sprite, platforms);
          scene.physics.add.collider(enemy.sprite, ground);
        }
        enemies.push(enemy);
      }
    }

    return enemies;
  }
}
