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
  },
  score: 0,       // cumulative total score shown in HUD
  levelScore: 0   // base points earned this level (for end-of-level multiplier)
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
  state.score = 0;
  state.levelScore = 0;
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

// Add base points during gameplay. Caller should also emit 'scoreChanged' on the scene.
function addScore(points) {
  state.score += points;
  state.levelScore += points;
}

// Called at the end of a level (after boss defeat). Applies the difficulty multiplier
// as a bonus on top of the level's base score. Returns breakdown for UI animation.
function applyLevelBonus() {
  const cfg = DIFFICULTY[state.difficulty] || DIFFICULTY.medium;
  const multiplier = cfg.scoreMultiplier || 1;
  const earned = state.levelScore;
  const bonus = Math.floor(earned * (multiplier - 1));
  state.score += bonus;
  state.levelScore = 0;
  return { bonus, levelScore: earned, multiplier };
}

// Deduct 10 points when the player retries after dying. Cannot go below 0.
function penalizeForDeath() {
  state.score = Math.max(0, state.score - 10);
  state.levelScore = 0;
}

export const GameState = {
  state,
  applyDifficulty,
  reset,
  resetForLevel,
  unlockCompanion,
  addAmmo,
  addScore,
  applyLevelBonus,
  penalizeForDeath
};
