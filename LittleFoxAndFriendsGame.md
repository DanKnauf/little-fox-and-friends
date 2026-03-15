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
**Framework:** Phaser 3 — must compile to static HTML/CSS/JS assets with no server-side dependencies
**Audio:** Web Audio API (built into Phaser 3) for all sound effects, ambient audio, and procedurally generated background music
**Target session length:** ~10 minutes (three levels, approximately 2–3 minutes each)
**Audience:** Children ages 7–9; controls must be simple, challenge must be readable and forgiving

---

## 2. Narrative Overview

Little Fox's Mama — Mama Sloth — has been taken. Little Fox must journey through three dangerous environments to rescue her: a forest, a desert, and an ocean. Each environment is guarded by a powerful boss. Defeating each boss frees a companion: Baby Bear and Steggie join Little Fox after their respective rescues and fight alongside him as loyal allies. The final boss is the most powerful of all, but with both companions at his side, Little Fox can prevail. When Mama Sloth is rescued at the end of Level 3, she wraps her long sloth arms around Little Fox in a warm, joyful hug — and heart-shaped fireworks fill the sky.

**Core emotional hook:** Little Fox is saving his Mama. This is the heart of the game.

---

## 3. Core Gameplay Loop

1. Player controls Little Fox through a side-scrolling 3D environment
2. Enemies (baddies) patrol, fly, or emerge throughout the level
3. Touching an enemy costs one heart; shooting an enemy with a projectile defeats it
4. Ammunition is finite on Medium and Hard (see Section 8); ammo pickups are placed throughout those levels
5. Hidden secret potions are scattered throughout each level — collecting one fully heals the player and temporarily doubles their size
6. Each level ends with a boss battle — unique mechanics, visible health bar, telegraphed attacks
7. Defeating the boss unlocks the next level and a new companion
8. Companions follow Little Fox automatically as AI-controlled allies, shooting at enemies
9. Completing all three levels rescues Mama Sloth and triggers the victory ending with heart fireworks

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

## 5. Start Menu & Instructions

The game opens on a **main menu screen** before any gameplay begins. The menu must include:

### 5.1 Main Menu Elements

- Game title: **Little Fox and Friends** (prominent, styled)
- Difficulty selection (Easy / Medium / Hard) — selectable before starting
- **START GAME** button
- Full in-game instructions panel (always visible or accessible via an "How to Play" button on the menu)

### 5.2 Instructions Panel Content

**Story:**
Little Fox's Mama Sloth has been taken! Help Little Fox rescue her by battling through the Forest, the Desert, and the Ocean.

**Keyboard Controls:**
- W — Move up / climb
- A — Move left
- S — Move down / crouch
- D — Move right
- Spacebar — Jump

**Mouse Controls:**
- Left click — Shoot

**Gameplay Tips:**
- Touching an enemy costs you one heart. Shoot them before they reach you!
- Find hidden potions behind objects to restore your health and grow big!
- Beat the boss at the end of each level to rescue a friend who will help you fight.
- Watch your ammo on Medium and Hard — pick up ammo packs to reload.
- When you find Mama Sloth, she'll give everyone a big hug!

---

## 6. Characters

### 6.1 Little Fox (Player Character)

- **Role:** Primary player-controlled character
- **Starting state:** Alone in Level 1
- **Default hearts:** 4 (Easy: 5, Hard: 3)
- **Attack:** Fires a small pellet projectile on mouse click
- **Sound — footstep:** Soft shushing sound, light and quick cadence
- **Sound — jump:** Spring/boing tone
- **Sound — shoot:** "Pew pew" sound
- **Sound — out of ammo (Medium/Hard):** Dry click sound — no projectile fires
- **Sound — takes damage:** Short yelp or impact sound
- **Sound — defeat (0 hearts):** Sad descending tone
- **Visual:** Small fox with visible tail, warm orange/red tones

### 6.2 Baby Bear (Companion — unlocked after Level 1 boss)

- **Role:** AI-controlled companion
- **Behavior:** Follows Little Fox; auto-targets and attacks nearby enemies
- **Default hearts:** 4 (difficulty scaling applies)
- **Sound — footstep:** Slightly heavier padded thud than Little Fox
- **Sound — attack:** Low growl or swipe
- **Visual:** Small bear cub, earthy brown tones

### 6.3 Steggie (Companion — unlocked after Level 2 boss)

- **Role:** AI-controlled companion
- **Behavior:** Follows Little Fox; auto-targets and attacks; heavier and slower than Baby Bear
- **Default hearts:** 4 (difficulty scaling applies)
- **Sound — footstep:** Heavy stomp — Steggie is a stegosaurus
- **Sound — attack:** Tail swipe or deep rumble
- **Visual:** Small stegosaurus, green/teal tones with visible back plates
- **Code file name:** `Steggie.js` (not Stegge)

### 6.4 Mama Sloth (Non-playable — rescue target)

- **Role:** The goal of the entire game. She is Little Fox's mother.
- **Appears:** After the Level 3 boss is defeated
- **Character design:**
  - Sloth body — rounded, soft, slightly chunky silhouette
  - Long arms (key sloth trait — used for the hug animation)
  - Warm, motherly color palette: soft grey-brown fur, pale face, kind expression
  - Large, sleepy-looking eyes — warm and expressive
  - Visible claws (gentle, not scary) — appropriate for a sloth
  - Optional: slightly tousled or fluffy fur texture
- **Victory behavior:**
  - Mama Sloth opens her long arms wide
  - She wraps them around Little Fox in a slow, warm embrace
  - Baby Bear and Steggie crowd in — Mama Sloth's arms extend to include them all
  - Heart-shaped fireworks burst across the screen during the hug
- **Sound — victory moment:** Warm, emotional fanfare; gentle "aww" undertone
- **Code file name:** `MamaSloth.js` (not Mamoslav)

---

## 7. Ammunition System

Ammunition applies to Little Fox's shooter only. Companions have unlimited ammo at all difficulty levels.

| Difficulty | Starting Ammo | Ammo Pickups in Level | Behavior |
|---|---|---|---|
| Easy | Unlimited | N/A | Shoot freely — no ammo tracking needed |
| Medium | 40 pellets | Yes — plentiful ammo packs placed throughout | Ammo counter displayed in HUD; dry click when empty |
| Hard | 20 pellets | Yes — fewer ammo packs than Medium | Ammo counter displayed in HUD; dry click when empty |

### 7.1 Ammo Pickup Objects

- Visual: Small glowing ammo pack or pellet bundle, environment-appropriate design per level
- Collecting an ammo pack restores +10 pellets (Medium) or +10 pellets (Hard)
- Ammo packs are placed along level paths — more plentiful on Medium, harder to find on Hard
- **Sound — collect ammo pack:** Short click or reload sound
- On Easy, ammo pickups do not appear (not needed)

### 7.2 HUD Ammo Display

- Easy: No ammo counter shown
- Medium/Hard: Ammo counter displayed in HUD (e.g., "Ammo: 28") near heart icons

---

## 8. Health System

### 8.1 Heart Display

- Player hearts: always visible, top-left HUD
- Companion hearts: displayed below or adjacent to player hearts
- Boss health: dedicated health bar at top-center of screen, visible only during boss encounters
- Ammo counter (Medium/Hard): displayed in HUD near hearts

### 8.2 Damage Rules

- Touching an enemy = 1 heart lost
- Hit by enemy projectile = 1 heart lost
- Falling off the map (if applicable) = 1 heart lost
- 0 hearts = game over screen with option to retry or return to main menu

### 8.3 Level Transition

- Player enters each new level at full hearts
- Companion hearts also reset at level start
- Ammo resets to starting value at the beginning of each new level

### 8.4 Secret Potions

- Each level contains hidden potions (count varies by difficulty — see Section 9)
- Potions are hidden behind level objects: trees, crates, rocks, coral formations (environment-appropriate)
- Collecting a potion: fully restores all of Little Fox's hearts AND temporarily doubles his size for 10 seconds
- Size doubling is visual and satisfying — does not significantly alter hitbox or speed
- **Sound — collect potion:** Magical shimmer/twinkle
- **Sound — size effect active:** Subtle low power-up hum

---

## 9. Difficulty Settings

Selected on the main menu before the game starts. Affects hearts, ammo, speed, enemy density, and boss behavior.

| Parameter | Easy | Medium | Hard |
|---|---|---|---|
| Little Fox starting hearts | 5 | 4 | 3 |
| Companion hearts | 5 | 4 | 3 |
| Starting ammo | Unlimited | 40 pellets | 20 pellets |
| Ammo pickups in levels | None | Plentiful | Scarce |
| Enemy movement speed | 0.7x | 1.0x | 1.3x |
| Boss attack speed multiplier | 0.6x | 1.0x | 1.4x |
| Boss attack telegraph window | 1.5s | 1.0s | 0.6s |
| Enemy density per screen | Low | Medium | High |
| Potion count per level | 4 | 3 | 2 |

All difficulty settings must keep the game completable and enjoyable for children ages 7–9. Easy mode should be completable on first or second attempt.

---

## 10. Level Design

### General Level Design Principles

- Each level lasts approximately 2–3 minutes of active gameplay
- Levels are side-scrolling but not purely linear — include vertical traversal, branching paths, hidden areas behind objects, and terrain that rewards exploration
- Hidden potions must require minor exploration to find (behind objects, up on platforms, in alcoves)
- Ammo packs (Medium/Hard) are placed along natural travel paths — not hidden, but require some movement to reach
- Mix open traversal sections with denser enemy encounters to create rhythm
- Each level ends with a closed boss arena — the player cannot leave until the boss is defeated
- Visual depth cues (parallax backgrounds, foreground objects) reinforce the 3D feel

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
**Background music:** Light, bouncy woodland adventure theme — playful and warm. Generated via Web Audio API using oscillators and rhythmic percussion patterns. Think "friendly forest" — upbeat, slightly whimsical.
**Boss music:** Same base theme but shifts to minor key, adds low drone, tempo increases — conveys urgency without being scary for young children.

**Level 1 Boss — The Forest Guardian (large spider/root creature)**
- **Arena:** A wide forest clearing
- **Health bar:** Visible at top of screen
- **Attack pattern (Easy/Medium):** Predictable sequence — charge left, charge right, drop webs from above (telegraphed by shadow). Pause between attacks gives player time to react.
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
**Background music:** Warm, slightly mysterious desert theme — uses pentatonic scale, hand-drum rhythm, wind-like synth pads. Exotic but accessible. Generated via Web Audio API.
**Boss music:** Same base theme, lower register, adds urgent pulse/heartbeat rhythm, minor mode — signals this is the big desert moment.

**Level 2 Boss — The Desert Scorpion King**
- **Arena:** A flat sandstone platform surrounded by sand pits
- **Health bar:** Visible at top of screen
- **Attack pattern (Easy/Medium):** Slow but hard-hitting claw swipes (telegraphed by claw raise animation), tail sting that arcs overhead (telegraphed by tail glow). Predictable rhythm.
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
- Tide pool sections with wet/slippery surface feel
- Coral reef maze section — non-linear branching paths reward exploration
- Sunken wreck section for hidden potion discovery
- Underwater bubble-rising ambient particle effects

**Ambient audio:** Waves crashing, seagulls, bubbling water, distant ship bell
**Background music:** Sweeping oceanic adventure theme — full and epic, uses flowing arpeggios, string-like synth tones, wave-rhythm percussion. Generated via Web Audio API. Most dramatic of the three levels.
**Boss music:** Full orchestral-style buildup — the most intense music in the game. Low bass pulses, urgent rhythm, dissonant harmonics. Signals the final battle. Resolves into the victory fanfare on defeat.

**Level 3 Boss — The Kraken (massive sea creature)**
- **Arena:** A large coastal platform with water on both sides
- **Health bar:** Visible at top of screen
- **Attack pattern (Easy/Medium):** Tentacle slam (telegraphed by tentacle shadow), ink spray (telegraphed by body glow), roar that pushes characters back. With both companions firing, the fight is achievable.
- **Attack pattern (Hard):** Multiple simultaneous tentacle slams, faster ink spray, shorter telegraph windows
- **Defeat reward:** Mama Sloth appears on the platform — victory cutscene triggers
- **Defeat sound:** Deep ocean rumble + splash + full victory fanfare begins

---

### Victory Cutscene (post-Level 3)

- Mama Sloth appears on the platform
- She opens her long sloth arms wide
- She wraps them slowly around Little Fox in a warm embrace
- Baby Bear and Steggie crowd in — Mama Sloth's arms extend to hold everyone
- **Heart-shaped fireworks** burst across the screen — multiple bursts, warm colors (red, pink, gold)
- Full warm victory fanfare plays
- Screen fades to "You saved Mama!" text
- "Play Again" and "Main Menu" buttons appear
- All game variables reset on "Play Again" — fresh game state

---

## 11. Game States & Reset Behavior

| State | Description |
|---|---|
| Main menu | Title, difficulty selection, instructions, START button |
| Level intro | Brief environment title card fades in then out |
| Gameplay | Active level play |
| Boss encounter | Boss arena loads, boss health bar appears, boss music begins |
| Level complete | Brief celebration animation, transition to next level at full health and reset ammo |
| Game over | Player reached 0 hearts — "Try Again" (restart current level) and "Main Menu" buttons |
| Victory | Post-Level 3 cutscene with Mama Sloth hug and heart fireworks, then end screen |

### 11.1 Full Game Reset Rules

When "Play Again" is selected from the victory screen or "Main Menu" from the game over screen, the following must reset to defaults:

- Player hearts → starting value for selected difficulty
- Companion hearts → starting value
- Ammo → starting value for selected difficulty
- Active companions → none (Baby Bear and Steggie must be re-unlocked)
- Current level → Level 1
- All enemy states → reset
- All boss states → reset
- All potion/ammo pickup states → reset (re-spawned in levels)
- Music → back to main menu state

Difficulty selection should be available again when returning to the main menu, so the player can change it for a new run.

---

## 12. Enemy Types

### Standard Baddies (appear across all levels with environment-appropriate skins)

| Enemy | Behavior | Notes |
|---|---|---|
| Spiders | Crawl along ground and walls | Forest and ocean variants |
| Evil Birds | Fly in arcing patterns, swoop at player | Desert and forest variants |
| Creepers | Slow-moving ground enemy, charges when close | All levels |

Each enemy type has an environment-appropriate visual skin per level. Behavior is consistent regardless of skin.

### Enemy Audio

- **Enemy defeated:** Pop or splat sound
- **Enemy hit (not defeated):** Short impact tick
- **Enemy spawning (if telegraphed):** Low growl or rustle

---

## 13. Audio Design

### 13.1 Background Music (Procedurally Generated via Web Audio API)

All background music is generated programmatically using the Web Audio API — no external audio files required for music. Each level has a distinct theme. Boss encounters trigger a music shift (same base theme, darker/more urgent).

| Context | Music Character |
|---|---|
| Main menu | Gentle, inviting — soft version of the forest theme |
| Level 1 — Forest (exploration) | Bouncy, warm, whimsical woodland — major key, light percussion |
| Level 1 — Forest (boss) | Minor key shift, low drone added, tempo increase |
| Level 2 — Desert (exploration) | Pentatonic, warm, mysterious — hand drum rhythm, wind pad |
| Level 2 — Desert (boss) | Lower register, urgent heartbeat pulse, minor mode |
| Level 3 — Ocean (exploration) | Sweeping, epic, flowing arpeggios — the grandest level theme |
| Level 3 — Ocean (boss) | Maximum urgency — low bass, dissonance, driving rhythm |
| Victory / Mama Sloth hug | Full warm fanfare — resolves all tension into joy |
| Game over | Short, gentle sad tone — child-appropriate, not harsh |

Music transitions (exploration → boss, boss → victory) should crossfade smoothly.

### 13.2 Player Action Sounds

| Action | Sound |
|---|---|
| Footstep (Little Fox) | Soft shush sound |
| Footstep (Baby Bear) | Padded thud |
| Footstep (Steggie) | Heavy stomp |
| Jump | Spring/boing tone |
| Shoot | "Pew pew" |
| Out of ammo (Medium/Hard) | Dry click — no projectile |
| Takes damage | Short yelp or impact |
| Defeat (0 hearts) | Sad descending tone |
| Collect potion | Magical shimmer/twinkle |
| Size-up effect active | Subtle power-up hum |
| Collect ammo pack | Short click or reload sound |

### 13.3 Enemy Sounds

| Event | Sound |
|---|---|
| Enemy hit (not defeated) | Short impact tick |
| Enemy defeated | Pop or splat |
| Enemy spawn (if visible) | Rustle or low growl |

### 13.4 Boss Sounds

| Event | Sound |
|---|---|
| Boss telegraph (attack incoming) | Low warning tone or growl |
| Boss takes damage | Heavy impact grunt |
| Boss defeated | Level-appropriate defeat sound + triumphant jingle |

### 13.5 UI Sounds

| Event | Sound |
|---|---|
| Menu button click | Soft click |
| Level start | Short upbeat fanfare |
| Level complete | Cheerful ascending chime |
| Game over | Sad but gentle tone |
| Victory (Mama Sloth rescued) | Full warm fanfare |

### 13.6 Ambient Audio by Level

| Level | Ambient Sounds |
|---|---|
| Forest | Rustling leaves, creaking branches, bird calls, wind |
| Desert | Wind gusts, shifting sand, distant hawk cry |
| Ocean | Waves crashing, seagulls, bubbling water, distant bell |

Ambient audio loops seamlessly. Music and ambient SFX are separate channels.

---

## 14. Visual and Graphics Requirements

### 14.1 Visual Style

- 3D rendered characters and environments within a side-scrolling camera constraint
- Graphics do not need to be high-fidelity — they must be fun, readable, and representative
- Bright, saturated color palette appropriate for children
- Parallax background layers to reinforce depth and 3D feel
- Each environment has a clearly distinct visual identity

### 14.2 Mama Sloth Visual Specification

Mama Sloth's design should be immediately readable as a sloth and feel warm and maternal:

- **Body:** Rounded, soft silhouette — slightly chunky, not tall
- **Arms:** Noticeably long relative to body — key sloth characteristic; used prominently in hug animation
- **Fur:** Soft grey-brown base coat; lighter/pale face and belly
- **Face:** Large, kind, slightly sleepy eyes; gentle smile; warm expression
- **Claws:** Visible but gentle — curved, not sharp-looking
- **Movement (if any):** Slow and deliberate — she is a sloth
- **Hug animation:** Arms open wide → wrap slowly around Little Fox → extend to include Baby Bear and Steggie

### 14.3 Heart Fireworks (Victory Sequence)

- Triggered immediately when the Mama Sloth hug animation begins
- Multiple bursts of heart-shaped particles across the screen
- Color palette: red, pink, gold, white — warm and celebratory
- Hearts should arc upward and outward like traditional fireworks
- Fade out gracefully as the "You saved Mama!" text appears
- Implementation: Phaser 3 particle emitter with custom heart-shaped particle texture

### 14.4 HUD Elements

- Heart icons top-left (player, then companions stacked below)
- Ammo counter (Medium/Hard only) adjacent to hearts
- Boss health bar top-center (only during boss encounters)
- Minimal UI — keep the screen clean for young players

### 14.5 Visual Feedback

- Flash/blink animation when a character takes damage
- Brief invincibility frames (~1 second) after taking damage
- Size-doubling potion effect: clear and satisfying scale animation
- Boss telegraph animations must be visually obvious (color change, glowing outline, shadow indicator)

### 14.6 Environment Depth Cues

- Foreground decorative elements (leaves, rocks, coral) pass in front of characters
- Background layers scroll at different rates (parallax)
- Lighting and shadow suggest environmental depth

---

## 15. Technical Requirements

### 15.1 Framework and Stack

- **Game engine:** Phaser 3
- **Language:** JavaScript (ES6+)
- **Audio:** Web Audio API (built into Phaser 3) — music generated procedurally; SFX generated or loaded as small audio files
- **Assets:** Sprite sheets, tilemaps, audio files — all bundled locally
- **Build output:** Static HTML, CSS, and JS files only — no server required

### 15.2 Deployment

- **Target host:** GitHub Pages
- **Branch:** `main` or `gh-pages`
- **Entry point:** `index.html` at root
- **Asset path:** All assets relative — no absolute paths

### 15.3 Browser Compatibility

- Target: modern desktop browsers (Chrome, Firefox, Edge, Safari)
- No mobile/touch support required for MVP
- Minimum resolution: 1024x768

### 15.4 Performance

- Target 60fps on a mid-range laptop
- Sprite atlases should be used to minimize draw calls
- Audio assets should be preloaded during level load screens

### 15.5 Recommended Project File Structure

```
/
├── index.html
├── /src
│   ├── main.js
│   ├── /scenes
│   │   ├── StartScene.js           ← Main menu, difficulty, instructions
│   │   ├── Level1Scene.js          ← Forest
│   │   ├── Level2Scene.js          ← Desert
│   │   ├── Level3Scene.js          ← Ocean
│   │   ├── GameOverScene.js
│   │   └── VictoryScene.js         ← Mama Sloth hug + heart fireworks
│   ├── /entities
│   │   ├── LittleFox.js
│   │   ├── BabyBear.js
│   │   ├── Steggie.js              ← (not Stegge)
│   │   ├── MamaSloth.js            ← (not Mamoslav)
│   │   └── /enemies
│   │       ├── Spider.js
│   │       ├── EvilBird.js
│   │       └── Creeper.js
│   ├── /bosses
│   │   ├── ForestGuardian.js
│   │   ├── ScorpionKing.js
│   │   └── Kraken.js
│   ├── /ui
│   │   ├── HUD.js                  ← Hearts, ammo counter, boss health bar
│   │   └── DifficultyMenu.js
│   ├── /audio
│   │   ├── MusicGenerator.js       ← Procedural music via Web Audio API
│   │   └── SoundEffects.js         ← All SFX definitions
│   └── /utils
│       └── GameState.js            ← Central game state; handles full reset on new game
├── /assets
│   ├── /sprites
│   ├── /tilemaps
│   └── /backgrounds
└── /dist
```

### 15.6 GameState Reset Implementation Note

`GameState.js` must expose a `resetAll()` method that is called when "Play Again" or "Main Menu" is selected. This method resets: player hearts, companion hearts, ammo count, active companions array, current level pointer, all pickup/enemy/boss spawn states. The `StartScene` must re-read difficulty selection on every new game start — not cache it from the previous run.

---

## 16. Boss Design Summary

| Boss | Level | Key Mechanic | Telegraph | Reward |
|---|---|---|---|---|
| Forest Guardian | 1 — Forest | Charge + web drop | Shadow before web drop | Unlocks Baby Bear |
| Scorpion King | 2 — Desert | Claw swipe + tail sting | Claw raise / tail glow | Unlocks Steggie |
| The Kraken | 3 — Ocean | Tentacle slam + ink spray | Tentacle shadow / body glow | Rescues Mama Sloth |

All bosses must:
- Have a visible health bar
- Telegraph attacks with enough lead time for a 7-year-old to react (Easy: 1.5s, Medium: 1.0s, Hard: 0.6s)
- Have predictable, learnable attack sequences
- Be defeatable with the companion(s) available at that point in the game
- Trigger a music shift (exploration → boss music) on arena entry

---

## 17. Scope Boundaries (MVP)

**In scope:**
- Three full levels (Forest, Desert, Ocean)
- Three playable enemy types with per-level skins
- Three bosses with unique mechanics
- Two companion characters (Baby Bear, Steggie) with AI follow-and-attack behavior
- Player character Little Fox with ammo system
- Full audio: footsteps, combat SFX, ambient audio, procedurally generated background music
- Difficulty selection (Easy, Medium, Hard) with ammo and heart scaling
- Hearts/health system with visual HUD
- Ammo counter and pickup system (Medium/Hard)
- Secret potions with size-up effect
- Victory cutscene: Mama Sloth hug + heart fireworks
- Full game reset on new game
- Main menu with instructions
- GitHub Pages deployment

**Out of scope for MVP:**
- Mobile/touch controls
- Save state / progress persistence
- Leaderboard or scoring system
- Character customization
- Additional levels beyond three
- Multiplayer

---

*End of requirements document.*
*This document is intended to be passed directly to Claude Code as a complete implementation brief.*
*Key naming notes for Claude Code: The rescue character is MamaSloth (file: `MamaSloth.js`), not Mamoslav. The stegosaurus companion is Steggie (file: `Steggie.js`), not Stegge. These names must be consistent across all code, comments, variable names, and file names.*
