export function generateEnemyTextures(scene) {
  generateSpiders(scene);
  generateEvilBirds(scene);
  generateCreepers(scene);
  generatePoopProjectile(scene);
}

const SKINS = {
  spider: {
    forest:  { body: '#5a2d0c', leg: '#3a1a00' },
    desert:  { body: '#c8a060', leg: '#8B6914' },
    ocean:   { body: '#2266aa', leg: '#113355' },
    volcano: { body: '#7a4010', leg: '#3a1a00' }  // Compsognathus — earthy orange-brown
  },
  bird: {
    forest:  { body: '#334422', wing: '#223311' },
    desert:  { body: '#cc4422', wing: '#882211' },
    ocean:   { body: '#eeeeff', wing: '#aaaacc' },
    volcano: { body: '#6a3a1a', wing: '#3a1a00' }  // Pterodactyl — leathery brown
  },
  creeper: {
    forest:  { body: '#226622', face: '#114411' },
    desert:  { body: '#cc7700', face: '#884400' },
    ocean:   { body: '#883399', face: '#551166' },
    volcano: { body: '#4a6622', face: '#2a3a10' }  // Velociraptor — dark olive green
  }
};

// ─── Spider / Compsognathus ───────────────────────────────────────────────────
function generateSpiders(scene) {
  for (const [level, colors] of Object.entries(SKINS.spider)) {
    const W = 28, H = 24, FRAMES = 2;
    const canvas = document.createElement('canvas');
    canvas.width = W * FRAMES; canvas.height = H;
    const ctx = canvas.getContext('2d');

    for (let f = 0; f < FRAMES; f++) {
      if (level === 'volcano') {
        drawCompsognathus(ctx, f * W + 14, 12, colors, f);
      } else {
        drawSpider(ctx, f * W + 14, 12, colors, f);
      }
    }
    scene.textures.addSpriteSheet(`spider_${level}`, canvas, { frameWidth: W, frameHeight: H });
  }
}

function drawSpider(ctx, cx, cy, colors, frame) {
  ctx.save();
  const legSpread = frame === 0 ? 1 : 0.85;

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

  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 5, cy - 1, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ff0';
  ctx.beginPath(); ctx.arc(cx + 4, cy - 2, 1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 7, cy - 2, 1, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// Compsognathus — tiny bipedal dino (runs on two legs, tiny arms)
function drawCompsognathus(ctx, cx, cy, colors, frame) {
  ctx.save();
  const legOff = frame === 0 ? 3 : -3;

  // tail — long and tapered
  ctx.strokeStyle = colors.body; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 4, cy + 2);
  ctx.quadraticCurveTo(cx - 10, cy + 1, cx - 12, cy - 3);
  ctx.stroke();

  // body — small oval
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 1, 6, 5, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // neck + head
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx + 5, cy - 4, 3.5, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // snout (pointy)
  ctx.fillStyle = colors.leg;
  ctx.beginPath();
  ctx.moveTo(cx + 7, cy - 4);
  ctx.lineTo(cx + 12, cy - 5);
  ctx.lineTo(cx + 11, cy - 3);
  ctx.closePath(); ctx.fill();

  // eye
  ctx.fillStyle = '#ff4400';
  ctx.beginPath(); ctx.arc(cx + 7, cy - 5, 1.2, 0, Math.PI * 2); ctx.fill();

  // tiny front arms
  ctx.strokeStyle = colors.body; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + 2, cy - 1);
  ctx.lineTo(cx + 5, cy + 2);
  ctx.stroke();

  // two back legs
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx - 2, cy + 6 + legOff, 2, 5, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 2, cy + 6 - legOff, 2, 5, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── Evil Bird / Pterodactyl ─────────────────────────────────────────────────
function generateEvilBirds(scene) {
  for (const [level, colors] of Object.entries(SKINS.bird)) {
    const W = 32, H = 28, FRAMES = 3;
    const canvas = document.createElement('canvas');
    canvas.width = W * FRAMES; canvas.height = H;
    const ctx = canvas.getContext('2d');

    for (let f = 0; f < FRAMES; f++) {
      if (level === 'volcano') {
        drawPterodactyl(ctx, f * W + 16, 14, colors, f);
      } else {
        drawBird(ctx, f * W + 16, 14, colors, f);
      }
    }
    scene.textures.addSpriteSheet(`bird_${level}`, canvas, { frameWidth: W, frameHeight: H });
  }
}

function drawBird(ctx, cx, cy, colors, frame) {
  ctx.save();
  const flapAngle = frame === 0 ? -0.4 : frame === 1 ? 0 : 0.4;

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

  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 7, cy - 1, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.moveTo(cx + 11, cy - 1);
  ctx.lineTo(cx + 16, cy);
  ctx.lineTo(cx + 11, cy + 2);
  ctx.fill();

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

// Pterodactyl — leathery wings, long beak/crest, no feathers
function drawPterodactyl(ctx, cx, cy, colors, frame) {
  ctx.save();
  const flapAngle = frame === 0 ? -0.5 : frame === 1 ? 0 : 0.5;

  // leathery wings (triangular, pointed)
  ctx.fillStyle = colors.wing;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(flapAngle);
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.lineTo(-15, -6 + frame);
  ctx.lineTo(-14, 5);
  ctx.lineTo(-6, 8);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-flapAngle);
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.lineTo(15, -6 + frame);
  ctx.lineTo(14, 5);
  ctx.lineTo(6, 8);
  ctx.fill();
  ctx.restore();

  // body — slim
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 3, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // head with crest
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.arc(cx + 6, cy, 4, 0, Math.PI * 2);
  ctx.fill();
  // bony crest on top of head
  ctx.fillStyle = colors.wing;
  ctx.beginPath();
  ctx.moveTo(cx + 4, cy - 3);
  ctx.lineTo(cx + 1, cy - 9);
  ctx.lineTo(cx + 8, cy - 2);
  ctx.closePath(); ctx.fill();
  // long beak
  ctx.fillStyle = '#aa6600';
  ctx.beginPath();
  ctx.moveTo(cx + 9, cy - 1);
  ctx.lineTo(cx + 16, cy);
  ctx.lineTo(cx + 9, cy + 1.5);
  ctx.closePath(); ctx.fill();

  // angry eye — red
  ctx.fillStyle = '#ff2200';
  ctx.beginPath();
  ctx.arc(cx + 7, cy - 1, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(cx + 7, cy - 1, 0.9, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── Creeper / Velociraptor ──────────────────────────────────────────────────
function generateCreepers(scene) {
  for (const [level, colors] of Object.entries(SKINS.creeper)) {
    const W = 28, H = 32, FRAMES = 3;
    const canvas = document.createElement('canvas');
    canvas.width = W * FRAMES; canvas.height = H;
    const ctx = canvas.getContext('2d');

    for (let f = 0; f < FRAMES; f++) {
      if (level === 'volcano') {
        drawVelociraptor(ctx, f * W + 14, 16, colors, f);
      } else {
        drawCreeper(ctx, f * W + 14, 16, colors, f);
      }
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

  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.roundRect(cx - 10, cy - 10, 20, 20, 3);
  ctx.fill();

  ctx.fillStyle = colors.face;
  ctx.fillRect(cx - 7, cy - 6, 4, 4);
  ctx.fillRect(cx + 3, cy - 6, 4, 4);
  ctx.fillRect(cx - 6, cy + 2, 4, 5);
  ctx.fillRect(cx - 1, cy + 4, 2, 3);
  ctx.fillRect(cx + 2, cy + 2, 4, 5);

  ctx.restore();

  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx - 5, cy + 14 + legOff, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 5, cy + 14 - legOff, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Velociraptor — bipedal, sickle claw, feathered, menacing
function drawVelociraptor(ctx, cx, cy, colors, frame) {
  ctx.save();
  const legOff = [0, 4, -4][frame] || 0;
  const isCharge = frame === 2;

  // tail — horizontal, balancing
  ctx.strokeStyle = colors.body; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy + 2);
  ctx.quadraticCurveTo(cx - 12, cy, cx - 13, cy - 4);
  ctx.stroke();

  // body — lean, forward-tilted
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 1, 7, 9, isCharge ? -0.3 : -0.15, 0, Math.PI * 2);
  ctx.fill();

  // feather pattern on back
  ctx.strokeStyle = colors.face; ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - 4 + i * 3, cy - 5);
    ctx.lineTo(cx - 7 + i * 3, cy - 10);
    ctx.stroke();
  }

  // neck + head — low-slung, aggressive
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx + 6, cy - 6, 4, 3.5, 0.4, 0, Math.PI * 2);
  ctx.fill();
  // snout with teeth
  ctx.fillStyle = colors.face;
  ctx.beginPath();
  ctx.moveTo(cx + 8, cy - 7);
  ctx.lineTo(cx + 13, cy - 6);
  ctx.lineTo(cx + 13, cy - 4);
  ctx.lineTo(cx + 8, cy - 5);
  ctx.closePath(); ctx.fill();
  // teeth
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(cx + 9, cy - 7); ctx.lineTo(cx + 10, cy - 5); ctx.lineTo(cx + 11, cy - 7);
  ctx.fill();
  // eye — angry orange
  ctx.fillStyle = '#ff6600';
  ctx.beginPath(); ctx.arc(cx + 8, cy - 7, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(cx + 8, cy - 7, 0.7, 0, Math.PI * 2); ctx.fill();

  // tiny arms
  ctx.strokeStyle = colors.body; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx + 3, cy - 3);
  ctx.lineTo(cx + 7, cy);
  ctx.stroke();

  // strong legs with sickle claw
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  ctx.ellipse(cx - 3, cy + 8 + legOff, 3, 7, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 2, cy + 8 - legOff, 3, 7, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // sickle claw on forward leg
  ctx.strokeStyle = '#cccccc'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + 2, cy + 14 - legOff);
  ctx.quadraticCurveTo(cx + 7, cy + 14 - legOff, cx + 6, cy + 10 - legOff);
  ctx.stroke();

  ctx.restore();
}

// ─── Poop Projectile ────────────────────────────────────────────────────────
function generatePoopProjectile(scene) {
  const W = 14, H = 16;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Main drop — white/cream, slightly tapered at top
  ctx.fillStyle = '#f0eecc';
  ctx.beginPath();
  ctx.ellipse(7, 10, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // top swirl curl
  ctx.fillStyle = '#e8e6b8';
  ctx.beginPath();
  ctx.ellipse(7, 5, 3.5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(7, 2, 2, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // little shine
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.ellipse(5, 8, 1.5, 2, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // flies — two tiny dots for comedic effect
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(4, 4, 1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(10, 3, 1, 0, Math.PI * 2); ctx.fill();

  scene.textures.addImage('bird_poop', canvas);
}
