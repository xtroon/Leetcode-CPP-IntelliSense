const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Generates a pure PNG image from raw RGBA pixel buffer
function createPNG(width, height, getPixelRGBA) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRGBA(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // Helper to create PNG chunks
  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(8 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);

    // CRC32 calculation
    const crc = crc32(buf.slice(4, 8 + len));
    buf.writeInt32BE(crc, 8 + len);
    return buf;
  }

  // Standard CRC32 table
  function crc32(buf) {
    let table = crc32.table;
    if (!table) {
      table = crc32.table = new Int32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) {
          c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c;
      }
    }
    let c = -1;
    for (let i = 0; i < buf.length; i++) {
      c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ -1);
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bit depth
  ihdr[9] = 6; // Color type 6 (RGBA)
  ihdr[10] = 0; // Compression (deflate)
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace (none)

  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
}

// 128x128 Icon Renderer with Modern Dark/Neon Aesthetics
const width = 128;
const height = 128;
const radius = 26;

function drawIcon(x, y, w, h) {
  // Distance from center
  const cx = w / 2;
  const cy = h / 2;

  // Rounded rectangle SDF
  const dx = Math.abs(x - cx) - (cx - radius);
  const dy = Math.abs(y - cy) - (cy - radius);
  const dist = Math.min(Math.max(dx, dy), 0.0) + Math.hypot(Math.max(dx, 0.0), Math.max(dy, 0.0)) - radius;

  if (dist > 0) {
    // Outside icon boundary -> transparent
    return [0, 0, 0, 0];
  }

  const normX = x / w;
  const normY = y / h;

  // Background Gradient (Deep Navy to Indigo/Purple)
  let r = Math.round(15 + 40 * normY + 30 * normX);
  let g = Math.round(23 + 20 * normX);
  let b = Math.round(42 + 80 * normY + 60 * normX);
  let a = 255;

  // Glowing Outer Border
  if (dist > -2.5) {
    const borderMix = 1.0 - Math.abs(dist + 1.25) / 1.25;
    r = Math.round(r * (1 - borderMix) + 129 * borderMix);
    g = Math.round(g * (1 - borderMix) + 140 * borderMix);
    b = Math.round(b * (1 - borderMix) + 248 * borderMix);
  }

  // Draw Central 'C++' & Lightning Glow Graphic
  // Circle badge in center
  const badgeDist = Math.hypot(x - cx, y - cy);
  if (badgeDist < 38) {
    const glow = 1.0 - (badgeDist / 38);
    // Inner vibrant cyan/indigo glow
    r = Math.min(255, Math.round(r + 80 * glow));
    g = Math.min(255, Math.round(g + 90 * glow));
    b = Math.min(255, Math.round(b + 180 * glow));
  }

  // Lightning bolt shape rasterizer
  // Points: (64, 28) -> (46, 62) -> (60, 62) -> (52, 98) -> (80, 54) -> (66, 54) -> (76, 28)
  const isLightning = pointInLightning(x, y);
  if (isLightning) {
    // Bright golden yellow / electric cyan bolt
    const boltY = (y - 28) / 70;
    r = Math.round(255 * (1 - boltY * 0.2));
    g = Math.round(215 + 40 * boltY);
    b = Math.round(40 + 200 * boltY);
    a = 255;
  }

  // Soft border antialiasing
  if (dist > -1.5) {
    a = Math.round(255 * (1.0 - (dist + 1.5) / 1.5));
  }

  return [r, g, b, a];
}

// Simple polygon rasterizer for lightning bolt
function pointInLightning(px, py) {
  // Lightning bolt vertices centered on 128x128 canvas
  const poly = [
    [64, 26],
    [48, 62],
    [62, 62],
    [54, 102],
    [82, 54],
    [68, 54],
    [78, 26]
  ];

  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const pngBuffer = createPNG(width, height, drawIcon);

// Save to public/icon.png and dist/icon.png
const publicPath = path.join(__dirname, 'public', 'icon.png');
const distPath = path.join(__dirname, 'dist', 'icon.png');

fs.writeFileSync(publicPath, pngBuffer);
if (fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.writeFileSync(distPath, pngBuffer);
}

console.log(`[Icon] Successfully generated high-resolution 128x128 icon (${pngBuffer.length} bytes)!`);
