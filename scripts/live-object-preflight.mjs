const targets = [
  {
    name: 'Einfamilienhaus Pötenitz 1724',
    url: 'https://immo-hoehn.de/immobilienangebote/kaufen/haeuser/efh-poetenitz',
    needles: ['1724', '585.000', '170'],
  },
  {
    name: 'Eigentumswohnung Pötenitz 1722',
    url: 'https://immo-hoehn.de/immobilienangebote/kaufen/wohnungen/eigentumswohung',
    needles: ['1722', '429.000', '105'],
  },
  {
    name: 'Baugrundstücke Rosenhagen',
    url: 'https://immo-hoehn.de/immobilienangebote/kaufen/grundstuecke/rosenhagen',
    needles: ['623', '349.000', '630', '354.000', '666', '379.000'],
  },
  {
    name: 'Baugrundstücke Rosenhagen von privat',
    url: 'https://immo-hoehn.de/immobilienangebote/kaufen/grundstuecke/rosenhagen-von-privat',
    needles: ['1.600', '2.005', '900'],
  },
];

function normalize(text) {
  return text
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

let failed = false;

for (const target of targets) {
  try {
    const response = await fetch(target.url, {
      redirect: 'follow',
      headers: { 'user-agent': 'Hoehn-Launch-Preflight/1.0' },
      signal: AbortSignal.timeout(30000),
    });

    const body = normalize(await response.text());
    const missing = target.needles.filter((needle) => !body.includes(needle));

    console.log(`\n[${target.name}]`);
    console.log(`URL: ${target.url}`);
    console.log(`HTTP: ${response.status}`);
    console.log(`Final URL: ${response.url}`);
    console.log(`Expected markers: ${target.needles.join(', ')}`);

    if (!response.ok) {
      console.error(`FAIL: HTTP ${response.status}`);
      failed = true;
      continue;
    }

    if (missing.length) {
      console.error(`FAIL: erwartete Marker fehlen: ${missing.join(', ')}`);
      failed = true;
      continue;
    }

    console.log('PASS: Seite erreichbar und bekannte Kernwerte vorhanden.');
  } catch (error) {
    failed = true;
    console.error(`\n[${target.name}] FAIL: ${error?.message || error}`);
  }
}

if (failed) process.exit(1);
console.log('\nLIVE OBJECT PREFLIGHT PASS: alle vier Höhn-Bestandsseiten erreichbar und Kernwerte bestätigt.');
