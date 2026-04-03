// Generate simple SVG-based PWA icons
const fs = require('fs');
const path = require('path');

function generateIcon(size) {
  const padding = Math.round(size * 0.15);
  const mountainSize = size - padding * 2;
  const cx = size / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="#4CAF50"/>
  <g transform="translate(${padding}, ${padding + mountainSize * 0.1})">
    <!-- Mountain -->
    <polygon points="${mountainSize*0.5},${mountainSize*0.1} ${mountainSize*0.15},${mountainSize*0.75} ${mountainSize*0.85},${mountainSize*0.75}" fill="#FFFFFF" opacity="0.95"/>
    <!-- Snow cap -->
    <polygon points="${mountainSize*0.5},${mountainSize*0.1} ${mountainSize*0.38},${mountainSize*0.32} ${mountainSize*0.62},${mountainSize*0.32}" fill="#E8F5E9"/>
    <!-- Small mountain -->
    <polygon points="${mountainSize*0.75},${mountainSize*0.35} ${mountainSize*0.55},${mountainSize*0.75} ${mountainSize*0.95},${mountainSize*0.75}" fill="#FFFFFF" opacity="0.7"/>
    <!-- Sun -->
    <circle cx="${mountainSize*0.2}" cy="${mountainSize*0.25}" r="${mountainSize*0.08}" fill="#FFD54F"/>
  </g>
</svg>`;
}

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

[192, 512].forEach(size => {
  const svg = generateIcon(size);
  // Write as SVG (browsers support SVG icons in manifest)
  fs.writeFileSync(path.join(assetsDir, `icon-${size}.svg`), svg);
  console.log(`Generated icon-${size}.svg`);
});

// Also generate a proper PNG-compatible SVG for the manifest
// (Most browsers accept SVG in manifest, but we reference .png for compatibility)
// For now, we'll update manifest to use .svg
console.log('Done! Update manifest.json icon types to image/svg+xml if needed.');
