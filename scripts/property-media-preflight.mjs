import { propertyMedia } from '../src/data/property-media.js';

const remoteUrls = [...new Set(
  Object.values(propertyMedia)
    .flatMap((entry) => [entry.hero, ...(entry.gallery ?? [])])
    .map((item) => item?.src)
    .filter((src) => typeof src === 'string' && /^https:\/\//i.test(src)),
)];

async function checkImage(url) {
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      Range: 'bytes=0-1023',
      'User-Agent': 'Hoehn-Immobilien-Media-Preflight/1.0',
    },
    signal: AbortSignal.timeout(15000),
  });

  const contentType = response.headers.get('content-type') ?? '';
  await response.body?.cancel();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  if (!contentType.toLowerCase().startsWith('image/')) {
    throw new Error(`unerwarteter Content-Type: ${contentType || 'leer'}`);
  }

  return `${response.status} ${contentType}`;
}

console.log(`Property media preflight: ${remoteUrls.length} eindeutige externe Bilddateien`);

const failures = [];
for (const url of remoteUrls) {
  try {
    const result = await checkImage(url);
    console.log(`PASS ${result} ${url}`);
  } catch (error) {
    failures.push({ url, error: error instanceof Error ? error.message : String(error) });
    console.error(`FAIL ${url}: ${failures.at(-1).error}`);
  }
}

if (failures.length > 0) {
  console.error(`Property media preflight FAILED: ${failures.length} Bildquelle(n) nicht valide.`);
  process.exit(1);
}

console.log('Property media preflight PASS');
