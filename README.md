# Little Fox and Friends

A browser-based side-scrolling adventure game for children ages 7–9. Help Little Fox rescue his Mama Sloth by battling through three dangerous worlds, defeating powerful bosses, and making new friends along the way.

**Play it now:** [https://DanKnauf.github.io/little-fox-and-friends/](https://DanKnauf.github.io/little-fox-and-friends/)

---

## The Story

Little Fox's Mama Sloth has been taken! Three fearsome bosses guard the way across the Forest, the Desert, and the Ocean. Little Fox must fight through waves of enemies, find hidden potions, and earn the loyalty of his friends — Baby Bear and Steggie — before facing the final challenge. When Mama Sloth is finally rescued, she opens her long sloth arms wide and wraps everyone in a warm hug while heart-shaped fireworks fill the sky.

---

## How to Play

### Keyboard & Mouse Controls

| Input | Action |
|---|---|
| `A` | Move left |
| `D` | Move right |
| `W` | Jump |
| `S` | Crouch (while on the ground) |
| `Space` | Jump |
| `Left Click` | Shoot toward the cursor |
| `ESC` | Pause / Resume |

### Xbox Controller Controls

| Input | Action |
|---|---|
| Left Stick / D-Pad | Move left / right |
| A Button | Jump |
| X Button / RB / RT | Shoot |
| Start Button | Pause / Resume |

On the menus, use **Left/Right** on the stick or D-pad to navigate and **A** to select.

### Touch Controls (iPad / Tablet)

On-screen buttons appear during gameplay when Touch Controls are enabled.

| Button | Location | Action |
|---|---|---|
| ◀ | Bottom-left | Move left |
| ▶ | Bottom-left (right of ◀) | Move right |
| ▲ | Above ◀ / ▶ | Jump |
| ● | Bottom-right | Shoot forward |
| ⏸ | Top-right | Pause / Resume |

Tap anywhere else on the screen to shoot toward that point.

**To toggle touch controls on or off:** use the **Touch Controls: ON/OFF** button on the main menu. Touch controls default to **ON** — desktop players who prefer a cleaner screen can turn them off.

### Tips

- **Shoot enemies** before they touch you — contact costs one heart
- **While invincible (big mode), touching an enemy kills it instantly** — use this to your advantage!
- **Find hidden potions** tucked behind stumps, rocks, and coral formations. Collecting one fully heals Little Fox, doubles his size, and grants 10 seconds of invincibility
- **Pick up ammo crates** (glowing star boxes) on Medium and Hard to reload your pellets — several are placed near the boss zone
- **Your companions auto-fight** — Baby Bear and Steggie will target nearby enemies on their own once they join

---

## Characters

| Character | Role |
|---|---|
| **Little Fox** | Player-controlled hero. Fast, agile, fires pellets on click or controller |
| **Baby Bear** | AI companion — unlocked after Level 1. Follows and auto-attacks |
| **Steggie** | AI companion — unlocked after Level 2. Heavier stomp, longer range |
| **Mama Sloth** | The rescue target. Appears at the end of Level 3 for the victory hug |

---

## Levels

### Level 1 — The Forest
Dense woodland with mossy logs, tree branches, and a stream gap. Spiders crawl the logs, Evil Birds swoop from the canopy, and Creepers lurk in the bushes.

**Boss:** The Giant Praying Mantis (10 HP) — a fearsome insect that lunges with a fast strike and leaps through the air toward Little Fox. Defeat it to free Baby Bear.

### Level 2 — The Desert
Sandy dunes, sandstone ruins, and crumbling bridges. Baby Bear fights alongside you here.

**Boss:** The Scorpion King (12 HP) — claw swipes and a tail sting arc. Defeat it to free Steggie.

### Level 3 — The Ocean
Coastal cliffs, coral reefs, and a sunken wreck. Both Baby Bear and Steggie join the fight.

**Boss:** The Kraken (14 HP) — tentacle slams, ink spray, and a roar that pushes everyone back. The most intense battle in the main game. Win to rescue Mama Sloth.

### Bonus Level 🌋
There is a secret bonus level hidden in the game. Can you find it?

*Hint: Rescuing Mama Sloth might not be the end of the adventure...*

---

## Difficulty

Choose your difficulty on the main menu before starting.

| | Easy | Medium | Hard |
|---|---|---|---|
| Hearts | 5 | 4 | 3 |
| Ammo | Unlimited | 40 + pickups | 20 + pickups |
| Ammo pickups per level | None | 10 | 10 |
| Enemy speed | 0.7× | 1.0× | 1.3× |
| Boss speed | 0.9× | 1.0× | 1.4× |
| Potions per level | 4 | 3 | 2 |
| Score multiplier | 1.5× | 3.0× | 4.5× |

**Easy** is designed to be completable on a first or second attempt. **Hard** is for players who want a real challenge.

---

## Scoring

Every game starts at **0 points**. Your score is always visible in the top-right corner of the screen.

| Event | Points |
|---|---|
| Little Fox kills an enemy | +3 |
| Baby Bear or Steggie kills an enemy | +2 |
| Defeating Level 1 boss | +50 |
| Defeating Level 2 boss | +60 |
| Defeating Level 3 boss | +75 |
| Retrying after dying | −10 |

### End-of-Level Multiplier Bonus

After each boss is defeated, the **Level Complete** screen shows your level score multiplied by your difficulty:

| Difficulty | Multiplier |
|---|---|
| Easy | 1.5× |
| Medium | 3.0× |
| Hard | 4.5× |

So a level score of 80 on Medium becomes **240 points** after the bonus is applied. Playing on Hard rewards nearly 3× more points than Easy — but it's much tougher!

Your final cumulative score (across all three levels) appears on the **Victory screen** after rescuing Mama Sloth.

### Score Tips

- Kill every enemy you see — each one counts
- Let your companions fight too — their kills score points as well
- Avoid dying — each retry costs 10 points
- Higher difficulty = bigger multiplier bonus at each level end

---

## Enemies

| Enemy | Behavior |
|---|---|
| **Spiders** | Crawl along the ground and walls |
| **Evil Birds** | Fly in arcing patterns, dive when the player is close |
| **Creepers** | Slow patrol, charge at close range |

Each enemy has an environment-appropriate skin for each level.

---

## Pause Menu

Press **ESC** (keyboard), **Start** (Xbox controller), or the **⏸ button** (touch) at any time during gameplay to pause. The pause menu shows a full controls reference and lets you resume the game or return to the main menu.

---

## Technical Details

- Built with [Phaser 3](https://phaser.io/) and [Vite](https://vitejs.dev/)
- All sprites are drawn procedurally via the Canvas 2D API — no external image files
- All audio (music + SFX) is generated via the Web Audio API — no audio file downloads
- Background music is unique per level; boss battles trigger a darker, more urgent track
- High-DPI rendering — sharp on retina displays and Windows 150% scaling
- Full Xbox controller support throughout menus and gameplay
- **Tablet / iPad friendly** — on-screen touch buttons for movement, jump, shoot, and pause; toggle on/off from the main menu
- Deployed automatically to GitHub Pages via GitHub Actions on every push to `main`
- Runs entirely in the browser — no server, no installs

---

## Running Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173/little-fox-and-friends/` in your browser.

To build for production:

```bash
npm run build
```
