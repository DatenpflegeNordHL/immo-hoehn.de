import { existsSync, statSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { propertyMedia } from '../src/data/property-media.js';

const sources = [...new Set(
  Object.values(propertyMedia)
    .flatMap((entry) => [entry.hero, ...(entry.gallery ?? [])])
    .map((item) => item?.src)
    .filter((src) => typeof src === 'string' && src.length > 0),
)];

const failures = [];

function hasExpectedSignature(file) {
  const bytes = readFileSync(file).subarray(0, 16);
  const ext = extname(file).toLowerCase();
  if (ext === '.webp') {
    return bytes.subarray(0, 4).toString('ascii') === 'RIFF'
      && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  if (ext === '.png') {
    return bytes.length >= 8
      && bytes[0] === 0x89
      && bytes.subarray(1, 4).toString('ascii') === 'PNG';
  }
  if (ext === '.jpg' || ext === '.jpeg') {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  return false;
}

for (const src of sources) {
  if (/^https?:\/\//i.test(src)) {
    failures.push(`${src}: externe Objektbildquelle ist nicht zulässig; WordPress-02-Medien müssen lokal in den Build übernommen werden.`);
    continue;
  }

  const relativePath = src.replace(/^\//, '');
  const file = join(process.cwd(), 'public', relativePath);
  if (!existsSync(file)) {
    failures.push(`${src}: Datei fehlt im Build-Input.`);
    continue;
  }
  if (!statSync(file).isFile() || statSync(file).size === 0) {
    failures.push(`${src}: Datei ist leer oder ungültig.`);
    continue;
  }
  if (!hasExpectedSignature(file)) {
    failures.push(`${src}: Dateiendung und tatsächliches Bildformat stimmen nicht überein.`);
    continue;
  }
  console.log(`PASS ${src}`);
}

if (failures.length > 0) {
  console.error(`Property media preflight FAILED (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Property media preflight PASS: ${sources.length} lokale WordPress-02-Bilddateien inklusive Dateisignatur geprüft.`);
