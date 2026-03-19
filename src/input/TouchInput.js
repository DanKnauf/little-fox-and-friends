// TouchInput — tracks which virtual on-screen buttons are currently held.
// The TouchControlsOverlay calls setTouchHeld() as fingers press/release buttons.
// LittleFox and GameScene read the state via the getTouchXxx() getters.

// Button zone definitions in screen/camera coords (non-scrolling).
// These must match the positions drawn by TouchControlsOverlay.
const ZONES = [
  { key: 'left',  cx: 52,  cy: 412, r: 32 },
  { key: 'right', cx: 128, cy: 412, r: 32 },
  { key: 'jump',  cx: 90,  cy: 340, r: 32 },
  { key: 'shoot', cx: 748, cy: 412, r: 32 },
  { key: 'pause', cx: 768, cy: 32,  r: 22 },
];

const _held = { left: false, right: false, jump: false, shoot: false, pause: false };

/** Called by TouchControlsOverlay when a finger presses or releases a button. */
export function setTouchHeld(key, value) {
  if (key in _held) _held[key] = value;
}

/** Returns true if the screen-space point (x, y) falls inside any button zone.
 *  Used by LittleFox to suppress tap-to-shoot when the tap lands on a button. */
export function touchHitZone(screenX, screenY) {
  for (const z of ZONES) {
    const dx = screenX - z.cx, dy = screenY - z.cy;
    if (dx * dx + dy * dy <= z.r * z.r) return true;
  }
  return false;
}

/** Clear all held states — called when GameScene resumes from pause so a
 *  button that was pressed to open the pause menu doesn't stay latched. */
export function resetAllTouch() {
  for (const k of Object.keys(_held)) _held[k] = false;
}

export function getTouchLeft()  { return _held.left;  }
export function getTouchRight() { return _held.right; }
export function getTouchJump()  { return _held.jump;  }
export function getTouchShoot() { return _held.shoot; }
export function getTouchPause() { return _held.pause; }
