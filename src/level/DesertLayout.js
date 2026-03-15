import { GAME_HEIGHT, BOSS_ZONE_X } from '../constants.js';

const G = GAME_HEIGHT;

export const DesertLayout = {
  level: 2,
  skin: 'desert',
  startX: 80,
  startY: G - 80,
  groundSegments: [
    [0, 700],
    [750, 900],
    [1700, 500],
    [2260, 800],
    [3120, 700],
    [3880, 900],
    [4840, 400],
    [5300, 700],
    // boss arena
    [BOSS_ZONE_X, 1100]
  ],
  platforms: [
    // Sandstone ruins and dune formations
    [160, G - 140, 128],
    [360, G - 200, 96],
    [520, G - 160, 128],

    [780, G - 180, 96],
    [940, G - 260, 128],
    [1100, G - 200, 96],
    [1280, G - 280, 128],
    [1440, G - 200, 96],
    [1560, G - 140, 128],

    [1760, G - 180, 128],
    [1940, G - 260, 96],
    [2100, G - 200, 128],

    [2320, G - 180, 96],
    [2500, G - 250, 128],
    [2700, G - 300, 96],
    [2880, G - 200, 128],

    [3180, G - 180, 128],
    [3380, G - 260, 96],
    [3560, G - 200, 128],

    [3940, G - 180, 128],
    [4120, G - 260, 96],
    [4320, G - 200, 160],
    [4560, G - 280, 96],

    // near boss
    [5400, G - 180, 128],
    [5600, G - 250, 96],
    [5800, G - 200, 128],
    [6000, G - 180, 128],
    [6100, G - 160, 96],
  ],
  enemies: [
    { type: 'creeper', x: 250,  y: G - 60 },
    { type: 'bird',    x: 450,  y: G - 280, flying: true },
    { type: 'spider',  x: 650,  y: G - 60 },
    { type: 'creeper', x: 900,  y: G - 60 },
    { type: 'bird',    x: 1100, y: G - 320, flying: true },
    { type: 'spider',  x: 1300, y: G - 60 },
    { type: 'creeper', x: 1600, y: G - 60 },
    { type: 'bird',    x: 1850, y: G - 260, flying: true },
    { type: 'spider',  x: 2100, y: G - 60 },
    { type: 'creeper', x: 2400, y: G - 60 },
    { type: 'bird',    x: 2700, y: G - 340, flying: true },
    { type: 'spider',  x: 3000, y: G - 60 },
    { type: 'creeper', x: 3200, y: G - 60 },
    { type: 'bird',    x: 3500, y: G - 280, flying: true },
    { type: 'spider',  x: 3700, y: G - 60 },
    { type: 'creeper', x: 4000, y: G - 60 },
    { type: 'bird',    x: 4300, y: G - 300, flying: true },
    { type: 'spider',  x: 4600, y: G - 60 },
    { type: 'creeper', x: 4900, y: G - 60 },
    { type: 'bird',    x: 5200, y: G - 260, flying: true },
    { type: 'spider',  x: 5500, y: G - 60 },
  ],
  potions: [
    { x: 500,  y: G - 200, coveredBy: null },
    { x: 2100, y: G - 300, coveredBy: null },
    { x: 3700, y: G - 250, coveredBy: 'cover_rock' },
    { x: 5000, y: G - 340, coveredBy: null },
  ],
  covers: [
    { key: 'cover_rock', x: 500,  y: G - 60 },
    { key: 'cover_rock', x: 3700, y: G - 60 },
    { key: 'cover_rock', x: 1400, y: G - 60 },
    { key: 'cover_rock', x: 4500, y: G - 60 },
  ],
  ammoPickups: [
    { x: 360,  y: G - 228 },  // on platform [360, G-200]
    { x: 940,  y: G - 288 },  // on platform [940, G-260]
    { x: 2500, y: G - 278 },  // on platform [2500, G-250]
    { x: 3380, y: G - 288 },  // on platform [3380, G-260]
    { x: 4120, y: G - 288 },  // on platform [4120, G-260]
    { x: 5000, y: G - 248 },  // on platform in area
    // pre-boss ammo cache
    { x: 5400, y: G - 208 },  // on platform [5400, G-180]
    { x: 5600, y: G - 278 },  // on platform [5600, G-250]
    { x: 5800, y: G - 228 },  // on platform [5800, G-200]
    // secret boss-arena ammo box — far right wall
    { x: 6960, y: G - 28 },
  ],
  bossZoneTriggerX: BOSS_ZONE_X,
  bossSpawnX: BOSS_ZONE_X + 430,
  bossSpawnY: G - 120
};
