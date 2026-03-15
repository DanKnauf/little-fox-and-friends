import { GAME_WIDTH, GAME_HEIGHT, LEVEL_WIDTH, LEVEL_CONFIG, DEPTH, DIFFICULTY } from '../constants.js';
import { GameState } from '../GameState.js';
import { AudioManager } from '../audio/AudioManager.js';
import { LevelBuilder } from '../level/LevelBuilder.js';
import { EnemySpawner } from '../level/EnemySpawner.js';
import { PotionPlacer } from '../level/PotionPlacer.js';
import { ForestLayout } from '../level/ForestLayout.js';
import { DesertLayout } from '../level/DesertLayout.js';
import { OceanLayout } from '../level/OceanLayout.js';
import { LittleFox } from '../entities/LittleFox.js';
import { BabyBear } from '../entities/BabyBear.js';
import { Steggie } from '../entities/Steggie.js';
import { HUD } from '../ui/HUD.js';

const LAYOUTS = { 1: ForestLayout, 2: DesertLayout, 3: OceanLayout };

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this._level = data.level || GameState.state.currentLevel || 1;
    GameState.state.currentLevel = this._level;
  }

  create() {
    // Clear stale WebGL texture bindings left over from the previous scene run.
    // Without this, Phaser's pipeline cache can hold null-glTexture references
    // from destroyed Text/Shape objects, causing a crash on the first render frame.
    this.game.renderer.resetTextures?.();

    AudioManager.init(this);

    const layout = LAYOUTS[this._level];
    const cfg = LEVEL_CONFIG[this._level];
    const difficulty = GameState.state.difficulty;

    // World bounds
    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, GAME_HEIGHT);

    // Parallax backgrounds
    this._buildParallax(cfg.bgKey);

    // Level geometry
    const builder = new LevelBuilder(this);
    const { platforms, ground, covers, bossZone } = builder.build(layout);
    this._platforms = platforms;
    this._ground = ground;
    this._bossZone = bossZone;

    // Enemies
    const spawner = new EnemySpawner(this, layout, difficulty);
    this._enemies = spawner.spawn(platforms, ground);

    // Tell birds about the player (set after player spawn)
    for (const e of this._enemies) {
      if (e.setPlayer) e._needsPlayer = true;
    }

    // Potions
    const potionPlacer = new PotionPlacer(this, layout, difficulty);
    this._potionGroup = potionPlacer.place();

    // Ammo pickups (only on medium/hard — easy has Infinity ammo)
    this._ammoGroup = null;
    if (GameState.state.ammo !== Infinity) {
      const ammoCfg = DIFFICULTY[difficulty] || DIFFICULTY.medium;
      const ammoCount = ammoCfg.ammoPickups || 0;
      const ammoSpots = (layout.ammoPickups || []).slice(0, ammoCount);
      this._ammoGroup = this.physics.add.staticGroup();
      for (const spot of ammoSpots) {
        const sprite = this.add.image(spot.x, spot.y, 'ammo_pickup');
        sprite.setDepth(DEPTH.TERRAIN + 1);
        this.physics.add.existing(sprite, true);
        this.tweens.add({ targets: sprite, y: spot.y - 6, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this._ammoGroup.add(sprite);
      }
    }

    // Player
    const { playerHearts, maxHearts } = GameState.state;
    this._littleFox = new LittleFox(this, layout.startX, layout.startY, maxHearts);
    this._littleFox.hearts = playerHearts || maxHearts;

    // Companions
    this._companions = {};
    this._companionList = [];
    const unlocked = GameState.state.companionsUnlocked;

    if (unlocked.includes('babybear')) {
      const bear = new BabyBear(this, layout.startX - 80, layout.startY, GameState.state.companions.babybear.maxHearts);
      bear.hearts = GameState.state.companions.babybear.hearts;
      bear.setPlayer(this._littleFox);
      bear.setEnemies(this._enemies);
      this._companions['babybear'] = bear;
      this._companionList.push(bear);
      this.physics.add.collider(bear.sprite, platforms);
      this.physics.add.collider(bear.sprite, ground);
    }

    if (unlocked.includes('steggie')) {
      const steggie = new Steggie(this, layout.startX - 140, layout.startY, GameState.state.companions.steggie.maxHearts);
      steggie.hearts = GameState.state.companions.steggie.hearts;
      steggie.setPlayer(this._littleFox);
      steggie.setEnemies(this._enemies);
      this._companions['steggie'] = steggie;
      this._companionList.push(steggie);
      this.physics.add.collider(steggie.sprite, platforms);
      this.physics.add.collider(steggie.sprite, ground);
    }

    // Give birds their player reference
    for (const e of this._enemies) {
      if (e._needsPlayer && e.setPlayer) {
        e.setPlayer(this._littleFox);
        e._needsPlayer = false;
      }
    }

    // Physics colliders
    this.physics.add.collider(this._littleFox.sprite, platforms);
    this.physics.add.collider(this._littleFox.sprite, ground);

    // Player projectiles vs enemies
    const foxProjGroup = this._littleFox.getProjectileGroup().getGroup();
    this.physics.add.overlap(foxProjGroup, this._buildEnemySpriteGroup(), (proj, enemySprite) => {
      const enemy = this._findEnemyBySprite(enemySprite);
      if (enemy && enemy.isAlive()) {
        enemy.takeDamage(1);
        this._littleFox.getProjectileGroup().hit(proj);
      }
    });

    // Companion projectiles vs enemies
    for (const comp of this._companionList) {
      const cProjGroup = comp.getProjectileGroup().getGroup();
      this.physics.add.overlap(cProjGroup, this._buildEnemySpriteGroup(), (proj, enemySprite) => {
        const enemy = this._findEnemyBySprite(enemySprite);
        if (enemy && enemy.isAlive()) {
          enemy.takeDamage(1);
          comp.getProjectileGroup().hit(proj);
        }
      });
    }

    // Player vs enemies — damage or invincible kill
    this.physics.add.overlap(this._littleFox.sprite, this._buildEnemySpriteGroup(), (playerSprite, enemySprite) => {
      const enemy = this._findEnemyBySprite(enemySprite);
      if (!enemy || !enemy.isAlive()) return;
      if (this._littleFox._invincible) {
        enemy.takeDamage(99); // instant kill on contact while invincible
      } else if (enemy.canDamagePlayer()) {
        this._littleFox.takeDamage(1);
      }
    });

    // Player vs potions
    this.physics.add.overlap(this._littleFox.sprite, this._potionGroup, (playerSprite, potionSprite) => {
      if (!potionSprite.active) return;
      this._potionGroup.remove(potionSprite, true, true); // safe removal during physics callback
      this._littleFox.activateSizeUp();
    });

    // Ammo pickups
    if (this._ammoGroup) {
      this.physics.add.overlap(this._littleFox.sprite, this._ammoGroup, (playerSprite, ammoSprite) => {
        if (!ammoSprite.active) return;
        this._ammoGroup.remove(ammoSprite, true, true); // safe removal during physics callback
        GameState.addAmmo(10);
        this.events.emit('ammoChanged');
        AudioManager.play('potion_collect');
      });
    }

    // Boss zone trigger
    this.physics.add.overlap(this._littleFox.sprite, bossZone, () => {
      if (!this._bossTriggered) {
        this._bossTriggered = true;
        this._launchBoss();
      }
    });

    // Camera follow
    this.cameras.main.startFollow(this._littleFox.sprite, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(100, 80);

    // HUD
    const companionHUDConfig = {
      babybear: { emoji: '🐻', color: '#c8a060', maxHearts: GameState.state.companions.babybear.maxHearts },
      steggie:  { emoji: '🦕', color: '#4A8C5C', maxHearts: GameState.state.companions.steggie.maxHearts }
    };
    this._hud = new HUD(this, this._littleFox.maxHearts, companionHUDConfig);
    this._hud.refresh();

    // Pause — ESC key or Xbox Start button (button 9)
    this._escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this._padStartPrev = false;

    // Events
    this.events.once('playerDefeated', () => {
      this.time.delayedCall(800, () => {
        this.scene.stop('BossScene');
        this.scene.start('GameOverScene');
      });
    });


    // Music
    AudioManager.playMusic(this._level);

    this._bossTriggered = false;
  }

  update(time, delta) {
    if (!this._littleFox || !this._littleFox.isAlive()) return;

    // Pause trigger: ESC key or Xbox Start button (button 9)
    if (Phaser.Input.Keyboard.JustDown(this._escKey)) {
      this._triggerPause(); return;
    }
    const pad = this.input.gamepad?.getPad(0) ?? null;
    const startNow = !!(pad?.isButtonDown(9));
    if (startNow && !this._padStartPrev) { this._triggerPause(); return; }
    this._padStartPrev = startNow;

    // Parallax scroll
    const camX = this.cameras.main.scrollX;
    for (const layer of (this._parallaxLayers || [])) {
      layer.sprite.tilePositionX = camX * layer.factor;
    }

    this._littleFox.update(time, delta);

    for (const comp of this._companionList) {
      comp.update(time, delta);
    }

    for (const enemy of this._enemies) {
      if (enemy && enemy.isAlive && enemy.isAlive()) {
        enemy.update(time, delta);
      }
    }
  }

  _buildParallax(bgKey) {
    this._parallaxLayers = [];
    const layerDefs = [
      { suffix: 'sky',  factor: 0.05, depth: DEPTH.BG_FAR  },
      { suffix: 'far',  factor: 0.10, depth: DEPTH.BG_MID  },
      { suffix: 'mid',  factor: 0.20, depth: DEPTH.BG_MID + 0.5 },
      { suffix: 'near', factor: 0.40, depth: DEPTH.BG_NEAR },
    ];

    for (const layer of layerDefs) {
      const key = `bg_${bgKey}_${layer.suffix}`;
      const sprite = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, key)
        .setScrollFactor(0).setOrigin(0, 0).setDepth(layer.depth);
      this._parallaxLayers.push({ sprite, factor: layer.factor });
    }
  }

  _buildEnemySpriteGroup() {
    if (!this._enemySpriteGroup) {
      this._enemySpriteGroup = this.physics.add.group();
    }
    // Rebuild group from live enemies each time we need it
    // (more robust than caching)
    const group = this.physics.add.group();
    for (const e of this._enemies) {
      if (e.isAlive && e.isAlive() && e.sprite?.active) {
        group.add(e.sprite);
      }
    }
    return group;
  }

  _findEnemyBySprite(sprite) {
    return this._enemies.find(e => e.sprite === sprite) || null;
  }

  _triggerPause() {
    if (this.scene.isActive('PauseScene')) return; // already paused
    this.scene.pause('GameScene');
    // Wake the scene if it was previously put to sleep (resume path),
    // otherwise launch it for the first time. This avoids repeatedly
    // creating and destroying PauseScene's Text objects which causes
    // Phaser's WebGL texture cache to hold stale null-glTexture references.
    if (this.scene.isSleeping('PauseScene')) {
      this.scene.wake('PauseScene');
    } else {
      this.scene.launch('PauseScene');
    }
  }

  _launchBoss() {
    AudioManager.stopMusic();
    this.scene.launch('BossScene', { level: this._level });
    // Do NOT pause — player must be able to move and shoot during the boss fight.
    // BossScene runs additively on top; both scenes update simultaneously.
  }

  shutdown() {
    // Stop BossScene so stale boss timers don't fire into the next GameScene run
    if (this.scene.isActive('BossScene') || this.scene.isSleeping('BossScene')) this.scene.stop('BossScene');
    if (this.scene.isActive('PauseScene') || this.scene.isSleeping('PauseScene')) this.scene.stop('PauseScene');

    // Cancel all pending timers so stale callbacks don't fire on stale sprites
    this.time.removeAllEvents();
    this.tweens.killAll();

    // Destroy projectile pools (clears kill timers + WebGL refs)
    try {
      this._littleFox?.getProjectileGroup()?.destroy();
      for (const comp of (this._companionList || [])) {
        comp.getProjectileGroup?.()?.destroy();
      }
    } catch (_) {}

    this._enemies = [];
    this._companionList = [];
    this._parallaxLayers = [];
  }
}
