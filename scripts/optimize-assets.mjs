import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

// One-shot generator for optimized responsive variants. Original source assets remain untouched.
const jobs = [
  ['public/assets/hero-coast.webp', 'public/assets/hero-coast-480.webp', 480, 72],
  ['public/assets/hero-coast.webp', 'public/assets/hero-coast-960.webp', 960, 76],
  ['public/assets/hero-coast.webp', 'public/assets/hero-coast-1440.webp', 1440, 78],
  ['public/assets/region-map.webp', 'public/assets/region-map-480.webp', 480, 68],
  ['public/assets/region-map.webp', 'public/assets/region-map-960.webp', 960, 72],
  ['public/assets/compass.png', 'public/assets/compass-128.webp', 128, 72],
  ['public/assets/region-dune-grass.webp', 'public/assets/region-dune-grass-320.webp', 320, 70],
  ['public/assets/heritage-house.webp', 'public/assets/heritage-house-600.webp', 600, 72],
  ['preview/assets/paper-texture.webp', 'preview/assets/paper-texture-512.webp', 512, 58],
];

for (const [inputName, outputName, width, quality] of jobs) {
  const input = path.resolve(inputName);
  const output = path.resolve(outputName);
  await fs.access(input);
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(output);
  const stat = await fs.stat(output);
  console.log(`${outputName}: ${Math.round(stat.size / 1024)} KiB`);
}
