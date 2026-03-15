import { GAME_HEIGHT, BOSS_ZONE_X } from '../constants.js';

const G = GAME_HEIGHT;  // 480

// Layout types:
// 'ground'    - flat ground tile
// 'platform'  - elevated surface
// 'cover'     - cover object hiding a potion underneath
// 'hazard'    - hurts on contact (gap/spikes)
// 'gap'       - no ground (fall = damage)

export const ForestLayout = {
  level: 1,
  skin: 'forest',
  startX: 80,
  startY: G - 80,
  groundSegments: [
    // [x, width] — ground tiles; gaps are inferred from missing regions
    [0, 800],
    [840, 600],
    [1500, 400],
    [1960, 1200],
    [3200, 800],
    [4060, 600],
    [4720, 500],
    [5280, 700],
    // Boss arena ground
    [BOSS_ZONE_X, 1100]
  ],
  platforms: [
    // [x, y, width] — elevated platforms (y from top)
    [200, G - 160, 96],
    [380, G - 220, 96],
    [560, G - 170, 128],
    [740, G - 280, 96],

    [900, G - 180, 128],
    [1060, G - 260, 96],
    [1220, G - 200, 128],
    [1400, G - 300, 96],

    [1600, G - 160, 128],
    [1760, G - 240, 96],
    [1900, G - 300, 128],

    [2100, G - 180, 128],
    [2300, G - 260, 96],
    [2480, G - 200, 160],
    [2700, G - 280, 96],
    [2880, G - 200, 128],

    [3300, G - 180, 128],
    [3500, G - 250, 96],
    [3700, G - 320, 128],
    [3900, G - 220, 96],

    [4200, G - 200, 128],
    [4400, G - 280, 96],
    [4600, G - 200, 128],

    [4800, G - 240, 96],
    [5000, G - 200, 128],
    [5200, G - 280, 96],

    // near boss zone
    [5600, G - 200, 160],
    [5800, G - 280, 96],
    [5980, G - 200, 128],
    [6100, G - 180, 96],
  ],
  enemies: [
    // [type, x, y] — y is spawn y (ground or platform height)
    { type: 'spider', x: 300,  y: G - 60 },
    { type: 'spider', x: 600,  y: G - 60 },
    { type: 'bird',   x: 700,  y: G - 260, flying: true },
    { type: 'creeper',x: 950,  y: G - 60 },
    { type: 'spider', x: 1100, y: G - 60 },
    { type: 'bird',   x: 1300, y: G - 320, flying: true },
    { type: 'creeper',x: 1700, y: G - 60 },
    { type: 'spider', x: 1900, y: G - 60 },
    { type: 'bird',   x: 2100, y: G - 260, flying: true },
    { type: 'creeper',x: 2300, y: G - 60 },
    { type: 'spider', x: 2500, y: G - 60 },
    { type: 'bird',   x: 2700, y: G - 320, flying: true },
    { type: 'creeper',x: 3000, y: G - 60 },
    { type: 'spider', x: 3400, y: G - 60 },
    { type: 'bird',   x: 3600, y: G - 260, flying: true },
    { type: 'creeper',x: 3800, y: G - 60 },
    { type: 'spider', x: 4100, y: G - 60 },
    { type: 'bird',   x: 4400, y: G - 300, flying: true },
    { type: 'creeper',x: 4700, y: G - 60 },
    { type: 'spider', x: 5100, y: G - 60 },
    { type: 'bird',   x: 5300, y: G - 280, flying: true },
    { type: 'creeper',x: 5500, y: G - 60 },
  ],
  // Potion hiding spots — up to 4 (difficulty trims this)
  potions: [
    { x: 580,  y: G - 200, coveredBy: 'cover_stump' },
    { x: 1900, y: G - 350, coveredBy: null },           // on tall platform
    { x: 3700, y: G - 370, coveredBy: null },
    { x: 5000, y: G - 260, coveredBy: 'cover_crate' },
  ],
  covers: [
    // Decorative cover objects that hide potions or just add visual interest
    { key: 'cover_stump', x: 580,  y: G - 58 },
    { key: 'cover_crate', x: 5000, y: G - 58 },
    { key: 'cover_stump', x: 2600, y: G - 58 },
    { key: 'cover_stump', x: 4200, y: G - 58 },
  ],
  // Ammo crate spots on platforms — clearly visible, up to 9
  ammoPickups: [
    { x: 380,  y: G - 248 },  // on platform [380, G-220]
    { x: 1060, y: G - 288 },  // on platform [1060, G-260]
    { x: 2480, y: G - 228 },  // on platform [2480, G-200]
    { x: 3500, y: G - 278 },  // on platform [3500, G-250]
    { x: 4400, y: G - 308 },  // on platform [4400, G-280]
    { x: 5000, y: G - 228 },  // on platform [5000, G-200]
    // pre-boss ammo cache
    { x: 5600, y: G - 228 },  // on platform [5600, G-200]
    { x: 5800, y: G - 308 },  // on platform [5800, G-280]
    { x: 5980, y: G - 228 },  // on platform [5980, G-200]
  ],
  bossZoneTriggerX: BOSS_ZONE_X,
  bossSpawnX: BOSS_ZONE_X + 450,
  bossSpawnY: G - 160
};
