export function generateEnvironmentTextures(scene) {
  generatePlatformTiles(scene);
  generateGroundTiles(scene);
  generateHazardTile(scene);
  generateCoverObjects(scene);
  generateBossArena(scene);
}

function makeTile(w, h, drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  drawFn(canvas.getContext('2d'), w, h);
  return canvas;
}

function generatePlatformTiles(scene) {
  // Forest: mossy log
  scene.textures.addCanvas('platform_forest', makeTile(96, 18, (ctx, w, h) => {
    ctx.fillStyle = '#5a3010';
    ctx.beginPath(); ctx.roundRect(0, 2, w, h - 2, 4); ctx.fill();
    ctx.fillStyle = '#336620';
    for (let x = 4; x < w; x += 12) {
      ctx.beginPath();
      ctx.ellipse(x, 4, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#6b3e1a';
    for (let x = 8; x < w; x += 20) {
      ctx.fillRect(x, 6, 2, h - 6);
    }
  }));

  // Desert: sandstone
  scene.textures.addCanvas('platform_desert', makeTile(96, 18, (ctx, w, h) => {
    ctx.fillStyle = '#d4a44c';
    ctx.beginPath(); ctx.roundRect(0, 2, w, h - 2, 2); ctx.fill();
    ctx.strokeStyle = '#aa7722'; ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 16) {
      ctx.beginPath(); ctx.moveTo(x, 2); ctx.lineTo(x, h); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    ctx.fillStyle = '#b89040';
    for (let x = 2; x < w; x += 16) {
      ctx.fillRect(x, 3, 12, 4);
    }
  }));

  // Ocean: coral
  scene.textures.addCanvas('platform_ocean', makeTile(96, 18, (ctx, w, h) => {
    ctx.fillStyle = '#2266aa';
    ctx.beginPath(); ctx.roundRect(0, 2, w, h - 2, 4); ctx.fill();
    ctx.fillStyle = '#ff6688';
    for (let x = 4; x < w; x += 14) {
      ctx.beginPath();
      ctx.ellipse(x, 2, 4, 6, 0, 0, Math.PI);
      ctx.fill();
    }
    ctx.fillStyle = '#ffaacc';
    for (let x = 10; x < w; x += 14) {
      ctx.beginPath();
      ctx.ellipse(x, 4, 2, 4, 0, 0, Math.PI);
      ctx.fill();
    }
  }));
}

function generateGroundTiles(scene) {
  // Forest ground
  scene.textures.addCanvas('ground_forest', makeTile(64, 40, (ctx, w, h) => {
    ctx.fillStyle = '#3d2510';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2d6010';
    ctx.fillRect(0, 0, w, 10);
    for (let x = 0; x < w; x += 8) {
      ctx.fillStyle = x % 16 === 0 ? '#3d8020' : '#2d6010';
      ctx.fillRect(x, 0, 4, 6 + Math.floor(x / 3) % 4);
    }
  }));

  // Desert ground
  scene.textures.addCanvas('ground_desert', makeTile(64, 40, (ctx, w, h) => {
    ctx.fillStyle = '#c8843c';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#e8aa5c';
    ctx.fillRect(0, 0, w, 8);
    // texture dots
    ctx.fillStyle = '#aa6020';
    for (let x = 2; x < w; x += 6) {
      for (let y = 2; y < h; y += 6) {
        ctx.beginPath();
        ctx.arc(x + (y % 3), y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }));

  // Ocean ground
  scene.textures.addCanvas('ground_ocean', makeTile(64, 40, (ctx, w, h) => {
    ctx.fillStyle = '#336699';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1a3355';
    ctx.fillRect(0, 4, w, h - 4);
    // waves on top
    ctx.fillStyle = '#66aadd';
    ctx.fillRect(0, 0, w, 6);
    ctx.fillStyle = '#aaddff';
    for (let x = 0; x < w; x += 10) {
      ctx.beginPath();
      ctx.arc(x + 5, 3, 4, Math.PI, 0);
      ctx.fill();
    }
  }));
}

function generateHazardTile(scene) {
  // Thorns / spikes
  scene.textures.addCanvas('hazard', makeTile(32, 16, (ctx, w, h) => {
    ctx.fillStyle = '#440000';
    ctx.fillRect(0, 8, w, h - 8);
    ctx.fillStyle = '#880000';
    for (let x = 2; x < w; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x, 8);
      ctx.lineTo(x + 3, 0);
      ctx.lineTo(x + 6, 8);
      ctx.fill();
    }
  }));

  // Web drop hazard (semi-transparent)
  scene.textures.addCanvas('web_hazard', makeTile(80, 8, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(220,220,220,0.6)';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(180,180,180,0.8)'; ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 8) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(0, h/2); ctx.lineTo(w, h/2); ctx.stroke();
  }));

  // Ink cloud
  scene.textures.addCanvas('ink_cloud', makeTile(200, 40, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(20,0,60,0.7)';
    ctx.beginPath();
    ctx.ellipse(w/2, h/2, w/2, h/2, 0, 0, Math.PI * 2);
    ctx.fill();
  }));

  // Shadow warning (used for tentacle/web telegraph)
  scene.textures.addCanvas('shadow_warning', makeTile(60, 12, (ctx, w, h) => {
    const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
    grad.addColorStop(0, 'rgba(200,0,0,0.6)');
    grad.addColorStop(1, 'rgba(200,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }));
}

function generateCoverObjects(scene) {
  // Forest: hollow stump
  scene.textures.addCanvas('cover_stump', makeTile(40, 36, (ctx, w, h) => {
    ctx.fillStyle = '#5a3010';
    ctx.beginPath(); ctx.roundRect(4, 6, 32, 30, 3); ctx.fill();
    ctx.fillStyle = '#3d2000';
    ctx.beginPath(); ctx.ellipse(20, 10, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2d6010';
    for (let x = 2; x < w - 2; x += 8) {
      ctx.fillStyle = x % 16 === 0 ? '#4a8a20' : '#336615';
      ctx.beginPath(); ctx.ellipse(x, 6, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
    }
  }));

  // Desert: boulder
  scene.textures.addCanvas('cover_rock', makeTile(44, 32, (ctx, w, h) => {
    ctx.fillStyle = '#9a7a50';
    ctx.beginPath();
    ctx.moveTo(8, h); ctx.lineTo(0, 16); ctx.lineTo(8, 4);
    ctx.lineTo(28, 0); ctx.lineTo(42, 8); ctx.lineTo(44, h); ctx.fill();
    ctx.fillStyle = '#b89a70';
    ctx.beginPath(); ctx.moveTo(10, 6); ctx.lineTo(28, 2); ctx.lineTo(40, 10); ctx.lineTo(30, 14); ctx.fill();
    // cracks
    ctx.strokeStyle = '#6a5030'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(16, 8); ctx.lineTo(20, 20); ctx.lineTo(26, 24); ctx.stroke();
  }));

  // Ocean: coral formation
  scene.textures.addCanvas('cover_coral', makeTile(38, 44, (ctx, w, h) => {
    const colors = ['#ff6688', '#ff4466', '#ffaacc', '#ff8899'];
    const branches = [[6,h,6,20],[12,h,12,10],[18,h,18,16],[24,h,24,8],[30,h,30,18]];
    for (let i = 0; i < branches.length; i++) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(branches[i][0]-3, branches[i][3], 6, h - branches[i][3]);
      ctx.beginPath();
      ctx.arc(branches[i][0], branches[i][3], 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }));

  // Crate
  scene.textures.addCanvas('cover_crate', makeTile(36, 36, (ctx, w, h) => {
    ctx.fillStyle = '#a07030';
    ctx.fillRect(2, 2, w-4, h-4);
    ctx.strokeStyle = '#704010'; ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, w-4, h-4);
    ctx.beginPath(); ctx.moveTo(w/2, 2); ctx.lineTo(w/2, h-2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2, h/2); ctx.lineTo(w-2, h/2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(2, 2); ctx.lineTo(w/2, h/2);
    ctx.moveTo(w-2, 2); ctx.lineTo(w/2, h/2);
    ctx.moveTo(2, h-2); ctx.lineTo(w/2, h/2);
    ctx.moveTo(w-2, h-2); ctx.lineTo(w/2, h/2);
    ctx.stroke();
  }));
}

function generateBossArena(scene) {
  // Arena floor
  scene.textures.addCanvas('arena_floor', makeTile(128, 24, (ctx, w, h) => {
    ctx.fillStyle = '#2a1a0a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#3a2a1a';
    for (let x = 0; x < w; x += 32) {
      ctx.fillRect(x, 0, 28, h - 2);
    }
    ctx.fillStyle = '#ff4400';
    ctx.fillRect(0, 0, w, 2);
  }));
}
