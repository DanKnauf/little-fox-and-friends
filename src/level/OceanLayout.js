import { GAME_HEIGHT, BOSS_ZONE_X } from '../constants.js';

const G = GAME_HEIGHT;

export const OceanLayout = {
  level: 3,
  skin: 'ocean',
  startX: 80,
  startY: G - 80,
  groundSegments: [
    [0, 600],
    [660, 800],
    [1520, 400],
    [1980, 700],
    [2740, 600],
    [3400, 900],
    [4360, 500],
    [4920, 800],
    // boss arena
    [BOSS_ZONE_X, 1200]
  ],
  platforms: [
    // Coastal cliffs and coral ledges
    [100, G - 160, 128],
    [300, G - 240, 96],
    [480, G - 180, 128],

    [700, G - 200, 96],
    [880, G - 280, 128],
    [1060, G - 220, 96],
    [1240, G - 300, 128],
    [1420, G - 220, 96],

    [1620, G - 180, 128],
    [1820, G - 260, 96],
    [2000, G - 200, 128],

    [2200, G - 220, 96],
    [2400, G - 300, 128],
    [2600, G - 240, 96],

    [2800, G - 200, 128],
    [3000, G - 280, 96],
    [3200, G - 200, 160],

    [3500, G - 220, 128],
    [3700, G - 300, 96],
    [3900, G - 240, 128],
    [4100, G - 200, 96],
    [4280, G - 280, 128],

    [4520, G - 200, 96],
    [4700, G - 270, 128],
    [4880, G - 200, 96],

    [5100, G - 220, 128],
    [5300, G - 300, 96],
    [5500, G - 240, 128],

    // near boss
    [5800, G - 200, 128],
    [5980, G - 270, 96],
    [6100, G - 200, 128],
  ],
  enemies: [
    { type: 'spider',  x: 200,  y: G - 60 },
    { type: 'bird',    x: 420,  y: G - 300, flying: true },
    { type: 'creeper', x: 600,  y: G - 60 },
    { type: 'spider',  x: 800,  y: G - 60 },
    { type: 'bird',    x: 1000, y: G - 340, flying: true },
    { type: 'creeper', x: 1200, y: G - 60 },
    { type: 'spider',  x: 1500, y: G - 60 },
    { type: 'bird',    x: 1700, y: G - 280, flying: true },
    { type: 'creeper', x: 1900, y: G - 60 },
    { type: 'spider',  x: 2200, y: G - 60 },
    { type: 'bird',    x: 2450, y: G - 350, flying: true },
    { type: 'creeper', x: 2700, y: G - 60 },
    { type: 'spider',  x: 3000, y: G - 60 },
    { type: 'bird',    x: 3250, y: G - 280, flying: true },
    { type: 'creeper', x: 3500, y: G - 60 },
    { type: 'spider',  x: 3750, y: G - 60 },
    { type: 'bird',    x: 4000, y: G - 320, flying: true },
    { type: 'creeper', x: 4200, y: G - 60 },
    { type: 'spider',  x: 4550, y: G - 60 },
    { type: 'bird',    x: 4800, y: G - 280, flying: true },
    { type: 'creeper', x: 5000, y: G - 60 },
    { type: 'spider',  x: 5300, y: G - 60 },
    { type: 'bird',    x: 5500, y: G - 300, flying: true },
  ],
  potions: [
    { x: 480,  y: G - 220, coveredBy: null },
    { x: 2000, y: G - 300, coveredBy: 'cover_coral' },
    { x: 3700, y: G - 360, coveredBy: null },
    { x: 5100, y: G - 280, coveredBy: 'cover_coral' },
  ],
  covers: [
    { key: 'cover_coral', x: 480,  y: G - 50 },
    { key: 'cover_coral', x: 2000, y: G - 50 },
    { key: 'cover_coral', x: 3200, y: G - 50 },
    { key: 'cover_coral', x: 5100, y: G - 50 },
  ],
  ammoPickups: [
    { x: 300,  y: G - 268 },  // on platform [300, G-240]
    { x: 880,  y: G - 308 },  // on platform [880, G-280]
    { x: 2400, y: G - 328 },  // on platform [2400, G-300]
    { x: 3000, y: G - 308 },  // on platform [3000, G-280]
    { x: 4280, y: G - 308 },  // on platform [4280, G-280]
    { x: 5000, y: G - 268 },  // on platform in area
    // pre-boss ammo cache
    { x: 5800, y: G - 228 },  // on platform [5800, G-200]
    { x: 5980, y: G - 298 },  // on platform [5980, G-270]
    { x: 6100, y: G - 228 },  // on platform [6100, G-200]
    // secret boss-arena ammo box — far right wall
    { x: 6970, y: G - 28 },
  ],
  bossZoneTriggerX: BOSS_ZONE_X,
  bossSpawnX: BOSS_ZONE_X + 500,
  bossSpawnY: G - 140
};
