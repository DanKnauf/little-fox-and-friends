export function generateCharacterTextures(scene) {
  generateLittleFox(scene);
  generateBabyBear(scene);
  generateStegge(scene);
  generateMamoslav(scene);
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

  const bodyColor = isHurt ? '#ff6644' : '#E8722A';
  const earColor  = '#E8722A';
  const bellyColor = '#f5c89a';

  // tail
  ctx.strokeStyle = bodyColor; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy + 4);
  ctx.quadraticCurveTo(cx - 18, cy - 4, cx - 14, cy - 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx - 14, cy - 10, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#fff'; ctx.fill();

  // body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 10, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // belly
  ctx.fillStyle = bellyColor;
  ctx.beginPath();
  ctx.ellipse(cx + 1, cy + 5, 5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // head
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx + 2, cy - 8, 9, 8, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // ears
  ctx.fillStyle = earColor;
  ctx.beginPath();
  ctx.moveTo(cx - 2, cy - 14);
  ctx.lineTo(cx - 7, cy - 22);
  ctx.lineTo(cx + 2, cy - 15);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 4, cy - 14);
  ctx.lineTo(cx + 9, cy - 21);
  ctx.lineTo(cx + 10, cy - 14);
  ctx.fill();

  // eyes
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(cx + 1, cy - 9, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 7, cy - 9, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx + 2, cy - 10, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 8, cy - 10, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // nose
  ctx.fillStyle = '#c0501a';
  ctx.beginPath();
  ctx.ellipse(cx + 9, cy - 7, 2, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs
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

// ─── Stegge (Stegosaurus) ────────────────────────────────────────────────────
function generateStegge(scene) {
  const W = 48, H = 32, FRAMES = 5;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    const ox = f * W;
    const legOff = [0, 4, 0, -4][f % 4];
    const isHurt = f === 4;
    drawStegge(ctx, ox + 24, 18, legOff, isHurt);
  }

  scene.textures.addSpriteSheet('stegge', canvas, { frameWidth: W, frameHeight: H });
}

function drawStegge(ctx, cx, cy, legOff, isHurt) {
  ctx.save();
  const bodyColor = isHurt ? '#88cc88' : '#4A8C5C';
  const plateColor = '#2d7a6e';

  // body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 18, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // back plates
  const platePositions = [-10, 0, 10];
  for (const px of platePositions) {
    ctx.fillStyle = plateColor;
    ctx.beginPath();
    ctx.moveTo(cx + px - 4, cy - 4);
    ctx.lineTo(cx + px, cy - 14);
    ctx.lineTo(cx + px + 4, cy - 4);
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

  // tail
  ctx.strokeStyle = bodyColor; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx - 16, cy + 2);
  ctx.quadraticCurveTo(cx - 26, cy + 8, cx - 24, cy + 4);
  ctx.stroke();

  // legs
  ctx.fillStyle = bodyColor;
  const legXs = [-10, -4, 4, 10];
  for (let i = 0; i < 4; i++) {
    const off = (i % 2 === 0) ? legOff : -legOff;
    ctx.beginPath();
    ctx.ellipse(cx + legXs[i], cy + 10 + off, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ─── Mamoslav ────────────────────────────────────────────────────────────────
function generateMamoslav(scene) {
  const W = 32, H = 36, FRAMES = 3;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    const ox = f * W;
    const isCelebrate = f >= 1;
    const armRaise = f === 2 ? -8 : 0;
    drawMamoslav(ctx, ox + 16, 18, isCelebrate, armRaise);
  }

  scene.textures.addSpriteSheet('mamoslav', canvas, { frameWidth: W, frameHeight: H });
}

function drawMamoslav(ctx, cx, cy, celebrate, armRaise) {
  ctx.save();
  // body
  ctx.fillStyle = '#f5c8d8';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 4, 10, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // head
  ctx.fillStyle = '#fce0e8';
  ctx.beginPath();
  ctx.arc(cx, cy - 8, 12, 0, Math.PI * 2);
  ctx.fill();

  // ears / bun
  ctx.fillStyle = '#f5c8d8';
  ctx.beginPath();
  ctx.arc(cx - 8, cy - 18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 8, cy - 18, 5, 0, Math.PI * 2);
  ctx.fill();

  // eyes - happy arc
  ctx.strokeStyle = '#884466'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx - 4, cy - 8, 3, Math.PI * 0.1, Math.PI * 0.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + 4, cy - 8, 3, Math.PI * 0.1, Math.PI * 0.9);
  ctx.stroke();

  // cheeks
  ctx.fillStyle = 'rgba(255,120,120,0.3)';
  ctx.beginPath();
  ctx.arc(cx - 6, cy - 6, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 6, cy - 6, 3, 0, Math.PI * 2);
  ctx.fill();

  // smile
  ctx.strokeStyle = '#884466'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy - 4, 4, 0.1, Math.PI - 0.1);
  ctx.stroke();

  // arms
  ctx.fillStyle = '#f5c8d8';
  const armY = celebrate ? cy + 2 + armRaise : cy + 4;
  ctx.beginPath();
  ctx.ellipse(cx - 14, armY, 4, 6, celebrate ? -0.5 : 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 14, armY, 4, 6, celebrate ? 0.5 : 0, 0, Math.PI * 2);
  ctx.fill();

  // legs
  ctx.fillStyle = '#f5c8d8';
  ctx.beginPath();
  ctx.ellipse(cx - 5, cy + 14, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 5, cy + 14, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
