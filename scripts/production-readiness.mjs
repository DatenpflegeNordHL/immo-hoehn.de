import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { properties } from '../src/data/properties.js';
import { PUBLISH_PROPERTY_LISTINGS } from '../src/data/launch-config.js';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const failures = [];

function fail(message) {
  failures.push(message);
}

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

function attr(html, tagName, attrName, attrValue, wanted) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];
  for (const tag of tags) {
    if (new RegExp(`${attrName}=["']${attrValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(tag)) {
      const match = tag.match(new RegExp(`${wanted}=["']([^"']+)["']`, 'i'));
      if (match) return match[1];
    }
  }
  return null;
}

function schemaTypes(value, out = []) {
  if (Array.isArray(value)) {
    for (const item of value) schemaTypes(item, out);
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  if (typeof value['@type'] === 'string') out.push(value['@type']);
  if (Array.isArray(value['@type'])) out.push(...value['@type'].filter((type) => typeof type === 'string'));
  if (value['@graph']) schemaTypes(value['@graph'], out);
  return out;
}

function parseJsonLd(html, route) {
  const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const parsed = [];
  for (const [index, match] of scripts.entries()) {
    try {
      parsed.push(JSON.parse(match[1]));
    } catch (error) {
      fail(`${route}: JSON-LD #${index + 1} ist ungültig (${error.message}).`);
    }
  }
  return parsed;
}

if (!existsSync(DIST)) fail('dist/ fehlt. Production build wurde nicht erzeugt.');

const htmlFiles = existsSync(DIST) ? walk(DIST, '.html') : [];
if (htmlFiles.length < 17) fail(`Zu wenige HTML-Seiten im Production-Build: ${htmlFiles.length} (erwartet mindestens 17).`);

const sitemapFiles = existsSync(DIST) ? walk(DIST, '.xml').filter((p) => p.includes('sitemap')) : [];
const sitemapCorpus = sitemapFiles.map((p) => readFileSync(p, 'utf8')).join('\n');

const noindexRoutes = new Set(['/impressum/', '/datenschutz/', '/404']);
if (!PUBLISH_PROPERTY_LISTINGS) {
  for (const property of properties) noindexRoutes.add(`/immobilien/${property.slug}/`);
}
let indexableCount = 0;

const retiredLandline = /(?:0388(?:\s|&nbsp;|-)*26(?:\s|&nbsp;|-)*80911|\+49(?:\s|&nbsp;|-)*388(?:\s|&nbsp;|-)*26(?:\s|&nbsp;|-)*80911|\+493882680911|tel:\+493882680911)/i;

for (const file of htmlFiles) {
  const route = routeForHtml(file);
  const html = readFileSync(file, 'utf8');

  if (/hoehn\.immobilien@t-online\.de/i.test(html)) fail(`${route}: alte T-Online-Adresse im Build gefunden.`);
  if (retiredLandline.test(html)) fail(`${route}: alte Höhn-Festnetznummer im öffentlichen Build gefunden.`);
  if (/DatenpflegeNord/i.test(html)) fail(`${route}: fremdes Projektbranding im öffentlichen Build gefunden.`);
  if (/Staging-(?:Fassung|Platzhalter)|Staging-Fassung|Staging-Platzhalter|Arbeitsbranch noch nicht für den Produktivbetrieb/i.test(html)) {
    fail(`${route}: Staging-/Arbeitsbranch-Text im Production-Build gefunden.`);
  }

  if (/Webador|Bildbestand|frühere Höhn|bisherigen Höhn-Bestand|öffentlich geführte[nr]? Höhn-Objektseite|WordPress[_ -]?02|Datenquelle/i.test(html)) {
    fail(`${route}: interne Migrations-/Quelleninformation im öffentlichen Build gefunden.`);
  }
  if (/einfamilienhaus-poetenitz-1724|eigentumswohnung-poetenitz-1722|Objektnummer\s*1724|Objektnummer\s*1722/i.test(html)) {
    fail(`${route}: ausgemustertes Nicht-WordPress-02-Angebot im öffentlichen Build gefunden.`);
  }
  if (/header-cta/i.test(html)) fail(`${route}: veralteter doppelter Header-CTA im öffentlichen Build gefunden.`);

  const footerCount = (html.match(/<footer\b/gi) ?? []).length;
  if (footerCount !== 1) fail(`${route}: ${footerCount} Footer gefunden, erwartet genau einen globalen Footer.`);

  const externalFontResource = /<(?:link|script)\b[^>]*(?:href|src)=["']https:\/\/(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^"']*["'][^>]*>/i;
  if (externalFontResource.test(html)) fail(`${route}: externe Google-Font-Ressource im Markup gefunden.`);

  const externalScript = /<script\b[^>]*src=["']https?:\/\/(?!immo-hoehn\.de\/)[^"']+["'][^>]*>/i;
  const externalIframe = /<iframe\b[^>]*src=["']https?:\/\/(?!immo-hoehn\.de\/)[^"']+["'][^>]*>/i;
  const externalStylesheet = /<link\b(?=[^>]*rel=["']stylesheet["'])(?=[^>]*href=["']https?:\/\/(?!immo-hoehn\.de\/)[^"']+["'])[^>]*>/i;
  if (externalScript.test(html)) fail(`${route}: unerwartetes externes Script im Production-Build.`);
  if (externalIframe.test(html)) fail(`${route}: unerwartetes externes iframe im Production-Build.`);
  if (externalStylesheet.test(html)) fail(`${route}: unerwartetes externes Stylesheet im Production-Build.`);

  const parsedSchemas = parseJsonLd(html, route);
  const types = parsedSchemas.flatMap((schema) => schemaTypes(schema));
  if (!types.includes('RealEstateAgent')) fail(`${route}: RealEstateAgent-Schema fehlt.`);
  if (route !== '/' && route !== '/404' && !types.includes('BreadcrumbList')) {
    fail(`${route}: BreadcrumbList-Schema fehlt.`);
  }

  const serializedSchemas = JSON.stringify(parsedSchemas);
  if (retiredLandline.test(serializedSchemas)) fail(`${route}: alte Höhn-Festnetznummer im JSON-LD gefunden.`);

  const robots = attr(html, 'meta', 'name', 'robots', 'content');
  const shouldNoindex = noindexRoutes.has(route);
  if (shouldNoindex) {
    if (!robots?.toLowerCase().includes('noindex')) fail(`${route}: erwartetes noindex fehlt.`);
  } else {
    indexableCount += 1;
    if (robots !== 'index,follow') fail(`${route}: Production-Robots ist '${robots}', erwartet 'index,follow'.`);
  }

  if (route !== '/404') {
    const canonicalMatch = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
      ?? html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
    const canonical = canonicalMatch?.[1] ?? null;
    if (!canonical) {
      fail(`${route}: Canonical fehlt.`);
    } else {
      try {
        const url = new URL(canonical);
        if (url.origin !== 'https://immo-hoehn.de') fail(`${route}: falscher Canonical-Host ${url.origin}.`);
        if (url.pathname !== route) fail(`${route}: Canonical-Pfad ${url.pathname} stimmt nicht mit Route ${route} überein.`);
        if (!shouldNoindex && !sitemapCorpus.includes(canonical)) fail(`${route}: indexierbarer Canonical fehlt in Sitemap.`);
        if (shouldNoindex && sitemapCorpus.includes(canonical)) fail(`${route}: noindex-Canonical ist unerwartet in der Sitemap.`);
      } catch {
        fail(`${route}: ungültiger Canonical '${canonical}'.`);
      }
    }
  }
}

if (indexableCount < 12) fail(`Zu wenige indexierbare Production-Seiten: ${indexableCount} (erwartet mindestens 12).`);

const robotsPath = join(DIST, 'robots.txt');
if (!existsSync(robotsPath)) fail('robots.txt fehlt im Production-Build.');
else {
  const robotsTxt = readFileSync(robotsPath, 'utf8');
  if (!robotsTxt.includes('Sitemap: https://immo-hoehn.de/sitemap-index.xml')) fail('robots.txt enthält nicht die kanonische Sitemap-URL.');
  if (/Disallow:\s*\//i.test(robotsTxt)) fail('robots.txt blockiert die Website global.');
}

if (!sitemapFiles.some((p) => p.endsWith('sitemap-index.xml'))) fail('sitemap-index.xml fehlt.');
if (/\/impressum\/?</i.test(sitemapCorpus)) fail('Impressum ist unerwartet in der Sitemap.');
if (/\/datenschutz\/?</i.test(sitemapCorpus)) fail('Datenschutz ist unerwartet in der Sitemap.');
if (/einfamilienhaus-poetenitz-1724|eigentumswohnung-poetenitz-1722/i.test(sitemapCorpus)) {
  fail('Ausgemusterte Angebote 1724/1722 sind unerwartet in der Sitemap.');
}
if (!PUBLISH_PROPERTY_LISTINGS) {
  for (const property of properties) {
    if (sitemapCorpus.includes(`/immobilien/${property.slug}/`)) {
      fail(`Unbestätigtes Objekt ${property.slug} ist unerwartet in der Sitemap.`);
    }
  }
}

const contactPath = join(DIST, 'api', 'contact.php');
if (!existsSync(contactPath)) fail('Kontakt-Endpunkt fehlt im Production-Build.');
else {
  const contact = readFileSync(contactPath, 'utf8');
  if (!contact.includes("const CONTACT_RECIPIENT = 'info@immo-hoehn.de';")) fail('Kontakt-Empfänger ist nicht fest auf info@immo-hoehn.de gesetzt.');
  if (/hoehn\.immobilien@t-online\.de/i.test(contact)) fail('Kontakt-Endpunkt enthält alte T-Online-Adresse.');
}

if (failures.length) {
  console.error(`Production readiness FAILED (${failures.length}):`);
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`Production readiness PASS: ${htmlFiles.length} HTML-Seiten, ${indexableCount} indexierbar, genau ein Footer pro Seite, Canonicals/Sitemap/Robots/Schema/Telefon/Form-Empfänger geprüft.`);
