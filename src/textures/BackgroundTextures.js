export function generateBackgroundTextures(scene) {
  generateForestBG(scene);
  generateDesertBG(scene);
  generateOceanBG(scene);
  generateVolcanoBG(scene);
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

// ─── Volcano ──────────────────────────────────────────────────────────────────
function generateVolcanoBG(scene) {
  // Sky layer — dark, brooding with lava-glow horizon
  scene.textures.addCanvas('bg_volcano_sky', makeBG(512, 480, (ctx, w, h) => {
    // Deep purple-black sky to angry orange at horizon
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1a0a1e');
    grad.addColorStop(0.45, '#3d1228');
    grad.addColorStop(0.75, '#8b2500');
    grad.addColorStop(1, '#cc4400');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // Ash clouds — dark grey puffs
    ctx.fillStyle = 'rgba(40,20,20,0.75)';
    drawCloud(ctx, 20, 55, 70);
    drawCloud(ctx, 220, 30, 90);
    drawCloud(ctx, 390, 65, 60);
    // Lava horizon glow
    const glowGrad = ctx.createLinearGradient(0, h * 0.8, 0, h);
    glowGrad.addColorStop(0, 'rgba(255,80,0,0)');
    glowGrad.addColorStop(1, 'rgba(255,120,0,0.55)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, h * 0.8, w, h * 0.2);
    // Embers — small orange dots floating up
    ctx.fillStyle = 'rgba(255,160,0,0.8)';
    for (let i = 0; i < 18; i++) {
      const ex = (i * 73 + 30) % w;
      const ey = 40 + (i * 53) % (h - 80);
      ctx.beginPath();
      ctx.arc(ex, ey, 1.5 + (i % 3) * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }));

  // Far layer — distant volcano silhouettes with lava rivers
  scene.textures.addCanvas('bg_volcano_far', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    // Volcano mountains — dark silhouettes
    const volcanoes = [
      { x: 60,  peak: 200, base: 180 },
      { x: 220, peak: 260, base: 200 },
      { x: 380, peak: 180, base: 160 },
      { x: 480, peak: 220, base: 170 },
    ];
    ctx.fillStyle = '#1e0808';
    for (const v of volcanoes) {
      ctx.beginPath();
      ctx.moveTo(v.x - v.base / 2, h);
      ctx.lineTo(v.x, h - v.peak);
      ctx.lineTo(v.x + v.base / 2, h);
      ctx.closePath();
      ctx.fill();
    }
    // Lava rivers on volcano slopes
    for (const v of volcanoes) {
      const lavaGrad = ctx.createLinearGradient(v.x, h - v.peak, v.x + 20, h);
      lavaGrad.addColorStop(0, 'rgba(255,100,0,0.9)');
      lavaGrad.addColorStop(1, 'rgba(200,50,0,0.5)');
      ctx.fillStyle = lavaGrad;
      ctx.beginPath();
      ctx.moveTo(v.x - 3, h - v.peak + 10);
      ctx.lineTo(v.x + 3, h - v.peak + 10);
      ctx.lineTo(v.x + 25, h);
      ctx.lineTo(v.x + 18, h);
      ctx.closePath();
      ctx.fill();
    }
  }));

  // Mid layer — rocky stone formations with glowing lava cracks
  scene.textures.addCanvas('bg_volcano_mid', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    // Stone formations
    ctx.fillStyle = '#2c1010';
    for (let x = 0; x < w; x += 70) {
      const rh = 100 + (x % 60);
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.lineTo(x + 10, h - rh);
      ctx.lineTo(x + 25, h - rh - 20);
      ctx.lineTo(x + 40, h - rh);
      ctx.lineTo(x + 70, h);
      ctx.closePath();
      ctx.fill();
    }
    // Lava cracks in stones — glowing orange lines
    ctx.strokeStyle = 'rgba(255,110,0,0.85)';
    ctx.lineWidth = 2;
    for (let x = 15; x < w; x += 70) {
      ctx.beginPath();
      ctx.moveTo(x, h - 20);
      ctx.lineTo(x + 5, h - 50);
      ctx.lineTo(x + 12, h - 40);
      ctx.lineTo(x + 8, h - 70);
      ctx.stroke();
    }
    // Lava crack glow
    ctx.strokeStyle = 'rgba(255,60,0,0.3)';
    ctx.lineWidth = 5;
    for (let x = 15; x < w; x += 70) {
      ctx.beginPath();
      ctx.moveTo(x, h - 20);
      ctx.lineTo(x + 5, h - 50);
      ctx.lineTo(x + 12, h - 40);
      ctx.lineTo(x + 8, h - 70);
      ctx.stroke();
    }
  }));

  // Near layer — dark ash rock foreground with ember glow
  scene.textures.addCanvas('bg_volcano_near', makeBG(512, 480, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    // Dark rock ground strip
    ctx.fillStyle = '#180808';
    ctx.fillRect(0, h - 55, w, 55);
    // Jagged rock teeth along top of ground
    ctx.fillStyle = '#0e0404';
    for (let x = 0; x < w; x += 22) {
      const th = 18 + (x % 20);
      ctx.beginPath();
      ctx.moveTo(x, h - 50);
      ctx.lineTo(x + 11, h - 50 - th);
      ctx.lineTo(x + 22, h - 50);
      ctx.fill();
    }
    // Lava pool surface — glowing orange strip
    ctx.fillStyle = '#cc3300';
    ctx.fillRect(0, h - 14, w, 14);
    const lavaShine = ctx.createLinearGradient(0, h - 14, 0, h);
    lavaShine.addColorStop(0, 'rgba(255,160,0,0.6)');
    lavaShine.addColorStop(1, 'rgba(200,40,0,0.3)');
    ctx.fillStyle = lavaShine;
    ctx.fillRect(0, h - 14, w, 14);
    // Ember sparks near ground
    ctx.fillStyle = 'rgba(255,180,0,0.9)';
    for (let x = 5; x < w; x += 38) {
      ctx.beginPath();
      ctx.arc(x, h - 60 - (x % 20), 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }));
}
