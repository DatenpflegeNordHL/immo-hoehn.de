import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = join(process.cwd(), 'dist');
const failures = [];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

if (!existsSync(dist)) {
  console.error('Legacy contact QA FAILED: dist/ fehlt.');
  process.exit(1);
}

const textFiles = walk(dist).filter((file) => /\.(?:html|xml|txt|php|js|css|json)$/i.test(file));
const forbidden = [
  /038826\s*80911/i,
  /\+49\s*38826\s*80911/i,
  /\+493882680911/i,
];

let corpus = '';
for (const file of textFiles) {
  const content = readFileSync(file, 'utf8');
  corpus += `\n${content}`;
  for (const pattern of forbidden) {
    if (pattern.test(content)) failures.push(`${relative(dist, file)} enthält die entfernte Festnetznummer (${pattern}).`);
  }
}

if (!/0171\s*1230162/.test(corpus) && !/\+491711230162/.test(corpus) && !/\+49\s*171\s*1230162/.test(corpus)) {
  failures.push('Die freigegebene Mobilnummer 0171 1230162 fehlt vollständig im Production-Build.');
}

if (failures.length) {
  console.error(`Legacy contact QA FAILED (${failures.length}):`);
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log('Legacy contact QA PASS: alte Festnetznummer nicht im Build; Mobilkontakt vorhanden.');
