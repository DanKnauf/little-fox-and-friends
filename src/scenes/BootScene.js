import { generateUITextures } from '../textures/UITextures.js';
import { generateCharacterTextures } from '../textures/CharacterTextures.js';
import { generateEnemyTextures } from '../textures/EnemyTextures.js';
import { generateBossTextures } from '../textures/BossTextures.js';
import { generateEnvironmentTextures } from '../textures/EnvironmentTextures.js';
import { generateBackgroundTextures } from '../textures/BackgroundTextures.js';
import { SoundGenerator } from '../audio/SoundGenerator.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    // Loading text
    const loadText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'Loading...',
      { fontSize: '28px', color: '#ffffff', fontFamily: 'Arial' }
    ).setOrigin(0.5);

    // Generate all textures synchronously
    generateUITextures(this);
    generateCharacterTextures(this);
    generateEnemyTextures(this);
    generateBossTextures(this);
    generateEnvironmentTextures(this);
    generateBackgroundTextures(this);

    // Register animations
    this._createAnimations();

    // Register audio buffers (Web Audio API, no playback yet)
    SoundGenerator.registerAll(this);

    loadText.destroy();
    this.scene.start('StartScene');
  }

  _createAnimations() {
    // Little Fox
    this.anims.create({ key: 'fox_walk',  frames: this.anims.generateFrameNumbers('fox', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'fox_jump',  frames: this.anims.generateFrameNumbers('fox', { start: 4, end: 4 }), frameRate: 1,  repeat: 0 });
    this.anims.create({ key: 'fox_hurt',  frames: this.anims.generateFrameNumbers('fox', { start: 5, end: 5 }), frameRate: 1,  repeat: 0 });
    this.anims.create({ key: 'fox_idle',  frames: this.anims.generateFrameNumbers('fox', { start: 6, end: 6 }), frameRate: 1,  repeat: -1 });
    this.anims.create({ key: 'fox_shoot', frames: this.anims.generateFrameNumbers('fox', { start: 7, end: 7 }), frameRate: 1,  repeat: 0 });

    // Baby Bear
    this.anims.create({ key: 'bear_walk',   frames: this.anims.generateFrameNumbers('bear', { start: 0, end: 3 }), frameRate: 8,  repeat: -1 });
    this.anims.create({ key: 'bear_idle',   frames: this.anims.generateFrameNumbers('bear', { start: 0, end: 0 }), frameRate: 1,  repeat: -1 });
    this.anims.create({ key: 'bear_attack', frames: this.anims.generateFrameNumbers('bear', { start: 4, end: 4 }), frameRate: 1,  repeat: 0 });
    this.anims.create({ key: 'bear_hurt',   frames: this.anims.generateFrameNumbers('bear', { start: 5, end: 5 }), frameRate: 1,  repeat: 0 });

    // Steggie
    this.anims.create({ key: 'steggie_walk', frames: this.anims.generateFrameNumbers('steggie', { start: 0, end: 3 }), frameRate: 6,  repeat: -1 });
    this.anims.create({ key: 'steggie_idle', frames: this.anims.generateFrameNumbers('steggie', { start: 0, end: 0 }), frameRate: 1,  repeat: -1 });
    this.anims.create({ key: 'steggie_hurt', frames: this.anims.generateFrameNumbers('steggie', { start: 4, end: 4 }), frameRate: 1,  repeat: 0 });

    // Mama Sloth
    this.anims.create({ key: 'mamasloth_idle',      frames: this.anims.generateFrameNumbers('mamasloth', { start: 0, end: 0 }), frameRate: 1,  repeat: -1 });
    this.anims.create({ key: 'mamasloth_celebrate', frames: this.anims.generateFrameNumbers('mamasloth', { start: 1, end: 2 }), frameRate: 4,  repeat: -1 });

    // Enemies — spiders
    for (const level of ['forest', 'desert', 'ocean']) {
      this.anims.create({ key: `spider_${level}_walk`, frames: this.anims.generateFrameNumbers(`spider_${level}`, { start: 0, end: 1 }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: `bird_${level}_fly`,    frames: this.anims.generateFrameNumbers(`bird_${level}`,   { start: 0, end: 2 }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: `creeper_${level}_walk`,frames: this.anims.generateFrameNumbers(`creeper_${level}`,{ start: 0, end: 1 }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: `creeper_${level}_charge`,frames:this.anims.generateFrameNumbers(`creeper_${level}`,{ start: 2, end: 2 }), frameRate: 1, repeat: -1 });
    }

    // Bosses
    this.anims.create({ key: 'boss_forest_idle',   frames: this.anims.generateFrameNumbers('boss_forest', { start: 0, end: 0 }), frameRate: 2, repeat: -1 });
    this.anims.create({ key: 'boss_forest_charge', frames: this.anims.generateFrameNumbers('boss_forest', { start: 1, end: 1 }), frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'boss_forest_web',    frames: this.anims.generateFrameNumbers('boss_forest', { start: 2, end: 2 }), frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'boss_forest_hurt',   frames: this.anims.generateFrameNumbers('boss_forest', { start: 3, end: 3 }), frameRate: 1, repeat: 0 });

    this.anims.create({ key: 'boss_desert_idle',  frames: this.anims.generateFrameNumbers('boss_desert', { start: 0, end: 0 }), frameRate: 2, repeat: -1 });
    this.anims.create({ key: 'boss_desert_claw',  frames: this.anims.generateFrameNumbers('boss_desert', { start: 1, end: 1 }), frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'boss_desert_tail',  frames: this.anims.generateFrameNumbers('boss_desert', { start: 2, end: 2 }), frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'boss_desert_hurt',  frames: this.anims.generateFrameNumbers('boss_desert', { start: 3, end: 3 }), frameRate: 1, repeat: 0 });

    this.anims.create({ key: 'boss_ocean_idle',      frames: this.anims.generateFrameNumbers('boss_ocean', { start: 0, end: 0 }), frameRate: 2, repeat: -1 });
    this.anims.create({ key: 'boss_ocean_tentacle',  frames: this.anims.generateFrameNumbers('boss_ocean', { start: 1, end: 1 }), frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'boss_ocean_ink',       frames: this.anims.generateFrameNumbers('boss_ocean', { start: 2, end: 2 }), frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'boss_ocean_hurt',      frames: this.anims.generateFrameNumbers('boss_ocean', { start: 3, end: 3 }), frameRate: 1, repeat: 0 });
  }
}
