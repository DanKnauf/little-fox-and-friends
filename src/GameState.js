import { DIFFICULTY } from './constants.js';

const state = {
  difficulty: 'medium',
  currentLevel: 1,
  companionsUnlocked: [],
  playerHearts: 4,
  maxHearts: 4,
  ammo: 40,       // Infinity for easy, 40 medium, 20 hard
  maxAmmo: 40,
  companions: {
    babybear: { hearts: 4, maxHearts: 4 },
    steggie:  { hearts: 4, maxHearts: 4 }
  }
};

function applyDifficulty(key) {
  const cfg = DIFFICULTY[key] || DIFFICULTY.medium;
  state.difficulty = key;
  state.playerHearts = cfg.hearts;
  state.maxHearts = cfg.hearts;
  state.ammo = cfg.ammo;
  state.maxAmmo = cfg.ammo;
  state.companions.babybear.hearts = cfg.hearts;
  state.companions.babybear.maxHearts = cfg.hearts;
  state.companions.steggie.hearts = cfg.hearts;
  state.companions.steggie.maxHearts = cfg.hearts;
}

function reset() {
  state.currentLevel = 1;
  state.companionsUnlocked = [];
  applyDifficulty(state.difficulty);
}

function resetForLevel() {
  const cfg = DIFFICULTY[state.difficulty] || DIFFICULTY.medium;
  state.playerHearts = cfg.hearts;
  state.maxHearts = cfg.hearts;
  state.ammo = cfg.ammo;
  state.maxAmmo = cfg.ammo;
  for (const key of state.companionsUnlocked) {
    state.companions[key].hearts = cfg.hearts;
    state.companions[key].maxHearts = cfg.hearts;
  }
}

function unlockCompanion(key) {
  if (!state.companionsUnlocked.includes(key)) {
    state.companionsUnlocked.push(key);
  }
}

function addAmmo(amount) {
  if (state.ammo === Infinity) return;
  state.ammo = Math.min(state.maxAmmo, state.ammo + amount);
}

export const GameState = { state, applyDifficulty, reset, resetForLevel, unlockCompanion, addAmmo };
