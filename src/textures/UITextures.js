export function generateUITextures(scene) {
  // Heart - 24x24
  const heartCanvas = document.createElement('canvas');
  heartCanvas.width = 24; heartCanvas.height = 24;
  const hCtx = heartCanvas.getContext('2d');
  drawHeart(hCtx, 12, 12, 10, '#e03030');
  scene.textures.addCanvas('heart_full', heartCanvas);

  // Heart empty - 24x24
  const heartEmptyCanvas = document.createElement('canvas');
  heartEmptyCanvas.width = 24; heartEmptyCanvas.height = 24;
  const heCtx = heartEmptyCanvas.getContext('2d');
  drawHeart(heCtx, 12, 12, 10, '#555');
  scene.textures.addCanvas('heart_empty', heartEmptyCanvas);

  // Small heart - 18x18
  const sHeartCanvas = document.createElement('canvas');
  sHeartCanvas.width = 18; sHeartCanvas.height = 18;
  const shCtx = sHeartCanvas.getContext('2d');
  drawHeart(shCtx, 9, 9, 7, '#e03030');
  scene.textures.addCanvas('heart_small', sHeartCanvas);

  // Potion - 20x28
  const potionCanvas = document.createElement('canvas');
  potionCanvas.width = 20; potionCanvas.height = 28;
  const pCtx = potionCanvas.getContext('2d');
  // bottle neck
  pCtx.fillStyle = '#aaa';
  pCtx.fillRect(7, 0, 6, 8);
  // bottle body
  pCtx.fillStyle = '#c060e0';
  pCtx.beginPath();
  pCtx.ellipse(10, 18, 8, 10, 0, 0, Math.PI * 2);
  pCtx.fill();
  // shimmer
  pCtx.fillStyle = 'rgba(255,255,255,0.5)';
  pCtx.beginPath();
  pCtx.ellipse(7, 14, 3, 5, -0.3, 0, Math.PI * 2);
  pCtx.fill();
  // cork
  pCtx.fillStyle = '#8B6914';
  pCtx.fillRect(7, 6, 6, 4);
  scene.textures.addCanvas('potion', potionCanvas);

  // Projectile - 12x6
  const projCanvas = document.createElement('canvas');
  projCanvas.width = 12; projCanvas.height = 6;
  const prCtx = projCanvas.getContext('2d');
  prCtx.fillStyle = '#ffe066';
  prCtx.beginPath();
  prCtx.ellipse(6, 3, 5, 2, 0, 0, Math.PI * 2);
  prCtx.fill();
  prCtx.fillStyle = '#fff';
  prCtx.beginPath();
  prCtx.ellipse(4, 2, 2, 1, 0, 0, Math.PI * 2);
  prCtx.fill();
  scene.textures.addCanvas('projectile', projCanvas);

  // Companion projectile - 10x5
  const cprojCanvas = document.createElement('canvas');
  cprojCanvas.width = 10; cprojCanvas.height = 5;
  const cpCtx = cprojCanvas.getContext('2d');
  cpCtx.fillStyle = '#66eeff';
  cpCtx.beginPath();
  cpCtx.ellipse(5, 2, 4, 2, 0, 0, Math.PI * 2);
  cpCtx.fill();
  scene.textures.addCanvas('projectile_companion', cprojCanvas);

  // Boss projectile - 16x16
  const bprojCanvas = document.createElement('canvas');
  bprojCanvas.width = 16; bprojCanvas.height = 16;
  const bpCtx = bprojCanvas.getContext('2d');
  bpCtx.fillStyle = '#ff4400';
  bpCtx.beginPath();
  bpCtx.arc(8, 8, 7, 0, Math.PI * 2);
  bpCtx.fill();
  bpCtx.fillStyle = '#ffaa00';
  bpCtx.beginPath();
  bpCtx.arc(8, 8, 4, 0, Math.PI * 2);
  bpCtx.fill();
  scene.textures.addCanvas('projectile_boss', bprojCanvas);

  // White square for overlays/hazards
  const whiteCanvas = document.createElement('canvas');
  whiteCanvas.width = 4; whiteCanvas.height = 4;
  const wCtx = whiteCanvas.getContext('2d');
  wCtx.fillStyle = '#fff';
  wCtx.fillRect(0, 0, 4, 4);
  scene.textures.addCanvas('white_sq', whiteCanvas);

  // Pixel - 2x2 colored dot
  const pixCanvas = document.createElement('canvas');
  pixCanvas.width = 2; pixCanvas.height = 2;
  const pixCtx = pixCanvas.getContext('2d');
  pixCtx.fillStyle = '#fff';
  pixCtx.fillRect(0, 0, 2, 2);
  scene.textures.addCanvas('pixel', pixCanvas);

  // Shadow warning - red ellipse on floor (boss attack incoming)
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 80; shadowCanvas.height = 20;
  const sCtx = shadowCanvas.getContext('2d');
  sCtx.fillStyle = 'rgba(200, 0, 0, 0.5)';
  sCtx.beginPath();
  sCtx.ellipse(40, 10, 38, 9, 0, 0, Math.PI * 2);
  sCtx.fill();
  sCtx.strokeStyle = '#ff2200';
  sCtx.lineWidth = 1.5;
  sCtx.beginPath();
  sCtx.ellipse(40, 10, 38, 9, 0, 0, Math.PI * 2);
  sCtx.stroke();
  scene.textures.addCanvas('shadow_warning', shadowCanvas);

  // Web hazard - sticky green web patch
  const webCanvas = document.createElement('canvas');
  webCanvas.width = 80; webCanvas.height = 20;
  const webCtx = webCanvas.getContext('2d');
  webCtx.fillStyle = 'rgba(100, 220, 100, 0.55)';
  webCtx.fillRect(0, 0, 80, 20);
  webCtx.strokeStyle = '#44aa44';
  webCtx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    webCtx.beginPath(); webCtx.moveTo(i * 20, 0); webCtx.lineTo(i * 20, 20); webCtx.stroke();
  }
  for (let i = 0; i <= 2; i++) {
    webCtx.beginPath(); webCtx.moveTo(0, i * 10); webCtx.lineTo(80, i * 10); webCtx.stroke();
  }
  scene.textures.addCanvas('web_hazard', webCanvas);

  // Stegosaurus HUD icon — 30x18 mini silhouette for the companion health row
  const stegIconCanvas = document.createElement('canvas');
  stegIconCanvas.width = 30; stegIconCanvas.height = 18;
  const siCtx = stegIconCanvas.getContext('2d');
  drawSteggieIcon(siCtx);
  scene.textures.addCanvas('steggie_icon', stegIconCanvas);
}

// Mini stegosaurus icon — arched back, dorsal plates, low beak head, 4 legs
function drawSteggieIcon(ctx) {
  const green = '#4A8C5C';
  const dark  = '#2d5c3a';
  const plateC = '#5ab87a';
  const tipC   = '#d06020';

  // Tail
  ctx.strokeStyle = green; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(4, 13);
  ctx.quadraticCurveTo(1, 13, 2, 9);
  ctx.stroke();
  // Thagomizer spikes (2 short ones)
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.moveTo(2, 9); ctx.lineTo(0, 6); ctx.lineTo(4, 9); ctx.fill();
  ctx.beginPath(); ctx.moveTo(2, 9); ctx.lineTo(4, 6); ctx.lineTo(5, 10); ctx.fill();

  // Body (arched)
  ctx.fillStyle = green;
  ctx.beginPath();
  ctx.moveTo(3, 13);
  ctx.bezierCurveTo(3, 5, 10, 3, 15, 4);
  ctx.bezierCurveTo(20, 5, 24, 7, 24, 11);
  ctx.quadraticCurveTo(20, 14, 3, 13);
  ctx.closePath(); ctx.fill();

  // Dorsal plates — 4 diamonds along the spine
  const plates = [{ x: 7, h: 6 }, { x: 11, h: 7 }, { x: 15, h: 6 }, { x: 19, h: 4 }];
  for (const p of plates) {
    const py = p.x < 14 ? 4 : 5; // approximate spine y
    ctx.fillStyle = plateC;
    ctx.beginPath();
    ctx.moveTo(p.x, py - p.h);
    ctx.lineTo(p.x + 2.5, py - p.h * 0.4);
    ctx.lineTo(p.x, py);
    ctx.lineTo(p.x - 2.5, py - p.h * 0.4);
    ctx.closePath(); ctx.fill();
    // Orange tip
    ctx.fillStyle = tipC;
    ctx.beginPath();
    ctx.moveTo(p.x, py - p.h);
    ctx.lineTo(p.x + 1.5, py - p.h * 0.62);
    ctx.lineTo(p.x - 1.5, py - p.h * 0.62);
    ctx.closePath(); ctx.fill();
  }

  // Head (small, low, beak-like)
  ctx.fillStyle = green;
  ctx.beginPath();
  ctx.ellipse(26, 10, 4, 3.5, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(23, 9); ctx.lineTo(30, 10); ctx.lineTo(28, 13); ctx.lineTo(22, 12);
  ctx.closePath(); ctx.fill();
  // Eye
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(27, 9, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(27.4, 8.6, 0.5, 0, Math.PI * 2); ctx.fill();

  // 4 legs
  ctx.fillStyle = dark;
  for (const lx of [7, 11, 16, 20]) {
    ctx.beginPath(); ctx.ellipse(lx, 15.5, 2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  }
}

function drawHeart(ctx, cx, cy, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy + size * 0.35);
  ctx.bezierCurveTo(cx, cy, cx - size, cy, cx - size, cy - size * 0.35);
  ctx.bezierCurveTo(cx - size, cy - size * 0.75, cx - size * 0.5, cy - size, cx, cy - size * 0.4);
  ctx.bezierCurveTo(cx + size * 0.5, cy - size, cx + size, cy - size * 0.75, cx + size, cy - size * 0.35);
  ctx.bezierCurveTo(cx + size, cy, cx, cy, cx, cy + size * 0.35);
  ctx.fill();
}
