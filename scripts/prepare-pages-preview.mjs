import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const base = '/immo-hoehn.de';

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

const files = await walk(root);
for (const file of files) {
  if (!/\.(html|css|js|xml)$/i.test(file)) continue;
  let text = await fs.readFile(file, 'utf8');

  if (/\.html$/i.test(file)) {
    text = text
      .replaceAll('href="/', `href="${base}/`)
      .replaceAll("href='/", `href='${base}/`)
      .replaceAll('src="/', `src="${base}/`)
      .replaceAll("src='/", `src='${base}/`)
      .replaceAll('action="/', `action="${base}/`)
      .replaceAll("action='/", `action='${base}/`);
  }

  if (/\.css$/i.test(file)) {
    text = text
      .replaceAll('url("/', `url("${base}/`)
      .replaceAll("url('/", `url('${base}/`)
      .replace(/url\(\/(?!\/)/g, `url(${base}/`);
  }

  await fs.writeFile(file, text);
}

await fs.writeFile(path.join(root, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
await fs.writeFile(path.join(root, '.nojekyll'), '');

console.log(`Prepared GitHub Pages preview under ${base}/ with robots disallow.`);
