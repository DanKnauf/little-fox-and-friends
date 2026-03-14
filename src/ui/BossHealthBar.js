import { GAME_WIDTH, DEPTH } from '../constants.js';

const BAR_W = 400;
const BAR_H = 20;
const BAR_X = GAME_WIDTH / 2;
const BAR_Y = 24;

export class BossHealthBar {
  constructor(scene, bossName) {
    this._scene = scene;
    this._maxHp = 1;
    this._hp = 1;

    const depth = DEPTH.HUD;

    // Background
    this._bg = scene.add.rectangle(BAR_X, BAR_Y, BAR_W + 6, BAR_H + 6, 0x220000)
      .setScrollFactor(0).setDepth(depth - 1).setStrokeStyle(2, 0xff4400);

    // Fill bar
    this._fill = scene.add.rectangle(BAR_X - BAR_W / 2, BAR_Y, BAR_W, BAR_H, 0xff2200)
      .setScrollFactor(0).setDepth(depth).setOrigin(0, 0.5);

    // Boss name label
    this._label = scene.add.text(BAR_X, BAR_Y - 18, bossName, {
      fontSize: '14px', color: '#ffdddd', fontFamily: 'Arial',
      stroke: '#330000', strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth);
  }

  init(maxHp) {
    this._maxHp = maxHp;
    this._hp = maxHp;
    this._updateBar();
  }

  update(hp, maxHp) {
    this._hp = hp;
    this._maxHp = maxHp;
    this._updateBar();
  }

  _updateBar() {
    const ratio = Math.max(0, this._hp / this._maxHp);
    const fillW = BAR_W * ratio;
    this._fill.setSize(fillW, BAR_H);

    // Color shift green → yellow → red
    const r = Math.round(255);
    const g = Math.round(ratio * 200);
    this._fill.setFillColor(Phaser.Display.Color.GetColor(r, g, 0));
  }

  flash() {
    this._scene.tweens.add({
      targets: this._fill,
      alpha: { from: 0.3, to: 1 },
      duration: 100,
      yoyo: true,
      repeat: 2
    });
  }

  destroy() {
    this._bg?.destroy();
    this._fill?.destroy();
    this._label?.destroy();
  }
}
