import { GAME_HEIGHT, DEPTH } from '../constants.js';

const GROUND_HEIGHT = 40;
const PLATFORM_HEIGHT = 18;

export class LevelBuilder {
  constructor(scene) {
    this._scene = scene;
  }

  build(layout) {
    const scene = this._scene;
    const skin = layout.skin;

    const platforms = scene.physics.add.staticGroup();
    const ground = scene.physics.add.staticGroup();
    const covers = scene.add.group();

    // Ground segments
    for (const [gx, gw] of layout.groundSegments) {
      const tile = scene.add.tileSprite(gx + gw / 2, GAME_HEIGHT - GROUND_HEIGHT / 2, gw, GROUND_HEIGHT, `ground_${skin}`);
      tile.setDepth(DEPTH.TERRAIN);
      const body = scene.physics.add.existing(tile, true);
      tile.body.setSize(gw, GROUND_HEIGHT);
      ground.add(tile);
    }

    // Elevated platforms
    for (const [px, py, pw] of layout.platforms) {
      const tile = scene.add.tileSprite(px + pw / 2, py + PLATFORM_HEIGHT / 2, pw, PLATFORM_HEIGHT, `platform_${skin}`);
      tile.setDepth(DEPTH.TERRAIN);
      scene.physics.add.existing(tile, true);
      tile.body.setSize(pw, PLATFORM_HEIGHT);
      platforms.add(tile);
    }

    // Cover objects (decorative, optionally hide potions)
    for (const cover of (layout.covers || [])) {
      const obj = scene.add.image(cover.x, cover.y, cover.key);
      obj.setOrigin(0.5, 1).setDepth(DEPTH.FOREGROUND);
      covers.add(obj);
    }

    // Boss zone trigger
    const bossZone = scene.add.zone(layout.bossZoneTriggerX, GAME_HEIGHT / 2, 40, GAME_HEIGHT);
    scene.physics.world.enable(bossZone);
    bossZone.body.setAllowGravity(false);
    bossZone.body.moves = false;

    return { platforms, ground, covers, bossZone };
  }
}
