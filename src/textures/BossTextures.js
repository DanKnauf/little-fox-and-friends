export function generateBossTextures(scene) {
  generateForestGuardian(scene);
  generateScorpionKing(scene);
  generateKraken(scene);
}

function generateForestGuardian(scene) {
  const W = 96, H = 96, FRAMES = 4;
  const canvas = document.createElement('canvas');
  canvas.width = W * FRAMES; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const states = ['idle', 'charge', 'web', 'hurt'];
  for (let f = 0; f < FRAMES; f++) {
    drawForestGuardian(ctx, f * W + 48, 48, states[f]);
  }
  scene.textures.addSpriteSheet('boss_forest', canvas, { frameWidth: W, frameHeight: H });
}

function drawForestGuardian(ctx, cx, cy, state) {
  ctx.save();

  const baseColor = state === 'hurt' ? '#994422' :
                    state === 'charge' ? '#cc3300' : '#3d2010';
  const legColor = state === 'hurt' ? '#662200' : '#2a1500';

  // Root tentacles / web strands behind
  ctx.strokeStyle = '#553311'; ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 10);
    ctx.lineTo(cx + Math.cos(a) * 44, cy + Math.sin(a) * 30 + 10);
    ctx.stroke();
  }

  // Spider legs (8 legs)
  ctx.strokeStyle = legColor; ctx.lineWidth = 5;
  const legAngles = [-Math.PI * 0.75, -Math.PI * 0.5, -Math.PI * 0.25, -Math.PI * 0.1,
                      Math.PI * 0.1, Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.75];
  for (const a of legAngles) {
    const mx = cx + Math.cos(a) * 28;
    const my = cy + Math.sin(a) * 18 + 10;
    const ex = cx + Math.cos(a) * 46;
    const ey = cy + Math.sin(a) * 28 + 14;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 10);
    ctx.lineTo(mx, my);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  }

  // Main body
  ctx.fillStyle = baseColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 28, 26, 0, 0, Math.PI * 2);
  ctx.fill();

  // Green/root texture on body
  ctx.strokeStyle = '#2d5a0a'; ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(cx - 8 + i * 4, cy - 8 + i * 3, 6, 0.5, 2.5);
    ctx.stroke();
  }

  // Eyes - 8 glowing eyes
  ctx.fillStyle = state === 'charge' ? '#ff0' : '#ff6600';
  const eyePositions = [[-10,-10],[-4,-14],[4,-14],[10,-10],[-12,-4],[12,-4],[-6,-6],[6,-6]];
  for (const [ex, ey] of eyePositions) {
    ctx.beginPath();
    ctx.arc(cx + ex, cy + ey, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(cx + ex, cy + ey, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = state === 'charge' ? '#ff0' : '#ff6600';
  }

  // Mandibles
  ctx.fillStyle = legColor;
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy + 10);
  ctx.lineTo(cx - 14, cy + 28);
  ctx.lineTo(cx - 4, cy + 14);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 8, cy + 10);
  ctx.lineTo(cx + 14, cy + 28);
  ctx.lineTo(cx + 4, cy + 14);
  ctx.fill();

  // Web drop indicator in 'web' state
  if (state === 'web') {
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * 20, cy + Math.sin(a) * 20);
      ctx.stroke();
    }
    for (let r = 5; r <= 20; r += 5) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

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
