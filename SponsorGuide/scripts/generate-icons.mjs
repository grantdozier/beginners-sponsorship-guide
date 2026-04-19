// Generates the iOS/Android app icon, adaptive icon, splash, and favicon
// from a single SVG source. Run with: `node scripts/generate-icons.mjs`.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ASSETS = path.resolve('assets');

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

console.log('Generating app icons from SVG...\n');

// iOS main icon — no alpha channel (Apple requirement)
await renderSvg(ICON_SVG, path.join(ASSETS, 'icon.png'), 1024, { flatten: '#E8751F' });
// Adaptive icon foreground — needs transparency (Android composites it)
await renderSvg(ADAPTIVE_SVG, path.join(ASSETS, 'adaptive-icon.png'), 1024);
// Splash — flatten onto cream
await renderSvg(SPLASH_SVG, path.join(ASSETS, 'splash-icon.png'), 1024, { flatten: '#FAF1DE' });
// Favicon — flatten onto orange
await renderSvg(FAVICON_SVG, path.join(ASSETS, 'favicon.png'), 48, { flatten: '#E8751F' });

console.log('\nDone. Review in assets/ then commit + rebuild.');
