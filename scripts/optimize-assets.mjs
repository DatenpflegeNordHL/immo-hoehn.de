import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

// One-shot generator for optimized responsive variants. Original source assets remain untouched.
const root = path.resolve('public/assets');
const jobs = [
  ['hero-coast.webp', 'hero-coast-480.webp', 480, 72],
  ['hero-coast.webp', 'hero-coast-960.webp', 960, 76],
  ['hero-coast.webp', 'hero-coast-1440.webp', 1440, 78],
  ['region-map.webp', 'region-map-480.webp', 480, 68],
  ['region-map.webp', 'region-map-960.webp', 960, 72],
  ['compass.png', 'compass-128.webp', 128, 72],
  ['region-dune-grass.webp', 'region-dune-grass-320.webp', 320, 70],
  ['heritage-house.webp', 'heritage-house-600.webp', 600, 72],
  ['paper-texture.webp', 'paper-texture-512.webp', 512, 58],
];

for (const [inputName, outputName, width, quality] of jobs) {
  const input = path.join(root, inputName);
  const output = path.join(root, outputName);
  await fs.access(input);
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(output);
  const stat = await fs.stat(output);
  console.log(`${outputName}: ${Math.round(stat.size / 1024)} KiB`);
}
