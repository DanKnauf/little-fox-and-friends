import { DEPTH } from '../constants.js';

export class Mamoslav {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.add.sprite(x, y, 'mamoslav', 0);
    this.sprite.setDepth(DEPTH.PLAYER).setScale(1.6);
    this.sprite.play('mamoslav_idle');
  }

  runTo(targetX, targetY, onComplete) {
    this.sprite.play('mamoslav_celebrate', true);
    this.sprite.setFlipX(this.sprite.x > targetX);
    this.scene.tweens.add({
      targets: this.sprite,
      x: targetX,
      y: targetY,
      duration: 800,
      ease: 'Power2',
      onComplete
    });
  }

  hug(targetSprite, onComplete) {
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: { from: 1.6, to: 2.0 },
      scaleY: { from: 1.6, to: 2.0 },
      duration: 300,
      yoyo: true,
      repeat: 1,
      onComplete
    });
  }

  celebrate() {
    this.sprite.play('mamoslav_celebrate', true);
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 20,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  destroy() {
    if (this.sprite && this.sprite.active) this.sprite.destroy();
  }
}
