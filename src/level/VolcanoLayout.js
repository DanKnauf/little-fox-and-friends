import { GAME_HEIGHT, BOSS_ZONE_X } from '../constants.js';

const G = GAME_HEIGHT;  // 480

export const VolcanoLayout = {
  level: 4,
  skin: 'volcano',
  startX: 80,
  startY: G - 80,
  groundSegments: [
    // Lava pits are the gaps between segments
    [0, 700],
    [780, 500],       // gap 700-780 (lava)
    [1360, 600],      // gap 1280-1360
    [2020, 500],      // gap 1960-2020
    [2580, 700],
    [3360, 600],      // gap 3280-3360
    [4020, 500],      // gap 3960-4020
    [4580, 700],
    [5360, 600],      // gap 5280-5360
    [6020, 260],      // gap 5960-6020
    // Boss arena ground
    [BOSS_ZONE_X, 1100]
  ],
  platforms: [
    // Low jump section — smaller gaps
    [180, G - 150, 96],
    [360, G - 220, 128],
    [540, G - 170, 96],

    // After first lava gap
    [800, G - 200, 128],
    [1000, G - 280, 96],
    [1180, G - 200, 128],

    // After second gap
    [1380, G - 170, 128],
    [1580, G - 260, 96],
    [1760, G - 200, 160],
    [1960, G - 300, 96],

    // Mid section — rocky steps up and down
    [2040, G - 180, 128],
    [2240, G - 260, 96],
    [2440, G - 320, 128],
    [2640, G - 240, 96],
    [2840, G - 180, 128],

    // After third gap
    [3380, G - 200, 128],
    [3580, G - 280, 96],
    [3780, G - 200, 160],
    [3960, G - 140, 96],

    // After fourth gap
    [4040, G - 200, 128],
    [4240, G - 300, 96],
    [4440, G - 240, 128],
    [4640, G - 180, 96],

    // Ascending rock staircase section
    [4820, G - 160, 128],
    [5040, G - 220, 96],
    [5240, G - 290, 128],

    // After fifth gap
    [5380, G - 180, 128],
    [5560, G - 260, 96],
    [5760, G - 200, 128],

    // After sixth gap — final approach to boss
    [6040, G - 200, 96],
    [6140, G - 160, 96],
  ],
  hazards: [
    // Lava pit hazard tiles — 64px wide each, tiled to fill gaps
    { x: 700,  y: G - 16, width: 80 },
    { x: 1280, y: G - 16, width: 80 },
    { x: 1960, y: G - 16, width: 60 },
    { x: 3280, y: G - 16, width: 80 },
    { x: 3960, y: G - 16, width: 60 },
    { x: 5280, y: G - 16, width: 80 },
    { x: 5960, y: G - 16, width: 60 },
  ],
  enemies: [
    // Compsognathus (spider class), Velociraptor (creeper class), Pterodactyl (bird class)
    { type: 'spider',  x: 220,  y: G - 60 },   // Compsognathus
    { type: 'bird',    x: 430,  y: G - 280, flying: true },  // Pterodactyl
    { type: 'creeper', x: 620,  y: G - 60 },   // Velociraptor
    { type: 'spider',  x: 900,  y: G - 60 },
    { type: 'bird',    x: 1080, y: G - 320, flying: true },
    { type: 'creeper', x: 1260, y: G - 60 },
    { type: 'spider',  x: 1500, y: G - 60 },
    { type: 'bird',    x: 1720, y: G - 280, flying: true },
    { type: 'creeper', x: 1940, y: G - 60 },
    { type: 'spider',  x: 2100, y: G - 60 },
    { type: 'bird',    x: 2320, y: G - 320, flying: true },
    { type: 'creeper', x: 2560, y: G - 60 },
    { type: 'spider',  x: 2760, y: G - 60 },
    { type: 'bird',    x: 3000, y: G - 280, flying: true },
    { type: 'creeper', x: 3200, y: G - 60 },
    { type: 'spider',  x: 3500, y: G - 60 },
    { type: 'bird',    x: 3720, y: G - 300, flying: true },
    { type: 'creeper', x: 3920, y: G - 60 },
    { type: 'spider',  x: 4140, y: G - 60 },
    { type: 'bird',    x: 4400, y: G - 320, flying: true },
    { type: 'creeper', x: 4620, y: G - 60 },
    { type: 'spider',  x: 4900, y: G - 60 },
    { type: 'bird',    x: 5120, y: G - 280, flying: true },
    { type: 'creeper', x: 5340, y: G - 60 },
    { type: 'spider',  x: 5600, y: G - 60 },
    { type: 'bird',    x: 5820, y: G - 300, flying: true },
    { type: 'creeper', x: 6000, y: G - 60 },
  ],
  potions: [
    { x: 540,  y: G - 200, coveredBy: null },
    { x: 1760, y: G - 250, coveredBy: null },
    { x: 3580, y: G - 330, coveredBy: 'cover_rock' },
    { x: 5040, y: G - 270, coveredBy: null },
  ],
  covers: [
    { key: 'cover_rock', x: 540,  y: G - 58 },
    { key: 'cover_rock', x: 3580, y: G - 58 },
    { key: 'cover_crate', x: 1940, y: G - 58 },
    { key: 'cover_rock', x: 4620, y: G - 58 },
  ],
  ammoPickups: [
    { x: 360,  y: G - 248 },
    { x: 1000, y: G - 308 },
    { x: 2440, y: G - 348 },
    { x: 3580, y: G - 308 },
    { x: 4240, y: G - 328 },
    { x: 5040, y: G - 248 },
    // pre-boss cache
    { x: 5560, y: G - 288 },
    { x: 5760, y: G - 228 },
    { x: 6040, y: G - 228 },
    // secret boss-arena ammo box — far right wall
    { x: 6980, y: G - 28 },
  ],
  bossZoneTriggerX: BOSS_ZONE_X,
  bossSpawnX: BOSS_ZONE_X + 450,
  bossSpawnY: G - 160
};
