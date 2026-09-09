import fs from 'node:fs/promises';
import path from 'node:path';

const dir = process.argv[2] || 'lighthouse-results';
const files = (await fs.readdir(dir)).filter((name) => name.endsWith('.json')).sort();
const rows = [];
let hardFailure = false;

for (const file of files) {
  const report = JSON.parse(await fs.readFile(path.join(dir, file), 'utf8'));
  const c = report.categories;
  const a = report.audits;
  const row = {
    file,
    performance: Math.round((c.performance?.score ?? 0) * 100),
    accessibility: Math.round((c.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((c['best-practices']?.score ?? 0) * 100),
    seo: Math.round((c.seo?.score ?? 0) * 100),
    fcp: a['first-contentful-paint']?.displayValue ?? null,
    lcp: a['largest-contentful-paint']?.displayValue ?? null,
    cls: a['cumulative-layout-shift']?.displayValue ?? null,
    tbt: a['total-blocking-time']?.displayValue ?? null,
    speedIndex: a['speed-index']?.displayValue ?? null,
  };
  rows.push(row);
  if (row.accessibility < 95 || row.seo < 95 || row.bestPractices < 90) hardFailure = true;
}

const header = ['Report','Perf','A11y','Best','SEO','FCP','LCP','CLS','TBT','Speed Index'];
const md = [
  '# Lighthouse QA',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `| ${header.join(' | ')} |`,
  `| ${header.map(() => '---').join(' | ')} |`,
  ...rows.map((r) => `| ${r.file} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.fcp ?? ''} | ${r.lcp ?? ''} | ${r.cls ?? ''} | ${r.tbt ?? ''} | ${r.speedIndex ?? ''} |`),
  '',
  'Thresholds for this staging gate:',
  '- Accessibility >= 95',
  '- SEO >= 95',
  '- Best Practices >= 90',
  '- Performance is recorded diagnostically; it is not treated as field Core Web Vitals.',
  ''
];

await fs.writeFile(path.join(dir, 'summary.md'), md.join('\n'));
console.table(rows);
if (hardFailure) {
  console.error('Lighthouse staging gate failed one or more hard thresholds.');
  process.exitCode = 1;
} else {
  console.log('Lighthouse staging gate passed hard thresholds.');
}
