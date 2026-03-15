import { GAME_WIDTH, GAME_HEIGHT, LEVEL_CONFIG, DEPTH, SCORE } from '../constants.js';
import { GameState } from '../GameState.js';
import { AudioManager } from '../audio/AudioManager.js';
import { BossHealthBar } from '../ui/BossHealthBar.js';
import { PrayingMantis } from '../bosses/PrayingMantis.js';
import { ScorpionKing } from '../bosses/ScorpionKing.js';
import { Kraken } from '../bosses/Kraken.js';

const BOSS_CLASSES = {
  PrayingMantis,
  ScorpionKing,
  Kraken
};

export class BossScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BossScene', active: false });
  }

  init(data) {
    this._level = data.level || GameState.state.currentLevel;
  }

  create() {
    AudioManager.init(this);
    AudioManager.playBossMusic(this._level);

    const cfg = LEVEL_CONFIG[this._level];
    const BossClass = BOSS_CLASSES[cfg.bossKey];

    // Semi-transparent arena overlay
    this._overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.15)
      .setScrollFactor(0).setDepth(DEPTH.HUD - 2);

    // Arena name banner
    const banner = this.add.text(GAME_WIDTH / 2, 60, `⚔️ BOSS ⚔️`, {
      fontSize: '22px', color: '#ff4400', fontFamily: 'Arial Black, Arial',
      stroke: '#330000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(DEPTH.HUD).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: banner, alpha: 1, duration: 400 });
    this.time.delayedCall(2000, () => { this.tweens.add({ targets: banner, alpha: 0, duration: 400 }); });

    // Get player and companions from GameScene
    this._gameScene = this.scene.get('GameScene');
    const gameScene = this._gameScene;
    this._player = gameScene?._littleFox;
    this._companions = Object.values(gameScene?._companions || {});

    // Sync this scene's camera + physics world to match GameScene's camera offset,
    // so world coordinates are shared between GameScene and BossScene.
    const cam = gameScene?.cameras.main;
    const scrollX = cam ? cam.scrollX : 0;
    this.cameras.main.setScroll(scrollX, 0);
    this.physics.world.setBounds(scrollX - 2000, -300, GAME_WIDTH + 4000, GAME_HEIGHT + 300);

    const bossX = scrollX + GAME_WIDTH / 2;
    const bossY = GAME_HEIGHT - 140;

    this._boss = new BossClass(this, bossX, bossY);
    if (this._boss.setPlayer) {
      this._boss.setPlayer(this._player, this._companions);
    }

    // Health bar
    this._healthBar = new BossHealthBar(this, this._boss.name);
    this._healthBar.init(this._boss.maxHp);

    // Boss HP updates
    this.events.on('bossHpChanged', (hp, maxHp) => {
      this._healthBar.update(hp, maxHp);
      this._healthBar.flash();
    });

    // Projectile hit detection runs every frame in update() for reliability

    // Boss defeated
    this.events.once('bossDefeated', () => {
      this._onBossDefeated();
    });

    // Player defeated during boss
    if (this._player) {
      this.scene.get('GameScene').events.once('playerDefeated', () => {
        this.time.delayedCall(600, () => {
          AudioManager.stopMusic();
          this.scene.stop('BossScene');
          this.scene.stop('GameScene');
          this.scene.start('GameOverScene');
        });
      });
    }
  }

  update(time, delta) {
    // Keep BossScene camera in sync with GameScene's camera every frame.
    // Without this, pointer.worldX in GameScene drifts from the boss's world
    // position as the player moves, causing mouse-aimed shots to miss.
    const gs = this._gameScene || this.scene.get('GameScene');
    if (gs?.cameras?.main) {
      this.cameras.main.setScroll(gs.cameras.main.scrollX, gs.cameras.main.scrollY);
    }

    if (this._boss && this._boss.isAlive()) {
      this._boss.update(time, delta);
    }

    // Projectile vs boss: check every frame to avoid missed hits from polling gaps
    this._checkProjectileHits();

    // ScorpionKing: check if tail projectiles hit player
    if (this._boss?.getTailProjectileGroup && this._player?.isAlive()) {
      const tailGroup = this._boss.getTailProjectileGroup();
      const pSprite = this._player.sprite;
      if (pSprite.active) {
        for (const proj of tailGroup.getChildren()) {
          if (!proj.active) continue;
          const dist = Phaser.Math.Distance.Between(proj.x, proj.y, pSprite.x, pSprite.y);
          if (dist < 30) {
            this._player.takeDamage(1);
            this._boss.getTailProjectileGroup().killAndHide(proj);
          }
        }
      }
    }

    // Kraken: check if ink projectiles hit player
    if (this._boss?.getInkProjectileGroup && this._player?.isAlive()) {
      const inkGroup = this._boss.getInkProjectileGroup();
      const pSprite = this._player.sprite;
      if (pSprite.active) {
        for (const proj of inkGroup.getChildren()) {
          if (!proj.active) continue;
          const dist = Phaser.Math.Distance.Between(proj.x, proj.y, pSprite.x, pSprite.y);
          if (dist < 28) {
            this._player.takeDamage(1);
            inkGroup.killAndHide(proj);
          }
        }
      }
    }
  }

  _checkProjectileHits() {
    if (!this._boss || !this._boss.isAlive() || !this._boss.sprite?.active) return;
    const bx = this._boss.sprite.x;
    const by = this._boss.sprite.y;
    // Use half the boss sprite's display width as hit radius, minimum 80px
    const hitRadius = Math.max(80, (this._boss.sprite.displayWidth / 2) * 0.85);

    const allProjGroups = [
      this._player?.getProjectileGroup(),
      ...this._companions.map(c => c.getProjectileGroup?.())
    ].filter(Boolean);

    for (const pg of allProjGroups) {
      for (const proj of pg.getGroup().getChildren()) {
        if (!proj.active) continue;
        const dist = Phaser.Math.Distance.Between(proj.x, proj.y, bx, by);
        if (dist < hitRadius) {
          this._boss.takeDamage(1);
          pg.hit(proj);
        }
      }
    }
  }

  _onBossDefeated() {
    this._healthBar.destroy();
    AudioManager.stopMusic();
    AudioManager.play('level_complete');

    // Award boss kill points and show +N in the HUD
    const bossPoints = SCORE.BOSS[this._level] || 50;
    GameState.addScore(bossPoints);
    this._gameScene?.events?.emit('scoreChanged', bossPoints);

    // Unlock companion
    const cfg = LEVEL_CONFIG[this._level];
    if (cfg.companionReward) {
      GameState.unlockCompanion(cfg.companionReward);
    }

    // Save heart states
    if (this._player) {
      GameState.state.playerHearts = this._player.hearts;
    }

    this.time.delayedCall(1200, () => {
      this.scene.stop('BossScene');
      this.scene.stop('GameScene');
      this.scene.start('LevelCompleteScene', {
        level: this._level,
        companionUnlocked: cfg.companionReward
      });
    });
  }

  shutdown() {
    if (this._boss) this._boss.destroy();
    if (this._healthBar) this._healthBar.destroy();
  }
}
