import { GAME_WIDTH, GAME_HEIGHT, LEVEL_WIDTH, LEVEL_CONFIG, DEPTH } from '../constants.js';
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
import { Stegge } from '../entities/Stegge.js';
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

    // Player
    const { hearts, maxHearts } = GameState.state;
    this._littleFox = new LittleFox(this, layout.startX, layout.startY, maxHearts);
    this._littleFox.hearts = hearts;

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

    if (unlocked.includes('stegge')) {
      const stegge = new Stegge(this, layout.startX - 140, layout.startY, GameState.state.companions.stegge.maxHearts);
      stegge.hearts = GameState.state.companions.stegge.hearts;
      stegge.setPlayer(this._littleFox);
      stegge.setEnemies(this._enemies);
      this._companions['stegge'] = stegge;
      this._companionList.push(stegge);
      this.physics.add.collider(stegge.sprite, platforms);
      this.physics.add.collider(stegge.sprite, ground);
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

    // Player vs enemies (damage)
    this.physics.add.overlap(this._littleFox.sprite, this._buildEnemySpriteGroup(), (playerSprite, enemySprite) => {
      const enemy = this._findEnemyBySprite(enemySprite);
      if (enemy && enemy.canDamagePlayer()) {
        this._littleFox.takeDamage(1);
      }
    });

    // Player vs potions
    this.physics.add.overlap(this._littleFox.sprite, this._potionGroup, (playerSprite, potionSprite) => {
      potionSprite.destroy();
      this._littleFox.activateSizeUp();
    });

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
      stegge:   { emoji: '🦕', color: '#4A8C5C', maxHearts: GameState.state.companions.stegge.maxHearts }
    };
    this._hud = new HUD(this, this._littleFox.maxHearts, companionHUDConfig);
    this._hud.refresh();

    // Events
    this.events.on('playerDefeated', () => {
      this.time.delayedCall(800, () => {
        this.scene.start('GameOverScene');
      });
    });

    // Pause/resume for boss scene
    this.events.on('pause', () => { this.tweens.pauseAll(); });
    this.events.on('resume', () => { this.tweens.resumeAll(); });

    // Music
    AudioManager.playMusic(this._level);

    this._bossTriggered = false;
  }

  update(time, delta) {
    if (!this._littleFox || !this._littleFox.isAlive()) return;

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
    const layers = [
      { suffix: 'sky',  factor: 0.05, depth: DEPTH.BG_FAR  },
      { suffix: 'far',  factor: 0.10, depth: DEPTH.BG_MID  },
      { suffix: 'mid',  factor: 0.20, depth: DEPTH.BG_MID + 0.5 },
      { suffix: 'near', factor: 0.40, depth: DEPTH.BG_NEAR },
    ];

    for (const layer of layers) {
      const key = `bg_${bgKey}_${layer.suffix}`;
      const sprite = this.add.tileSprite(
        GAME_WIDTH / 2, GAME_HEIGHT / 2,
        GAME_WIDTH, GAME_HEIGHT,
        key
      );
      sprite.setScrollFactor(layer.factor, 0);
      sprite.setDepth(layer.depth);
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

  _launchBoss() {
    AudioManager.stopMusic();
    this.scene.launch('BossScene', { level: this._level });
    this.scene.pause();
  }
}
