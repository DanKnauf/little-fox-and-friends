export function generateCharacterTextures(scene) {
  generateLittleFox(scene);
  generateBabyBear(scene);
  generateSteggie(scene);
  generateMamaSloth(scene);
  generateAmmoPickup(scene);
}

// ─── Little Fox ──────────────────────────────────────────────────────────────
function generateLittleFox(scene) {
  // Spritesheet: 8 frames × 32px = 256 wide, 32 tall
  // Frames: 0-3 walk, 4 jump, 5 hurt, 6 idle, 7 shoot
  const W = 32, H = 32, FRAMES = 8;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    const ox = f * W;
    const legOffset = [0, 3, 0, -3][f % 4];
    const isJump = f === 4;
    const isHurt = f === 5;
    drawFox(ctx, ox + 16, 16, legOffset, isJump, isHurt);
  }

  scene.textures.addSpriteSheet('fox', canvas, { frameWidth: W, frameHeight: H });
}

function drawFox(ctx, cx, cy, legOff, isJump, isHurt) {
  ctx.save();
  if (isHurt) ctx.globalAlpha = 0.7;

  const bodyColor  = isHurt ? '#ff7744' : '#D4621A'; // rust-orange
  const bellyColor = '#f0c080';  // warm cream belly
  const earInner   = '#ffaaaa';  // pink inner ear
  const muzzleColor = '#f0c080'; // cream muzzle

  // ── TAIL (behind body, drawn first) ─────────────────────────────────────────
  ctx.strokeStyle = bodyColor; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy + 5);
  ctx.quadraticCurveTo(cx - 22, cy + 2, cx - 20, cy - 10);
  ctx.stroke();
  // white fluffy tip
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - 20, cy - 10, 6, 0, Math.PI * 2);
  ctx.fill();
  // light grey outline on tip
  ctx.strokeStyle = '#dddddd'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx - 20, cy - 10, 6, 0, Math.PI * 2);
  ctx.stroke();

  // ── BODY ────────────────────────────────────────────────────────────────────
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 3, 9, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // belly / chest patch
  ctx.fillStyle = bellyColor;
  ctx.beginPath();
  ctx.ellipse(cx + 1, cy + 5, 5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── HEAD ────────────────────────────────────────────────────────────────────
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx + 2, cy - 8, 8, 7, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // white face mask (forehead + eye area)
  ctx.fillStyle = bellyColor;
  ctx.beginPath();
  ctx.ellipse(cx + 2, cy - 10, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── EARS (large pointed triangles) ──────────────────────────────────────────
  // left ear
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(cx - 3, cy - 13);
  ctx.lineTo(cx - 9, cy - 24);
  ctx.lineTo(cx + 2, cy - 14);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = earInner;
  ctx.beginPath();
  ctx.moveTo(cx - 3, cy - 14);
  ctx.lineTo(cx - 7, cy - 22);
  ctx.lineTo(cx + 1, cy - 15);
  ctx.closePath(); ctx.fill();

  // right ear
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(cx + 5, cy - 13);
  ctx.lineTo(cx + 12, cy - 23);
  ctx.lineTo(cx + 11, cy - 13);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = earInner;
  ctx.beginPath();
  ctx.moveTo(cx + 6, cy - 14);
  ctx.lineTo(cx + 11, cy - 21);
  ctx.lineTo(cx + 10, cy - 14);
  ctx.closePath(); ctx.fill();

  // ── SNOUT / MUZZLE (elongated, pointed) ─────────────────────────────────────
  ctx.fillStyle = muzzleColor;
  ctx.beginPath();
  ctx.ellipse(cx + 7, cy - 7, 6, 3.5, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // black nose tip — at the front of the muzzle, well within frame
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.ellipse(cx + 11, cy - 7, 2, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // tiny nose highlight
  ctx.fillStyle = '#444';
  ctx.beginPath();
  ctx.arc(cx + 10.5, cy - 7.5, 0.7, 0, Math.PI * 2);
  ctx.fill();

  // ── EYES ────────────────────────────────────────────────────────────────────
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(cx + 1, cy - 11, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 6, cy - 11, 2, 0, Math.PI * 2);
  ctx.fill();
  // eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx + 2, cy - 12, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 7, cy - 12, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // ── LEGS ────────────────────────────────────────────────────────────────────
  const jumpY = isJump ? -3 : 0;
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx - 4, cy + 12 + legOff + jumpY, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 4, cy + 12 - legOff + jumpY, 3, 5, 0, 0, Math.PI * 2);
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

  // attack paw
  if (isAttack) {
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(cx + 18, cy, 6, 5, 0, 0, Math.PI * 2);
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
    drawSteggie(ctx, ox + 24, 18, legOff, isHurt);
  }

  scene.textures.addSpriteSheet('steggie', canvas, { frameWidth: W, frameHeight: H });
}

function drawSteggie(ctx, cx, cy, legOff, isHurt) {
  ctx.save();
  const bodyColor = isHurt ? '#88cc88' : '#4A8C5C';
  const plateColor = '#2d7a6e';

  // body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 18, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // back plates (more prominent, teal/orange tips)
  const platePositions = [-10, 0, 10];
  for (let pi = 0; pi < platePositions.length; pi++) {
    const px = platePositions[pi];
    ctx.fillStyle = plateColor;
    ctx.beginPath();
    ctx.moveTo(cx + px - 4, cy - 4);
    ctx.lineTo(cx + px, cy - 16);
    ctx.lineTo(cx + px + 4, cy - 4);
    ctx.fill();
    // orange tip
    ctx.fillStyle = '#e07030';
    ctx.beginPath();
    ctx.moveTo(cx + px - 2, cy - 10);
    ctx.lineTo(cx + px, cy - 16);
    ctx.lineTo(cx + px + 2, cy - 10);
    ctx.fill();
  }

  // head
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx + 18, cy - 2, 7, 6, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // eye
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(cx + 23, cy - 4, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx + 23.5, cy - 4.5, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // tail with spikes
  ctx.strokeStyle = bodyColor; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx - 16, cy + 2);
  ctx.quadraticCurveTo(cx - 26, cy + 8, cx - 24, cy + 4);
  ctx.stroke();
  // tail spikes
  ctx.fillStyle = '#2d7a6e';
  ctx.beginPath(); ctx.moveTo(cx - 22, cy + 2); ctx.lineTo(cx - 26, cy - 2); ctx.lineTo(cx - 20, cy + 4); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx - 19, cy + 3); ctx.lineTo(cx - 24, cy + 0); ctx.lineTo(cx - 17, cy + 5); ctx.fill();

  // legs
  ctx.fillStyle = bodyColor;
  const legXs = [-10, -4, 4, 10];
  for (let i = 0; i < 4; i++) {
    const off = (i % 2 === 0) ? legOff : -legOff;
    ctx.beginPath();
    ctx.ellipse(cx + legXs[i], cy + 10 + off, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // toe claws
    ctx.fillStyle = '#3a6a4a';
    ctx.beginPath();
    ctx.ellipse(cx + legXs[i], cy + 14 + off, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bodyColor;
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
