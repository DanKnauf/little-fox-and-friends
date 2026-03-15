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
  const belly = isHurt ? '#aabb88' : '#5a7840';
  const teeth = '#fffdf0';
  const eyeR  = '#ff2200';

  // ── LAYOUT (all coordinates anchored to cx, cy) ──────────────────────────
  // The entire creature is drawn as ONE connected silhouette path first,
  // then details are added on top — this guarantees no floating parts.
  const gY  = cy + 34;   // ground/foot level
  const hipX = cx - 4;   // hip pivot x
  const hipY = cy + 6;   // hip pivot y
  const sO  = isStomp ? 6 : 0;

  // ── STEP 1: TAIL + BODY + NECK + HEAD as a single filled silhouette ──────
  // This ensures every part is physically connected with no gaps.
  ctx.fillStyle = body;
  ctx.beginPath();

  // Start at tail tip (far left, mid-height)
  ctx.moveTo(cx - 50, hipY + 20);
  // Tail upper edge — curves up to hips
  ctx.bezierCurveTo(cx - 36, hipY + 10, cx - 22, hipY + 2, hipX, hipY - 4);
  // Back of body — arch upward
  ctx.bezierCurveTo(hipX + 6, hipY - 24, cx + 10, hipY - 32, cx + 16, hipY - 36);
  // Top of neck sweeping forward
  ctx.bezierCurveTo(cx + 20, hipY - 42, cx + 30, hipY - 48, cx + 38, hipY - 44);
  // Skull top (right side) — wide, rounded
  ctx.bezierCurveTo(cx + 48, hipY - 42, cx + 50, hipY - 34, cx + 48, hipY - 28);
  // Snout upper jaw tip
  ctx.lineTo(cx + 50, hipY - 26);
  ctx.lineTo(cx + 46, hipY - 20);
  // Upper jaw / snout underside curves back
  ctx.bezierCurveTo(cx + 40, hipY - 17, cx + 28, hipY - 20, cx + 22, hipY - 22);
  // Front of neck / chest
  ctx.bezierCurveTo(cx + 18, hipY - 24, cx + 16, hipY - 18, cx + 14, hipY - 8);
  // Chest / belly line forward
  ctx.bezierCurveTo(cx + 10, hipY + 2, cx + 4, hipY + 8, hipX + 6, hipY + 10);
  // Tail lower edge — curves back to tip
  ctx.bezierCurveTo(cx - 8, hipY + 14, cx - 30, hipY + 18, cx - 50, hipY + 20);
  ctx.closePath();
  ctx.fill();

  // ── STEP 2: LOWER JAW (attached to snout, opens on chomp) ────────────────
  const jawOpen  = isChomp ? 18 : 2;
  const jawBaseX = cx + 22;
  const jawBaseY = hipY - 22;
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(jawBaseX,      jawBaseY);
  ctx.quadraticCurveTo(cx + 34, jawBaseY + 4 + jawOpen, cx + 46, jawBaseY + 6 + jawOpen);
  ctx.lineTo(cx + 47,       jawBaseY + 10 + jawOpen);
  ctx.quadraticCurveTo(cx + 30, jawBaseY + 10 + jawOpen, jawBaseX - 2, jawBaseY + 8);
  ctx.closePath(); ctx.fill();

  // Pink mouth inside (visible when chomping)
  if (jawOpen > 6) {
    ctx.fillStyle = '#bb2222';
    ctx.beginPath();
    ctx.moveTo(jawBaseX + 2,  jawBaseY);
    ctx.quadraticCurveTo(cx + 34, jawBaseY + jawOpen * 0.5, cx + 44, jawBaseY + 4 + jawOpen * 0.6);
    ctx.lineTo(cx + 44,       jawBaseY + 7  + jawOpen * 0.6);
    ctx.quadraticCurveTo(cx + 30, jawBaseY + 6 + jawOpen * 0.5, jawBaseX, jawBaseY + 6);
    ctx.closePath(); ctx.fill();
  }

  // ── STEP 3: BELLY lighter shade ──────────────────────────────────────────
  ctx.fillStyle = belly;
  ctx.beginPath();
  ctx.ellipse(hipX + 6, hipY - 2, 12, 14, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // ── STEP 4: TWO THICK LEGS (grow directly from the hip silhouette) ────────
  ctx.fillStyle = body;
  // Back leg (left)
  ctx.beginPath();
  ctx.moveTo(hipX - 12, hipY + 6);
  ctx.bezierCurveTo(hipX - 20, hipY + 14, hipX - 22, hipY + 26, hipX - 20, hipY + 32 + sO);
  ctx.bezierCurveTo(hipX - 18, hipY + 36 + sO, hipX - 6, hipY + 36 + sO, hipX - 4, hipY + 32 + sO);
  ctx.bezierCurveTo(hipX - 2, hipY + 26, hipX - 4, hipY + 12, hipX + 0, hipY + 4);
  ctx.closePath(); ctx.fill();
  // Back foot
  ctx.beginPath();
  ctx.ellipse(hipX - 14, gY + sO, 15, 6, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Front leg (right, slightly forward)
  ctx.beginPath();
  ctx.moveTo(hipX + 8, hipY + 4);
  ctx.bezierCurveTo(hipX + 14, hipY + 14, hipX + 16, hipY + 24 - sO, hipX + 14, hipY + 30 - sO);
  ctx.bezierCurveTo(hipX + 12, hipY + 34 - sO, hipX + 24, hipY + 34 - sO, hipX + 26, hipY + 30 - sO);
  ctx.bezierCurveTo(hipX + 28, hipY + 22 - sO, hipX + 26, hipY + 12, hipX + 20, hipY + 2);
  ctx.closePath(); ctx.fill();
  // Front foot
  ctx.beginPath();
  ctx.ellipse(hipX + 20, gY + (isStomp ? -4 : 0), 15, 6, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // Foot claws (3 per foot)
  ctx.fillStyle = dark;
  for (const [fx, fy] of [[hipX - 14, gY + sO + 4], [hipX + 20, gY + (isStomp ? -4 : 0) + 4]]) {
    for (let c = -1; c <= 1; c++) {
      ctx.beginPath();
      ctx.moveTo(fx + c * 5, fy);
      ctx.lineTo(fx + c * 5 + (c >= 0 ? 9 : -9), fy + 7);
      ctx.lineTo(fx + c * 5 + (c >= 0 ? 5 : -5), fy + 10);
      ctx.closePath(); ctx.fill();
    }
  }

  // ── STEP 5: TINY ARMS (stub on the upper chest area of the silhouette) ────
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(cx + 20, hipY - 20);
  ctx.bezierCurveTo(cx + 26, hipY - 20, cx + 30, hipY - 16, cx + 28, hipY - 11);
  ctx.bezierCurveTo(cx + 26, hipY - 7,  cx + 18, hipY - 8,  cx + 17, hipY - 13);
  ctx.closePath(); ctx.fill();
  // Claw tips
  ctx.fillStyle = dark;
  for (let c = 0; c < 2; c++) {
    ctx.beginPath();
    ctx.moveTo(cx + 26 + c * 3, hipY - 11);
    ctx.lineTo(cx + 30 + c * 4, hipY - 8);
    ctx.lineTo(cx + 28 + c * 3, hipY - 5);
    ctx.closePath(); ctx.fill();
  }

  // ── STEP 6: SCALE TEXTURE on body ────────────────────────────────────────
  ctx.strokeStyle = dark; ctx.lineWidth = 1;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      ctx.beginPath();
      ctx.arc(cx - 8 + col * 10 + (row % 2) * 5, hipY - 18 + row * 11, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // ── STEP 7: UPPER TEETH ───────────────────────────────────────────────────
  ctx.fillStyle = teeth;
  for (let t = 0; t < 6; t++) {
    ctx.beginPath();
    ctx.moveTo(cx + 24 + t * 4,   hipY - 21);
    ctx.lineTo(cx + 26 + t * 4,   hipY - 16);
    ctx.lineTo(cx + 28 + t * 4,   hipY - 21);
    ctx.closePath(); ctx.fill();
  }
  // Lower teeth (when chomping)
  if (jawOpen > 6) {
    for (let t = 0; t < 5; t++) {
      ctx.beginPath();
      ctx.moveTo(jawBaseX + 2 + t * 4,  jawBaseY + 4 + jawOpen * 0.5);
      ctx.lineTo(jawBaseX + 4 + t * 4,  jawBaseY     + jawOpen * 0.5);
      ctx.lineTo(jawBaseX + 6 + t * 4,  jawBaseY + 4 + jawOpen * 0.5);
      ctx.closePath(); ctx.fill();
    }
  }

  // ── STEP 8: NOSTRIL ───────────────────────────────────────────────────────
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.ellipse(cx + 44, hipY - 28, 3, 2.5, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // ── STEP 9: MENACING RED EYE ──────────────────────────────────────────────
  const ex = cx + 36, ey = hipY - 38;
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.ellipse(ex, ey, 7, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = eyeR;
  ctx.beginPath(); ctx.ellipse(ex, ey, 5, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(ex + 1, ey, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,60,0,0.25)';
  ctx.beginPath(); ctx.ellipse(ex, ey, 9, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.arc(ex - 2, ey - 3, 1.8, 0, Math.PI * 2); ctx.fill();
  // Angry brow ridge
  ctx.strokeStyle = dark; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(ex - 5, ey - 9);
  ctx.quadraticCurveTo(ex + 1, ey - 12, ex + 10, ey - 9);
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
