export function generateEnemyTextures(scene) {
  generateSpiders(scene);
  generateEvilBirds(scene);
  generateCreepers(scene);
}

const SKINS = {
  spider: {
    forest: { body: '#5a2d0c', leg: '#3a1a00' },
    desert: { body: '#c8a060', leg: '#8B6914' },
    ocean:  { body: '#2266aa', leg: '#113355' }
  },
  bird: {
    forest: { body: '#334422', wing: '#223311' },
    desert: { body: '#cc4422', wing: '#882211' },
    ocean:  { body: '#eeeeff', wing: '#aaaacc' }
  },
  creeper: {
    forest: { body: '#226622', face: '#114411' },
    desert: { body: '#cc7700', face: '#884400' },
    ocean:  { body: '#883399', face: '#551166' }
  }
};

function generateSpiders(scene) {
  for (const [level, colors] of Object.entries(SKINS.spider)) {
    // 2 frame animation (legs wiggle)
    const W = 28, H = 24, FRAMES = 2;
    const canvas = document.createElement('canvas');
    canvas.width = W * FRAMES; canvas.height = H;
    const ctx = canvas.getContext('2d');

    for (let f = 0; f < FRAMES; f++) {
      drawSpider(ctx, f * W + 14, 12, colors, f);
    }
    scene.textures.addSpriteSheet(`spider_${level}`, canvas, { frameWidth: W, frameHeight: H });
  }
}

function drawSpider(ctx, cx, cy, colors, frame) {
  ctx.save();
  const legSpread = frame === 0 ? 1 : 0.85;

  // legs
  ctx.strokeStyle = colors.leg; ctx.lineWidth = 2;
  const angles = [-Math.PI * 0.7, -Math.PI * 0.5, -Math.PI * 0.3, -Math.PI * 0.15,
                   Math.PI * 0.15, Math.PI * 0.3, Math.PI * 0.5, Math.PI * 0.7];
  for (const a of angles) {
    const ex = cx + Math.cos(a) * 11 * legSpread;
    const ey = cy + Math.sin(a) * 7 * legSpread + (frame ? 2 : 0);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo((cx + ex) / 2, cy + 3);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  }

  // body
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // head
  ctx.beginPath();
  ctx.ellipse(cx + 5, cy - 1, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // eyes
  ctx.fillStyle = '#ff0';
  ctx.beginPath(); ctx.arc(cx + 4, cy - 2, 1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 7, cy - 2, 1, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

function generateEvilBirds(scene) {
  for (const [level, colors] of Object.entries(SKINS.bird)) {
    const W = 32, H = 28, FRAMES = 3;
    const canvas = document.createElement('canvas');
    canvas.width = W * FRAMES; canvas.height = H;
    const ctx = canvas.getContext('2d');

    for (let f = 0; f < FRAMES; f++) {
      drawBird(ctx, f * W + 16, 14, colors, f);
    }
    scene.textures.addSpriteSheet(`bird_${level}`, canvas, { frameWidth: W, frameHeight: H });
  }
}

function drawBird(ctx, cx, cy, colors, frame) {
  ctx.save();
  const flapAngle = frame === 0 ? -0.4 : frame === 1 ? 0 : 0.4;

  // wings
  ctx.fillStyle = colors.wing;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(flapAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-16, -4 + frame * 2);
  ctx.lineTo(-8, 4);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-flapAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(16, -4 + frame * 2);
  ctx.lineTo(8, 4);
  ctx.fill();
  ctx.restore();

  // body
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // head
  ctx.beginPath();
  ctx.arc(cx + 7, cy - 1, 5, 0, Math.PI * 2);
  ctx.fill();

  // beak
  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.moveTo(cx + 11, cy - 1);
  ctx.lineTo(cx + 16, cy);
  ctx.lineTo(cx + 11, cy + 2);
  ctx.fill();

  // angry eye
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(cx + 9, cy - 2, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(cx + 9, cy - 2, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function generateCreepers(scene) {
  for (const [level, colors] of Object.entries(SKINS.creeper)) {
    const W = 28, H = 32, FRAMES = 3;
    const canvas = document.createElement('canvas');
    canvas.width = W * FRAMES; canvas.height = H;
    const ctx = canvas.getContext('2d');

    for (let f = 0; f < FRAMES; f++) {
      drawCreeper(ctx, f * W + 14, 16, colors, f);
    }
    scene.textures.addSpriteSheet(`creeper_${level}`, canvas, { frameWidth: W, frameHeight: H });
  }
}

function drawCreeper(ctx, cx, cy, colors, frame) {
  ctx.save();
  const legOff = [0, 3, -3][frame] || 0;
  const chargeScale = frame === 2 ? 1.1 : 1;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(chargeScale, chargeScale);
  ctx.translate(-cx, -cy);

  // body
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.roundRect(cx - 10, cy - 10, 20, 20, 3);
  ctx.fill();

  // face
  ctx.fillStyle = colors.face;
  // eyes
  ctx.fillRect(cx - 7, cy - 6, 4, 4);
  ctx.fillRect(cx + 3, cy - 6, 4, 4);
  // angry mouth
  ctx.fillRect(cx - 6, cy + 2, 4, 5);
  ctx.fillRect(cx - 1, cy + 4, 2, 3);
  ctx.fillRect(cx + 2, cy + 2, 4, 5);

  ctx.restore();

  // legs
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx - 5, cy + 14 + legOff, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 5, cy + 14 - legOff, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
