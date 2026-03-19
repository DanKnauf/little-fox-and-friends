import { setTouchHeld, resetAllTouch } from '../input/TouchInput.js';
import { DEPTH } from '../constants.js';

// Button definitions — positions must match ZONES in TouchInput.js
const BTN_DEFS = [
  { key: 'left',  cx: 52,  cy: 412, r: 32, label: '◀', labelSize: '22px', fillColor: 0x1a2a4a, borderColor: 0xffffff, labelColor: '#ffffff' },
  { key: 'right', cx: 128, cy: 412, r: 32, label: '▶', labelSize: '22px', fillColor: 0x1a2a4a, borderColor: 0xffffff, labelColor: '#ffffff' },
  { key: 'jump',  cx: 90,  cy: 340, r: 32, label: '▲', labelSize: '22px', fillColor: 0x1a2a4a, borderColor: 0xffffff, labelColor: '#ffffff' },
  { key: 'shoot', cx: 748, cy: 412, r: 32, label: '●', labelSize: '20px', fillColor: 0x4a1a1a, borderColor: 0xff6644, labelColor: '#ff6644' },
  { key: 'pause', cx: 768, cy: 32,  r: 22, label: '⏸', labelSize: '16px', fillColor: 0x1a2a4a, borderColor: 0xffffff, labelColor: '#ffffff' },
];

export class TouchControlsOverlay {
  constructor(scene) {
    this._scene = scene;
    this._buttons = {};
    this._activePointers = new Map(); // pointerId → button key

    // Support up to 4 simultaneous touch points (thumb left, thumb right, etc.)
    scene.input.addPointer(3);

    for (const def of BTN_DEFS) {
      const g = scene.add
        .graphics()
        .setScrollFactor(0)
        .setDepth(DEPTH.HUD + 1);

      const label = scene.add
        .text(def.cx, def.cy, def.label, {
          fontSize: def.labelSize,
          color: def.labelColor,
          fontFamily: 'Arial',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.HUD + 2);

      this._buttons[def.key] = { g, label, def, pressed: false };
      this._draw(def.key, false);
    }

    scene.input.on('pointerdown',      p => this._onDown(p));
    scene.input.on('pointermove',      p => this._onMove(p));
    scene.input.on('pointerup',        p => this._onUp(p));
    scene.input.on('pointerupoutside', p => this._onUp(p));

    // When the scene resumes from pause, release all held buttons.
    // A finger that pressed Pause to open the menu won't still be
    // physically down when GameScene wakes back up.
    scene.events.on('resume', () => {
      for (const key of Object.keys(this._buttons)) {
        this._press(key, false);
      }
      this._activePointers.clear();
    });
  }

  // ── Internal helpers ───────────────────────────────────────────────────────

  _hit(screenX, screenY) {
    for (const def of BTN_DEFS) {
      const dx = screenX - def.cx, dy = screenY - def.cy;
      if (dx * dx + dy * dy <= def.r * def.r) return def.key;
    }
    return null;
  }

  _onDown(p) {
    const key = this._hit(p.x, p.y);
    if (key) {
      this._activePointers.set(p.id, key);
      this._press(key, true);
    }
  }

  _onMove(p) {
    if (!p.isDown) return;
    const prev = this._activePointers.get(p.id);
    const curr = this._hit(p.x, p.y);
    if (prev !== curr) {
      if (prev) this._press(prev, false);
      if (curr) {
        this._activePointers.set(p.id, curr);
        this._press(curr, true);
      } else {
        this._activePointers.delete(p.id);
      }
    }
  }

  _onUp(p) {
    const key = this._activePointers.get(p.id);
    if (!key) return;
    this._activePointers.delete(p.id);
    // Only release the button if no other finger is still holding it
    const stillHeld = [...this._activePointers.values()].includes(key);
    if (!stillHeld) this._press(key, false);
  }

  _press(key, down) {
    const btn = this._buttons[key];
    if (!btn || btn.pressed === down) return;
    btn.pressed = down;
    this._draw(key, down);
    setTouchHeld(key, down);
  }

  _draw(key, pressed) {
    const { g, def } = this._buttons[key];
    g.clear();
    const fillAlpha   = pressed ? 0.85 : 0.45;
    const borderAlpha = pressed ? 1.0  : 0.6;
    const r           = pressed ? def.r * 1.12 : def.r;
    g.fillStyle(def.fillColor, fillAlpha);
    g.fillCircle(def.cx, def.cy, r);
    g.lineStyle(2, def.borderColor, borderAlpha);
    g.strokeCircle(def.cx, def.cy, r);
  }

  destroy() {
    for (const btn of Object.values(this._buttons)) {
      btn.g?.destroy();
      btn.label?.destroy();
    }
    this._buttons = {};
    this._activePointers.clear();
    resetAllTouch();
  }
}
