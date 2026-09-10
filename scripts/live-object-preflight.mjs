const base = 'https://immo-hoehn.de';

const historicalPages = [
  '/immobilien/einfamilienhaus-poetenitz-1724/',
  '/immobilien/eigentumswohnung-poetenitz-1722/',
  '/immobilien/baugrundstuecke-rosenhagen/',
  '/immobilien/baugrundstuecke-rosenhagen-von-privat/',
];

const legacyObjectPaths = [
  '/immobilienangebote/kaufen/haeuser/efh-poetenitz/',
  '/immobilienangebote/kaufen/wohnungen/eigentumswohung/',
  '/immobilienangebote/kaufen/grundstuecke/rosenhagen/',
  '/immobilienangebote/kaufen/grundstuecke/rosenhagen-von-privat/',
];

const headers = {
  'user-agent': 'Mozilla/5.0 (compatible; HoehnProductionQA/1.0)',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
};

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

async function fetchText(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    headers,
    redirect: options.redirect ?? 'manual',
    signal: AbortSignal.timeout(30000),
  });
  const body = await response.text();
  return { response, body };
}

console.log('HÖHN HISTORICAL OBJECT SAFETY PREFLIGHT');

const sitemap = await fetchText('/sitemap-0.xml', { redirect: 'follow' });
if (!sitemap.response.ok) fail(`Sitemap HTTP ${sitemap.response.status}`);

for (const path of historicalPages) {
  const { response, body } = await fetchText(path, { redirect: 'follow' });
  console.log(`${path} -> ${response.status}`);

  if (response.status !== 200) {
    fail(`${path} muss als historische Informationsseite 200 liefern.`);
    continue;
  }

  if (!/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["']/i.test(body)
      && !/<meta\s+content=["'][^"']*noindex[^"']*["']\s+name=["']robots["']/i.test(body)) {
    fail(`${path} muss noindex sein, solange die aktuelle Verfügbarkeit nicht bestätigt ist.`);
  }

  if (sitemap.body.includes(`${base}${path}`)) {
    fail(`${path} darf nicht in der Sitemap stehen, solange die Seite noindex/historisch ist.`);
  }

  if (!/Verfügbarkeit nicht aktuell bestätigt|nicht als aktuelles Höhn-Angebot|aktuelle Verfügbarkeit ist nicht bestätigt/i.test(body)) {
    fail(`${path} enthält keinen klaren Hinweis auf den historischen/unbestätigten Status.`);
  }
}

for (const path of legacyObjectPaths) {
  const { response } = await fetchText(path, { redirect: 'manual' });
  console.log(`${path} -> ${response.status}`);
  if (response.status !== 404) {
    fail(`${path} muss bis zur bestätigten Entity-Zuordnung 404 liefern, nicht redirecten oder 200 ausgeben.`);
  }
}

if (process.exitCode) process.exit(1);
console.log('HISTORICAL OBJECT SAFETY PREFLIGHT PASS: historische Seiten noindex + sitemap-frei; unsichere Legacy-Objektpfade bleiben 404.');
