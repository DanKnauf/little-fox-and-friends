import { GAME_WIDTH, GAME_HEIGHT, LEVEL_CONFIG, DEPTH } from '../constants.js';
import { GameState } from '../GameState.js';
import { AudioManager } from '../audio/AudioManager.js';
import { BossHealthBar } from '../ui/BossHealthBar.js';
import { ForestGuardian } from '../bosses/ForestGuardian.js';
import { ScorpionKing } from '../bosses/ScorpionKing.js';
import { Kraken } from '../bosses/Kraken.js';

const BOSS_CLASSES = {
  ForestGuardian,
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
    AudioManager.playMusic(this._level);

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
    const gameScene = this.scene.get('GameScene');
    this._player = gameScene?._littleFox;
    this._companions = Object.values(gameScene?._companions || {});

    // Spawn boss in center of view
    const cam = gameScene?.cameras.main;
    const bossX = cam ? cam.scrollX + GAME_WIDTH / 2 : GAME_WIDTH / 2;
    const bossY = GAME_HEIGHT - 140;

    this._boss = new BossClass(this, bossX, bossY);
    if (this._boss.setPlayer) {
      this._boss.setPlayer(this._player, this._companions);
    }

    // Transfer boss sprite to the correct world position for camera
    if (cam) {
      this._boss.sprite.x = bossX + cam.scrollX;
      this._boss.sprite.y = bossY;
    }

    // Health bar
    this._healthBar = new BossHealthBar(this, this._boss.name);
    this._healthBar.init(this._boss.maxHp);

    // Boss HP updates
    this.events.on('bossHpChanged', (hp, maxHp) => {
      this._healthBar.update(hp, maxHp);
      this._healthBar.flash();
    });

    // Player projectiles (from GameScene) hitting boss
    if (this._player && gameScene) {
      const foxProjGroup = this._player.getProjectileGroup().getGroup();
      // Override update to also check boss
      this._projOverlapTimer = this.time.addEvent({
        delay: 50,
        loop: true,
        callback: () => { this._checkProjectileHits(gameScene); }
      });
    }

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
    if (this._boss && this._boss.isAlive()) {
      this._boss.update(time, delta);
    }

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
  }

  _checkProjectileHits(gameScene) {
    if (!this._boss || !this._boss.isAlive()) return;
    const allProjGroups = [this._player?.getProjectileGroup(), ...this._companions.map(c => c.getProjectileGroup?.())].filter(Boolean);

    for (const pg of allProjGroups) {
      for (const proj of pg.getGroup().getChildren()) {
        if (!proj.active) continue;
        const dist = Phaser.Math.Distance.Between(proj.x, proj.y, this._boss.sprite.x, this._boss.sprite.y);
        if (dist < 60) {
          this._boss.takeDamage(1);
          pg.hit(proj);
          break;
        }
      }
    }
  }

  _onBossDefeated() {
    if (this._projOverlapTimer) this._projOverlapTimer.remove();
    this._healthBar.destroy();
    AudioManager.stopMusic();
    AudioManager.play('level_complete');

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
    if (this._projOverlapTimer) this._projOverlapTimer.remove();
    if (this._boss) this._boss.destroy();
    if (this._healthBar) this._healthBar.destroy();
  }
}
