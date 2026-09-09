import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const outDir = process.env.QA_OUT_DIR || 'visual-qa';
const widths = [360, 390, 412, 430, 768, 820, 1024, 1280, 1440, 1920];
const height = 900;

const routes = [
  '/',
  '/immobilie-verkaufen/',
  '/grundstueck-verkaufen/',
  '/immobilienbewertung/',
  '/immobilien/',
  '/immobilien/einfamilienhaus-poetenitz-1724/',
  '/immobilien/eigentumswohnung-poetenitz-1722/',
  '/immobilien/baugrundstuecke-rosenhagen/',
  '/regionen/dassow/',
  '/regionen/poetenitz/',
  '/regionen/rosenhagen/',
  '/regionen/travemuende/',
  '/regionen/priwall/',
  '/ueber-uns/',
  '/kontakt/',
  '/impressum/',
  '/datenschutz/'
];

const screenshotRoutes = new Set([
  '/',
  '/immobilie-verkaufen/',
  '/grundstueck-verkaufen/',
  '/immobilienbewertung/',
  '/immobilien/',
  '/immobilien/einfamilienhaus-poetenitz-1724/',
  '/regionen/poetenitz/',
  '/kontakt/'
]);

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(path.join(outDir, 'screenshots'), { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = {
  generatedAt: new Date().toISOString(),
  baseURL,
  widths,
  routes: [],
  summary: {
    checks: 0,
    horizontalOverflowFailures: 0,
    offscreenElementFailures: 0,
    brokenImageFailures: 0,
    h1Failures: 0,
    consoleErrors: 0,
    pageErrors: 0
  }
};

const slugify = (route) => route === '/' ? 'home' : route.replace(/^\//, '').replace(/\/$/, '').replaceAll('/', '__');

for (const route of routes) {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', error => pageErrors.push(String(error)));

    const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts?.ready);

    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const body = document.body;
      const vw = window.innerWidth;
      const all = [...document.querySelectorAll('body *')];

      const visible = all.filter((el) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
      });

      const intentionallyClipped = (el) => {
        let parent = el.parentElement;
        while (parent && parent !== document.body) {
          const style = getComputedStyle(parent);
          const ox = style.overflowX;
          const o = style.overflow;
          if (ox === 'hidden' || ox === 'clip' || o === 'hidden' || o === 'clip') return true;
          parent = parent.parentElement;
        }
        return false;
      };

      const offscreen = visible
        .filter((el) => !intentionallyClipped(el))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName.toLowerCase(),
            className: typeof el.className === 'string' ? el.className.slice(0, 140) : '',
            text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100),
            left: Math.round(r.left),
            right: Math.round(r.right),
            width: Math.round(r.width)
          };
        })
        .filter((x) => x.right > vw + 2 || x.left < -2)
        .slice(0, 20);

      const brokenImages = [...document.images]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src || img.alt || '(unknown)');

      return {
        viewportWidth: vw,
        rootScrollWidth: root.scrollWidth,
        bodyScrollWidth: body.scrollWidth,
        horizontalOverflow: Math.max(root.scrollWidth, body.scrollWidth) > vw + 2,
        offscreen,
        brokenImages,
        h1Count: document.querySelectorAll('h1').length,
        title: document.title,
        robots: document.querySelector('meta[name="robots"]')?.content || null
      };
    });

    const result = {
      route,
      width,
      status: response?.status() ?? null,
      ...metrics,
      consoleErrors,
      pageErrors
    };

    report.routes.push(result);
    report.summary.checks += 1;
    if (metrics.horizontalOverflow) report.summary.horizontalOverflowFailures += 1;
    if (metrics.offscreen.length) report.summary.offscreenElementFailures += 1;
    if (metrics.brokenImages.length) report.summary.brokenImageFailures += 1;
    if (metrics.h1Count !== 1) report.summary.h1Failures += 1;
    report.summary.consoleErrors += consoleErrors.length;
    report.summary.pageErrors += pageErrors.length;

    if (screenshotRoutes.has(route)) {
      const file = path.join(outDir, 'screenshots', `${slugify(route)}-${width}.png`);
      await page.screenshot({ path: file, fullPage: true });
    }

    await context.close();
  }
}

await browser.close();
await fs.writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

const lines = [
  '# Visual QA Report',
  '',
  `Generated: ${report.generatedAt}`,
  '',
  `Checks: ${report.summary.checks}`,
  `Horizontal overflow failures: ${report.summary.horizontalOverflowFailures}`,
  `Offscreen element failures: ${report.summary.offscreenElementFailures}`,
  `Broken image failures: ${report.summary.brokenImageFailures}`,
  `H1 failures: ${report.summary.h1Failures}`,
  `Console errors: ${report.summary.consoleErrors}`,
  `Page errors: ${report.summary.pageErrors}`,
  '',
  '## Failures',
  ''
];

const failed = report.routes.filter((r) => r.status !== 200 || r.horizontalOverflow || r.offscreen.length || r.brokenImages.length || r.h1Count !== 1 || r.consoleErrors.length || r.pageErrors.length);
if (!failed.length) {
  lines.push('No automated viewport failures detected.');
} else {
  for (const r of failed) {
    lines.push(`### ${r.route} @ ${r.width}px`);
    lines.push(`- HTTP: ${r.status}`);
    lines.push(`- overflow: ${r.horizontalOverflow} (scrollWidth ${Math.max(r.rootScrollWidth, r.bodyScrollWidth)} / viewport ${r.viewportWidth})`);
    lines.push(`- offscreen elements: ${r.offscreen.length}`);
    lines.push(`- broken images: ${r.brokenImages.length}`);
    lines.push(`- H1 count: ${r.h1Count}`);
    lines.push(`- console errors: ${r.consoleErrors.length}`);
    lines.push(`- page errors: ${r.pageErrors.length}`);
    if (r.offscreen.length) lines.push(`- first offscreen: \`${JSON.stringify(r.offscreen[0])}\``);
    lines.push('');
  }
}

await fs.writeFile(path.join(outDir, 'report.md'), lines.join('\n'));

if (failed.length) {
  console.error(`Visual QA found ${failed.length} failing route/viewport combinations.`);
  process.exitCode = 1;
} else {
  console.log(`Visual QA passed ${report.summary.checks} route/viewport combinations.`);
}
