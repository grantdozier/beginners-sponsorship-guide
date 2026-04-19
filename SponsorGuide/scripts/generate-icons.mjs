// Generates the iOS/Android app icon, adaptive icon, splash, and favicon
// from a single PNG source (the tree-of-life concept). Run with:
// `node scripts/generate-icons.mjs`.
//
// Source image: assets/app_icon_concept_1_colors.png (756x615 on a cream bg).
// We pad it to 1024x1024 by extending the cream background on all sides.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ASSETS = path.resolve('assets');
const SOURCE = path.join(ASSETS, 'app_icon_concept_1_colors.png');
const CREAM = { r: 0xFA, g: 0xF1, b: 0xDE };   // #FAF1DE — matches theme
const ORANGE = { r: 0xE8, g: 0x75, b: 0x1F };   // #E8751F

// ──────────────────────────────────────────────────────────────
// Main icon — 1024×1024, full-bleed orange gradient + serif "B"
// Matches the app's cream/orange book-cover aesthetic.
// ──────────────────────────────────────────────────────────────
const ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="68%">
      <stop offset="0%" stop-color="#F5B87A"/>
      <stop offset="45%" stop-color="#E8751F"/>
      <stop offset="100%" stop-color="#A8480A"/>
    </radialGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
      <stop offset="45%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed background. Apple applies corner mask automatically. -->
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <rect width="1024" height="1024" fill="url(#sheen)"/>

  <!-- Elegant serif "B" in cream/white, centered. Playfair-style curves. -->
  <text
    x="512"
    y="720"
    font-family="Georgia, 'Playfair Display', 'Times New Roman', serif"
    font-size="720"
    font-weight="700"
    font-style="italic"
    fill="#FAF1DE"
    text-anchor="middle">B</text>

  <!-- Subtle fleuron beneath -->
  <text
    x="512"
    y="880"
    font-family="Georgia, serif"
    font-size="80"
    fill="#FAF1DE"
    text-anchor="middle"
    opacity="0.6">❦</text>
</svg>
`;

// ──────────────────────────────────────────────────────────────
// Adaptive (Android) foreground — transparent bg, centered "B"
// Android wraps it in a shape (circle/square/rounded) automatically,
// so the foreground needs ~30% padding.
// ──────────────────────────────────────────────────────────────
const ADAPTIVE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <text
    x="512"
    y="660"
    font-family="Georgia, 'Playfair Display', 'Times New Roman', serif"
    font-size="540"
    font-weight="700"
    font-style="italic"
    fill="#FAF1DE"
    text-anchor="middle">B</text>
</svg>
`;

// ──────────────────────────────────────────────────────────────
// Splash — cream background, centered orange "B"
// ──────────────────────────────────────────────────────────────
const SPLASH_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#FAF1DE"/>
  <text
    x="512"
    y="640"
    font-family="Georgia, 'Playfair Display', 'Times New Roman', serif"
    font-size="560"
    font-weight="700"
    font-style="italic"
    fill="#E8751F"
    text-anchor="middle">B</text>
  <text
    x="512"
    y="740"
    font-family="Georgia, serif"
    font-size="40"
    font-style="italic"
    fill="#3A2418"
    text-anchor="middle"
    letter-spacing="4">BEGINNERS SPONSORSHIP GUIDE</text>
</svg>
`;

// ──────────────────────────────────────────────────────────────
// Web favicon — simple "B" on orange, 48×48 compressed
// ──────────────────────────────────────────────────────────────
const FAVICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#E8751F"/>
  <text
    x="256"
    y="380"
    font-family="Georgia, serif"
    font-size="400"
    font-weight="700"
    font-style="italic"
    fill="#FAF1DE"
    text-anchor="middle">B</text>
</svg>
`;

async function renderSvg(svg, outPath, size, opts = {}) {
  let pipeline = sharp(Buffer.from(svg)).resize(size, size);
  // Apple rejects main icon with alpha channel — flatten onto a background.
  if (opts.flatten) {
    pipeline = pipeline.flatten({ background: opts.flatten });
  }
  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
  const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(`  ✓ ${path.basename(outPath)} — ${size}×${size}, ${kb}KB`);
}

console.log('Generating app icons from tree-of-life source PNG...\n');

// ──────────────────────────────────────────────────────────────
// Pad the source image to square 1024×1024 on a cream background,
// then emit the different asset variants.
// ──────────────────────────────────────────────────────────────

async function squarePad(size, bg) {
  const meta = await sharp(SOURCE).metadata();
  const maxSide = Math.max(meta.width, meta.height);
  // Contain the art in ~85% of the square; 15% breathing room around it.
  const artSize = Math.floor(size * 0.85);
  const scale = artSize / maxSide;
  const targetW = Math.floor(meta.width * scale);
  const targetH = Math.floor(meta.height * scale);
  const padX = Math.floor((size - targetW) / 2);
  const padY = Math.floor((size - targetH) / 2);

  const resized = await sharp(SOURCE)
    .resize(targetW, targetH)
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: bg,
    },
  })
    .composite([{ input: resized, left: padX, top: padY }])
    .png({ compressionLevel: 9 });
}

async function emit(outPath, size, bg) {
  const pipeline = await squarePad(size, bg);
  await pipeline.toFile(outPath);
  const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(`  ✓ ${path.basename(outPath)} — ${size}×${size}, ${kb}KB`);
}

// iOS icon — 1024×1024, cream background (no alpha)
await emit(path.join(ASSETS, 'icon.png'), 1024, CREAM);
// Android adaptive foreground — same source; Android wraps in shape
await emit(path.join(ASSETS, 'adaptive-icon.png'), 1024, CREAM);
// Splash screen — centered tree on cream
await emit(path.join(ASSETS, 'splash-icon.png'), 1024, CREAM);
// Favicon — tiny, orange bg
await emit(path.join(ASSETS, 'favicon.png'), 48, ORANGE);

console.log('\nDone. Review in assets/ then commit + rebuild.');
