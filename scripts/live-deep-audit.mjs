import { writeFileSync } from 'node:fs';

const BASE = new URL(process.env.LIVE_AUDIT_BASE || 'https://immo-hoehn.de/');
const ORIGIN = BASE.origin;
const failures = [];
const warnings = [];
const passes = [];
const fetchedPages = new Map();

const propertyRoutes = [
  '/immobilien/einfamilienhaus-poetenitz-1724/',
  '/immobilien/eigentumswohnung-poetenitz-1722/',
  '/immobilien/baugrundstuecke-rosenhagen/',
  '/immobilien/baugrundstuecke-rosenhagen-von-privat/',
];

const legalNoindexRoutes = ['/impressum/', '/datenschutz/'];
const legacyRedirects = new Map([
  ['/verkaufen/', '/immobilie-verkaufen/'],
  ['/unsere-dienstleistungen/', '/immobilie-verkaufen/'],
  ['/aktuelle-angebote/', '/immobilien/'],
  ['/immobilienangebote/', '/immobilien/'],
  ['/immobilienangebote/kaufen/', '/immobilien/'],
  ['/immobilienangebote/kaufen/grundstuecke/', '/immobilien/'],
  ['/immobilienangebote/kaufen/haeuser/', '/immobilien/'],
  ['/immobilienangebote/kaufen/wohnungen/', '/immobilien/'],
  ['/datenschutzerklaerung/', '/datenschutz/'],
]);

const legacyPropertyRoutes = [
  '/immobilienangebote/kaufen/haeuser/efh-poetenitz/',
  '/immobilienangebote/kaufen/wohnungen/eigentumswohung/',
  '/immobilienangebote/kaufen/grundstuecke/rosenhagen/',
  '/immobilienangebote/kaufen/grundstuecke/rosenhagen-von-privat/',
];

function fail(message) { failures.push(message); }
function warn(message) { warnings.push(message); }
function pass(message) { passes.push(message); }

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    redirect: options.redirect ?? 'follow',
    method: options.method ?? 'GET',
    headers: {
      'user-agent': 'Höhn-Live-Deep-Audit/1.0',
      'accept-encoding': 'gzip, br',
      ...(options.headers || {}),
    },
    signal: AbortSignal.timeout(options.timeout ?? 15000),
    body: options.body,
  });
  return response;
}

async function getText(url, options = {}) {
  const response = await request(url, options);
  const text = await response.text();
  return { response, text };
}

function extractAll(html, re, group = 1) {
  return [...html.matchAll(re)].map((m) => decodeHtml(m[group] ?? '')).filter(Boolean);
}

function getAttr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return m ? decodeHtml(m[1]) : null;
}

function normalizeInternal(raw, pageUrl) {
  try {
    const url = new URL(raw, pageUrl);
    if (url.origin !== ORIGIN) return null;
    return url;
  } catch {
    return null;
  }
}

function countTag(html, tag) {
  return (html.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
}

function metaContent(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if ((getAttr(tag, 'name') || '').toLowerCase() === name.toLowerCase()) return getAttr(tag, 'content');
  }
  return null;
}

function linkHref(html, rel) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const relValue = (getAttr(tag, 'rel') || '').toLowerCase().split(/\s+/);
    if (relValue.includes(rel.toLowerCase())) return getAttr(tag, 'href');
  }
  return null;
}

function jsonLdTypes(value, out = []) {
  if (Array.isArray(value)) {
    for (const item of value) jsonLdTypes(item, out);
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  if (typeof value['@type'] === 'string') out.push(value['@type']);
  if (Array.isArray(value['@type'])) out.push(...value['@type'].filter((v) => typeof v === 'string'));
  for (const child of Object.values(value)) {
    if (child && typeof child === 'object') jsonLdTypes(child, out);
  }
  return out;
}

function parseJsonLd(html, route) {
  const blocks = extractAll(html, /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const parsed = [];
  blocks.forEach((block, i) => {
    try { parsed.push(JSON.parse(block)); }
    catch (error) { fail(`${route}: ungültiges JSON-LD #${i + 1}: ${error.message}`); }
  });
  return parsed;
}

function isNoindex(html) {
  return (metaContent(html, 'robots') || '').toLowerCase().includes('noindex');
}

function cacheMaxAge(header = '') {
  const m = header.match(/(?:s-maxage|max-age)=(\d+)/i);
  return m ? Number(m[1]) : 0;
}

async function checkRedirect(from, expected) {
  const response = await request(from, { redirect: 'manual' });
  const location = response.headers.get('location');
  const absolute = location ? new URL(location, from).href : null;
  if (response.status !== 301 || absolute !== expected) {
    fail(`Redirect ${from}: ${response.status} -> ${absolute || '(kein Location)'}, erwartet 301 -> ${expected}`);
  } else {
    pass(`Redirect ${from} -> ${expected}`);
  }
  await response.body?.cancel();
}

async function fetchPage(route) {
  if (fetchedPages.has(route)) return fetchedPages.get(route);
  const url = new URL(route, BASE).href;
  const { response, text } = await getText(url);
  const result = { response, text, url: response.url };
  fetchedPages.set(route, result);
  return result;
}

console.log(`Live Deep Audit: ${ORIGIN}`);

// 1. Canonical transport/host behavior.
await checkRedirect('http://immo-hoehn.de/', `${ORIGIN}/`);
await checkRedirect('http://www.immo-hoehn.de/', `${ORIGIN}/`);
await checkRedirect('https://www.immo-hoehn.de/', `${ORIGIN}/`);

// 2. Root response and production security headers.
const root = await fetchPage('/');
if (root.response.status !== 200) fail(`/ -> HTTP ${root.response.status}`);
if (root.response.url !== `${ORIGIN}/`) fail(`/ final URL ${root.response.url}, erwartet ${ORIGIN}/`);

const requiredHeaders = new Map([
  ['strict-transport-security', /max-age=15552000/i],
  ['x-content-type-options', /^nosniff$/i],
  ['referrer-policy', /^strict-origin-when-cross-origin$/i],
  ['x-frame-options', /^SAMEORIGIN$/i],
  ['permissions-policy', /camera=\(\).*microphone=\(\).*geolocation=\(\)/i],
]);
for (const [name, expected] of requiredHeaders) {
  const value = root.response.headers.get(name) || '';
  if (!expected.test(value)) fail(`Security-Header ${name}: '${value || '(fehlt)'}'`);
  else pass(`Security-Header ${name}`);
}
if (root.response.headers.get('x-powered-by')) warn(`X-Powered-By wird ausgeliefert: ${root.response.headers.get('x-powered-by')}`);
if (!root.response.headers.get('content-security-policy')) warn('CSP ist weiterhin nicht gesetzt (bewusstes Hardening-Backlog, kein Launch-Blocker).');

// 3. robots + sitemap discovery.
const robots = await getText(`${ORIGIN}/robots.txt`);
if (robots.response.status !== 200) fail(`robots.txt -> HTTP ${robots.response.status}`);
if (!/^User-agent:\s*\*/im.test(robots.text)) fail('robots.txt: User-agent: * fehlt.');
if (/^Disallow:\s*\/\s*$/im.test(robots.text)) fail('robots.txt blockiert die gesamte Website.');
if (!robots.text.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`)) fail('robots.txt verweist nicht auf die kanonische Sitemap.');

const sitemapIndex = await getText(`${ORIGIN}/sitemap-index.xml`);
if (sitemapIndex.response.status !== 200) fail(`sitemap-index.xml -> HTTP ${sitemapIndex.response.status}`);
const childSitemaps = extractAll(sitemapIndex.text, /<loc>([^<]+)<\/loc>/gi);
if (!childSitemaps.length) fail('sitemap-index.xml enthält keine Child-Sitemap.');

const sitemapUrls = [];
for (const child of childSitemaps) {
  let childUrl;
  try { childUrl = new URL(child); } catch { fail(`Ungültige Sitemap-URL: ${child}`); continue; }
  if (childUrl.origin !== ORIGIN) fail(`Fremder Sitemap-Host: ${child}`);
  const map = await getText(childUrl.href);
  if (map.response.status !== 200) { fail(`${childUrl.pathname} -> HTTP ${map.response.status}`); continue; }
  sitemapUrls.push(...extractAll(map.text, /<loc>([^<]+)<\/loc>/gi));
}

const uniqueSitemapUrls = [...new Set(sitemapUrls)];
if (uniqueSitemapUrls.length !== sitemapUrls.length) fail('Sitemap enthält doppelte URLs.');
if (uniqueSitemapUrls.length !== 12) fail(`Sitemap enthält ${uniqueSitemapUrls.length} URLs, erwartet 12 indexierbare Seiten.`);
for (const raw of uniqueSitemapUrls) {
  const u = new URL(raw);
  if (u.origin !== ORIGIN) fail(`Sitemap-URL mit falschem Host: ${raw}`);
  if (u.search || u.hash) fail(`Sitemap-URL mit Query/Fragment: ${raw}`);
}
pass(`Sitemap-Struktur: ${uniqueSitemapUrls.length} eindeutige indexierbare URLs`);

// 4. Indexable page SEO, schema and stale-data checks.
const seenTitles = new Map();
const seenDescriptions = new Map();
const seenH1 = new Map();
const internalTargets = new Set();
const fragmentTargets = [];
const resources = new Map();

for (const raw of uniqueSitemapUrls) {
  const u = new URL(raw);
  const route = u.pathname;
  const page = await fetchPage(route);
  const html = page.text;
  if (page.response.status !== 200) fail(`${route}: HTTP ${page.response.status}`);
  if ((page.response.headers.get('content-type') || '').toLowerCase().includes('text/html') === false) fail(`${route}: Content-Type ist nicht text/html.`);

  const titles = extractAll(html, /<title>([\s\S]*?)<\/title>/gi).map((v) => v.replace(/\s+/g, ' ').trim());
  if (titles.length !== 1 || !titles[0]) fail(`${route}: exakt ein nichtleerer <title> erwartet, gefunden ${titles.length}.`);
  const desc = metaContent(html, 'description');
  if (!desc) fail(`${route}: Meta-Description fehlt.`);
  const h1s = extractAll(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map((v) => v.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  if (h1s.length !== 1 || !h1s[0]) fail(`${route}: exakt eine nichtleere H1 erwartet, gefunden ${h1s.length}.`);

  if (titles[0]) {
    if (seenTitles.has(titles[0])) fail(`${route}: doppelter Title mit ${seenTitles.get(titles[0])}.`);
    seenTitles.set(titles[0], route);
  }
  if (desc) {
    if (seenDescriptions.has(desc)) fail(`${route}: doppelte Meta-Description mit ${seenDescriptions.get(desc)}.`);
    seenDescriptions.set(desc, route);
  }
  if (h1s[0]) {
    if (seenH1.has(h1s[0])) fail(`${route}: doppelte H1 mit ${seenH1.get(h1s[0])}.`);
    seenH1.set(h1s[0], route);
  }

  const canonical = linkHref(html, 'canonical');
  if (canonical !== `${ORIGIN}${route}`) fail(`${route}: Canonical '${canonical}', erwartet '${ORIGIN}${route}'.`);
  const robotMeta = (metaContent(html, 'robots') || '').toLowerCase().replace(/\s/g, '');
  if (robotMeta !== 'index,follow') fail(`${route}: robots='${robotMeta || '(fehlt)'}', erwartet index,follow.`);
  if ((getAttr((html.match(/<html\b[^>]*>/i) || [''])[0], 'lang') || '').toLowerCase() !== 'de') fail(`${route}: html lang ist nicht de.`);
  if (!metaContent(html, 'viewport')) fail(`${route}: viewport meta fehlt.`);
  if (!/charset=["']?utf-8/i.test(html) && !/<meta\b[^>]*charset=["']?utf-8/i.test(html)) fail(`${route}: UTF-8 charset fehlt.`);

  if (/038826\s*(?:\||\/|-|\s)*\s*80911|\+49\s*38826\s*80911|\+493882680911/i.test(html)) fail(`${route}: alte Festnetznummer gefunden.`);
  if (/hoehn\.immobilien@t-online\.de/i.test(html)) fail(`${route}: alte T-Online-Mail gefunden.`);
  if (/DatenpflegeNord/i.test(html)) fail(`${route}: Projekt-/Agenturbranding im öffentlichen HTML gefunden.`);
  if (/staging|platzhalter|arbeitsbranch/i.test(html)) fail(`${route}: möglicher Staging-/Platzhaltertext gefunden.`);

  const schemas = parseJsonLd(html, route);
  const types = schemas.flatMap((s) => jsonLdTypes(s));
  if (!types.includes('RealEstateAgent')) fail(`${route}: RealEstateAgent-Schema fehlt.`);
  if (route !== '/' && !types.includes('BreadcrumbList')) fail(`${route}: BreadcrumbList-Schema fehlt.`);

  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  for (const tag of imgTags) {
    if (getAttr(tag, 'alt') === null) fail(`${route}: <img> ohne alt-Attribut.`);
    if (!getAttr(tag, 'width') || !getAttr(tag, 'height')) warn(`${route}: Bild ohne explizite width/height-Dimensionen (${getAttr(tag, 'src') || 'unbekannt'}).`);
  }

  const hrefTags = html.match(/<a\b[^>]*>/gi) || [];
  for (const tag of hrefTags) {
    const href = getAttr(tag, 'href');
    if (href === null || href.trim() === '') { fail(`${route}: Link ohne href.`); continue; }
    if (/^(mailto:|tel:)/i.test(href)) continue;
    if (/^javascript:/i.test(href)) { fail(`${route}: javascript:-Link gefunden.`); continue; }
    const target = normalizeInternal(href, `${ORIGIN}${route}`);
    if (!target) continue;
    if (target.protocol !== 'https:') fail(`${route}: unsicherer interner Link ${href}`);
    internalTargets.add(target.pathname + target.search);
    if (target.hash) fragmentTargets.push({ from: route, target });
  }

  for (const tag of html.match(/<(?:img|script|link)\b[^>]*>/gi) || []) {
    const name = tag.match(/^<([a-z]+)/i)?.[1]?.toLowerCase();
    if (name === 'link') {
      const rel = (getAttr(tag, 'rel') || '').toLowerCase();
      if (!/(stylesheet|icon|preload|modulepreload)/.test(rel)) continue;
    }
    const rawSrc = getAttr(tag, name === 'link' ? 'href' : 'src');
    if (!rawSrc || rawSrc.startsWith('data:')) continue;
    const target = normalizeInternal(rawSrc, `${ORIGIN}${route}`);
    if (!target) continue;
    resources.set(target.href, name);
    if (target.protocol !== 'https:') fail(`${route}: unsichere interne Ressource ${rawSrc}`);
  }

  for (const tag of imgTags) {
    const srcset = getAttr(tag, 'srcset');
    if (!srcset) continue;
    for (const entry of srcset.split(',')) {
      const raw = entry.trim().split(/\s+/)[0];
      const target = normalizeInternal(raw, `${ORIGIN}${route}`);
      if (target) resources.set(target.href, 'img');
    }
  }
}

// 5. Crawl every internal link target, including fragment existence.
for (const path of [...internalTargets].sort()) {
  const url = new URL(path, BASE);
  const response = await request(url.href);
  if (response.status >= 400) fail(`Interner Link ${path} -> HTTP ${response.status}`);
  if (response.url && !response.url.startsWith(ORIGIN)) fail(`Interner Link ${path} verlässt kanonischen Host -> ${response.url}`);
  await response.body?.cancel();
}
pass(`Interne Links: ${internalTargets.size} eindeutige Ziele ohne 4xx/5xx`);

for (const { from, target } of fragmentTargets) {
  const page = await fetchPage(target.pathname);
  const id = decodeURIComponent(target.hash.slice(1));
  const re = new RegExp(`\\b(?:id|name)=["']${escapeRegex(id)}["']`, 'i');
  if (!re.test(page.text)) fail(`${from}: Fragment ${target.pathname}${target.hash} existiert nicht.`);
}
pass(`Fragmente: ${fragmentTargets.length} Verweise geprüft`);

// 6. Resources and production cache behavior.
let hashedAssetCount = 0;
for (const [href, kind] of [...resources.entries()].sort()) {
  let response = await request(href, { method: 'HEAD' });
  if (response.status === 405) response = await request(href);
  if (response.status !== 200) fail(`Ressource ${href} -> HTTP ${response.status}`);
  const type = (response.headers.get('content-type') || '').toLowerCase();
  if (kind === 'img' && !type.startsWith('image/')) fail(`Bild ${href}: unerwarteter Content-Type '${type}'.`);
  if (kind === 'link' && href.includes('.css') && !type.includes('text/css')) fail(`CSS ${href}: unerwarteter Content-Type '${type}'.`);
  if (href.includes('/_astro/')) {
    hashedAssetCount += 1;
    const cc = response.headers.get('cache-control') || '';
    if (cacheMaxAge(cc) < 31536000 || !/immutable/i.test(cc)) {
      fail(`Hashed Asset ohne 1-Jahr immutable Cache: ${new URL(href).pathname} ('${cc || 'kein Cache-Control'}').`);
    }
  }
  await response.body?.cancel();
}
pass(`Ressourcen: ${resources.size} interne Assets geprüft, davon ${hashedAssetCount} gehashte Astro-Assets`);

// 7. Explicit noindex routes and historical property safety.
const sitemapSet = new Set(uniqueSitemapUrls.map((u) => new URL(u).pathname));
for (const route of [...legalNoindexRoutes, ...propertyRoutes]) {
  const page = await fetchPage(route);
  if (page.response.status !== 200) fail(`${route}: HTTP ${page.response.status}, erwartet 200.`);
  if (!isNoindex(page.text)) fail(`${route}: noindex fehlt.`);
  if (sitemapSet.has(route)) fail(`${route}: noindex-Seite steht in Sitemap.`);
  const canonical = linkHref(page.text, 'canonical');
  if (canonical !== `${ORIGIN}${route}`) fail(`${route}: Self-Canonical fehlt/falsch.`);
}
pass('Noindex-Safety: Rechtsseiten + 4 historische Objektseiten außerhalb Sitemap');

// 8. Legacy redirects and intentionally disabled historical object redirects.
for (const [from, to] of legacyRedirects) await checkRedirect(`${ORIGIN}${from}`, `${ORIGIN}${to}`);
for (const route of legacyPropertyRoutes) {
  const response = await request(`${ORIGIN}${route}`, { redirect: 'manual' });
  if (response.status !== 404) fail(`${route}: erwartet aktuell 404 (Objekt-Redirect bewusst deaktiviert), erhalten ${response.status}.`);
  await response.body?.cancel();
}
pass('Historische Objekt-Redirects bleiben bis Statusbestätigung bewusst deaktiviert und liefern 404');

// 9. Error document and contact endpoint behavior without sending a real customer mail.
const notFound = await getText(`${ORIGIN}/qa-live-deep-audit-does-not-exist-70931`);
if (notFound.response.status !== 404) fail(`Custom 404: HTTP ${notFound.response.status}, erwartet 404.`);
if (!notFound.text.toLowerCase().includes('<!doctype html')) fail('Custom 404 liefert kein HTML-Dokument.');

const contactGet = await request(`${ORIGIN}/api/contact.php`, { redirect: 'manual' });
if (contactGet.status !== 405) fail(`/api/contact.php GET -> ${contactGet.status}, erwartet 405.`);
await contactGet.body?.cancel();

const invalidBody = new URLSearchParams({
  name: 'X',
  email: 'kaputt',
  anliegen: 'allgemeine-anfrage',
  nachricht: 'zu kurz',
  datenschutz: '1',
});
const contactPost = await request(`${ORIGIN}/api/contact.php`, {
  method: 'POST',
  redirect: 'manual',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: invalidBody.toString(),
});
const contactLocation = contactPost.headers.get('location');
if (contactPost.status !== 303 || contactLocation !== '/kontakt/?kontakt=ungueltig#kontaktformular') {
  fail(`Ungültiger Kontakt-POST -> ${contactPost.status} Location=${contactLocation}, erwartet 303 auf Fehlerzustand.`);
}
await contactPost.body?.cancel();

const contactPage = await fetchPage('/kontakt/');
if (!/<form\b[^>]*action=["']\/api\/contact\.php["'][^>]*method=["']post["']/i.test(contactPage.text)
    && !/<form\b[^>]*method=["']post["'][^>]*action=["']\/api\/contact\.php["']/i.test(contactPage.text)) {
  fail('/kontakt/: Formular action/method stimmt nicht.');
}
for (const field of ['name', 'email', 'anliegen', 'nachricht', 'datenschutz']) {
  if (!new RegExp(`\\bname=["']${field}["']`, 'i').test(contactPage.text)) fail(`/kontakt/: Formularfeld '${field}' fehlt.`);
}
pass('Kontaktformular: GET-Schutz, ungültiger POST und Pflichtfelder geprüft; keine reale Mail versendet');

// 10. Final report.
const report = {
  checkedAt: new Date().toISOString(),
  base: ORIGIN,
  failures,
  warnings,
  passes,
  counts: {
    sitemapUrls: uniqueSitemapUrls.length,
    internalTargets: internalTargets.size,
    fragments: fragmentTargets.length,
    resources: resources.size,
    hashedAssets: hashedAssetCount,
    fetchedPages: fetchedPages.size,
  },
};
writeFileSync('live-deep-audit.json', JSON.stringify(report, null, 2));

const md = [
  '# Höhn Live Deep Audit',
  '',
  `- Checked: ${report.checkedAt}`,
  `- Base: ${ORIGIN}`,
  `- Sitemap URLs: ${report.counts.sitemapUrls}`,
  `- Internal targets: ${report.counts.internalTargets}`,
  `- Fragment links: ${report.counts.fragments}`,
  `- Internal resources: ${report.counts.resources}`,
  `- Hashed assets: ${report.counts.hashedAssets}`,
  `- Failures: ${failures.length}`,
  `- Warnings: ${warnings.length}`,
  '',
  '## Failures',
  ...(failures.length ? failures.map((x) => `- ${x}`) : ['- None']),
  '',
  '## Warnings',
  ...(warnings.length ? warnings.map((x) => `- ${x}`) : ['- None']),
  '',
  '## Passed checks',
  ...passes.map((x) => `- ${x}`),
  '',
].join('\n');
writeFileSync('live-deep-audit.md', md);

console.log(md);
if (failures.length) {
  console.error(`LIVE DEEP AUDIT FAILED: ${failures.length} failure(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(`LIVE DEEP AUDIT PASS: 0 failures, ${warnings.length} warning(s).`);
