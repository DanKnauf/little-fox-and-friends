/**
 * Generates public/apple-touch-icon.png (180×180)
 * Uses only Node.js built-ins — no extra npm packages needed.
 *
 * Run:  node scripts/gen-apple-touch-icon.mjs
 */

import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';
import { fileURLToPath } from 'url';

const W = 180, H = 180;
const pixels = new Uint8Array(W * H * 4); // RGBA, all transparent

// ── Pixel helpers ────────────────────────────────────────────────────────────

function setPixel(x, y, r, g, b, a) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  const sa = a / 255, da = pixels[i + 3] / 255;
  const oa = sa + da * (1 - sa);
  if (oa === 0) return;
  pixels[i]     = Math.round((r * sa + pixels[i]     * da * (1 - sa)) / oa);
  pixels[i + 1] = Math.round((g * sa + pixels[i + 1] * da * (1 - sa)) / oa);
  pixels[i + 2] = Math.round((b * sa + pixels[i + 2] * da * (1 - sa)) / oa);
  pixels[i + 3] = Math.round(oa * 255);
}

function fillCircle(cx, cy, radius, r, g, b, a) {
  const r2 = radius * radius;
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++)
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r2)
        setPixel(x, y, r, g, b, a);
}

function fillEllipse(cx, cy, rx, ry, r, g, b, a) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1)
        setPixel(x, y, r, g, b, a);
}

function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
  const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
  const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}

function fillTriangle(ax, ay, bx, by, cx, cy, r, g, b, a) {
  const minX = Math.floor(Math.min(ax, bx, cx));
  const minY = Math.floor(Math.min(ay, by, cy));
  const maxX = Math.ceil(Math.max(ax, bx, cx));
  const maxY = Math.ceil(Math.max(ay, by, cy));
  for (let y = minY; y <= maxY; y++)
    for (let x = minX; x <= maxX; x++)
      if (pointInTriangle(x, y, ax, ay, bx, by, cx, cy))
        setPixel(x, y, r, g, b, a);
}

// ── Fox drawing — scales the SVG viewBox (0 0 32 32) → 180×180 ──────────────

const S = W / 32; // 5.625
const s = v => v * S; // scale a coordinate

// Left ear outer
fillTriangle(s(4), s(13), s(8), s(1), s(14), s(11),  0xFF, 0x77, 0x22, 255);
// Left ear inner (dark)
fillTriangle(s(6.5), s(12), s(8), s(4), s(12), s(11), 0x2a, 0x0a, 0x00, 255);

// Right ear outer
fillTriangle(s(28), s(13), s(24), s(1), s(18), s(11), 0xFF, 0x77, 0x22, 255);
// Right ear inner (dark)
fillTriangle(s(25.5), s(12), s(24), s(4), s(20), s(11), 0x2a, 0x0a, 0x00, 255);

// Head
fillCircle(s(16), s(19), s(13), 0xFF, 0x77, 0x22, 255);

// Muzzle
fillEllipse(s(16), s(23), s(7), s(5), 0xfc, 0xe8, 0xc8, 255);

// Eyes
fillCircle(s(12), s(17), Math.round(2.5 * S), 0x1a, 0x0a, 0x00, 255);
fillCircle(s(20), s(17), Math.round(2.5 * S), 0x1a, 0x0a, 0x00, 255);

// Eye sparkles
fillCircle(s(13), s(16), Math.round(0.9 * S), 0xff, 0xff, 0xff, 255);
fillCircle(s(21), s(16), Math.round(0.9 * S), 0xff, 0xff, 0xff, 255);

// Nose
fillEllipse(s(16), s(21), s(2), Math.round(1.5 * S), 0x1a, 0x0a, 0x00, 255);

// Cheek blush
fillCircle(s(10), s(22), Math.round(1.2 * S), 0xe0, 0x50, 0x20, 115);
fillCircle(s(22), s(22), Math.round(1.2 * S), 0xe0, 0x50, 0x20, 115);

// ── PNG encoder ──────────────────────────────────────────────────────────────

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = (crcTable[(c ^ b) & 0xff] ^ (c >>> 8)) >>> 0;
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const crcBuf = Buffer.concat([typeBytes, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([lenBuf, typeBytes, data, crcVal]);
}

// IHDR
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 6;  // colour type: RGBA
ihdr[10] = ihdr[11] = ihdr[12] = 0;

// IDAT — one filter byte (0 = None) per row, then raw RGBA pixel data
const rowLen = 1 + W * 4;
const raw = Buffer.alloc(H * rowLen);
for (let y = 0; y < H; y++) {
  raw[y * rowLen] = 0; // filter type None
  for (let x = 0; x < W; x++) {
    const src = (y * W + x) * 4;
    const dst = y * rowLen + 1 + x * 4;
    raw[dst]     = pixels[src];
    raw[dst + 1] = pixels[src + 1];
    raw[dst + 2] = pixels[src + 2];
    raw[dst + 3] = pixels[src + 3];
  }
}

const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const png = Buffer.concat([
  sig,
  pngChunk('IHDR', ihdr),
  pngChunk('IDAT', deflateSync(raw, { level: 9 })),
  pngChunk('IEND', Buffer.alloc(0)),
]);

const outPath = fileURLToPath(new URL('../public/apple-touch-icon.png', import.meta.url));
writeFileSync(outPath, png);
console.log(`✓ Written ${png.length} bytes → public/apple-touch-icon.png`);
