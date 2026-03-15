export function generateBossTextures(scene) {
  generatePrayingMantis(scene);
  generateScorpionKing(scene);
  generateKraken(scene);
  generateTRex(scene);
}

function generatePrayingMantis(scene) {
  const W = 96, H = 96, FRAMES = 4;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const states = ['idle', 'strike', 'leap', 'hurt'];
  for (let f = 0; f < FRAMES; f++) {
    drawPrayingMantis(ctx, f * W + 48, 52, states[f]);
  }
  scene.textures.addSpriteSheet('boss_mantis', canvas, { frameWidth: W, frameHeight: H });
}

function drawPrayingMantis(ctx, cx, cy, state) {
  ctx.save();

  const lime       = state === 'hurt' ? '#99ee99' : '#3aaa3a';
  const dark       = state === 'hurt' ? '#55bb55' : '#1a6a1a';
  const mid        = state === 'hurt' ? '#66cc66' : '#2a882a';
  const eyeColor   = state === 'strike' ? '#ff3300' : '#ff9900';
  const armExtend  = state === 'strike' ? 14 : 0;
  const leaping    = state === 'leap';

  // ── Abdomen (long tapered segment) ────────────────────────────────────
  ctx.fillStyle = lime;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 18, 11, 22, leaping ? 0.25 : 0, 0, Math.PI * 2);
  ctx.fill();
  // Segmentation stripes
  ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(cx, cy + 8 + i * 6, 11 - i * 0.8, 2, leaping ? 0.25 : 0, 0, Math.PI);
    ctx.stroke();
  }

  // ── Thorax ─────────────────────────────────────────────────────────────
  ctx.fillStyle = mid;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 2, 15, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Walking legs (4 small legs on thorax sides) ────────────────────────
  ctx.strokeStyle = dark; ctx.lineWidth = 2;
  const wLegs = [[-15, 2, -24, 18], [-15, 8, -22, 24], [15, 2, 24, 18], [15, 8, 22, 24]];
  for (const [x1, y1, x2, y2] of wLegs) {
    ctx.beginPath();
    ctx.moveTo(cx + x1, cy + y1);
    ctx.lineTo(cx + x2, cy + y2);
    ctx.stroke();
  }

  // ── Wing buds (narrow triangles on back of thorax) ─────────────────────
  ctx.fillStyle = dark;
  [[-1, 1], [1, 1]].forEach(([side, _]) => {
    ctx.beginPath();
    ctx.moveTo(cx + side * 10, cy - 8);
    ctx.lineTo(cx + side * 22, cy + 4);
    ctx.lineTo(cx + side * 10, cy + 6);
    ctx.closePath();
    ctx.fill();
  });

  // ── Raptorial forelegs ─────────────────────────────────────────────────
  // Upper arm
  const armY = cy - 10;
  [[cx - 12, -0.5], [cx + 12, 0.5]].forEach(([ax, tilt]) => {
    ctx.save();
    ctx.translate(ax, armY);
    ctx.rotate(tilt * (leaping ? 1.6 : 1.0));

    // Upper arm bone
    ctx.fillStyle = mid;
    ctx.beginPath();
    ctx.roundRect(-4, -16 - armExtend, 8, 20 + armExtend, 3);
    ctx.fill();

    // Forearm / tibia (bent inward toward body center for prayer pose)
    const tibiaAngle = tilt < 0 ? 0.9 : -0.9;
    ctx.save();
    ctx.translate(0, -16 - armExtend);
    ctx.rotate(tibiaAngle);
    ctx.fillStyle = lime;
    ctx.beginPath();
    ctx.roundRect(-3, -14, 6, 16, 2);
    ctx.fill();
    // Spine/spike on inner edge
    ctx.fillStyle = '#004400';
    const spineDir = tilt < 0 ? 1 : -1;
    for (let s = 0; s < 3; s++) {
      ctx.beginPath();
      ctx.moveTo(spineDir * 3, -4 - s * 4);
      ctx.lineTo(spineDir * 8, -6 - s * 4);
      ctx.lineTo(spineDir * 3, -8 - s * 4);
      ctx.fill();
    }
    ctx.restore();
    ctx.restore();
  });

  // ── Prothorax / neck ───────────────────────────────────────────────────
  ctx.fillStyle = mid;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 17, 7, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Head (inverted triangle) ───────────────────────────────────────────
  ctx.fillStyle = lime;
  ctx.beginPath();
  ctx.moveTo(cx,      cy - 34);   // top vertex
  ctx.lineTo(cx - 16, cy - 22);
  ctx.lineTo(cx + 16, cy - 22);
  ctx.closePath();
  ctx.fill();

  // ── Compound eyes ─────────────────────────────────────────────────────
  for (const [ex, ey] of [[cx - 13, cy - 26], [cx + 13, cy - 26]]) {
    // Outer bulge
    ctx.fillStyle = eyeColor;
    ctx.beginPath(); ctx.ellipse(ex, ey, 8, 8, 0, 0, Math.PI * 2); ctx.fill();
    // Pupil
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(ex + (ex < cx ? 1 : -1), ey, 4, 0, Math.PI * 2); ctx.fill();
    // Highlight
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(ex + (ex < cx ? 2 : -2), ey - 2, 1.5, 0, Math.PI * 2); ctx.fill();
  }

  // ── Antennae ───────────────────────────────────────────────────────────
  ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - 8, cy - 34); ctx.lineTo(cx - 24, cy - 50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 8, cy - 34); ctx.lineTo(cx + 24, cy - 50); ctx.stroke();
  // Antenna tips
  ctx.fillStyle = mid;
  ctx.beginPath(); ctx.arc(cx - 24, cy - 50, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 24, cy - 50, 2.5, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}


function generateScorpionKing(scene) {
  const W = 96, H = 80, FRAMES = 4;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const states = ['idle', 'claw', 'tail', 'hurt'];
  for (let f = 0; f < FRAMES; f++) {
    drawScorpionKing(ctx, f * W + 48, 44, states[f]);
  }
  scene.textures.addSpriteSheet('boss_desert', canvas, { frameWidth: W, frameHeight: H });
}

function drawScorpionKing(ctx, cx, cy, state) {
  ctx.save();
  const bodyColor = state === 'hurt' ? '#ddaa66' : '#c8882a';
  const darkColor = state === 'hurt' ? '#997744' : '#8B5500';
  const tailGlow = state === 'tail';

  // Tail
  ctx.save();
  if (tailGlow) {
    ctx.shadowColor = '#ffee00';
    ctx.shadowBlur = 15;
  }
  ctx.strokeStyle = darkColor; ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy);
  ctx.quadraticCurveTo(cx - 40, cy - 20, cx - 30, cy - 40);
  ctx.stroke();
  ctx.fillStyle = tailGlow ? '#ffee00' : '#aa4400';
  ctx.beginPath();
  ctx.ellipse(cx - 30, cy - 44, 6, 8, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Legs (8 legs)
  ctx.strokeStyle = darkColor; ctx.lineWidth = 3;
  const legPositions = [[-30,-4],[-20,-4],[-10,-4],[0,-4],[10,-4],[20,-4],[30,-4],[35,-4]];
  const footY = cy + 24;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + legPositions[i][0], cy + 8);
    ctx.lineTo(cx + legPositions[i][0] - 2, footY);
    ctx.stroke();
  }

  // Body segments
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx + 10, cy, 30, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = darkColor;
  for (let i = -20; i <= 30; i += 10) {
    ctx.beginPath();
    ctx.arc(cx + i, cy, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Head
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx + 34, cy - 4, 14, 12, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Claws
  const clawRaise = state === 'claw' ? -10 : 0;
  ctx.fillStyle = darkColor;
  // Left claw
  ctx.beginPath();
  ctx.ellipse(cx + 30, cy + 14 + clawRaise, 10, 8, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 24, cy + 22 + clawRaise, 7, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 36, cy + 20 + clawRaise, 7, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Right claw
  ctx.beginPath();
  ctx.ellipse(cx + 44, cy + 10 + clawRaise, 10, 8, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 38, cy + 18 + clawRaise, 7, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 50, cy + 14 + clawRaise, 7, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#ff4400';
  ctx.beginPath(); ctx.arc(cx + 30, cy - 8, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 38, cy - 8, 3, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

function generateKraken(scene) {
  const W = 128, H = 96, FRAMES = 4;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const states = ['idle', 'tentacle', 'ink', 'hurt'];
  for (let f = 0; f < FRAMES; f++) {
    drawKraken(ctx, f * W + 64, 48, states[f]);
  }
  scene.textures.addSpriteSheet('boss_ocean', canvas, { frameWidth: W, frameHeight: H });
}

// ─── T-Rex ────────────────────────────────────────────────────────────────────
function generateTRex(scene) {
  const W = 112, H = 96, FRAMES = 4;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const states = ['idle', 'chomp', 'stomp', 'hurt'];
  for (let f = 0; f < FRAMES; f++) {
    drawTRex(ctx, f * W + 56, 54, states[f]);
  }
  scene.textures.addSpriteSheet('boss_volcano', canvas, { frameWidth: W, frameHeight: H });
}

function drawTRex(ctx, cx, cy, state) {
  ctx.save();
  const isHurt  = state === 'hurt';
  const isChomp = state === 'chomp';
  const isStomp = state === 'stomp';

  const body  = isHurt ? '#88aa66' : '#3a6028';
  const dark  = isHurt ? '#557744' : '#1a3010';
  const belly = isHurt ? '#aabb88' : '#527840';
  const teeth = '#fffdf0';
  const eyeR  = '#ff2200';

  // Frame 112×96, cx=center-x of frame, cy=54
  // Upright bipedal: ground at cy+34, hips at cy+4, head up at cy-38
  const gY = cy + 34;   // ground / foot base
  const hY = cy + 4;    // hip height
  const sO = isStomp ? 7 : 0; // stomp offset on front leg

  // ── THICK COUNTERBALANCE TAIL ──────────────────────────────────────────
  // Goes from hips backward and downward (balances the heavy head forward)
  ctx.strokeStyle = body; ctx.lineWidth = 22; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 8, hY + 2);
  ctx.bezierCurveTo(cx - 26, hY + 6, cx - 44, hY + 14, cx - 52, hY + 22);
  ctx.stroke();
  // Tail taper (narrower tip)
  ctx.strokeStyle = body; ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx - 38, hY + 16);
  ctx.quadraticCurveTo(cx - 48, hY + 20, cx - 52, hY + 24);
  ctx.stroke();
  // Tail ridge stripe
  ctx.strokeStyle = dark; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 10, hY - 4);
  ctx.bezierCurveTo(cx - 28, hY + 2, cx - 44, hY + 12, cx - 50, hY + 20);
  ctx.stroke();

  // ── TWO THICK HIND LEGS (bipedal — no front legs) ──────────────────────
  // Upper thigh (femur) — angled back slightly
  ctx.fillStyle = body;
  // Back leg thigh
  ctx.beginPath();
  ctx.ellipse(cx - 10, hY + 16, 11, 20, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // Back leg shin + foot
  ctx.beginPath();
  ctx.ellipse(cx - 14, hY + 36, 10, 8, 0, 0, Math.PI * 2); // ankle
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx - 18, gY + sO, 14, 7, 0.15, 0, Math.PI * 2); // foot
  ctx.fill();
  // Front leg thigh (slightly forward)
  ctx.beginPath();
  ctx.ellipse(cx + 6, hY + 14 - sO, 11, 20, 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Front leg shin + foot
  ctx.beginPath();
  ctx.ellipse(cx + 2, hY + 34 - sO, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx - 2, gY + (isStomp ? -6 : 0), 14, 7, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // Three large claws on each foot
  ctx.fillStyle = dark;
  for (const [fx, fy] of [[cx - 18, gY + sO + 4], [cx - 2, gY + (isStomp ? -6 : 0) + 4]]) {
    for (let c = -1; c <= 1; c++) {
      ctx.beginPath();
      ctx.moveTo(fx + c * 5, fy);
      ctx.lineTo(fx + c * 5 + (c >= 0 ? 8 : -8), fy + 7);
      ctx.lineTo(fx + c * 5 + (c >= 0 ? 4 : -4), fy + 10);
      ctx.closePath(); ctx.fill();
    }
  }

  // ── BARREL BODY — held near-horizontal, leaning forward ────────────────
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(cx + 2, hY - 10, 22, 18, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Pale belly underside
  ctx.fillStyle = belly;
  ctx.beginPath();
  ctx.ellipse(cx + 6, hY - 4, 13, 12, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // Scale row texture
  ctx.strokeStyle = dark; ctx.lineWidth = 1;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      ctx.beginPath();
      ctx.arc(cx - 14 + col * 9 + (row % 2) * 4, hY - 22 + row * 10, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // ── FAMOUSLY TINY ARMS — held right against the chest ──────────────────
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(cx + 18, hY - 18, 4, 8, 0.55, 0, Math.PI * 2);
  ctx.fill();
  // Two stubby clawed fingers
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(cx + 22, hY - 12);
  ctx.lineTo(cx + 27, hY - 10);
  ctx.lineTo(cx + 25, hY - 7);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 21, hY - 10);
  ctx.lineTo(cx + 25, hY - 7);
  ctx.lineTo(cx + 21, hY - 6);
  ctx.closePath(); ctx.fill();

  // ── THICK FORWARD-LEANING NECK ─────────────────────────────────────────
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(cx + 16, hY - 26, 12, 14, 0.35, 0, Math.PI * 2);
  ctx.fill();

  // ── ICONIC MASSIVE HEAD (biggest feature, ~40% of total height) ─────────
  const hx = cx + 28;   // head center x
  const hy = hY - 42;   // head center y  (= cy - 38 ≈ y=16 in frame)
  ctx.fillStyle = body;
  // Skull — wide oval
  ctx.beginPath();
  ctx.ellipse(hx, hy, 24, 14, isChomp ? 0.1 : 0, 0, Math.PI * 2);
  ctx.fill();

  // ── LONG SNOUT / UPPER JAW ─────────────────────────────────────────────
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(hx - 20, hy + 5);
  ctx.lineTo(hx + 22, hy + 1);
  ctx.lineTo(hx + 24, hy + 8);
  ctx.lineTo(hx - 16, hy + 11);
  ctx.closePath(); ctx.fill();

  // ── LOWER JAW — droops open on chomp ─────────────────────────────────
  const jawOpen = isChomp ? 20 : 3;
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(hx - 18, hy + 11);
  ctx.lineTo(hx + 20, hy + 6 + jawOpen);
  ctx.lineTo(hx + 15, hy + 12 + jawOpen);
  ctx.lineTo(hx - 20, hy + 12 + jawOpen * 0.3);
  ctx.closePath(); ctx.fill();

  // Pink mouth interior (visible when chomping)
  if (jawOpen > 8) {
    ctx.fillStyle = '#cc3333';
    ctx.beginPath();
    ctx.moveTo(hx - 16, hy + 11);
    ctx.lineTo(hx + 18, hy + 8 + jawOpen * 0.5);
    ctx.lineTo(hx + 12, hy + 11 + jawOpen * 0.5);
    ctx.lineTo(hx - 16, hy + 11 + jawOpen * 0.2);
    ctx.closePath(); ctx.fill();
  }

  // Upper teeth (7 jagged fangs)
  ctx.fillStyle = teeth;
  for (let t = 0; t < 7; t++) {
    ctx.beginPath();
    ctx.moveTo(hx - 16 + t * 7,   hy + 10);
    ctx.lineTo(hx - 13 + t * 7,   hy + 16);
    ctx.lineTo(hx - 10 + t * 7,   hy + 10);
    ctx.closePath(); ctx.fill();
  }
  // Lower teeth (chomping only)
  if (jawOpen > 8) {
    for (let t = 0; t < 5; t++) {
      ctx.beginPath();
      ctx.moveTo(hx - 10 + t * 7,  hy + 9 + jawOpen);
      ctx.lineTo(hx - 7  + t * 7,  hy + 3 + jawOpen);
      ctx.lineTo(hx - 4  + t * 7,  hy + 9 + jawOpen);
      ctx.closePath(); ctx.fill();
    }
  }

  // ── NOSTRIL (near tip of snout) ───────────────────────────────────────
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.ellipse(hx + 19, hy - 2, 3, 2.5, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // ── MENACING RED EYE ──────────────────────────────────────────────────
  const ex = hx + 2, ey = hy - 9;
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.ellipse(ex, ey, 8, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = eyeR;
  ctx.beginPath(); ctx.ellipse(ex, ey, 6, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(ex + 1, ey, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
  // Eye glow halo
  ctx.fillStyle = 'rgba(255,60,0,0.28)';
  ctx.beginPath(); ctx.ellipse(ex, ey, 10, 10, 0, 0, Math.PI * 2); ctx.fill();
  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath(); ctx.arc(ex - 2, ey - 3, 2, 0, Math.PI * 2); ctx.fill();
  // Angry brow ridge above eye
  ctx.strokeStyle = dark; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(hx - 4,  hy - 16);
  ctx.quadraticCurveTo(hx + 2, hy - 18, hx + 12, hy - 15);
  ctx.stroke();

  ctx.restore();
}

function drawKraken(ctx, cx, cy, state) {
  ctx.save();
  const bodyColor = state === 'hurt' ? '#55aacc' : '#1a5566';
  const inkBlob = state === 'ink';
  const tentacleAlert = state === 'tentacle';

  // Tentacles (8)
  const tentacleAngles = [-Math.PI*0.9, -Math.PI*0.7, -Math.PI*0.5, -Math.PI*0.3,
                            Math.PI*0.3, Math.PI*0.5, Math.PI*0.7, Math.PI*0.9];
  ctx.strokeStyle = bodyColor; ctx.lineWidth = 8;
  for (let i = 0; i < tentacleAngles.length; i++) {
    const a = tentacleAngles[i];
    const len = tentacleAlert && i < 2 ? 55 : 40;
    const ex = cx + Math.cos(a) * len;
    const ey = cy + Math.sin(a) * 28 + 20;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 16);
    ctx.quadraticCurveTo(
      cx + Math.cos(a) * len * 0.5,
      cy + Math.sin(a) * 14 + 10,
      ex, ey
    );
    ctx.stroke();
    // suckers
    ctx.fillStyle = '#aaddee';
    ctx.beginPath();
    ctx.arc(ex, ey, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mantle / body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 2, 34, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ink sac glow
  if (inkBlob) {
    ctx.fillStyle = 'rgba(0,0,40,0.7)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 6, 20, 24, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Spots
  ctx.fillStyle = state === 'hurt' ? '#aaddee' : '#224455';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(cx - 12 + i * 6, cy + (i % 2) * 8 - 4, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eyes - large and menacing
  ctx.fillStyle = state === 'ink' ? '#440066' : '#ffcc00';
  ctx.beginPath(); ctx.ellipse(cx - 12, cy - 12, 9, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 12, cy - 12, 9, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(cx - 12, cy - 12, 5, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 12, cy - 12, 5, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx - 10, cy - 14, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 14, cy - 14, 2, 0, Math.PI * 2); ctx.fill();

  // Beak
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy + 4);
  ctx.lineTo(cx, cy + 14);
  ctx.lineTo(cx + 6, cy + 4);
  ctx.fill();

  ctx.restore();
}
