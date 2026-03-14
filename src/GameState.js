import { DIFFICULTY } from './constants.js';

const state = {
  difficulty: 'medium',
  currentLevel: 1,
  companionsUnlocked: [],
  playerHearts: 4,
  maxHearts: 4,
  companions: {
    babybear: { hearts: 4, maxHearts: 4 },
    stegge:   { hearts: 4, maxHearts: 4 }
  }
};

function applyDifficulty(key) {
  const cfg = DIFFICULTY[key] || DIFFICULTY.medium;
  state.difficulty = key;
  state.playerHearts = cfg.hearts;
  state.maxHearts = cfg.hearts;
  state.companions.babybear.hearts = cfg.hearts;
  state.companions.babybear.maxHearts = cfg.hearts;
  state.companions.stegge.hearts = cfg.hearts;
  state.companions.stegge.maxHearts = cfg.hearts;
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

export const GameState = { state, applyDifficulty, reset, resetForLevel, unlockCompanion };
