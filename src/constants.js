export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 480;
export const LEVEL_WIDTH = 7200;

export const DIFFICULTY = {
  easy:   { hearts: 5, enemySpeed: 0.7, bossSpeed: 0.6, telegraphMs: 1500, density: 'low',    potions: 4 },
  medium: { hearts: 4, enemySpeed: 1.0, bossSpeed: 1.0, telegraphMs: 1000, density: 'medium', potions: 3 },
  hard:   { hearts: 3, enemySpeed: 1.3, bossSpeed: 1.4, telegraphMs:  600, density: 'high',   potions: 2 }
};

export const DEPTH = {
  BG_FAR:      0,
  BG_MID:      1,
  BG_NEAR:     2,
  TERRAIN:     5,
  ENEMIES:    10,
  COMPANIONS: 12,
  PROJECTILES:13,
  BOSS:       14,
  PLAYER:     15,
  FOREGROUND: 20,
  HUD:       100
};

export const LEVEL_CONFIG = {
  1: { name: 'The Forest',  bgKey: 'forest', bossKey: 'ForestGuardian',  companionReward: 'babybear' },
  2: { name: 'The Desert',  bgKey: 'desert', bossKey: 'ScorpionKing',    companionReward: 'stegge'   },
  3: { name: 'The Ocean',   bgKey: 'ocean',  bossKey: 'Kraken',          companionReward: null       }
};

export const BOSS_ZONE_X = 6200;
export const BOSS_ARENA_WIDTH = 900;
