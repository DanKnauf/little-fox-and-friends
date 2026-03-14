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
