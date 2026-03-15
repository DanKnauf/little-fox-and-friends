import { DEPTH } from '../constants.js';

export class ProjectileGroup {
  constructor(scene, textureKey = 'projectile', maxSize = 30) {
    this.scene = scene;
    this.group = scene.physics.add.group({
      maxSize,
      runChildUpdate: false
    });
    this._textureKey = textureKey;
  }

  fire(fromX, fromY, targetX, targetY, speed = 600) {
    // Recycle or create
    let proj = this.group.getFirstDead(false);
    if (!proj) {
      proj = this.group.create(fromX, fromY, this._textureKey);
    } else {
      proj.setPosition(fromX, fromY);
      proj.setActive(true).setVisible(true);
    }

    if (!proj) return null;

    proj.setDepth(DEPTH.PROJECTILES);
    proj.body.setAllowGravity(false);

    const angle = Math.atan2(targetY - fromY, targetX - fromX);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    proj.body.setVelocity(vx, vy);
    proj.setRotation(angle);

    // Auto-kill after 2 seconds or out of bounds
    proj._killTimer = this.scene.time.delayedCall(2000, () => {
      if (proj.active) {
        proj.setActive(false).setVisible(false);
        proj.body.setVelocity(0, 0);
      }
    });

    return proj;
  }

  hit(proj) {
    if (!proj || !proj.active) return;
    if (proj._killTimer) { proj._killTimer.remove(); proj._killTimer = null; }
    proj.setActive(false).setVisible(false);
    if (proj.body) proj.body.setVelocity(0, 0);
  }

  destroy() {
    for (const proj of this.group.getChildren()) {
      if (proj._killTimer) { proj._killTimer.remove(); proj._killTimer = null; }
    }
    this.group.clear(true, true);
  }

  getGroup() {
    return this.group;
  }
}
