/**
 * GamepadInput — reads directly from the browser's Web Gamepad API.
 *
 * Phaser's GamepadPlugin has a timestamp guard in Gamepad.update() that
 * silently drops all input when the pad's last-change timestamp is older
 * than the moment Phaser created its wrapper object (common across scene
 * transitions). By polling navigator.getGamepads() ourselves we bypass
 * all of Phaser's internal gamepad state machinery.
 *
 * Xbox button layout (standard Gamepad API mapping):
 *   0=A  1=B  2=X  3=Y  4=LB  5=RB  6=LT  7=RT
 *   8=Select/Back  9=Start/Menu
 *   12=D-Up  13=D-Down  14=D-Left  15=D-Right
 * Axes: 0=Left-X  1=Left-Y  2=Right-X  3=Right-Y
 */

/** Returns the first connected raw browser Gamepad, or null. */
export function getRawPad() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (let i = 0; i < pads.length; i++) {
    if (pads[i]) return pads[i];
  }
  return null;
}

/** Returns true if the button at `index` is currently pressed. */
export function isButtonDown(pad, index) {
  if (!pad) return false;
  return pad.buttons[index]?.pressed ?? false;
}

/** Returns the value (-1…1) of the axis at `index`, or 0 if unavailable. */
export function getAxis(pad, index) {
  if (!pad) return 0;
  return pad.axes[index] ?? 0;
}
