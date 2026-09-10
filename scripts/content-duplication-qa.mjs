import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const failures = [];
const warnings = [];

function fail(message) { failures.push(message); }
function warn(message) { warnings.push(message); }

function walk(dir, suffix = '') {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full, suffix));
    else if (!suffix || name.endsWith(suffix)) out.push(full);
  }
  return out;
}

function routeForHtml(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'/index.html'.length)}/`;
  return `/${rel.replace(/\.html$/, '')}`;
}

function decode(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function plainText(html) {
  return decode(html)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function mainHtml(html) {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return match?.[1] ?? html;
}

function mainText(html) {
  let main = mainHtml(html);

  // Shared boilerplate must not inflate page-to-page similarity.
  main = main
    .replace(/<aside\b[^>]*class=["'][^"']*side-card[^"']*["'][^>]*>[\s\S]*?<\/aside>/gi, ' ')
    .replace(/<div\b[^>]*class=["'][^"']*breadcrumbs[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, ' ');

  return plainText(main);
}

function firstTagText(html, tag) {
  const match = html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? plainText(match[1]) : '';
}

function allTagTexts(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
    .map((match) => plainText(match[1]))
    .filter(Boolean);
}

function metaDescription(html) {
  const tag = html.match(/<meta\b[^>]*name=["']description["'][^>]*>/i)?.[0]
    ?? html.match(/<meta\b[^>]*content=["'][^"']*["'][^>]*name=["']description["'][^>]*>/i)?.[0]
    ?? '';
  return tag.match(/content=["']([^"']*)["']/i)?.[1]?.trim() ?? '';
}

function robots(html) {
  const tag = html.match(/<meta\b[^>]*name=["']robots["'][^>]*>/i)?.[0] ?? '';
  return tag.match(/content=["']([^"']*)["']/i)?.[1]?.toLowerCase() ?? '';
}

const STOP = new Set([
  'der','die','das','den','dem','des','ein','eine','einer','einem','einen','und','oder','mit','von','vom','für','auf','im','in','am','an','zu','zur','zum','ist','sind','wird','werden','als','auch','bei','sich','nicht','nur','ihre','ihrer','ihren','sie','wir','über','durch','einem','einer','eines','diese','dieser','diesem','diesen','kann','können','sowie','höhn','immobilien'
]);

function tokens(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .match(/[a-z0-9äöüß]+/gi)?.map((x) => x.toLowerCase())
    .filter((x) => x.length >= 3 && !STOP.has(x)) ?? [];
}

function frequency(items) {
  const map = new Map();
  for (const item of items) map.set(item, (map.get(item) ?? 0) + 1);
  return map;
}

function cosine(a, b) {
  const fa = frequency(a);
  const fb = frequency(b);
  let dot = 0;
  let aa = 0;
  let bb = 0;
  for (const value of fa.values()) aa += value * value;
  for (const value of fb.values()) bb += value * value;
  for (const [key, value] of fa) dot += value * (fb.get(key) ?? 0);
  if (!aa || !bb) return 0;
  return dot / Math.sqrt(aa * bb);
}

function shingles(items, n = 4) {
  const out = new Set();
  for (let i = 0; i <= items.length - n; i += 1) out.add(items.slice(i, i + n).join(' '));
  return out;
}

function containment(a, b) {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return intersection / Math.min(a.size, b.size);
}

function checkExactDuplicates(pages, key, label) {
  const groups = new Map();
  for (const page of pages) {
    const value = page[key]?.trim();
    if (!value) {
      fail(`${page.route}: ${label} fehlt.`);
      continue;
    }
    const normalized = normalizeText(value);
    if (!groups.has(normalized)) groups.set(normalized, []);
    groups.get(normalized).push(page.route);
  }
  for (const routes of groups.values()) {
    if (routes.length > 1) fail(`${label} ist exakt doppelt: ${routes.join(', ')}`);
  }
}

function checkWithinPageDuplicates(page) {
  const main = mainHtml(page.html);

  const paragraphs = allTagTexts(main, 'p').filter((text) => text.length >= 90);
  const paragraphGroups = new Map();
  for (const paragraph of paragraphs) {
    const key = normalizeText(paragraph);
    if (!paragraphGroups.has(key)) paragraphGroups.set(key, []);
    paragraphGroups.get(key).push(paragraph);
  }
  for (const copies of paragraphGroups.values()) {
    if (copies.length > 1) {
      fail(`${page.route}: identischer langer Absatz ${copies.length}× innerhalb derselben Seite.`);
    }
  }

  const headings = allTagTexts(main, 'h2');
  const headingGroups = new Map();
  for (const heading of headings) {
    const key = normalizeText(heading);
    if (!headingGroups.has(key)) headingGroups.set(key, []);
    headingGroups.get(key).push(heading);
  }
  for (const copies of headingGroups.values()) {
    if (copies.length > 1) {
      warn(`${page.route}: identische H2 „${copies[0]}“ ${copies.length}× innerhalb derselben Seite.`);
    }
  }
}

if (!existsSync(DIST)) {
  console.error('content-duplication-qa: dist/ fehlt.');
  process.exit(1);
}

const pages = walk(DIST, '.html')
  .map((file) => {
    const html = readFileSync(file, 'utf8');
    return {
      route: routeForHtml(file),
      html,
      title: firstTagText(html, 'title'),
      description: metaDescription(html),
      h1: firstTagText(html, 'h1'),
      text: mainText(html),
      robots: robots(html),
    };
  })
  .filter((page) => page.route !== '/404' && !page.robots.includes('noindex'));

checkExactDuplicates(pages, 'title', 'Title');
checkExactDuplicates(pages, 'description', 'Meta Description');
checkExactDuplicates(pages, 'h1', 'H1');
for (const page of pages) checkWithinPageDuplicates(page);

const similarities = [];
for (let i = 0; i < pages.length; i += 1) {
  for (let j = i + 1; j < pages.length; j += 1) {
    const a = pages[i];
    const b = pages[j];
    const ta = tokens(a.text);
    const tb = tokens(b.text);
    const lexical = cosine(ta, tb);
    const phrase = containment(shingles(ta), shingles(tb));
    similarities.push({ a: a.route, b: b.route, lexical, phrase });

    if (lexical >= 0.78 && phrase >= 0.28) {
      fail(`Nahe Content-Dublette: ${a.route} ↔ ${b.route} (cosine=${lexical.toFixed(3)}, phrase=${phrase.toFixed(3)}).`);
    } else if (lexical >= 0.55 || phrase >= 0.18) {
      warn(`Hohe Ähnlichkeit prüfen: ${a.route} ↔ ${b.route} (cosine=${lexical.toFixed(3)}, phrase=${phrase.toFixed(3)}).`);
    }
  }
}

similarities.sort((x, y) => (y.lexical + y.phrase) - (x.lexical + x.phrase));

console.log(`Content duplication QA: ${pages.length} indexierbare Seiten.`);
console.log('Top-Ähnlichkeiten:');
for (const item of similarities.slice(0, 10)) {
  console.log(`- ${item.a} ↔ ${item.b}: cosine=${item.lexical.toFixed(3)}, phrase=${item.phrase.toFixed(3)}`);
}

if (warnings.length) {
  console.warn(`WARNINGS (${warnings.length}):`);
  for (const item of warnings) console.warn(`- ${item}`);
}

if (failures.length) {
  console.error(`Content duplication QA FAILED (${failures.length}):`);
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log('Content duplication QA PASS: keine harten Title-/Description-/H1-/Content-Dubletten gefunden.');
