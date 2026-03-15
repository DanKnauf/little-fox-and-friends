export function generateBackgroundTextures(scene) {
  generateForestBG(scene);
  generateDesertBG(scene);
  generateOceanBG(scene);
}

function makeBG(w, h, drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  drawFn(canvas.getContext('2d'), w, h);
  return canvas;
}

// ─── Forest ──────────────────────────────────────────────────────────────────
function generateForestBG(scene) {
  // Sky layer
  scene.textures.addCanvas('bg_forest_sky', makeBG(512, 480, (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#87ceeb');
    grad.addColorStop(0.6, '#b0e0f0');
    grad.addColorStop(1, '#d0f0c0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // clouds
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    drawCloud(ctx, 80, 60, 40);
    drawCloud(ctx, 240, 40, 55);
    drawCloud(ctx, 400, 80, 35);
  }));

  // Far trees
  scene.textures.addCanvas('bg_forest_far', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#2a5010';
    for (let x = 10; x < w; x += 45) {
      const treeH = 180 + (x % 60);
      drawTree(ctx, x, h, treeH, 30 + (x % 15), '#2a5010', '#1a3008');
    }
  }));

  // Mid trees
  scene.textures.addCanvas('bg_forest_mid', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (let x = 0; x < w; x += 60) {
      const treeH = 220 + (x % 50);
      drawTree(ctx, x, h, treeH, 40 + (x % 20), '#3a7020', '#2a4a10');
    }
    // mushrooms
    ctx.fillStyle = '#cc2244';
    for (let x = 20; x < w; x += 100) {
      drawMushroom(ctx, x, h - 8, 14);
    }
  }));

  // Near undergrowth
  scene.textures.addCanvas('bg_forest_near', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1a4008';
    ctx.fillRect(0, h - 50, w, 50);
    ctx.fillStyle = '#2a6010';
    for (let x = 0; x < w; x += 18) {
      const bh = 30 + (x % 30);
      ctx.beginPath();
      ctx.moveTo(x, h - 40);
      ctx.lineTo(x + 9, h - 40 - bh);
      ctx.lineTo(x + 18, h - 40);
      ctx.fill();
    }
    // fallen log
    ctx.fillStyle = '#5a3010';
    ctx.beginPath(); ctx.roundRect(100, h - 42, 80, 16, 4); ctx.fill();
    ctx.fillStyle = '#3d7020';
    for (let x = 106; x < 176; x += 10) {
      ctx.beginPath(); ctx.ellipse(x, h - 42, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
    }
  }));
}

// ─── Desert ──────────────────────────────────────────────────────────────────
function generateDesertBG(scene) {
  scene.textures.addCanvas('bg_desert_sky', makeBG(800, 480, (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#ff8c00');
    grad.addColorStop(0.3, '#ffbb44');
    grad.addColorStop(0.7, '#ffe8aa');
    grad.addColorStop(1, '#ffd080');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // sun — centered in the 800px canvas so tiling never shows two at once
    ctx.fillStyle = '#ffee00';
    ctx.beginPath(); ctx.arc(400, 70, 32, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,238,0,0.3)';
    ctx.beginPath(); ctx.arc(400, 70, 50, 0, Math.PI * 2); ctx.fill();
  }));

  scene.textures.addCanvas('bg_desert_far', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#c8843c';
    for (let x = 0; x < w + 60; x += 80) {
      const dh = 80 + (x % 40);
      ctx.beginPath();
      ctx.moveTo(x - 60, h);
      ctx.quadraticCurveTo(x, h - dh, x + 60, h);
      ctx.fill();
    }
  }));

  scene.textures.addCanvas('bg_desert_mid', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    // sandstone ruins
    ctx.fillStyle = '#d4a44c';
    for (let x = 60; x < w; x += 140) {
      ctx.fillRect(x, h - 120, 18, 100);
      ctx.fillRect(x + 30, h - 90, 18, 70);
      ctx.fillRect(x - 20, h - 140, 60, 20);
    }
    // cacti
    ctx.fillStyle = '#336622';
    for (let x = 20; x < w; x += 90) {
      drawCactus(ctx, x, h - 20, 50 + (x % 20));
    }
  }));

  scene.textures.addCanvas('bg_desert_near', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#e8aa5c';
    ctx.fillRect(0, h - 30, w, 30);
    // sand ripples
    ctx.strokeStyle = '#c88830'; ctx.lineWidth = 1;
    for (let y = h - 28; y < h; y += 6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < w; x += 20) {
        ctx.sineTo?.(x + 10, y - 2) || ctx.quadraticCurveTo(x + 5, y - 3, x + 10, y - 2);
        ctx.quadraticCurveTo(x + 15, y - 1, x + 20, y);
      }
      ctx.stroke();
    }
  }));
}

// ─── Ocean ───────────────────────────────────────────────────────────────────
function generateOceanBG(scene) {
  scene.textures.addCanvas('bg_ocean_sky', makeBG(512, 480, (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1a6699');
    grad.addColorStop(0.4, '#3388bb');
    grad.addColorStop(0.6, '#66aad4');
    grad.addColorStop(1, '#99ccee');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // clouds
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    drawCloud(ctx, 60, 50, 45);
    drawCloud(ctx, 260, 30, 60);
    drawCloud(ctx, 440, 70, 38);
    // sun
    ctx.fillStyle = 'rgba(255,255,200,0.6)';
    ctx.beginPath(); ctx.arc(440, 40, 20, 0, Math.PI * 2); ctx.fill();
  }));

  scene.textures.addCanvas('bg_ocean_far', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1a5577';
    // cliffs
    for (let x = 0; x < w; x += 100) {
      const cliffH = 200 + (x % 60);
      ctx.fillRect(x, h - cliffH, 80, cliffH);
    }
  }));

  scene.textures.addCanvas('bg_ocean_mid', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    // ship wreck silhouette
    ctx.fillStyle = '#2a3344';
    ctx.beginPath();
    ctx.moveTo(60, h - 80); ctx.lineTo(60, h - 160); ctx.lineTo(80, h - 170);
    ctx.lineTo(100, h - 160); ctx.lineTo(200, h - 90); ctx.lineTo(200, h - 80); ctx.fill();
    ctx.fillStyle = '#1a2233';
    ctx.fillRect(80, h - 220, 8, 60); // mast
    // coral in mid distance
    ctx.fillStyle = '#cc4466';
    for (let x = 220; x < w; x += 30) {
      ctx.beginPath(); ctx.arc(x, h - 50, 10, Math.PI, 0); ctx.fill();
      ctx.fillRect(x - 4, h - 50, 8, 30);
    }
  }));

  scene.textures.addCanvas('bg_ocean_near', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    // water surface
    ctx.fillStyle = '#1a4a6e';
    ctx.fillRect(0, h - 40, w, 40);
    ctx.fillStyle = '#2266aa';
    ctx.fillRect(0, h - 44, w, 8);
    // wave highlights
    ctx.fillStyle = '#aaddff';
    for (let x = 0; x < w; x += 24) {
      ctx.beginPath(); ctx.arc(x + 12, h - 42, 8, Math.PI, 0); ctx.fill();
    }
    // seaweed
    ctx.strokeStyle = '#226622'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let x = 10; x < w; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, h - 30);
      ctx.quadraticCurveTo(x - 10, h - 60, x, h - 90);
      ctx.quadraticCurveTo(x + 10, h - 110, x + 5, h - 130);
      ctx.stroke();
    }
  }));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function drawTree(ctx, x, baseY, h, spread, topColor, trunkColor) {
  ctx.fillStyle = trunkColor;
  ctx.fillRect(x + spread / 2 - 5, baseY - h * 0.4, 10, h * 0.4);
  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.moveTo(x, baseY - h * 0.4);
  ctx.lineTo(x + spread / 2, baseY - h);
  ctx.lineTo(x + spread, baseY - h * 0.4);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 8, baseY - h * 0.6);
  ctx.lineTo(x + spread / 2, baseY - h * 1.15);
  ctx.lineTo(x + spread - 8, baseY - h * 0.6);
  ctx.fill();
}

function drawMushroom(ctx, x, y, size) {
  ctx.fillStyle = '#cc2244';
  ctx.beginPath(); ctx.arc(x, y - size * 0.8, size, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x - size * 0.3, y - size * 0.9, size * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + size * 0.4, y - size * 0.7, size * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f5f0e0';
  ctx.fillRect(x - size * 0.2, y - size * 0.8, size * 0.4, size * 0.8);
}

function drawCactus(ctx, x, y, h) {
  ctx.fillStyle = '#336622';
  ctx.fillRect(x - 5, y - h, 10, h);
  // arms
  ctx.fillRect(x - 20, y - h * 0.6, 16, 8);
  ctx.fillRect(x - 20, y - h * 0.6 - 20, 8, 22);
  ctx.fillRect(x + 4, y - h * 0.4, 16, 8);
  ctx.fillRect(x + 12, y - h * 0.4 - 16, 8, 18);
  // spines
  ctx.strokeStyle = '#aaccaa'; ctx.lineWidth = 1;
  for (let py = y - h + 8; py < y; py += 12) {
    ctx.beginPath(); ctx.moveTo(x - 5, py); ctx.lineTo(x - 9, py - 3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 5, py); ctx.lineTo(x + 9, py - 3); ctx.stroke();
  }
}

function drawCloud(ctx, x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.arc(x + size * 0.5, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
  ctx.arc(x + size, y, size * 0.45, 0, Math.PI * 2);
  ctx.arc(x + size * 0.5, y + size * 0.2, size * 0.5, 0, Math.PI * 2);
  ctx.fill();
}
