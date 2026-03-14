# Little Fox and Friends — Game Requirements Document

> **Intended recipient:** Claude (via Claude Code in VS Code)
> **Purpose:** Full implementation requirements for a browser-based 3D side-scrolling adventure game
> **Target players:** Children ages 7–9
> **Author:** Dan Knauf (via voice-to-text design session)

---

## 1. Project Overview

**Game title:** Little Fox and Friends
**Genre:** 3D side-scrolling platformer/adventure
**Platform:** Web browser (static deployment, no backend required)
**Hosting target:** GitHub Pages
**Framework:** Phaser 3 (preferred) — must compile to static HTML/CSS/JS assets with no server-side dependencies
**Audio:** Web Audio API for all sound effects and ambient audio
**Target session length:** ~10 minutes (three levels, approximately 2–3 minutes each)
**Audience:** Children ages 7–9; controls must be simple, challenge must be readable and forgiving

---

## 2. Narrative Overview

Little Fox is alone in the forest. To rescue his friend Mama Sloth, he must journey through three dangerous environments — a forest, a desert, and an ocean — defeating a powerful boss in each. Each boss guards a companion: Baby Bear and Steggie join Little Fox after their respective rescues and fight alongside him as loyal allies. The final boss is the most powerful of all, but with both companions at his side, Little Fox can prevail. When Mama Sloth is rescued at the end of Level 3, she celebrates by hugging everyone.

---

## 3. Core Gameplay Loop

1. Player controls Little Fox through a side-scrolling 3D environment
2. Enemies (baddies) patrol, fly, or emerge throughout the level
3. Touching an enemy costs one heart; shooting an enemy with a projectile defeats it
4. Hidden secret potions are scattered throughout each level — collecting one fully heals the player and temporarily doubles their size
5. Each level ends with a boss battle — unique mechanics, visible health bar, telegraphed attacks
6. Defeating the boss unlocks the next level and a new companion
7. Companions follow Little Fox automatically as AI-controlled allies, shooting at enemies
8. Completing all three levels rescues Mama Sloth and triggers the victory ending

---

## 4. Controls

| Input | Action |
|---|---|
| W | Move up / climb |
| A | Move left |
| S | Move down / crouch |
| D | Move right |
| Spacebar | Jump |
| Left mouse click | Shoot projectile |

Controls are identical across all levels. No control remapping required for MVP.

---

## 5. Characters

### 5.1 Little Fox (Player Character)

- **Role:** Primary player-controlled character
- **Starting state:** Alone in Level 1
- **Default hearts:** 4 (Easy: 5, Hard: 3)
- **Attack:** Fires a small projectile on mouse click
- **Sound — footstep:** Soft shushing sound, light and quick cadence
- **Sound — jump:** Spring/boing tone
- **Sound — shoot:** "Pew pew" sound
- **Sound — takes damage:** Short yelp or impact sound
- **Sound — defeat (0 hearts):** Sad descending tone
- **Visual:** Small fox with visible tail, warm orange/red tones

### 5.2 Baby Bear (Companion — unlocked after Level 1 boss)

- **Role:** AI-controlled companion
- **Behavior:** Follows Little Fox; auto-targets and attacks nearby enemies
- **Default hearts:** 4 (difficulty scaling applies)
- **Sound — footstep:** Slightly heavier padded thud than Little Fox
- **Sound — attack:** Low growl or swipe
- **Visual:** Small bear cub, earthy brown tones

### 5.3 Steggie (Companion — unlocked after Level 2 boss)

- **Role:** AI-controlled companion
- **Behavior:** Follows Little Fox; auto-targets and attacks; heavier and slower than Baby Bear
- **Default hearts:** 4 (difficulty scaling applies)
- **Sound — footstep:** Heavy stomp — Steggie is a stegosaurus
- **Sound — attack:** Tail swipe or deep rumble
- **Visual:** Small stegosaurus, green/teal tones with visible back plates

### 5.4 Mama Sloth (Non-playable — rescue target)

- **Role:** The goal of the entire game
- **Appears:** After the Level 3 boss is defeated
- **Behavior:** Hugs Little Fox, Baby Bear, and Steggie in the victory cutscene
- **Sound — victory moment:** Warm fanfare or happy chime
- **Visual:** Cute, huggable character design — warm and friendly. Is a sloth. 

---

## 6. Health System

### 6.1 Heart Display

- Player hearts: always visible, top-left HUD
- Companion hearts: displayed below or adjacent to player hearts
- Boss health: dedicated health bar at top-center of screen, visible only during boss encounters

### 6.2 Damage Rules

- Touching an enemy = 1 heart lost
- Hit by enemy projectile = 1 heart lost
- Falling off the map (if applicable) = 1 heart lost
- 0 hearts = game over screen with option to retry from level start

### 6.3 Level Transition

- Player enters each new level at full hearts
- Companion hearts also reset at level start

### 6.4 Secret Potions

- Each level contains hidden potions (count varies by difficulty — see Section 8)
- Potions are hidden behind level objects: trees, crates, rocks, coral formations (environment-appropriate)
- Collecting a potion: fully restores all of Little Fox's hearts AND temporarily doubles his size for 10 seconds
- Size doubling is visual and satisfying — does not significantly alter hitbox or speed
- **Sound — collect potion:** Magical shimmer/twinkle
- **Sound — size effect active:** Subtle low power-up hum

---

## 7. Enemy Types

### Standard Baddies (appear across all levels, with environment-appropriate skins)

| Enemy | Behavior | Notes |
|---|---|---|
| Spiders | Crawl along ground and walls | Forest and ocean variants |
| Evil Birds | Fly in arcing patterns, swoop at player | Desert and forest variants |
| Creepers | Slow-moving ground enemy, charges when close | All levels |

Each enemy type should have an environment-appropriate visual skin per level (e.g., desert spider vs. forest spider). Enemy behavior is the same regardless of skin.

### Enemy Audio

- **Enemy defeated:** Pop or splat sound
- **Enemy hit (not defeated):** Short impact tick
- **Enemy spawning (if telegraphed):** Low growl or rustle

---

## 8. Difficulty Settings

Selected on the game start screen. Affects hearts, speed, enemy density, and boss behavior.

| Parameter | Easy | Medium | Hard |
|---|---|---|---|
| Little Fox starting hearts | 5 | 4 | 3 |
| Companion hearts | 5 | 4 | 3 |
| Enemy movement speed | 0.7x | 1.0x | 1.3x |
| Boss attack speed multiplier | 0.6x | 1.0x | 1.4x |
| Boss attack telegraph window | 1.5s | 1.0s | 0.6s |
| Enemy density per screen | Low | Medium | High |
| Potion count per level | 4 | 3 | 2 |

All difficulty settings must keep the game completable and enjoyable for children ages 7–9. Easy mode should be completable on first or second attempt. Hard mode adds meaningful challenge without being punishing.

---

## 9. Level Design

### General Level Design Principles

- Each level lasts approximately 2–3 minutes of active gameplay
- Levels are side-scrolling but not purely linear — include vertical traversal, branching paths, hidden areas behind objects, and terrain that rewards exploration
- Hidden potions must require minor exploration to find (behind objects, up on platforms, in alcoves)
- Mix open traversal sections with denser enemy encounters to create rhythm
- Each level ends with a closed boss arena — the player cannot leave until the boss is defeated
- Visual depth cues (parallax backgrounds, foreground objects) reinforce the 3D feel even within the side-scroll constraint

---

### Level 1 — The Forest

**Environment:** Dense woodland with tall trees, mossy logs, mushrooms, and undergrowth
**Companions present:** None (Little Fox is alone)
**Baddies:** Spiders (crawl on logs and tree trunks), Evil Birds (swoop from the canopy), Creepers (emerge from bushes)
**Terrain features:**
- Fallen logs to jump over and crawl under
- Elevated tree branch platforms for vertical traversal
- Hidden hollow stumps and behind-rock areas where potions are concealed
- A stream or ravine section requiring precise jumping

**Ambient audio:** Rustling leaves, creaking branches, bird calls, wind through trees
**Ambient music:** Light, adventurous woodland theme

**Level 1 Boss — The Forest Guardian (large spider/root creature)**
- **Arena:** A wide forest clearing
- **Health bar:** Visible at top of screen
- **Attack pattern (Easy/Medium):** Predictable sequence — charge left, charge right, drop webs from above (telegraphed by shadow). Pause between attacks gives player time to react and shoot.
- **Attack pattern (Hard):** Sequence speeds up, shorter pauses, web drops have smaller telegraph window
- **Defeat reward:** Baby Bear is freed from a web/cage — joins as companion
- **Defeat sound:** Crumbling/scuttling sound + triumphant jingle

---

### Level 2 — The Desert

**Environment:** Hot sandy dunes, sandstone ruins, cacti, rocky outcroppings
**Companions present:** Baby Bear
**Baddies:** Evil Birds (circle overhead and dive), Desert Creepers (emerge from sand), Desert Spiders (hide behind rocks)
**Terrain features:**
- Shifting sand sections that slow movement slightly
- Elevated sandstone ruins providing platform traversal
- Sand dunes with slopes for vertical variation
- Hidden cave alcoves in rock walls containing potions
- A crumbling bridge section requiring quick crossing

**Ambient audio:** Wind gusts, sand shifting, distant hawk call
**Ambient music:** Warm, slightly mysterious desert theme

**Level 2 Boss — The Desert Scorpion King**
- **Arena:** A flat sandstone platform surrounded by sand pits
- **Health bar:** Visible at top of screen
- **Attack pattern (Easy/Medium):** Slow but hard-hitting claw swipes (telegraphed by claw raise animation), tail sting that arcs overhead (telegraphed by tail glow). Slower than Level 1 boss but hits harder. Predictable rhythm.
- **Attack pattern (Hard):** Adds a sand-throw that temporarily obscures vision; shorter telegraph windows
- **Defeat reward:** Steggie is freed from a sand trap — joins as companion
- **Defeat sound:** Heavy thud + dust cloud + triumphant jingle

---

### Level 3 — The Ocean

**Environment:** Coastal cliffs, tide pools, coral reefs, underwater sections, ship wreckage
**Companions present:** Baby Bear and Steggie
**Baddies:** Ocean Spiders (cling to coral and cliff faces), Sea Birds (dive from above), Ocean Creepers (emerge from water)
**Terrain features:**
- Coastal cliff platforms with ocean spray visual effects
- Tide pool sections with wet/slippery surface feel (slower turn speed)
- Coral reef maze section — non-linear branching paths reward exploration
- Sunken wreck section for hidden potion discovery
- Underwater bubble-rising ambient particle effects

**Ambient audio:** Waves crashing, seagulls, bubbling water, distant ship bell
**Ambient music:** Sweeping oceanic adventure theme

**Level 3 Boss — The Kraken (massive sea creature)**
- **Arena:** A large coastal platform with water on both sides
- **Health bar:** Visible at top of screen
- **Attack pattern (Easy/Medium):** Tentacle slam (telegraphed by tentacle shadow before it crashes down), ink spray (telegraphed by body glow — moves slowly across screen), and a roar that pushes characters back. With both companions firing, the fight is challenging but achievable.
- **Attack pattern (Hard):** Multiple simultaneous tentacle slams, faster ink spray, shorter telegraph windows
- **Defeat reward:** Mama Sloth appears on the platform — victory cutscene triggers
- **Defeat sound:** Deep ocean rumble + splash + full victory fanfare

---

### Victory Cutscene (post-Level 3)

- Mama Sloth runs toward Little Fox
- She hugs Little Fox, then Baby Bear, then Steggie
- All characters celebrate together on screen
- Victory fanfare plays
- "The End" screen with option to play again or return to main menu

---

## 10. Game States

| State | Description |
|---|---|
| Start screen | Title card "Little Fox and Friends", difficulty selection (Easy / Medium / Hard), Start button |
| Level intro | Brief environment title card (e.g., "Level 1 — The Forest") fades in then out |
| Gameplay | Active level play |
| Boss encounter | Boss arena loads, boss health bar appears |
| Level complete | Brief celebration animation, transition to next level at full health |
| Game over | Player reached 0 hearts — "Try Again" button, returns to start of current level |
| Victory | Post-Level 3 cutscene, "The End" screen |

---

## 11. Audio Design

### 11.1 Player Action Sounds

| Action | Sound |
|---|---|
| Footstep (Little Fox) | Soft shush sound |
| Footstep (Baby Bear) | Padded thud |
| Footstep (Steggie) | Heavy stomp |
| Jump | Spring/boing tone |
| Shoot | "Pew pew" |
| Takes damage | Short yelp or impact |
| Defeat (0 hearts) | Sad descending tone |
| Collect potion | Magical shimmer/twinkle |
| Size-up effect active | Subtle power-up hum |

### 11.2 Enemy Sounds

| Event | Sound |
|---|---|
| Enemy hit (not defeated) | Short impact tick |
| Enemy defeated | Pop or splat |
| Enemy spawn (if visible) | Rustle or low growl |

### 11.3 Boss Sounds

| Event | Sound |
|---|---|
| Boss telegraph (attack incoming) | Low warning tone or growl |
| Boss takes damage | Heavy impact grunt |
| Boss defeated | Level-appropriate defeat sound + triumphant jingle |

### 11.4 UI Sounds

| Event | Sound |
|---|---|
| Menu button click | Soft click |
| Level start | Short upbeat fanfare |
| Level complete | Cheerful ascending chime |
| Game over | Sad but gentle tone (not harsh — child-appropriate) |
| Victory (Mama Sloth rescued) | Full warm fanfare |

### 11.5 Ambient Audio by Level

| Level | Ambient Sounds |
|---|---|
| Forest | Rustling leaves, creaking branches, bird calls, wind |
| Desert | Wind gusts, shifting sand, distant hawk cry |
| Ocean | Waves crashing, seagulls, bubbling water, distant bell |

All ambient audio should loop seamlessly. Music and ambient SFX are separate channels with independent volume control.

---

## 12. Visual and Graphics Requirements

### 12.1 Visual Style

- 3D rendered characters and environments within a side-scrolling camera constraint
- Graphics do not need to be high-fidelity — they must be fun, readable, and representative
- Bright, saturated color palette appropriate for children
- Parallax background layers to reinforce depth and 3D feel
- Each environment has a clearly distinct visual identity (green/brown forest, warm tan/orange desert, blue/teal ocean)

### 12.2 HUD Elements

- Heart icons top-left (player, then companions stacked below)
- Boss health bar top-center (only during boss encounters)
- No other on-screen clutter — keep UI minimal for young players

### 12.3 Visual Feedback

- Flash/blink animation when a character takes damage
- Brief invincibility frames (i-frames) after taking damage — character flickers for ~1 second
- Size-doubling potion effect: clear and visually satisfying scale animation
- Boss telegraph animations must be visually obvious — color change, glowing outline, or shadow indicator

### 12.4 Environment Depth Cues

- Foreground decorative elements (leaves, rocks, coral) pass in front of characters to reinforce 3D
- Background layers scroll at different rates (parallax)
- Lighting and shadow suggest environmental depth

---

## 13. Technical Requirements

### 13.1 Framework and Stack

- **Game engine:** Phaser 3
- **Language:** JavaScript (ES6+)
- **Audio:** Web Audio API (built into Phaser 3)
- **Assets:** Sprite sheets, tilemaps, audio files — all bundled locally (no CDN dependencies at runtime)
- **Build output:** Static HTML, CSS, and JS files only — no server required

### 13.2 Deployment

- **Target host:** GitHub Pages
- **Branch:** `main` or `gh-pages`
- **Entry point:** `index.html` at root
- **Asset path:** All assets relative — no absolute paths

### 13.3 Browser Compatibility

- Target: modern desktop browsers (Chrome, Firefox, Edge, Safari)
- No mobile/touch support required for MVP
- Minimum resolution: 1024x768

### 13.4 Performance

- Target 60fps on a mid-range laptop
- Sprite atlases should be used to minimize draw calls
- Audio assets should be preloaded during level load screens

### 13.5 Project File Structure (recommended)

```
/
├── index.html
├── /src
│   ├── main.js
│   ├── /scenes
│   │   ├── StartScene.js
│   │   ├── Level1Scene.js
│   │   ├── Level2Scene.js
│   │   ├── Level3Scene.js
│   │   ├── BossScene.js (or boss logic embedded per level)
│   │   └── VictoryScene.js
│   ├── /entities
│   │   ├── LittleFox.js
│   │   ├── BabyBear.js
│   │   ├── Steggie.js
│   │   ├── MamaSloth.js
│   │   └── /enemies
│   │       ├── Spider.js
│   │       ├── EvilBird.js
│   │       └── Creeper.js
│   ├── /bosses
│   │   ├── ForestGuardian.js
│   │   ├── ScorpionKing.js
│   │   └── Kraken.js
│   └── /ui
│       ├── HUD.js
│       └── DifficultyMenu.js
├── /assets
│   ├── /sprites
│   ├── /tilemaps
│   ├── /audio
│   └── /backgrounds
└── /dist (build output — gitignored during dev)
```

---

## 14. Boss Design Summary

| Boss | Level | Key Mechanic | Telegraph | Reward |
|---|---|---|---|---|
| Forest Guardian | 1 — Forest | Charge + web drop | Shadow before web drop | Unlocks Baby Bear |
| Scorpion King | 2 — Desert | Claw swipe + tail sting | Claw raise animation / tail glow | Unlocks Steggie |
| The Kraken | 3 — Ocean | Tentacle slam + ink spray | Tentacle shadow / body glow | Rescues Mama Sloth |

All bosses must:
- Have a visible health bar
- Telegraph attacks with enough lead time for a 7-year-old to react (Easy: 1.5s, Medium: 1.0s, Hard: 0.6s)
- Have predictable, learnable attack sequences
- Be defeatable with the companion(s) available at that point in the game

---

## 15. Scope Boundaries (MVP)

The following are in scope for the initial build:

- Three full levels (Forest, Desert, Ocean)
- Three playable enemy types with per-level skins
- Three bosses with unique mechanics
- Two companion characters (Baby Bear, Steggie) with AI follow-and-attack behavior
- One player character (Little Fox)
- Full audio — footsteps, combat, ambient, music
- Difficulty selection (Easy, Medium, Hard)
- Hearts/health system with visual HUD
- Secret potions with size-up effect
- Victory cutscene with Mama Sloth
- GitHub Pages deployment

The following are out of scope for MVP (can be added later):

- Mobile/touch controls
- Save state / progress persistence
- Leaderboard or scoring system
- Character customization
- Additional levels beyond three
- Multiplayer

---

*End of requirements document.*
*This document is intended to be passed directly to Claude Code as a complete implementation brief.*
