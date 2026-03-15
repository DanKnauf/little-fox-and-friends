export function generateCharacterTextures(scene) {
  generateLittleFox(scene);
  generateBabyBear(scene);
  generateSteggie(scene);
  generateMamaSloth(scene);
  generateMamaSlothCompanion(scene);
  generateFluffyBunny(scene);
  generateAmmoPickup(scene);
}

// ─── Little Fox ──────────────────────────────────────────────────────────────
function generateLittleFox(scene) {
  // Spritesheet: 8 frames × 32px wide, 40px tall (extra height gives ear clearance)
  // Frames: 0-3 walk, 4 jump, 5 hurt, 6 idle, 7 shoot
  const W = 32, H = 40, FRAMES = 8;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    const ox = f * W;
    const legOffset = [0, 3, 0, -3][f % 4];
    const isJump = f === 4;
    const isHurt = f === 5;
    // cy=20 (centre of 40px frame); ear tips land at y≈7 — clear of the top edge
    drawFox(ctx, ox + 16, 20, legOffset, isJump, isHurt);
  }

  scene.textures.addSpriteSheet('fox', canvas, { frameWidth: W, frameHeight: H });
}

function drawFox(ctx, cx, cy, legOff, isJump, isHurt) {
  ctx.save();
  if (isHurt) ctx.globalAlpha = 0.75;

  // Shift body down from frame centre so the fox sits in the lower ⅔ of the frame.
  // With cy=20 (40px frame), oy=25: head at y=17, ear tips at y=7 — well clear of top.
  const oy = cy + 5;  // effective vertical centre

  const orange = isHurt ? '#FF9966' : '#FF6600';
  const cream  = '#FFF5CC';
  const pink   = '#FFAAAA';
  const dark   = '#1a0a00';

  // ── TAIL (drawn behind body) ──────────────────────────────────────────────
  // Curve from lower-back of fox sweeping upward-left, tip stays inside frame
  ctx.strokeStyle = orange; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 3, oy + 4);
  ctx.quadraticCurveTo(cx - 12, oy + 1, cx - 10, oy - 8);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - 10, oy - 9, 4, 0, Math.PI * 2);
  ctx.fill();

  // ── BODY ─────────────────────────────────────────────────────────────────
  ctx.fillStyle = orange;
  ctx.beginPath();
  ctx.ellipse(cx - 1, oy + 3, 8, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  // belly
  ctx.fillStyle = cream;
  ctx.beginPath();
  ctx.ellipse(cx, oy + 4, 4.5, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── LEGS ─────────────────────────────────────────────────────────────────
  const jy = isJump ? -3 : 0;
  ctx.fillStyle = orange;
  ctx.beginPath();
  ctx.ellipse(cx - 4, oy + 12 + legOff + jy, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 3, oy + 12 - legOff + jy, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── HEAD ─────────────────────────────────────────────────────────────────
  // head centre at y = oy - 8 = 11, giving 11px of room above for ears (tip at y≈2)
  const hx = cx + 1, hy = oy - 8;
  ctx.fillStyle = orange;
  ctx.beginPath();
  ctx.arc(hx, hy, 7, 0, Math.PI * 2);
  ctx.fill();

  // ── EARS ─────────────────────────────────────────────────────────────────
  // Back ear (left)
  ctx.fillStyle = orange;
  ctx.beginPath();
  ctx.moveTo(hx - 5, hy - 4);
  ctx.lineTo(hx - 8, hy - 10);   // tip at y = hy-10 = 1  (inside frame)
  ctx.lineTo(hx - 1, hy - 4);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = pink;
  ctx.beginPath();
  ctx.moveTo(hx - 5, hy - 5);
  ctx.lineTo(hx - 7, hy - 9);
  ctx.lineTo(hx - 2, hy - 5);
  ctx.closePath(); ctx.fill();

  // Front ear (right)
  ctx.fillStyle = orange;
  ctx.beginPath();
  ctx.moveTo(hx + 3, hy - 4);
  ctx.lineTo(hx + 6, hy - 10);   // tip at y = 1
  ctx.lineTo(hx + 8, hy - 4);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = pink;
  ctx.beginPath();
  ctx.moveTo(hx + 3, hy - 5);
  ctx.lineTo(hx + 5, hy - 9);
  ctx.lineTo(hx + 7, hy - 5);
  ctx.closePath(); ctx.fill();

  // ── MUZZLE (cream rectangle-ish snout pointing right) ────────────────────
  ctx.fillStyle = cream;
  ctx.beginPath();
  ctx.ellipse(hx + 5, hy + 2, 4.5, 2.8, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Nose — dark oval at tip of muzzle, clearly within frame (x = hx+8 = 26)
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.ellipse(hx + 8, hy + 2, 2, 1.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.arc(hx + 7.5, hy + 1.5, 0.7, 0, Math.PI * 2);
  ctx.fill();

  // ── EYE ──────────────────────────────────────────────────────────────────
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(hx + 2, hy - 2, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(hx + 2.7, hy - 2.7, 0.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── Baby Bear ───────────────────────────────────────────────────────────────
function generateBabyBear(scene) {
  const W = 32, H = 32, FRAMES = 6;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    const ox = f * W;
    const legOff = [0, 4, 0, -4][f % 4];
    const isAttack = f === 4;
    const isHurt = f === 5;
    drawBear(ctx, ox + 16, 16, legOff, isAttack, isHurt);
  }

  scene.textures.addSpriteSheet('bear', canvas, { frameWidth: W, frameHeight: H });
}

function drawBear(ctx, cx, cy, legOff, isAttack, isHurt) {
  ctx.save();
  const bodyColor = isHurt ? '#cc9944' : '#8B6914';
  const darkBrown = '#5a3c00';

  // body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 11, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // head
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(cx + 1, cy - 8, 9, 0, Math.PI * 2);
  ctx.fill();

  // muzzle
  ctx.fillStyle = '#c8a060';
  ctx.beginPath();
  ctx.ellipse(cx + 3, cy - 5, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // ears
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(cx - 6, cy - 15, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 7, cy - 15, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c8a060';
  ctx.beginPath();
  ctx.arc(cx - 6, cy - 15, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 7, cy - 15, 2, 0, Math.PI * 2);
  ctx.fill();

  // eyes
  ctx.fillStyle = darkBrown;
  ctx.beginPath();
  ctx.arc(cx - 2, cy - 9, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 5, cy - 9, 2, 0, Math.PI * 2);
  ctx.fill();

  // nose
  ctx.fillStyle = darkBrown;
  ctx.beginPath();
  ctx.ellipse(cx + 3, cy - 6, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // arms — always visible; attack frame extends arm forward
  ctx.fillStyle = bodyColor;
  if (isAttack) {
    // punching arm extended forward
    ctx.beginPath();
    ctx.ellipse(cx + 16, cy - 1, 7, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // fist / paw
    ctx.beginPath();
    ctx.arc(cx + 22, cy - 1, 5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // left arm
    ctx.beginPath();
    ctx.ellipse(cx - 11, cy - 1, 4, 6, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // right arm
    ctx.beginPath();
    ctx.ellipse(cx + 11, cy - 1, 4, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // legs
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx - 5, cy + 12 + legOff, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 5, cy + 12 - legOff, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── Steggie (Stegosaurus) ───────────────────────────────────────────────────
function generateSteggie(scene) {
  const W = 48, H = 32, FRAMES = 5;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    const ox = f * W;
    const legOff = [0, 4, 0, -4][f % 4];
    const isHurt = f === 4;
    // Clip each frame to its own rect so no drawing bleeds into adjacent frames
    ctx.save();
    ctx.beginPath();
    ctx.rect(ox, 0, W, H);
    ctx.clip();
    drawSteggie(ctx, ox + 24, 18, legOff, isHurt);
    ctx.restore();
  }

  scene.textures.addSpriteSheet('steggie', canvas, { frameWidth: W, frameHeight: H });
}

function drawSteggie(ctx, cx, cy, legOff, isHurt) {
  ctx.save();
  const green  = isHurt ? '#88cc88' : '#4A8C5C';
  const dark   = '#2d5c3a';
  const plateC = '#5ab87a';
  const tipC   = '#d06020';

  // ── TAIL (drawn first so body covers base) ──────────────────────────────
  ctx.strokeStyle = green; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy + 5);
  ctx.quadraticCurveTo(cx - 22, cy + 3, cx - 21, cy - 2);
  ctx.stroke();
  // Thagomizer — 4 short spikes radiating upward from tail tip
  ctx.fillStyle = dark;
  const tailTipX = cx - 21; const tailTipY = cy - 2;
  const spikeAngles = [-2.3, -1.9, -1.5, -1.1];
  for (const a of spikeAngles) {
    const ex = Math.max(cx - 22, tailTipX + Math.cos(a) * 9);
    const ey = tailTipY + Math.sin(a) * 9;
    ctx.beginPath();
    ctx.moveTo(tailTipX - 3, tailTipY + 3);
    ctx.lineTo(ex, ey);
    ctx.lineTo(tailTipX + 3, tailTipY - 1);
    ctx.closePath(); ctx.fill();
  }

  // ── BODY (iconic arched/humped stegosaurus shape) ───────────────────────
  ctx.fillStyle = green;
  ctx.beginPath();
  ctx.moveTo(cx - 17, cy + 8);                          // tail base
  ctx.bezierCurveTo(
    cx - 16, cy - 6, cx - 2, cy - 11, cx + 7, cy - 5   // high arched back
  );
  ctx.quadraticCurveTo(cx + 15, cy - 1, cx + 14, cy + 5); // neck slope down
  ctx.bezierCurveTo(
    cx + 10, cy + 10, cx - 10, cy + 10, cx - 17, cy + 8  // belly
  );
  ctx.closePath(); ctx.fill();

  // ── DORSAL PLATES (diamond/kite shapes — stegosaurus signature) ─────────
  // Spine position at each x based on body arch
  const spineY = (dx) => {
    const t = Math.max(0, Math.min(1, (dx + 17) / 24));
    return cy - 11 + t * 6 + (1 - Math.abs(t - 0.35) * 2.2) * 5;
  };
  const plates = [
    { dx: -11, w: 4, h:  9 },
    { dx:  -5, w: 6, h: 12 },
    { dx:  +1, w: 6, h: 12 },
    { dx:  +7, w: 4, h:  8 },
    { dx: +11, w: 3, h:  5 },
  ];
  for (const p of plates) {
    const px   = cx + p.dx;
    const py   = spineY(p.dx);
    const maxH = py - (cy - 17);          // don't clip above frame top
    const h    = Math.min(p.h, maxH);
    if (h <= 0) continue;

    // Diamond shape
    ctx.fillStyle = plateC;
    ctx.beginPath();
    ctx.moveTo(px,        py - h);           // top point
    ctx.lineTo(px + p.w,  py - h * 0.42);   // right
    ctx.lineTo(px,        py);               // base at spine
    ctx.lineTo(px - p.w,  py - h * 0.42);   // left
    ctx.closePath(); ctx.fill();

    // Orange tip
    ctx.fillStyle = tipC;
    ctx.beginPath();
    ctx.moveTo(px,              py - h);
    ctx.lineTo(px + p.w * 0.5, py - h * 0.62);
    ctx.lineTo(px - p.w * 0.5, py - h * 0.62);
    ctx.closePath(); ctx.fill();

    // Dark outline
    ctx.strokeStyle = dark; ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(px,       py - h);
    ctx.lineTo(px + p.w, py - h * 0.42);
    ctx.lineTo(px,       py);
    ctx.lineTo(px - p.w, py - h * 0.42);
    ctx.closePath(); ctx.stroke();
  }

  // ── HEAD — all-ellipse, no polygon edges that create antialiasing seams ──
  ctx.fillStyle = green;
  // Neck oval bridging body shoulder to head
  ctx.beginPath();
  ctx.ellipse(cx + 10, cy + 3, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Main head oval
  ctx.beginPath();
  ctx.ellipse(cx + 15, cy + 2, 5, 4, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // Snout — smaller forward ellipse (no polygon seam)
  ctx.beginPath();
  ctx.ellipse(cx + 19, cy + 3, 3, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Eye
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(cx + 14, cy + 0, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx + 14.6, cy - 0.5, 0.7, 0, Math.PI * 2); ctx.fill();
  // Nostril
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.arc(cx + 20, cy + 3, 0.9, 0, Math.PI * 2); ctx.fill();

  // ── LEGS (4 legs — back pair slightly taller than front) ────────────────
  ctx.fillStyle = green;
  // Back pair
  ctx.beginPath(); ctx.ellipse(cx - 10, cy + 11 + legOff, 3.5, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx - 4,  cy + 11 - legOff, 3.5, 6, 0, 0, Math.PI * 2); ctx.fill();
  // Front pair
  ctx.beginPath(); ctx.ellipse(cx + 5,  cy +  9 - legOff, 3,   5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 10, cy +  9 + legOff, 3,   5, 0, 0, Math.PI * 2); ctx.fill();
  // Foot pads
  ctx.fillStyle = dark;
  for (const [lx, ly] of [
    [cx - 10, cy + 15 + legOff],
    [cx - 4,  cy + 15 - legOff],
    [cx + 5,  cy + 12 - legOff],
    [cx + 10, cy + 12 + legOff],
  ]) {
    ctx.beginPath(); ctx.ellipse(lx, ly, 4, 2, 0, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();
}

// ─── Mama Sloth ──────────────────────────────────────────────────────────────
function generateMamaSloth(scene) {
  // Frames: 0 idle, 1-2 celebrate
  const W = 36, H = 40, FRAMES = 3;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    const ox = f * W;
    const isCelebrate = f >= 1;
    const armRaise = f === 2 ? -10 : 0;
    drawMamaSloth(ctx, ox + 18, 22, isCelebrate, armRaise);
  }

  scene.textures.addSpriteSheet('mamasloth', canvas, { frameWidth: W, frameHeight: H });
}

function drawMamaSloth(ctx, cx, cy, celebrate, armRaise) {
  ctx.save();

  const furColor    = '#9aaa88';  // grey-green sloth fur
  const bellyColor  = '#c8d4b0';  // lighter belly
  const faceColor   = '#d4c8a0';  // warm cream face mask
  const clawColor   = '#5a4a2a';  // dark brown claws
  const noseColor   = '#7a5a44';

  // body — round, heavy-looking
  ctx.fillStyle = furColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 11, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // belly patch
  ctx.fillStyle = bellyColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 4, 6, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // head — large and round like a real sloth
  ctx.fillStyle = furColor;
  ctx.beginPath();
  ctx.arc(cx, cy - 11, 11, 0, Math.PI * 2);
  ctx.fill();

  // face mask (cream circle)
  ctx.fillStyle = faceColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 10, 7, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // dark eye rings (sloths have dark patches around eyes)
  ctx.fillStyle = '#6a5a40';
  ctx.beginPath();
  ctx.arc(cx - 3, cy - 13, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 3, cy - 13, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // eyes — droopy/sleepy looking (half-moon shape)
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(cx - 3, cy - 13, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 3, cy - 13, 2, 0, Math.PI * 2);
  ctx.fill();
  // sleepy drooping eyelid lines
  ctx.strokeStyle = '#4a3a20'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx - 3, cy - 13, 2, Math.PI + 0.3, 0 - 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + 3, cy - 13, 2, Math.PI + 0.3, 0 - 0.3);
  ctx.stroke();

  // eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx - 2.2, cy - 14, 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 3.8, cy - 14, 0.7, 0, Math.PI * 2);
  ctx.fill();

  // nose — small round
  ctx.fillStyle = noseColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 8, 2.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // smile — gentle
  ctx.strokeStyle = noseColor; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy - 6, 3, 0.15, Math.PI - 0.15);
  ctx.stroke();

  // arms with LONG CURVED CLAWS (signature sloth feature)
  ctx.fillStyle = furColor;
  const armAngle = celebrate ? (armRaise < -5 ? -0.8 : -0.4) : 0.3;
  const armYL = celebrate ? cy - 2 + armRaise : cy + 2;
  const armYR = celebrate ? cy - 2 + armRaise : cy + 2;

  // left arm
  ctx.beginPath();
  ctx.ellipse(cx - 13, armYL, 4, 7, armAngle, 0, Math.PI * 2);
  ctx.fill();
  // left claws — 3 long curved claws
  ctx.strokeStyle = clawColor; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
  for (let c = -1; c <= 1; c++) {
    const clawStartX = cx - 13 + c * 2;
    const clawStartY = armYL + 7;
    ctx.beginPath();
    ctx.moveTo(clawStartX, clawStartY);
    ctx.quadraticCurveTo(clawStartX - 2, clawStartY + 5, clawStartX + 1, clawStartY + 7);
    ctx.stroke();
  }

  // right arm
  ctx.fillStyle = furColor;
  ctx.beginPath();
  ctx.ellipse(cx + 13, armYR, 4, 7, -armAngle, 0, Math.PI * 2);
  ctx.fill();
  // right claws
  for (let c = -1; c <= 1; c++) {
    const clawStartX = cx + 13 + c * 2;
    const clawStartY = armYR + 7;
    ctx.beginPath();
    ctx.moveTo(clawStartX, clawStartY);
    ctx.quadraticCurveTo(clawStartX + 2, clawStartY + 5, clawStartX - 1, clawStartY + 7);
    ctx.stroke();
  }

  // legs — short and stubby
  ctx.fillStyle = furColor;
  ctx.beginPath();
  ctx.ellipse(cx - 5, cy + 13, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 5, cy + 13, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // foot claws
  ctx.strokeStyle = clawColor; ctx.lineWidth = 1.5;
  for (const fx of [cx - 5, cx + 5]) {
    for (let c = -1; c <= 1; c++) {
      ctx.beginPath();
      ctx.moveTo(fx + c * 2, cy + 17);
      ctx.quadraticCurveTo(fx + c * 2, cy + 21, fx + c * 2 + (c >= 0 ? 2 : -2), cy + 22);
      ctx.stroke();
    }
  }

  ctx.restore();
}

// ─── Mama Sloth Companion (walk + hurt sprite sheet) ────────────────────────
function generateMamaSlothCompanion(scene) {
  // Frames: 0-3 walk, 4 hurt
  const W = 36, H = 40, FRAMES = 5;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    const ox = f * W;
    const legOff = [0, 4, 0, -4][f % 4];
    const isHurt = f === 4;
    drawMamaSlothComp(ctx, ox + 18, 22, legOff, isHurt);
  }

  scene.textures.addSpriteSheet('mamasloth_comp', canvas, { frameWidth: W, frameHeight: H });
}

function drawMamaSlothComp(ctx, cx, cy, legOff, isHurt) {
  ctx.save();

  const furColor   = isHurt ? '#ccddc0' : '#9aaa88';
  const bellyColor = '#c8d4b0';
  const faceColor  = '#d4c8a0';
  const clawColor  = '#5a4a2a';
  const noseColor  = '#7a5a44';

  // body
  ctx.fillStyle = furColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 11, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // belly
  ctx.fillStyle = bellyColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 4, 6, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // head
  ctx.fillStyle = furColor;
  ctx.beginPath();
  ctx.arc(cx, cy - 11, 11, 0, Math.PI * 2);
  ctx.fill();

  // face mask
  ctx.fillStyle = faceColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 10, 7, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // dark eye rings
  ctx.fillStyle = '#6a5a40';
  ctx.beginPath(); ctx.arc(cx - 3, cy - 13, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 3, cy - 13, 3.5, 0, Math.PI * 2); ctx.fill();

  // eyes
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(cx - 3, cy - 13, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 3, cy - 13, 2, 0, Math.PI * 2); ctx.fill();

  // eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx - 2.2, cy - 14, 0.7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 3.8, cy - 14, 0.7, 0, Math.PI * 2); ctx.fill();

  // nose
  ctx.fillStyle = noseColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 8, 2.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // arms with claws — walking animation
  ctx.fillStyle = furColor;
  const armAngle = 0.3;
  ctx.beginPath();
  ctx.ellipse(cx - 13, cy + 2 + legOff * 0.5, 4, 7, armAngle, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = clawColor; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
  for (let c = -1; c <= 1; c++) {
    const sx = cx - 13 + c * 2; const sy = cy + 8 + legOff * 0.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(sx - 2, sy + 5, sx + 1, sy + 7);
    ctx.stroke();
  }

  ctx.fillStyle = furColor;
  ctx.beginPath();
  ctx.ellipse(cx + 13, cy + 2 - legOff * 0.5, 4, 7, -armAngle, 0, Math.PI * 2);
  ctx.fill();
  for (let c = -1; c <= 1; c++) {
    const sx = cx + 13 + c * 2; const sy = cy + 8 - legOff * 0.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(sx + 2, sy + 5, sx - 1, sy + 7);
    ctx.stroke();
  }

  // legs
  ctx.fillStyle = furColor;
  ctx.beginPath(); ctx.ellipse(cx - 5, cy + 13 + legOff, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 5, cy + 13 - legOff, 4, 5, 0, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ─── Fluffy Bunny (rescue target) ────────────────────────────────────────────
function generateFluffyBunny(scene) {
  // Frames: 0 idle, 1 happy (ears up), 2 celebrate
  const W = 30, H = 38, FRAMES = 3;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    drawFluffyBunny(ctx, f * W + 15, 28, f);
  }

  scene.textures.addSpriteSheet('bunny', canvas, { frameWidth: W, frameHeight: H });
}

function drawFluffyBunny(ctx, cx, cy, frame) {
  ctx.save();

  const white  = '#f8f8ff';
  const pink   = '#ffb3cc';
  const darkPk = '#cc6688';
  const grey   = '#dde4f0';

  // Ears — long floppy bunny ears
  const earLift = frame === 1 ? -4 : (frame === 2 ? -6 : 0);
  // Left ear
  ctx.fillStyle = white;
  ctx.beginPath();
  ctx.ellipse(cx - 7, cy - 18 + earLift, 4, 12, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = pink;
  ctx.beginPath();
  ctx.ellipse(cx - 7, cy - 18 + earLift, 2, 9, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Right ear
  ctx.fillStyle = white;
  ctx.beginPath();
  ctx.ellipse(cx + 7, cy - 18 + earLift, 4, 12, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = pink;
  ctx.beginPath();
  ctx.ellipse(cx + 7, cy - 18 + earLift, 2, 9, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Body — fluffy round
  ctx.fillStyle = white;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 11, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly fluff — slightly lighter circle
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 6.5, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fluffy tail — small circle at back
  ctx.fillStyle = white;
  ctx.beginPath();
  ctx.arc(cx - 10, cy + 2, 4, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = white;
  ctx.beginPath();
  ctx.arc(cx, cy - 12, 10, 0, Math.PI * 2);
  ctx.fill();

  // Chubby cheeks
  ctx.fillStyle = 'rgba(255,180,200,0.4)';
  ctx.beginPath(); ctx.arc(cx - 5, cy - 10, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 5, cy - 10, 4, 0, Math.PI * 2); ctx.fill();

  // Eyes — large, sparkling, adorable
  ctx.fillStyle = '#1a0a2a';
  ctx.beginPath(); ctx.arc(cx - 3.5, cy - 13, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 3.5, cy - 13, 3, 0, Math.PI * 2); ctx.fill();
  // Large sparkle
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(cx - 2, cy - 14.5, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 5, cy - 14.5, 1.4, 0, Math.PI * 2); ctx.fill();
  // Tiny secondary sparkle
  ctx.beginPath(); ctx.arc(cx - 3.5, cy - 11.5, 0.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 3.5, cy - 11.5, 0.6, 0, Math.PI * 2); ctx.fill();

  // Nose — tiny pink heart-shaped
  ctx.fillStyle = darkPk;
  ctx.beginPath();
  ctx.arc(cx - 1, cy - 8.5, 1.5, Math.PI, 0);
  ctx.arc(cx + 1, cy - 8.5, 1.5, Math.PI, 0);
  ctx.lineTo(cx, cy - 5.5);
  ctx.closePath();
  ctx.fill();

  // Smile — big happy smile on celebrate/happy frames
  ctx.strokeStyle = darkPk; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
  if (frame >= 1) {
    ctx.beginPath();
    ctx.arc(cx, cy - 6.5, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy - 7, 3, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  // Short little arms — up on celebrate
  ctx.fillStyle = white;
  if (frame === 2) {
    // arms up
    ctx.beginPath(); ctx.ellipse(cx - 10, cy - 5, 3, 6, -0.7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 10, cy - 5, 3, 6,  0.7, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.beginPath(); ctx.ellipse(cx - 10, cy + 2, 3, 5, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 10, cy + 2, 3, 5, -0.2, 0, Math.PI * 2); ctx.fill();
  }

  // Tiny feet
  ctx.fillStyle = grey;
  ctx.beginPath(); ctx.ellipse(cx - 5, cy + 10, 4, 3, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 5, cy + 10, 4, 3,  0.2, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ─── Ammo Pickup ─────────────────────────────────────────────────────────────
function generateAmmoPickup(scene) {
  const W = 28, H = 28;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // outer glowing ring
  ctx.strokeStyle = '#ffe066';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(14, 14, 13, 0, Math.PI * 2);
  ctx.stroke();

  // crate body — gold
  ctx.fillStyle = '#c89000';
  ctx.fillRect(4, 6, 20, 16);
  ctx.fillStyle = '#f0c020';
  ctx.fillRect(5, 7, 18, 14);

  // border
  ctx.strokeStyle = '#8a6000';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(4, 6, 20, 16);

  // cross braces
  ctx.strokeStyle = '#c89000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(14, 6); ctx.lineTo(14, 22);
  ctx.moveTo(4, 14); ctx.lineTo(24, 14);
  ctx.stroke();

  // star icon in center
  ctx.fillStyle = '#5a3500';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 14, 14);

  // "+10" label above
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 6px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('+10', 14, 6);

  scene.textures.addImage('ammo_pickup', canvas);
}
