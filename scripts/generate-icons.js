import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple function to create a basic PNG file with a solid color
function createSimplePNG(width, height, color = [64, 128, 192]) {
    // PNG file header and basic structure for a solid color image
    const png = Buffer.alloc(8 + 25 + width * height * 3 + 12);
    let offset = 0;

    // PNG signature
    png.writeUInt32BE(0x89504E47, offset); offset += 4;
    png.writeUInt32BE(0x0D0A1A0A, offset); offset += 4;

    // IHDR chunk
    png.writeUInt32BE(13, offset); offset += 4; // chunk length
    png.write('IHDR', offset); offset += 4;
    png.writeUInt32BE(width, offset); offset += 4;
    png.writeUInt32BE(height, offset); offset += 4;
    png.writeUInt8(8, offset); offset += 1; // bit depth
    png.writeUInt8(2, offset); offset += 1; // color type (RGB)
    png.writeUInt8(0, offset); offset += 1; // compression
    png.writeUInt8(0, offset); offset += 1; // filter
    png.writeUInt8(0, offset); offset += 1; // interlace

    // CRC for IHDR (simplified)
    png.writeUInt32BE(0, offset); offset += 4;

    // IDAT chunk (simplified - just create a basic colored rectangle)
    const dataSize = width * height * 3;
    png.writeUInt32BE(dataSize + 6, offset); offset += 4;
    png.write('IDAT', offset); offset += 4;

    // Simplified image data
    for (let i = 0; i < dataSize; i += 3) {
        png.writeUInt8(color[0], offset + i);
        png.writeUInt8(color[1], offset + i + 1);
        png.writeUInt8(color[2], offset + i + 2);
    }
    offset += dataSize;

    // CRC for IDAT (simplified)
    png.writeUInt32BE(0, offset); offset += 4;

    // IEND chunk
    png.writeUInt32BE(0, offset); offset += 4;
    png.write('IEND', offset); offset += 4;
    png.writeUInt32BE(0, offset); offset += 4;

    return png.slice(0, offset);
}

// Create a simple SVG icon
function createSVGIcon(size) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#4080c0" rx="8"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial, sans-serif" font-size="${Math.floor(size * 0.4)}" font-weight="bold">SA</text>
</svg>`;
}

// Generate icons
const publicDir = path.join(__dirname, '..', 'public');

// Create SVG favicon
const faviconSVG = createSVGIcon(32);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSVG);

// Create Apple touch icon SVG
const appleTouchIconSVG = createSVGIcon(180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), appleTouchIconSVG);

// Create mask icon SVG
const maskIconSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="16" fill="black"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'mask-icon.svg'), maskIconSVG);

// Create PWA icon SVGs (these will work as fallbacks)
const pwa192SVG = createSVGIcon(192);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.svg'), pwa192SVG);

const pwa512SVG = createSVGIcon(512);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.svg'), pwa512SVG);

console.log('✅ Icons generated successfully!');
console.log('Generated files:');
console.log('- favicon.svg');
console.log('- apple-touch-icon.svg');
console.log('- mask-icon.svg');
console.log('- pwa-192x192.svg');
console.log('- pwa-512x512.svg');
